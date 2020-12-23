import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';

import worker from 'workerize-loader!./workers/eyetracking' // eslint-disable-line import/no-webpack-loader-syntax

// const eyetrackerInstance = worker()

// eyetrackerInstance.addEventListener('message', (message) => {
//   console.log('New Message: ', message.data)
// });


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
