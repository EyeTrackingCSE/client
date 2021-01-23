import React, { useState, useRef, useEffect } from 'react';

const Clip = (props) => {
    if (!props.string)
        throw new Error("string cannot be null/undefined");

    const onClipButtonClick = () => {
        if (props.onBeforeClip)
            props.onBeforeClip(props.string);

        navigator.clipboard.writeText(this.state.working);
        
        if (props.onAfterClip)
            props.onAfterClip(props.string);
    }

    return (
        <button onClick={onClipButtonClick}>
            Clip
        </button>
    );
};

export const Clip;