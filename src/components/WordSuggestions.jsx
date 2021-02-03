import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import "../styles/WordSuggestions.css";
import { defaults } from "../constants/index";

/**
 * Component that simply displays text.
 */
const Block = forwardRef((props, ref) => {
    return (
        <div
            className={"block"}
            onClick={() => props.onBlockClick(props.word)}
            title={props.title}
            ref={ref}>
            <span>
                {props.word || ' '}
            </span>
        </div>
    )
});

/**
 * Component that displays words suggestions provided a query string (props.input);
 */
const WordSuggestions = forwardRef((props, ref) => {
    let [suggestions, setSuggestions] = useState(defaults.DEFAULT_WORD_SUGGESTIONS);

    // Refs to 3 blocks that display words. This exposes the blocks to the parent.
    const blockLeft = useRef();
    const blockMiddle = useRef();
    const blockRight = useRef();

    /**
     * Extract the last word in a string.
     * gamblers ruin => ruin
     * @param {string} input 
     */
    const getLastWordFromInput = input => {
        const words = input.split(/[\W_]+/);

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
        const timeoutDurationMS = 1000;

        let timeout = setTimeout(() => controller.abort(), timeoutDurationMS);

        let array = [];
        let http = `https://api.datamuse.com/sug?s=${query}`

        try {
            let resp = await fetch(http, { signal });
            array = await resp.json();
            clearTimeout(timeout);
        } catch (e) {
            console.error(`${http} request timed out after ${timeoutDurationMS} MS`)
            array = defaults.DEFAULT_WORD_SUGGESTIONS;
        }
        return array;
    };

    /**
     * Expose the recurseButtons hook to parent.
     */
    useImperativeHandle(ref, () => ({

        /**
         * callback() gets called for each block in the component.
         * Gives the parent access to the blocks HTMLElement object.
         * @param {function} callback 
         */
        recurseButtons(callback) {
            callback(blockLeft.current);
            callback(blockMiddle.current);
            callback(blockRight.current);
        },

        /**
         * Given the ID of a block, returns the ref of the corresponding block.
         * s can only be one of [the, you, for]
         * @param {string} title 
         */
        getBlockByTitle(title) {
            if (title === blockLeft.current.title)
                return blockLeft.current;
            
            if (title === blockMiddle.current.title)
                return blockMiddle.current;

            if (title === blockRight.current.title)
                return blockRight.current;
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
                title={'left'}
                word={getWordAtIndex(suggestions, 0)} />
            <Block
                onBlockClick={props.onSuggestionClick}
                ref={blockMiddle}
                title={'middle'}
                word={getWordAtIndex(suggestions, 1)} />
            <Block
                onBlockClick={props.onSuggestionClick}
                ref={blockRight}
                title={'right'}
                word={getWordAtIndex(suggestions, 2)} />
        </div>
    );
});

export default WordSuggestions;