const { ipcMain, dialog } = require('electron');

const { events } = require('../constants/index');

ipcMain.on(events.SYNC_SAVE_FILE, (event, arg) => {
    dialog.showSaveDialogSync();
});

ipcMain.on(events.SYNC_LOAD_FILE, (event, arg) => {
    dialog.showOpenDialogSync();
});