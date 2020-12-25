import React, { useState, useRef, useEffect } from 'react';

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import "../styles/KeyboardWrapper.css";

import * as constants from "../constants/index";

import {
  ASYNC_GAZE_FOCUS_EVENT,
  SET_GAZE_FOCUS_REGIONS,
  ASYNC_LISTEN, ERROR, OK
} from "../constants/index";

const { ipcRenderer } = window.require("electron");

const KeyboardWrapper = () => {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const keyboard = useRef();

  useEffect(() => {
    window.addEventListener('resize', setKeyDimensions);
    ipcRenderer.on(ASYNC_GAZE_FOCUS_EVENT, onGazeFocusEvent);

    // ipcRenderer.sendSync('asynchronous-message', 'ping')
    // ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //   console.log(arg) // prints "pong"
    // })
  }, []);

  const getKeyDimensions = () => {
    let w = window.outerWidth;
    let h = window.outerHeight;
    let keyDimensions = [];
    keyboard.current.recurseButtons(buttonElement => {
      keyDimensions.push({
        id: keyDimensions.length,
        key: buttonElement.innerText,
        x: buttonElement.offsetLeft,
        y: buttonElement.offsetTop,
        width: buttonElement.offsetWidth,
        height: buttonElement.offsetHeight
      });
    });
    console.log(`Screen ${w}x${h}`);
    console.log(keyDimensions);

    return {
      width: w,
      height: h,
      rectangles: keyDimensions
    };
  }

  const setKeyDimensions = () => {
    let dims = getKeyDimensions();
    let returnVal = ipcRenderer.sendSync(SET_GAZE_FOCUS_REGIONS, dims);

    if (returnVal === 1) {
      throw new Error("Something went wrong extracting keyboard regions.");
    }

    // Start Tobii listen loop
    ipcRenderer.send(ASYNC_LISTEN, 1);

  }

  const onGazeFocusEvent = (event, arg) => {

  }

  const onChange = input => {
    setInput(input);
    // console.log("Input changed ", input);
  };

  const handleShift = () => {
    const newLayout = layout === "default" ? "shift" : "default";
    setLayout(newLayout);
  };

  const onKeyPress = button => {
    // console.log("Button pressed", button);

    if (button === "{shift}" || button === "{lock}") {
      handleShift();
    }
  }

  const onChangeInput = event => {
    const input = event.target.value;
    setInput(input);

    keyboard.current.setInput(input);
  }

  return (
    <div>
      <textarea
        value={input}
        placeholder={"Tap on the virtual keyboard to start"}
        onChange={onChangeInput}
      />
      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        layoutName={layout}
        onChange={onChange}
        onKeyPress={onKeyPress}
        physicalKeyboardHighlight={true}
      />

    </div>
  );
}

export default KeyboardWrapper;