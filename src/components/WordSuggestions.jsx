import React, { useState, useEffect, useImperativeHandle, createRef, forwardRef, useRef } from 'react';
import "../styles/WordSuggestions.css";
import { defaults } from "../constants/index";

const TIMEOUT_FETCH = 1000; // After this much time, fail fetching and return empty
const EMPTY_OBJ = {};
const API = "https://api.datamuse.com/sug?s="

const SEPARATORS = /[\W_]+/

const Block = forwardRef((props, ref) => {
    return (
        <div
            className={"block"}
            onClick={() => props.onBlockClick(props.word)}
            ref={ref}>
            <span>
                {props.word || ''}
            </span>
        </div>
    )
});

const WordSuggestions = forwardRef((props, ref) => {
    let [suggestions, setSuggestions] = useState(defaults.DEFAULT_WORD_SUGGESTIONS);

    const blockLeft = useRef();
    const blockMiddle = useRef();
    const blockRight = useRef();

    const blockObject = {
        blockLeft,
        blockMiddle,
        blockRight
    }

    /**
     * Extract the last word in a string.
     * gamblers ruin => ruin
     * @param {string} input 
     */
    const getLastWordFromInput = input => {
        const words = input.split(SEPARATORS);

        let last = (words.length === 0) ? '' : words.pop();
        return last;
    };

    /**
     * Returns and array of word suggestions
     * @param {string} input string to query words suggestions for.
     */
    const getWordSuggestions = async (query) => {
        if (query === '')
            return defaults.DEFAULT_WORD_SUGGESTIONS;

        const controller = new AbortController();
        const signal = controller.signal;

        let timeout = setTimeout(() => controller.abort(), TIMEOUT_FETCH, EMPTY_OBJ);

        let array = [];
        try {
            let resp = await fetch(API + query, { signal });
            array = await resp.json();
            clearTimeout(timeout);
        } catch (e) {
            console.error(e);
        }
        return array;
    };

    /**
     * Expose the recurseButtons hook to parent.
     */
    useImperativeHandle(ref, () => ({
        recurseButtons(callback) {
            callback(blockLeft.current, 'blockLeft');
            callback(blockMiddle.current, 'blockMiddle');
            callback(blockRight.current, 'blockRight');
        },

        getBlockById(id) {
            return blockObject[id].current;
        }
    }));

    const getWordAtIndex = (wordsArray, i) => {
        return (wordsArray[i]) ? wordsArray[i].word : ' ';
    }
    /**
     * Function runs when props.input changes, because we need to query the API again.
     */
    useEffect(() => {
        const asyncFetchWrapper = async () => {
            let query = getLastWordFromInput(props.input);
            let words = await getWordSuggestions(query);
            setSuggestions(words);
        }
        if (props.input === '')
            return;

        asyncFetchWrapper();
    }, [props.input]);

    return (
        <div className={"block-wrapper"} ref={ref}>
            <Block
                onBlockClick={props.onSuggestionClick}
                ref={blockLeft}
                word={getWordAtIndex(suggestions, 0)} />
            <Block
                onBlockClick={props.onSuggestionClick}
                ref={blockMiddle}
                word={getWordAtIndex(suggestions, 1)} />
            <Block
                onBlockClick={props.onSuggestionClick}
                ref={blockRight}
                word={getWordAtIndex(suggestions, 2)} />
        </div>
    );
});

export default WordSuggestions;