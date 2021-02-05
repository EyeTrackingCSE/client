const { ipcMain } = require('electron');
const { events } = require('../constants/index');

const TobiiEyetracker = require('../util/TobiiEyetracker');

// let eyetracking = new TobiiEyetracker();

/**
 * When the user wishes to recalibrate,
 * this function is called to do so.
 */
ipcMain.on(events.CALIBRATE_TOBII_EYETRACKER, (event, arg) => {
    TobiiEyetracker.calibrate();
    // eyetracking.calibrate();
    // event.returnValue = eyetracking.numCalibrations;
});