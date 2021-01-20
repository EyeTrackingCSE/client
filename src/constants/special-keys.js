/**
 * This file exports special key bindings for the virtual keyboard,
 * for example, if the user selects {space}, we don't want to insert the literal
 * string "{space}", we wan't to capture " ".
 */

class SpecialKey {
    constructor(id, fn) {
        this.id = id;
        this.fn = fn;
    }
}

module.exports = {
    "": new SpecialKey("{space}", input => input + " "),

    "tab": new SpecialKey("{tab}", input => input + "   "),

    // Does not affect input variable
    "shift": new SpecialKey("{shift}", input => input),

    "< enter": new SpecialKey("{enter}", input => input + "\n"),

    "backspace": new SpecialKey("{bksp}", input => input.slice(0, -1)),

    // Does not affect input variable
    "caps": new SpecialKey("{lock}", input => input)
}