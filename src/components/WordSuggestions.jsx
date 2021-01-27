import React, { useState, useEffect } from 'react';
import "../styles/WordSuggestions.css";
import { defaults } from "../constants/index";

const TIMEOUT_FETCH = 1000; // After this much time, fail fetching and return empty
const EMPTY_OBJ = {};
const API = "https://api.datamuse.com/sug?s="

const SEPARATORS = /[\W_]+/

const Block = (props) => {
    return (
        <div
            className={"block"}
            onClick={() => props.onBlockClick(props.word)}>
            <span>
                {props.word || ''}
            </span>
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
        console.log(words);

        let last;
        
        if (words.length === 0) {
            last = '';
        }
        else {
            let lastTerm = words.pop();
            if (lastTerm == '')
                lastTerm = words.pop();
            last = lastTerm;
        }
        console.log('last', last);
        return last;
    };

    /**
     * Returns and array of word suggestions
     * @param {string} input string to query words suggestions for.
     */
    const getWordSuggestions = async (query) => {
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

    const renderBlocks = (wordsArray, term) => {
        let ans = [];
        for (let i = 0; i < 3; i++) {
            let word = wordsArray[i].word;

            ans.push(
                <Block onBlockClick={props.onSuggestionClick} key={i} word={word} />
            );
        }
        return ans;
    };

    /**
     * Function runs when props.input changes, because we need to query the API again.
     */
    useEffect(() => {
        const asyncFetchWrapper = async () => {
            let query = getLastWordFromInput(props.input);
            let words = await getWordSuggestions(query);
            setSuggestions(words);
            console.log(words);
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