import React, { useState, useRef, useEffect } from 'react';

import Keyboard from 'react-simple-keyboard';
import Toggle from 'react-toggle'

import 'react-simple-keyboard/build/css/index.css';

import "../styles/KeyboardWrapper.css";

import {
  ASYNC_GAZE_FOCUS_EVENT,
  ASYNC_LISTEN,
} from "../constants/index";

const { ipcRenderer } = window.require("electron");

const KeyboardWrapper = () => {
  /* Text input string var */
  const [input, setInput] = useState("");

  /* Layout of the keyboard, used for pivoting between shift and unshift */
  const [layout, setLayout] = useState("default");

  /* How long the user should "dwell" their focus on a key
    before accepting the key as input. Default 1000ms (1 second) */
  const [dwellTimeMS, setDwellTimeMS] = useState(1000);

  /* By default enable eyetracking keyboard */
  const [eyetrackingIsOn, setEyetrackingIsOn] = useState(true);

  const keyboard = useRef();


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
        height: buttonElement.offsetHeight,
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
    console.log(dims);

    // Start Tobii listen loop
    ipcRenderer.send(ASYNC_LISTEN, dims);
  }

  /**
   * When the user focuses on a key, 
   * update the input variabe.
   * @param {object} event event obj
   * @param {object} arg args to the ipc event
   */
  const onGazeFocusEvent = (event, args) => {
    let currentInput = keyboard.current.getInput();
    let newInput = currentInput + args.key;

    console.log(args.key);
    setInput(newInput);
    keyboard.current.setInput(newInput);
  }

  /**
   * Update input variable in state
   * @param {string} input 
   */
  const onChange = input => {
    setInput(input);
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

  /**
   * Gets called when component mounts
   * Just binds the 'resize' event to setKeyDimensions to update eyetracker
   */
  useEffect(() => {
    window.addEventListener('resize', setKeyDimensions);
    ipcRenderer.on(ASYNC_GAZE_FOCUS_EVENT, onGazeFocusEvent);
    setKeyDimensions();
  }, []);

  return (
    <div>
      <div id="settings-bar">
        Settings bar
      </div>
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