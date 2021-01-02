const { app, BrowserWindow, ipcMain } = require('electron')
const eyetracking = require('eyetracking');
const path = require('path')
const url = require('url')
const { fork } = require('child_process');

const {
  ASYNC_GAZE_FOCUS_EVENT,
  ASYNC_LISTEN,
  SYNC_SET_NEW_SCREEN,
  OK,
  ERROR,
  SYNC_SET_SCREEN_SPACE
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

/**
 * Takes an object containing width, height, and an array of objects denoting
 * screen space coordinates for each key on virtual keyboard
 * 
 * Actually creates a new eyetracking instance, so old data is disregarded.
 * Pushes keys to node-gyp module.
 */
let screen;
ipcMain.on(SYNC_SET_NEW_SCREEN, (event, arg) => {
  if (!arg.rectangles.length) {
    event.returnValue = ERROR;
    return;
  }

  screen = new eyetracking(arg.width, arg.height);
  screen.AddRectangles(arg.rectangles);
  event.returnValue = OK;
});

/**
 * Sets only the screen space size of the monitor.
 */
ipcMain.on(SYNC_SET_SCREEN_SPACE, (event, arg) => {
  if (screen === null) {
    event.returnValue = constants.ERROR;
    return;
  }

  if (!arg.height || !arg.width) {
    event.returnValue = ERROR;
    return;
  }

  screen.SetWidth(arg.width);
  screen.SetHeight(arg.height);

  event.returnValue = OK;
});

/**
 * Kicks off the tobii.listen() loop.
 * 
 * Each time the eyetracking recognizes a new focus event,
 * the metadata of said event to emitted to the renderer process
 * using a event.reply() call. 
 */
let eyetrackingProcess;
ipcMain.on(ASYNC_LISTEN, (event, arg) => {

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
 
  // Send the screen metadata
  eyetrackingProcess.send(arg);

  // When the forked process emits a message, push to the render process
  eyetrackingProcess.on('message', (evt) => {
    
    // Skip any event that indicates a region does NOT have focus.
    if (!evt.hasFocus)
      return;

    // the id of the event corresponds to an index in
    // arg.rectangles. combine the rectangle focused and the evt
    // into a single object to send back to the render process
    let payload = {
      ...evt,
      ...arg.rectangles[evt.id]
    }
    event.reply(ASYNC_GAZE_FOCUS_EVENT, payload);
  });
});

