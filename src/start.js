const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const { fork } = require('child_process');

const {
    events,
} = require('./constants/index');

let mainWindow

// Electron window params, we can config this to better fit the use of our app.
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        },
    })

    // Load html from environment variable, else from html dist file.
    mainWindow.loadURL(
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '/../public/index.html'),
            protocol: 'file:',
            slashes: true,
        })
    )

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

require('./ipc/files');

/**
 * TODO: Put this in its own file in /ipc/
 * Kicks off the tobii.listen() loop.
 * 
 * Each time the eyetracking recognizes a new focus event,
 * the metadata of said event to emitted to the renderer process
 * using a event.reply() call. 
 */
let eyetrackingProcess;
ipcMain.on(events.ASYNC_LISTEN, (event, arg) => {

    // Check if there is a currently running eyetracking process
    // if so, murder it
    if (eyetrackingProcess) {
        console.log(`Killing eyetracking process (${eyetrackingProcess.pid || 'no pid found'})`);
        eyetrackingProcess.kill('SIGINT');
    }

    // fork a child process to run the eyetracking module
    eyetrackingProcess = fork(path.join(__dirname, 'eyetracking.js'), [], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    console.log(`Forking eyetracking process (${eyetrackingProcess.pid || 'no pid found'})`);
    console.log(`(${eyetrackingProcess.pid}): w${arg.width} h${arg.height} r${arg.rectangles.length}`);

    // Send the screen metadata to start the listen loop.
    eyetrackingProcess.send(arg);

    // When the forked process emits a message, push to the render process
    eyetrackingProcess.on('message', (evt) => {
        let payload = {
            ...evt,
            ...arg.rectangles[evt.id]
        };

        event.reply(events.ASYNC_GAZE_FOCUS_EVENT, payload);
    });
});