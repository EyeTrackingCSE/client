import React from 'react';
import "../styles/Files.css";

const { dialog } = require('electron').remote

const Files = props => {

    const onSaveClick = e => {

    };

    const onLoadClick = e => {

    };

    return (
        <div>
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