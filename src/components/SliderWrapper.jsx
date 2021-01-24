import React from 'react';

import Slider, { SliderTooltip } from 'rc-slider';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import { defaults } from "../constants/index";

import "../styles/SliderWrapper.css";

const { Handle } = Slider;


const handle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <SliderTooltip
            prefixCls="rc-slider-tooltip"
            overlay={`${value} MS`}
            visible={dragging}
            placement="bottom"
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

        marksArray.map(cur => marks[cur / 10] = cur);
        console.log(marks);
        return marks;
    }

    const onMarkChange = valueMS => {

    };

    return (
            <Slider
                className={"wrapper"}
                min={defaults.DEFAULT_DWELL_TIME_OPTIONS_MS[0] / 10}
                defaultValue={defaults.DEFAULT_DWELL_TIME_MS / 10}
                marks={formatDwellTimeIntervals()}
                step={null}
                handle={handle}
            />

    );
};

export default SliderWrapper;