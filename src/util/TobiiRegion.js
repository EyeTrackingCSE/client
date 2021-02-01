class TobiiRegion {
    constructor(id, buttonElement) {
        let block = buttonElement.getBoundingClientRect();

        this.id = id;
        this.key = buttonElement.innerText;
        this.x = block.x;
        this.y = block.y;
        this.width = block.width;
        this.height = block.height;
        this.html = buttonElement;
    }

    setKey(newValue) {
        this.key = newValue;
    }
}

module.exports = TobiiRegion;