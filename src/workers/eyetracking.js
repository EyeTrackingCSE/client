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
