import React from 'react';

const TIMEOUT_FETCH = 1000; // After this much time, fail fetching and return empty
const EMPTY_OBJ = {};

const SEPARATORS = /[\W_]+/

// Word suggestion API from https://www.datamuse.com/api/
const api = "https://api.datamuse.com/sug?s="

const WordSuggestions = (props) => {

    if (!props.input || props.input.length === 0) {
        throw new Error("input cannot be undefined/null.");
    }

    const getLastWordFromInput = input => {
        const words = input.split(SEPARATORS);
        const last = (words.length === 0) ? "" : words.pop();
        return last;
    };

    const getWordSuggestions = (input) => {
        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(() => controller.abort(), timeout, EMPTY_OBJ);

        let cue = getLastWordFromInput(input);

        let results;
        try {
            results = await fetch(api + cue, {signal});
        } catch {   
            console.error("Error in fetch");
        }

        console.log(results);

        return results;
    };

    return (
        <div onClick={getWordSuggestions(props.input)}>
            dsfajjf;lkdsa;lkdsa
        </div>
    );
};

export default WordSuggestions;


// HTML

<WordSuggestions
    input={input}
></WordSuggestions>