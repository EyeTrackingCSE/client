let KeyboardLayouts = require('simple-keyboard-layouts').default;
let layout = new KeyboardLayouts()

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

    DEFAULT_RECALIBRATE_TIMER: 30000,

    DEFAULT_LAYOUTS: new Proxy({
        'default': [
            '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
            '{tab} q w e r t y u i o p [ ] \\',
            '{lock} a s d f g h j k l ; \' {enter}',
            '{shift} z x c v b n m , . / {shift}',
            '.com @ {space}'
        ],
        'default-shift': [
            '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
            '{tab} Q W E R T Y U I O P { } |',
            '{lock} A S D F G H J K L : " {enter}',
            '{shift} Z X C V B N M < > ? {shift}',
            '.com @ {space}'
        ],
        'dvorak': [
            '~ 1 2 3 4 5 6 7 8 9 0 [ ] {bksp}',
            '{tab} \' , . p y f g c r l / = \\',
            '{lock} a o e u i d h t n s . {enter}',
            '{shift} ; q j k x b m w v z {shift}',
            '.com @ {space}'
        ],
        'dvorak-shift': [
            "~ 1 2 3 4 5 6 7 8 9 0 [ ] {bksp}",
            "{tab} ' , . P Y F G C R L / = \\",
            "{lock} A O E U I D H T N S . {enter}",
            "{shift} ; Q J K X B M W V Z {shift}",
            ".com @ {space}"
        ]
    }, {
        get: (target, prop, recv) => {
            let english = ['default', 'default-shift', 'dvorak', 'dvorak-shift']

            if (english.includes(prop))
                return Reflect.get(target, prop, recv);

            let lay = prop.replace("-shift", '');
            let needShifted = lay.length !== prop.length;

            let ans = layout.get(lay);

            if (!ans)
                return Reflect.get(target, "default", recv)

            if (needShifted)
                return layout.get(lay).shift
            else
                return layout.get(lay).default
        }
    }),

    SUPPORTED_LAYOUTS: [
        { label: "qwerty", value: "default" },
        { label: "dvorak", value: "dvorak" },
        { label: "Arabic", value: "arabic" },
        { label: "Assamese", value: "assamese" },
        { label: "Belarusian", value: "belarusian" },
        { label: "Bengali", value: "bengali" },
        { label: "Burmese", value: "burmese" },
        { label: "Chinese", value: "chinese" },
        { label: "Czech", value: "czech" },
        { label: "Farsi", value: "farsi" },
        { label: "French", value: "french" },
        { label: "Georgian", value: "georgian" },
        { label: "German", value: "german" },
        { label: "Gilaki", value: "gilaki" },
        { label: "Greek", value: "greek" },
        { label: "Hebrew", value: "hebrew" },
        { label: "Hindi", value: "hindi" },
        { label: "Italian", value: "italian" },
        { label: "Japanese", value: "japanese" },
        { label: "Kannada", value: "kannada" },
        { label: "Korean", value: "korean" },
        { label: "Nigerian", value: "nigerian" },
        { label: "Norwegian", value: "norwegian" },
        { label: "Polish", value: "polish" },
        { label: "Russian", value: "russian" },
        { label: "Sindhi", value: "sindhi" },
        { label: "Spanish", value: "spanish" },
        { label: "Swedish", value: "swedish" },
        { label: "Thai", value: "thai" },
        { label: "Turkish", value: "turkish" },
        { label: "Ukrainian", value: "ukrainian" },
        { label: "Urdu", value: "urdu" },
        { label: "Uyghur", value: "Uyghur" },
    ]
}