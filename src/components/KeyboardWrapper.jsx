import React, { useState, useRef, useEffect } from 'react';

import Keyboard from 'react-simple-keyboard';
import Toggle from 'react-toggle';
import Clip from './Clip';
import SliderWrapper from './SliderWrapper';
import WordSuggestions from './WordSuggestions';

import 'react-simple-keyboard/build/css/index.css';
import 'react-toggle/style.css';

import "../styles/KeyboardWrapper.css";

import {
  events,
  defaults,
  specialkeys
} from "../constants/index";

const { ipcRenderer } = window.require("electron");

const KeyboardWrapper = () => {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const [dwellTimeMS, setDwellTimeMS] = useState(defaults.DEFAULT_DWELL_TIME_MS);
  const [eyetrackingIsOn, setEyetrackingIsOn] = useState(defaults.DEFAULT_EYETRACKING_ON);
  const [gazeLog, setGazeLog] = useState({});

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
      width: window.innerWidth,
      height: window.innerHeight,
      rectangles: rectangles
    };

    // Start Tobii listen loop
    ipcRenderer.send(events.ASYNC_LISTEN, dimensions);
  }

  /**
   * Updates CSS of keyboard. If a key is focused on,
   * apply the hg-gaze animation to it.
   * 
   * If the key is not focused on, clear the hg-gaze animation.
   * @param {string} keyPressed key pressed on virtual keyboard
   * @param {boolean} hasFocus true if the users gaze is focused on keyPressed
   */
  const updateKeyboardStyles = (key, hasFocus) => {
    let cssSelector = specialkeys[key] ? specialkeys[key].id : key;
    let cssClass = `hg-gaze${dwellTimeMS}`

    if (hasFocus) {
      keyboard.current.addButtonTheme(cssSelector, cssClass);
    } else {
      keyboard.current.removeButtonTheme(cssSelector, cssClass);
    }
  }

  /**
   * Calculate the time a key was dwelled on.
   * if the user has NOT moved their gaze away from the key,
   * this function returns 0.
   * 
   * Otherwise it returns the dwell time in seconds.
   * @param {string} key key that was pressed
   * @param {number} timestamp UNIX timestamp of when key was looked at.
   */
  const computeDwellTime = (key, timestamp) => {
    let timestampOfLastFocus = 0;

    setGazeLog(logs => {
      timestampOfLastFocus = logs[key] || timestamp;
      return { [key]: timestamp }
    });

    return Math.abs(timestamp - timestampOfLastFocus);
  }

  /**
   * Called when the user looks at a key.
   * @param {object} event event obj
   * @param {object} arg args to the ipc event
   */
  const onGazeFocusEvent = (event, args) => {
    updateKeyboardStyles(args.key, args.hasFocus);

    let dwellTimeOfKey = computeDwellTime(args.key, args.timestamp);
    let keyAcceptedAsInput = dwellTimeOfKey >= dwellTimeMS;

    if (keyAcceptedAsInput) {
      let newInput = keyboard.current.getInput();

      if (specialkeys[args.key])
        newInput = specialkeys[args.key].fn(newInput);
      else
        newInput = newInput + args.key;

      setInput(newInput);
      keyboard.current.setInput(newInput);
    }
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
   * 
   * Doesn't actually work at the moment, hitting shift does nothing
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

  /**
   * Called when the user toggles the checkbox to 
   * turn on/off eyetracking.
   * @param {object} event 
   */
  const onEyeTrackingIsOnChange = event => {
    setEyetrackingIsOn(event.target.checked);
  }

  const onAfterClip = clippedString => {
    setInput('');
    keyboard.current.setInput('');
  };

  const onDwellTimeSliderChange = newDwellTimeMS => {
    setDwellTimeMS(newDwellTimeMS);
  }

  /**
   * When user clicks word suggestions, update input variables.
   * @param {string} clickedWord 
   */
  const onWordSuggestionClick = (clickedWord) => {
    let currentInput = keyboard.current.getInput();
    
    /* Extract the last 'word' in currentInput
       Replace the instance of lastWord in clickedWord with '' to get the remainder

       ex:
       currentInput = album by radio
       lastWord = radio
       clickedWord = radiohead
      
       trim = head
       newInput = currentInput + trim = radio + head .   
    */
    let lastWord = currentInput.substring(currentInput.lastIndexOf(" ")+1);
    let trim = clickedWord.replace(lastWord, '');

    let newInput = `${currentInput}${trim} `; 

    setInput(newInput);
    keyboard.current.setInput(newInput);
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
   * Gets called when the user turns on/off eyetracking. Also happens to 
   * run on startup (because eyetrackingIsOn setting its default value triggers this hook)
   * 
   * If they turn eyetracking on, it runs startGazeEventListener()
   * to kickstart a new tobii eyetracking session
   * 
   * If they turn eyetracking off, it unhooks the ASYNC_GAZE_FOCUS_EVENT
   * listener from IPC. Also rmemove lingering CSS from keyboard
   */
  useEffect(() => {
    ipcRenderer.removeAllListeners(events.ASYNC_GAZE_FOCUS_EVENT);

    if (eyetrackingIsOn) {
      ipcRenderer.on(events.ASYNC_GAZE_FOCUS_EVENT, onGazeFocusEvent);
      startGazeFocusEventListener();
    } else {
      keyboard.current.recurseButtons(buttonElement =>
        updateKeyboardStyles(buttonElement.innerText, false));
    }
  }, [eyetrackingIsOn, dwellTimeMS])

  return (
    <div className={"component-wrapper"}>
      <div className={"settings-bar"}>
        <Clip
          string={input}
          onAfterClip={onAfterClip} />
        <SliderWrapper
          onChange={onDwellTimeSliderChange} />
        <label htmlFor='eid' className={"eyetracking-toggle-label"}>Eyetracking</label>
        <Toggle
          className={"eyetracking-toggle"}
          id='eid'
          defaultChecked={eyetrackingIsOn}
          onChange={onEyeTrackingIsOnChange} />
      </div>
      <div className={"textarea-wrapper"}>
        <textarea
          className={"canvas"}
          value={input}
          placeholder={"Tap on the virtual keyboard to start"}
          onChange={onChangeInput}
        />
      </div>
      <WordSuggestions
        input={input}
        onSuggestionClick={onWordSuggestionClick} />
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