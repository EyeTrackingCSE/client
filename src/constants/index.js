/**
 * Bundle all constants in one fat object
 */
module.exports = {
    ...require('./events'),
    ...require('./status'),
    ...require('./lettering')
}