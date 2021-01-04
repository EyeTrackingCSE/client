import React, { useState, useRef, useEffect } from 'react';

import Keyboard from 'react-simple-keyboard';
import Toggle from 'react-toggle'

import 'react-simple-keyboard/build/css/index.css';
import 'react-toggle/style.css';

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
  const [eyetrackingIsOn, setEyetrackingIsOn] = useState(false);

  const keyboard = useRef();

  /**
   * Gets screen and keyboard metadata, and pushes said info to
   * the eyetracking module via ipc.
   * 
   * Begins eyetracking listen loop.
   * 
   * On each gaze focus event, calls onGazeFocusEvent()
   */
  const setKeyDimensions = () => {
    let rectangles = [];

    keyboard.current.recurseButtons(buttonElement => {
      rectangles.push({
        id: rectangles.length,
        key: buttonElement.innerText,
        x: buttonElement.offsetLeft,
        y: buttonElement.offsetTop,
        width: buttonElement.offsetWidth,
        height: buttonElement.offsetHeight,
      });
    });

    let dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      rectangles: rectangles
    };

    console.log(dimensions);

    // Start Tobii listen loop
    ipcRenderer.send(ASYNC_LISTEN, dimensions);
  }

  /**
   * When the user focuses on a key, 
   * update the input variabe.
   * @param {object} event event obj
   * @param {object} arg args to the ipc event
   */
  const onGazeFocusEvent = (event, args) => {
    console.log(eyetrackingIsOn);

    if (!eyetrackingIsOn)
      return;

    let currentInput = keyboard.current.getInput();
    let newInput = currentInput + args.key;

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
   * Swaps keyboard to shift mode or vice-versa.
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

  const onEyeTrackingIsOnChange = event => {
    setEyetrackingIsOn(event.target.checked);
  }

  /**
   * Gets called when component mounts
   */
  useEffect(() => {
    window.addEventListener('resize', setKeyDimensions);
    ipcRenderer.on(ASYNC_GAZE_FOCUS_EVENT, onGazeFocusEvent);
    setKeyDimensions();
    console.log(window.outerHeight);
    console.log(window.innerHeight);
  }, []);

  return (
    <div id="component-wrapper">
      <div id="settings-bar">
        <Toggle
          id="eyetracking-toggle"
          defaultChecked={eyetrackingIsOn}
          onChange={onEyeTrackingIsOnChange} />
      </div>
      <textarea
        className={"canvas"}
        // style={{height: window.outerHeight - 485}}
        value={input}
        placeholder={"Tap on the virtual keyboard to start"}
        onChange={onChangeInput}
      />
      <Keyboard
        id="simple-keyboard"
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