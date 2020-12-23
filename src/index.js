import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';

import worker from 'workerize-loader!./workers/eyetracking' // eslint-disable-line import/no-webpack-loader-syntax

const workerInstance = worker()
// Attach an event listener to receive calculations from your worker
workerInstance.addEventListener('message', (message) => {
  console.log('New Message: ', message.data)
})

// Run your calculations
workerInstance.calculatePrimes(500, 1000000000)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
