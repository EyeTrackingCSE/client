/**
 * This file exports default settings in the keyboard component such 
 * as dwell time, focus, and the potentially more.
 */

module.exports = {
    /**
     * Available dwell time configuration in MS
     */
    DEFAULT_DWELL_TIME_OPTIONS_MS: [0, 250, 500, 750, 1000],

    /**
     * Index of default dwell time.
     */
    DEFAULT_DWELL_TIME_MS: 750,

    /**
     * DEPRECATED - not used ATM
     * 
     * The eyetracking will capture a gaze event even if the user does not
     * focus on a particular key. Imagine gazing across the 'f' key
     * to reach the 'g' key. The eyetracking will emit an event for 'f', but hasFocus
     * will be set to false. In a second event, an event will be emit for 'f' with hasFocus
     * will be set to true.
     */
    DEFAULT_REQUIRE_FOCUS: true,

    /**
     * By default whether to listen for gaze data.
     */
    DEFAULT_EYETRACKING_ON: false,

    DEFAULT_WORD_SUGGESTIONS: [
        { word: 'the', score: 0 },
        { word: 'you', score: 0 },
        { word: 'for', score: 0 },
    ],

    DEFAULT_TOBII_EXPERIENCE_PATH: "c:\\Program Files (x86)\\Tobii",

    DEFAULT_RECALIBRATE_TIMER: 30000
}