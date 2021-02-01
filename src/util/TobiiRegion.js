const { types } = require('../constants/index')

class TobiiRegion {
    constructor(id, regionType, buttonElement) {
        if (!types[regionType])
            throw new Error(`Invalid TobiiRegion type, got regionType=${regionType}`);

        let block = buttonElement.getBoundingClientRect();

        this.id = id;
        this.key = buttonElement.innerText;
        this.x = block.x;
        this.y = block.y;
        this.width = block.width;
        this.height = block.height;

        this.type = regionType;
    }

    setKey(newValue) {
        this.key = newValue;
    }
}

module.exports = TobiiRegion;