import React from 'react';

import Slider, { SliderTooltip } from 'rc-slider';

import 'rc-slider/assets/index.css';

import { defaults } from "../constants/index";

import "../styles/SliderWrapper.css";

const { Handle } = Slider;

/**
 * Utility component that slider tooltip. Does not get exported
 * @param {object} props 
 */
const handle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <SliderTooltip
            prefixCls="rc-slider-tooltip"
            overlay={`${value * 10} MS`}
            visible={dragging}
            placement="bottom"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </SliderTooltip>
    );
};

const SliderWrapper = (props) => {

    /**
     * Converts a number array to format
     * used by rc-slider mark option.
     */
    const formatDwellTimeIntervals = () => {
        let marksArray = defaults.DEFAULT_DWELL_TIME_OPTIONS_MS;
        let marks = {};

        // Need to divide the numbers by 10 because rc-slider
        // computes its width using the nominal value of the max mark.
        marksArray.map(cur => marks[cur / 10] = cur);
        return marks;
    }

    const onMarkChange = value => {
        let valueMS = value * 10;
        console.log(valueMS);

        if (props.onChange)
            props.onChange(valueMS);
    };

    return (
        <Slider
            className={"wrapper"}
            min={defaults.DEFAULT_DWELL_TIME_OPTIONS_MS[0] / 10}
            defaultValue={defaults.DEFAULT_DWELL_TIME_MS / 10}
            marks={formatDwellTimeIntervals()}
            onChange={onMarkChange}
            step={null}
            handle={handle}
        />
    );
};

export default SliderWrapper;