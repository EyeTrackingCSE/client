import React from 'react';

const TIMEOUT_FETCH = 1000; // After this much time, fail fetching and return empty
const EMPTY_OBJ = {};

const SEPARATORS = /[\W_]+/

// Word suggestion API from https://www.datamuse.com/api/
const api = "https://api.datamuse.com/sug?s="

const WordSuggestions = (props) => {
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

        return fetch(api + cue, { signal })
            .then(result => {
                result = result.json();
                console.log(result);
            })
            .catch(error => error);
    };

    return (
        <div></div>
    );
};

export default WordSuggestions;
