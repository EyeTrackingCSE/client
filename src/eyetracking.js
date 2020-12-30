const eyetracking = require('eyetracking');

process.on('message', (arg) => {
    screen = new eyetracking(arg.width, arg.height);
    screen.AddRectangles(arg.rectangles);
    screen.Listen((id, hasFocus, timestamp) => {
        process.send({id, hasFocus, timestamp});
    });
});

