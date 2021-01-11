/**
 * This file exports special key bindings for the virtual keyboard,
 * for example, if the user selects {space}, we don't want to insert the literal
 * string "{space}", we wan't to capture " ".
 */

module.exports = {
    "": " ",
    "tab": "    ",
    "shift": "",
    "< enter": "\n"
}