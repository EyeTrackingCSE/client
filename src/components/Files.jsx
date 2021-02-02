import React, { useEffect } from 'react';
import "../styles/Files.css";
import {
    events,
} from "../constants/index";

const { ipcRenderer } = window.require("electron");

/**
 * Handles loading and saving files.
 * @param {object} props 
 */
const Files = props => {

    const onSaveClick = e => {
        ipcRenderer.send(events.SYNC_SAVE_FILE, props.string);
        if (props.onSave) {
            props.onSave(props.string);
        }
    };

    const onLoadClick = e => {
        ipcRenderer.send(events.SYNC_LOAD_FILE, props.string);
    };

    const onFileLoad = (event, args) => {
        if (props.onLoad) {
            props.onLoad(args);
        }
    }

    /**
     * Runs on init only once
     * Attaches the SYNC_FILE_CONTENT event to ipc,
     * so when a file is read, the stream is direction to onFileLoad()
     */
    useEffect(() => {
        ipcRenderer.on(events.SYNC_FILE_CONTENT, onFileLoad);
    }, []);

    return (
        <div className={"file-wrapper"}>
            <div onClick={onSaveClick} className={"file-button"}>
                Save
            </div>

            <div onClick={onLoadClick} className={"file-button"}>
                Load
            </div>
        </div>
    );
};

export default Files;