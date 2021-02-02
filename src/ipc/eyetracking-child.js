/**
 * This file is intended to be run unilaterally
 * from the main and renderer processes of the electron app.
 * 
 * The main process forks a seperate process for this file,
 * and this file communicates eyetracking data to electron via ipc.
 */
const eyetracking = require('eyetracking');

process.on('message', (arg) => {
    if (!arg) {
        throw new Error("can't instance tobii. invalid params")
    }
    if (!arg.width || !arg.height) {
        throw new Error(`missing screen coordinates, got w:${arg.width} h:${arg.height}`)
    }
    if (!arg.rectangles.length) {
        throw new Error(`no interactive regions passed in ['rectangles'] property`)
    }
    let screen = new eyetracking(arg.width, arg.height);
    screen.AddRectangles(arg.rectangles);

    screen.Listen((id, hasFocus, timestamp) => {
        process.send({ id, hasFocus, timestamp: Date.now(), pid: process.pid });
    });
});