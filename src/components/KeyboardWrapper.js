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
  const startGazeFocusEventListener = () => {
    if (!eyetrackingIsOn)
      return;

    let rectangles = [];

    keyboard.current.recurseButtons(buttonElement => {
      let block = buttonElement.getBoundingClientRect();

      rectangles.push({
        id: rectangles.length,
        key: buttonElement.innerText,
        x: block.x,
        y: block.y,
        width: block.width,
        height: block.height
      });
    });

    let dimensions = {
      width: window.outerWidth,
      height: window.outerHeight,
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
    if (!args.hasFocus)
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
   * 
   * When the use changes the window size,
   * this affects the screen dimensions and keyboard key offets
   * meaning these values must be updated to the eytracking
   * device. The new Gaze Focus Event Listener needs to be started
   * to accomomdate new screen dimensions
   */
  useEffect(() => {
    window.addEventListener('resize', startGazeFocusEventListener);
  }, []);

  /**
   * Gets called when the user turns on/off eyetracking.
   * 
   * If they turn eyetracking on, it runs startGazeEventListener()
   * to kickstart a new tobii eyetracking session
   * 
   * If they turn eyetracking off, it unhooks the ASYNC_GAZE_FOCUS_EVENT
   * listener from IPC.
   */
  useEffect(() => {
    if (eyetrackingIsOn) {
      ipcRenderer.on(ASYNC_GAZE_FOCUS_EVENT, onGazeFocusEvent);
      startGazeFocusEventListener();
    } else {
      ipcRenderer.removeAllListeners(ASYNC_GAZE_FOCUS_EVENT);
    }
  }, [eyetrackingIsOn])

  return (
    <div className={"component-wrapper"}>
      <div className={"settings-bar"}>
        <div>
          <Toggle
            id='eyetracking-toggle'
            defaultChecked={eyetrackingIsOn}
            onChange={onEyeTrackingIsOnChange} />
          <label htmlFor='eyetracking-toggle'>Adjacent label tag</label>
        </div>


      </div>
      <div className={"textarea-wrapper"}>
        <textarea
          className={"canvas"}
          value={input}
          placeholder={"Tap on the virtual keyboard to start"}
          onChange={onChangeInput}
        />
      </div>
      <Keyboard
        className={"simple-keyboard"}
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