import React, { useState, useRef, useEffect } from 'react';

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import "../styles/KeyboardWrapper.css";

import {
  ASYNC_GAZE_FOCUS_EVENT,
  SYNC_SET_NEW_SCREEN,
  ASYNC_LISTEN,
  ERROR,
} from "../constants/index";

const { ipcRenderer } = window.require("electron");

const KeyboardWrapper = () => {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const keyboard = useRef();

  /**
   * Gets called when component mounts
   * Just binds the 'resize' event to setKeyDimensions to update eyetracker
   */
  useEffect(() => {
    window.addEventListener('resize', setKeyDimensions);
  }, []);

  /**
   * Extracts width of screen, height of screen,
   * and coordinates of key on virutal keyboard.
   */
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

    return {
      width: w,
      height: h,
      rectangles: keyDimensions
    };
  }

  /**
   * Gets screen and keyboard metadata, and pushes said info to
   * the eyetracking module via ipc.
   * 
   * Begins eyetracking listen loop.
   * 
   * On each gaze focus event, calls onGazeFocusEvent()
   */
  const setKeyDimensions = () => {
    let dims = getKeyDimensions();
    let returnVal = ipcRenderer.sendSync(SYNC_SET_NEW_SCREEN, dims);
    console.log('returnVal', returnVal);
    if (returnVal === ERROR) {
      throw new Error("Something went wrong extracting keyboard regions.");
    }

    console.log(dims);

    // Start Tobii listen loop
    ipcRenderer.on(ASYNC_GAZE_FOCUS_EVENT, onGazeFocusEvent);
    ipcRenderer.send(ASYNC_LISTEN, 1);
  }

  /**
   * TODO
   * @param {object} event event obj
   * @param {object} arg args to the ipc event
   */
  const onGazeFocusEvent = (event, args) => {
    console.log(args);
  }

  /**
   * Update input variable in state
   * @param {string} input 
   */
  const onChange = input => {
    setInput(input);
    // console.log("Input changed ", input);
  };

  /**
   * Swaps keyboard to shift mode.
   */
  const handleShift = () => {
    const newLayout = layout === "default" ? "shift" : "default";
    setLayout(newLayout);
  };

  /**
   * Called when keyboard button is pressed. Check for shift or caps lock
   * @param {string} button button pressed
   */
  const onKeyPress = button => {
    // console.log("Button pressed", button);

    if (button === "{shift}" || button === "{lock}") {
      handleShift();
    }
  }

  /**
   * Called when input must change due to manual typing
   * in <textarea /> window
   * @param {object} event 
   */
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