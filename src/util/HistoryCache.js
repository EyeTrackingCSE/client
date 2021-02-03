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
        if (newString.length === 0)
            return;

        if (newString.length === this.string.length)
            return;

        console.log(`current '${this.string}', new '${newString}'`);
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

        let last = this.history.pop();
        let newString = '';

        if (last.command === INSERT) {
            // newString = this.string.slice(0, -1);
            newString = this.string.replace(last.diff, '');
        } else {
            newString = this.string + last.diff;
        }

        this.string = newString;
        return newString;
    }
};

module.exports = HistoryCache;