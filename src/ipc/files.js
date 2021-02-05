const { ipcMain, dialog } = require('electron');
const fs = require('fs');

const { events } = require('../constants/index');

/**
 * When the user wishes to save a file,
 * open the windows save file dialog.
 * 
 * Save the string to the file
 */
ipcMain.on(events.SYNC_SAVE_FILE, (event, arg) => {
    let filename = dialog.showSaveDialogSync();

    if (!filename.length)
        return;

    let path = `${filename}.txt`;

    // Write arg to filename
    console.log(`Writing ${arg} to ${path}`);
    fs.writeFileSync(filename, arg);
});

/**
 * When the user wishes to load a file, open
 * the windows open dialog and read the content. Send the
 * content back over IPC.
 */
ipcMain.on(events.SYNC_LOAD_FILE, (event, arg) => {
    filenames = dialog.showOpenDialogSync();

    if (filenames.length > 1) {
        throw new Error("User selected too many files.");
    }

    let content = fs.readFileSync(filenames[0], { encoding: 'utf8', flag: 'r' });

    console.log(`Read ${content} from ${filenames[0]}`);

    event.reply(events.SYNC_FILE_CONTENT, content);
});