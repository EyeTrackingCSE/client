import React, { useEffect } from 'react';
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

    useEffect(() => {
        ipcRenderer.removeAllListeners(events.CALIBRATE_TOBII_WHEN_IDLE);
        ipcRenderer.send(events.CALIBRATE_TOBII_WHEN_IDLE, {width: window.innerWidth, height: window.innerHeight});
    }, [])

    return (
        <div onClick={onCalibrateClick} className={"cal"}>
            Calibrate
        </div>
    );
};

export default Calibrate;