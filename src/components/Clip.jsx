import React, { useState, useRef, useEffect } from 'react';
import { defaults } from '../constants';

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
        <button onClick={onClipButtonClick}>
            Clip
        </button>
    );
};

export default Clip;