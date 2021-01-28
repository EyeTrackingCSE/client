import React from 'react';

import "../styles/Clip.css";

/**
 * Button that copies props.string to the users clipboard when clicked.
 * @param {object} props 
 */
const Clip = (props) => {
    const onClipButtonClick = () => {
        if (props.onBeforeClip)
            props.onBeforeClip(props.string);

        navigator.clipboard.writeText(props.string);
        
        if (props.onAfterClip)
            props.onAfterClip(props.string);
    }

    return (
        <div onClick={onClipButtonClick} className={"clip"}>
            Clip
        </div>
    );
};

export default Clip;