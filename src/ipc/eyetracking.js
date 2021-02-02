const { ipcMain, dialog } = require('electron');
const { fork } = require('child_process');
const path = require('path');

const { events } = require('../constants/index');

const PROCESS_NAME = 'eyetracking-child.js';

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
        console.log(`Killing ${PROCESS_NAME} process (${eyetrackingProcess.pid || 'no pid found'})`);
        eyetrackingProcess.kill('SIGINT');
    }

    // fork a child process to run the eyetracking module
    eyetrackingProcess = fork(path.join(__dirname, PROCESS_NAME), [], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    console.log(`Forking ${PROCESS_NAME} process (${eyetrackingProcess.pid || 'no pid found'})`);
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