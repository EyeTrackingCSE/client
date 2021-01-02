const { rebuildNativeModules } = require("electron-rebuild");

/**
 * This file contains default settings
 * for eyetracking sensitivity and config
 */
module.exports = {
    // 1 second default dwell trigger
    DWELL_TIME_MS: 1000,

    // Filter by hasFocus
    FILTER_UNFOCUSED_EVENTS: true
};