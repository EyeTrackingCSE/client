import React, { useState, useEffect } from 'react';
import "../styles/WordSuggestions.css";
import {defaults} from "../constants/index";

const TIMEOUT_FETCH = 1000; // After this much time, fail fetching and return empty
const EMPTY_OBJ = {};
const API = "https://api.datamuse.com/sug?s="

const SEPARATORS = /[\W_]+/

const Block = (props) => {
    return (
        <div
            className={"block"}>
            {props.word || ''}
        </div>
    )
}

const WordSuggestions = (props) => {
    let [suggestions, setSuggestions] = useState(defaults.DEFAULT_WORD_SUGGESTIONS);

    /**
     * Extract the last word in a string.
     * gamblers ruin => ruin
     * @param {string} input 
     */
    const getLastWordFromInput = input => {
        const words = input.split(SEPARATORS);
        const last = (words.length === 0) ? "" : words.pop();
        return last;
    };

    /**
     * Returns and array of word suggestions
     * @param {string} input string to query words suggestions for.
     */
    const getWordSuggestions = async (input) => {
        const controller = new AbortController();
        const signal = controller.signal;

        let timeout = setTimeout(() => controller.abort(), TIMEOUT_FETCH, EMPTY_OBJ);
        let context = getLastWordFromInput(input);

        let array = [];
        try {
            let resp = await fetch(API + context, { signal });
            array = await resp.json();
            clearTimeout(timeout);
        } catch (e) {
            console.error(e);
        }
        return array;
    };

    const renderBlocks = (wordsArray) => {
        let ans = [];
        for (let i = 0; i < 3; i++) {
            let word = wordsArray[i] ? wordsArray[i].word : '';

            ans.push(<Block key={i} word={word} />)
        }
        return ans;
    };

    /**
     * Function runs when props.input changes, because we need to query the API again.
     */
    useEffect(() => {
        const asyncFetchWrapper = async () => {
            let words = await getWordSuggestions(props.input);
            console.log(words);
            setSuggestions(words);
        }
        if (props.input === '')
            return;
        asyncFetchWrapper();
    }, [props.input]);

    return (
        <div className={"block-wrapper"}>
            {renderBlocks(suggestions)}
        </div>
    );
};

export default WordSuggestions;