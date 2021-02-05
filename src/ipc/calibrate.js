const { ipcMain } = require('electron');
const { events } = require('../constants/index');

const Calibrate = require('../util/Calibrate');

// let eyetracking = new TobiiEyetracker();

/**
 * When the user wishes to recalibrate,
 * this function is called to do so.
 */
ipcMain.on(events.CALIBRATE_TOBII_EYETRACKER, (event, arg) => {
    Calibrate.calibrate();
});