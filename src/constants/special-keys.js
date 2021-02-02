/**
 * This file exports special key bindings for the virtual keyboard,
 * for example, if the user selects {space}, we don't want to insert the literal
 * string "{space}", we wan't to capture " ".
 * 
 * I truly dislike this solution, so I would like to make this better in the future
 * If I can develop a better one
 */

class SpecialKey {
    constructor(id, update) {
        this.id = id;
        this.update = update;
    }
}

const space = new SpecialKey("{space}", input => input + " ");

const tab = new SpecialKey("{tab}", input => input + "   ");

const shift = new SpecialKey("{shift}", input => input);

const enter = new SpecialKey("{enter}", input => input + "\n");

const backspace = new SpecialKey("{bksp}", input => input.slice(0, -1));

const caps = new SpecialKey("{lock}", input => input);

module.exports = {
    "": space,

    "tab": tab,

    "shift": shift,

    "< enter": enter,

    "backspace": backspace,

    "caps": caps
}