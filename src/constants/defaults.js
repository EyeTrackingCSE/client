/**
 * This file exports default settings in the keyboard component such 
 * as dwell time, focus, and the potentially more.
 */

module.exports = {
    /**
     * By default, the user must focus on a key for 1000ms (1 seconds)
     * to capture that key as input.
     */
    DEFAULT_DWELL_TIME_MS: 1000,

    /**
     * The eyetracking will capture a gaze event even if the user does not
     * focus on a particular key. Imagine gazing across the 'f' key
     * to reach the 'g' key. The eyetracking will emit an event for 'f', but hasFocus
     * will be set to false. In a second event, an event will be emit for 'f' with hasFocus
     * will be set to true.
     */
    REQUIRE_FOCUS: true,

    /**
     * By default the eyetracking is on.
     */
    EYETRACKING_ON: true
}