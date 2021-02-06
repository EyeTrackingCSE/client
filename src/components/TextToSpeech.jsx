import React from 'react';

import "../styles/TextToSpeech.css";

/**
 * On click, say the string stored in props.string
 * @param {object} props 
 */
const TextToSpeech = (props) => {
    const onSpeakButtonClick = () => {
        if (!props.string || props.string.length === 0)
            return;
        
        let utterance = new SpeechSynthesisUtterance(props.string);
        speechSynthesis.speak(utterance);
    }

    return (
        <div onClick={onSpeakButtonClick} className={"speak"}>
            Speak
        </div>
    );
};

export default TextToSpeech;