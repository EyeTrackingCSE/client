const fs = require('fs');
const { exec } = require("child_process");

const { defaults } = require('../constants/index');

class TobiiEyetracker {
    static calibrate(basePath) {
        let base = (basePath) ? basePath : defaults.DEFAULT_TOBII_EXPERIENCE_PATH;
        if (!fs.existsSync(base)) {
            throw new Error(`${this.base} can't be found, do you have Tobii Experience installed?`);
        }

        let path = `${base}\\Tobii Configuration\\Tobii.Configuration.exe`;
        if (!fs.existsSync(path)) {
            throw new Error(`${path} can't be found. Not able to callibrate.`);
        }

        let command = `"${path}" -Q`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(error.message);
            }

            console.log(`Calibrate successful`);
        });
    };
}

module.exports = TobiiEyetracker;