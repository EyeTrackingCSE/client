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
    filenames = dialog.showOpenDialogSync();

    if (filenames.length > 1) {
        throw new Error("User selected too many files.");
    }

    let content = fs.readFileSync(filenames[0], { encoding: 'utf8', flag: 'r' });

    console.log(`Read ${content} from ${filenames[0]}`);

    event.reply(events.SYNC_FILE_CONTENT, content);
});