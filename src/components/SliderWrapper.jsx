import React, { useState, useRef, useEffect } from 'react';

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { defaults } from "../constants/index";

const SliderWrapper = (props) => {



    const formatDwellTimeIntervals = () => {
        let marksArray = defaults.DEFAULT_DWELL_TIME_OPTIONS_MS;
        let marks = {};

        marksArray.map(cur => marks[cur] = cur);
        return marks;
    }

    return (
        <div>
            <Slider 
            min={defaults.DEFAULT_DWELL_TIME_OPTIONS_MS[0]} 
            defaultValue={defaults.DEFAULT_DWELL_TIME_MS} 
            marks={formatDwellTimeIntervals()} step={null} />
        </div>
    );
};

export default SliderWrapper;