import React, { useState, useRef, useEffect } from 'react';

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import "../styles/KeyboardWrapper.css";

const KeyboardWrapper = () => {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const keyboard = useRef();

  useEffect(() => {
    window.addEventListener('resize', getKeyDimensions);
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