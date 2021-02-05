const fs = require('fs');
const { exec } = require("child_process");

const { defaults } = require('../constants/index');

class TobiiEyetracker {
    constructor(base) {
        this.base = (base) ? base : defaults.DEFAULT_TOBII_EXPERIENCE_PATH;
        this.lastCalibration = Date.now();
        this.numCalibrations = 1;

        // Check if this.base exists
        let exists = fs.existsSync(this.base);
        if (!exists) {
            throw new Error(`${this.base} can't be found, do you have Tobii Experience installed?`);
        }
    }

    calibrate() {
        let path = `${this.base}\\Tobii Configuration\\Tobii.Configuration.exe`;

        let exists = fs.existsSync(path);
        if (!exists) {
            throw new Error(`${path} can't be found. Not able to callibrate.`);
        }

        let command = `"${path}" -Q`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }

            console.log(`Calibrate successful`);
            this.numCalibrations++;
            this.lastCalibration = Date.now();
        });
    };
}