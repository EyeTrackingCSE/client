import React from 'react';
import "../styles/Calibrate.css";
import {
    events,
} from "../constants/index";

const { ipcRenderer } = window.require("electron");

/**
 * Handles calibrating the Tobii eyetracker with a button click.
 * @param {object} props 
 */
const Calibrate = props => {

    const onCalibrateClick = e => {
        ipcRenderer.send(events.CALIBRATE_TOBII_EYETRACKER, 1);
    };

    return (
        <div onClick={onCalibrateClick} className={"cal"}>
            Calibrate
        </div>
    );
};

export default Calibrate;