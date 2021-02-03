const INSERT = 0;
const DELETE = 1;

class Update {
    constructor(command, char) {
        this.command = command;
        this.char = char;
    }
}

class HistoryCache {
    constructor(string) {
        this.string = string;
        this.history = [new Update(INSERT, string)];
    }

    update(newString) {
        let diff = newString.replace(this.string, '');

        let command;
        let char;
        if (diff === newString) {
            command = DELETE;
            char = this.string.replace(newString, '');
        } else {
            command = INSERT;
            char = diff;
        }

        this.history.push(new Update(command, char));
        this.string = newString;
    }

    undo() {
        if (this.history.length === 0)
            return '';

        let last = this.history.pop();
        let newString = '';

        if (last.command === INSERT) {
            newString = this.string.slice(0, -1);
        } else {
            newString = this.string + last.change;
        }
    }
}