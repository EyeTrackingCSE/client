const eyetracking = require('eyetracking');

let screen;

export const newScreen = (w, h) => {
    screen = new eyetracking(w. h);
};

export const addRectangles = (array) => {
    if (screen == null) {
        console.log("Screen has not been init");
        return;
    }

    screen.addRectangles(array);
};

export const listen = (cb) => {
    if (screen == null) {
        console.log("Screen has not been init");
        return;
    }

    screen.listen(cb);
}

export const calculatePrimes = (iterations, multiplier) => {
    while(true)  {
      let primes = [];
      for (let i = 0; i < iterations; i++) {
        let candidate = i * (multiplier * Math.random());
        let isPrime = true;
        
        for (var c = 2; c <= Math.sqrt(candidate); ++c) {
          if (candidate % c === 0) {
            // not prime
            isPrime = false;
            break;
          }
        }
        if (isPrime) {
          primes.push(candidate);
        }
      }
      postMessage(primes);
    }
  }