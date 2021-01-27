import React, { useState, useEffect } from 'react';

const TIMEOUT_FETCH = 1000; // After this much time, fail fetching and return empty
const EMPTY_OBJ = {};

const SEPARATORS = /[\W_]+/

// Word suggestion API from https://www.datamuse.com/api/
const api = "https://api.datamuse.com/sug?s="

const WordSuggestions = (props) => {
    let [suggestions, setSuggestions] = useState([]);

    const getLastWordFromInput = input => {
        const words = input.split(SEPARATORS);
        const last = (words.length === 0) ? "" : words.pop();
        return last;
    };

    const getWordSuggestions = async (input) => {
        const controller = new AbortController();
        const signal = controller.signal;

        setTimeout(() => controller.abort(), TIMEOUT_FETCH, EMPTY_OBJ);

        let cue = getLastWordFromInput(input);

        let resp = await fetch(api + cue, { signal });
        let array = await resp.json();

        return array || [];
    };

    useEffect(async () => {
        let words = await getWordSuggestions(props.input);
        console.log(words);
        setSuggestions(words);
    }, [props.input]);

    return (
        <div></div>
    );
};

export default WordSuggestions;