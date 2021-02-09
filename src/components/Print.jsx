import React from 'react';

import "../styles/Print.css";

/**
 * Button that copies props.string to the users clipboard when clicked.
 * @param {object} props 
 */
const Print = (props) => {
    const onPrintButtonClick = () => {
        window.print();
    }

    return (
        <div onClick={onPrintButtonClick} className={"clip"}>
            Print
        </div>
    );
};

export default Clip;