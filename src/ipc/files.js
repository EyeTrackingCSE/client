const { ipcMain, dialog } = require('electron');
const fs = require('fs');

const { events } = require('../constants/index');
ipcMain.on(events.SYNC_SAVE_FILE, (event, arg) => {
    console.log(arg);
    let filename = dialog.showSaveDialogSync();

    let path = `${filename}.txt`;

    // Write arg to filename
    console.log(`Writing ${arg} to ${path}`);
    fs.writeFileSync(filename, arg);
});

ipcMain.on(events.SYNC_LOAD_FILE, (event, arg) => {
    dialog.showOpenDialogSync();
});