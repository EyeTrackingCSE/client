const INSERT = 'I';
const DELETE = 'D';

class Update {
    constructor(command, diff) {
        this.command = command;
        this.diff = diff;
    }
}

/**
 * Keeps a change log of the a string.
 */
class HistoryCache {
    constructor(string) {
        this.string = string;
        this.history = [new Update(INSERT, string)];
    }

    /**
     * When string gets updated, the update needs to
     * be communicated with the cache through update()
     * @param {string} newString 
     */
    update(newString) {
        if (newString.length === this.string.length)
            return;

        let command, diff;

        if (newString.length < this.string.length) {
            command = DELETE;
            diff = this.string.replace(newString, '');
        } else {
            command = INSERT;
            diff = newString.replace(this.string, '');
        }

        this.history.push(new Update(command, diff));
        this.string = newString;
    }

    /**
     * Undoes the most recent operation
     * done to the string.
     * 
     * Returns the updated string
     */
    undo() {
        if (this.history.length === 0)
            return '';

        this.history.pop();

        this.string = this.generate();
        return this.string;
    }

    generate() {
        let str = '';
        for (let i = 0; i < this.history.length; i++) {
            let cur = this.history[i];
            if (cur.command === INSERT) {
                str += cur.diff;
            } else {
                str = str.replace(cur.diff, '');
            }
        }
        return str;
    }
};

module.exports = HistoryCache;