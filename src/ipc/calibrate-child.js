/**
 * This file is intended to be run unilaterally
 * from the main and renderer processes of the electron app.
 * 
 * The main process forks a seperate process for this file,
 * and this file communicates eyetracking data to electron via ipc.
 */
const eyetracking = require('eyetracking');
const { defaults } = require('../constants/index');

let lastGazeTimestamp = Date.now();
process.on('message', (arg) => {
    if (!arg) {
        throw new Error("can't instance tobii. invalid params")
    }
    if (!arg.width || !arg.height) {
        throw new Error(`missing screen coordinates, got w:${arg.width} h:${arg.height}`)
    }

    let screen = new eyetracking(arg.width, arg.height);

    screen.ListenGazePoint((x, y, validity, timestamp) => {
        timestamp = Date.now();

        let diff = Math.abs(timestamp - lastGazeTimestamp);

        lastGazeTimestamp = timestamp;

        if (diff > defaults.DEFAULT_RECALIBRATE_TIMER) {
            process.send({ x, y, validity, timestamp })
        }

    });
});