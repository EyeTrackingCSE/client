const INSERT = 'U';
const DELETE = 'D';

class Update {
    constructor(command, change) {
        this.command = command;
        this.change = string;
    }
}

class HistoryCache {
    constructor(string) {
        this.string = string;
        this.history = [new Update(INSERT, string)];
    }

    update(newString) {

    }
}