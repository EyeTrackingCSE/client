import React, { useState, useRef, useEffect } from 'react';

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import "../styles/KeyboardWrapper.css";

import worker from 'workerize-loader!../workers/eyetracking' // eslint-disable-line import/no-webpack-loader-syntax

const KeyboardWrapper = () => {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const keyboard = useRef();
  let eyetrackingInstance = worker();

  useEffect(() => {
    window.addEventListener('resize', getKeyDimensions);
    eyetrackingInstance.addEventListener('message', onKeyFocus);

    let screenMeta = getKeyDimensions();
    eyetrackingInstance.newScreen(screenMeta.width, screenMeta.height);
    eyetrackingInstance.addRectangles(screenMeta.rectangles);

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

  const onKeyFocus = message => {
    console.log("New message: ", message.data);
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