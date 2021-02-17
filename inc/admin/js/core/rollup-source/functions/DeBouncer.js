/**
 * ⛹️‍️Debounce class.
 *
 * Add a timeout to supplied function to delay its execution on certain situations, mostly in order to increase performance on repeating functions.
 *
 * @return {Function} main debounce function
 * @class
 */
function DeBouncer() {
	const actionIds = {};

	/**
	 * Main debounce function.
	 *
	 * @param {number} id unique id for action
	 * @param {Function} callable function to be called
	 * @param {number} timeout timeout duration in milliseconds
	 */
	function deBounce(id, callable, timeout = 2000) {
		if (Object.keys(actionIds).includes(id)) {
			clearTimeout(actionIds[id]);
		}
		actionIds[id] = setTimeout(callable, timeout);
	}

	return deBounce;
}

/**
 * @module DeBouncer module
 */
export default DeBouncer();
