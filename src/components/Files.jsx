import React from 'react';
import "../styles/Files.css";
import {
    events,
} from "../constants/index";

const { ipcRenderer } = window.require("electron");

const Files = props => {

    const onSaveClick = e => {
        ipcRenderer.send(events.SYNC_SAVE_FILE, props.string);
    };

    const onLoadClick = e => {
        ipcRenderer.send(events.SYNC_LOAD_FILE, props.string);
    };

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