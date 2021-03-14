/**
 * Bundle all constants in one fat object
 */
module.exports = {
    events: require('./events'),
    lettering: require('./lettering'),
    defaults: require('./defaults'),
    specialkeys: require('./special-keys'),
    types: require('./types')
};

let a = require('./defaults');

console.log(a.DEFAULT_LAYOUTS.hello);