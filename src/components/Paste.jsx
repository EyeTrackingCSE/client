import React from 'react';

import "../styles/Clip.css";

/**
 * Button that copies the users clipboard to props.string
 * @param {object} props 
 */
const Paste = (props) => {
    const onPasteButtonClick = () => {
        if (props.onBeforePaste)
            props.onBeforePaste(props.string);

        navigator.clipboard.readText()
            .then(clipboard => {
                if (props.onAfterPaste)
                    props.onAfterPaste(clipboard);
            });
    }

    return (
        <div onClick={onPasteButtonClick} className={"clip"}>
            Paste
        </div>
    );
};

export default Paste;