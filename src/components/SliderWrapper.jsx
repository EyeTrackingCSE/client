import React, { useState, useRef, useEffect } from 'react';

import Slider, { SliderTooltip } from 'rc-slider';

import 'rc-slider/assets/index.css';
import { defaults } from "../constants/index";

import "../styles/SliderWrapper.css";

const { Handle } = Slider;


const handle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <SliderTooltip
            prefixCls="rc-slider-tooltip"
            overlay={`${value} %`}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </SliderTooltip>
    );
};

const SliderWrapper = (props) => {
    const formatDwellTimeIntervals = () => {
        let marksArray = defaults.DEFAULT_DWELL_TIME_OPTIONS_MS;
        let marks = {};

        marksArray.map(cur => marks[cur] = cur);
        return marks;
    }

    const onMarkChange = valueMS => {

    };

    return (
        <div className={"wrapper"}>
            <Slider
                min={defaults.DEFAULT_DWELL_TIME_OPTIONS_MS[0]}
                defaultValue={defaults.DEFAULT_DWELL_TIME_MS}
                marks={formatDwellTimeIntervals()}
                step={null}
                handle={handle} />
        </div>

    );
};

export default SliderWrapper;