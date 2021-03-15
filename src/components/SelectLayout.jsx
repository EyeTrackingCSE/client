import React from 'react';

import "../styles/SelectLayout.css";

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { defaults } from '../constants/index'

/**
 * Wrapper for layout dropdown.
 * @param {object} props 
 */
const SelectLayout = (props) => {
    console.log(defaults.SUPPORTED_LAYOUTS)
    return (
        <Dropdown
            className={"dropdown-wrapper"}
            options={defaults.SUPPORTED_LAYOUTS}
            onChange={props.onChange}
            placeholder={"qwerty"}
        />
    );
};

export default SelectLayout;