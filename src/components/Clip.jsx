import React from 'react';

import "../styles/Clip.css";

const Clip = (props) => {
    if (props.string === null || props.string === undefined)
        throw new Error("string cannot be null/undefined");

    const onClipButtonClick = () => {
        if (props.onBeforeClip)
            props.onBeforeClip(props.string);

        navigator.clipboard.writeText(props.string);
        
        if (props.onAfterClip)
            props.onAfterClip(props.string);
    }

    return (
        <a onClick={onClipButtonClick} className={"clip"}>
            Clip
        </a>
    );
};

export default Clip;