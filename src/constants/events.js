/**
 * Define names of ipc events.
 */
module.exports = {
    ASYNC_GAZE_FOCUS_EVENT: 'ASYNC_GAZE_FOCUS_EVENT',
    ASYNC_LISTEN: 'ASYNC_LISTEN',

    SYNC_SET_NEW_SCREEN: 'SYNC_SET_NEW_SCREEN',
    SYNC_SET_SCREEN_SPACE: 'SET_SCREEN_SPACE', // Not presently used

    SYNC_SAVE_FILE: 'SYNC_SAVE_FILE',
    SYNC_LOAD_FILE: 'SYNC_LOAD_FILE',
    SYNC_FILE_CONTENT: 'SYNC_FILE_CONTENT',

    CALIBRATE_TOBII_EYETRACKER: 'CALIBRATE_TOBII_EYETRACKER',
    CALIBRATE_TOBII_WHEN_IDLE: 'CALIBRATE_TOBII_WHEN_IDLE'
}