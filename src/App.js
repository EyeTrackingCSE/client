import React from 'react';
import './App.css';

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css'

import Button from 'react-bootstrap/Button';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {working: ''};

    this.onChange = this.onChange.bind(this);
    this.onChangeEvent = this.onChangeEvent.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onClickCopy = this.onClickCopy.bind(this);
  }

  /**
   * Function that gets called when the user invokes a keyboard press via the keyboard
   * Pops the last char off the working string and appends it to state. 
   * @param {string} input param passed by keyboard component 
   */
  onChange(input) {
    let last = input.charAt(input.length - 1)
    this.setState({working: this.state.working + last});
  }

  /** 
   * Called when the user changes working string by manual input.
   */
  onChangeEvent(event) {
    this.setState({working: event.target.value});
  }

  /**
   * 
   * @param {string} input key pressed on keyboard
   */
  onKeyPress(input) {
    console.log("Keypress", input);
  }

  /**
   * Copies the state.working string to the user clipboard.
   * @param {event} event event object passed by button press
   */
  onClickCopy(event) {
    event.preventDefault();

    // copy this.state.working to the user clipboard
    navigator.clipboard.writeText(this.state.working);
    console.log(`Copied ${this.state.working} to clipboard`);

  }

  render() {
      return (
        <div className="App">
          <header className="App-header">
            <p>
              Eyetracking Keyboard
            </p>
            <form>
              {/* Text input for working string */}
              <input type="text" value={this.state.working} onChange={this.onChangeEvent} name="workingstring"></input>
              {' '}
              {/* Copy to clipboard button */}
              <Button variant="danger" onClick={this.onClickCopy}>Clip</Button>
            </form>
          </header>
          <div className="Keyboard-wrapper">
            <Keyboard className="Keyboard" onChange={this.onChange} onKeyPress={this.onKeyPress}/>
          </div>
        </div>
  );
  }

}

export default App;
