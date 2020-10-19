/**
 * Assign given factory function to available global space.
 *
 * @param {string} key key
 * @param {Function} factory factory function that will be assigned to global space key
 */
// eslint-disable-next-line no-unused-vars
function assignToGlobal(key, factory) {
	// eslint-disable-next-line no-restricted-globals
	const context = self || global;
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
}
