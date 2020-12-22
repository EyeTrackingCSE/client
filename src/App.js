import React from 'react';
import './styles/App.css';

import KeyboardWrapper from './components/KeyboardWrapper';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <KeyboardWrapper></KeyboardWrapper>
      </div>
    );
  }

}

export default App;
