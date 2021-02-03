import React, { useEffect, useState } from 'react';

import "../styles/Undo.css";
import HistoryCache from '../util/HistoryCache';

/**
 * @param {object} props 
 */
const Undo = (props) => {
    const [cache, setCache] = useState(new HistoryCache(props.string));

    const onUndoClick = e => {
        let newString = cache.undo();
        if (props.onUndoClick)
            props.onUndoClick(newString);
    };

    useEffect(() => {
        cache.update(props.string);
    }, [props.string])

    return (
        <div onClick={onUndoClick} className={"undo"}>
            Undo
        </div>
    );
};

export default Undo;