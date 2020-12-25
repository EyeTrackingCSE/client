const { app, BrowserWindow, ipcMain } = require('electron')
const eyetracking = require('eyetracking');
const path = require('path')
const url = require('url')

const {
  ASYNC_GAZE_FOCUS_EVENT,
  ASYNC_LISTEN,
  SYNC_SET_SCREEN_SPACE,
  OK,
  ERROR } = require('./constants/index');

let mainWindow

let screen = null;

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
ipcMain.on(SYNC_SET_GAZE_FOCUS_REGIONS, (event, arg) => {
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
ipcMain.on(ASYNC_LISTEN, (event, arg) => {

});

// Deprecated. Will remove 
// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   let count = 0;
//   while (count < 5) {
//     setTimeout(() => {
//       event.reply(`asynchronous-reply`, `pong ${new Date()}`);
//     }, 5000);
//     count++;
//   }
// })