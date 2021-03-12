/**
 * Data manager store getters.
 *
 * @type {Object}
 */
const getters = {
	/**
	 * Get temp data values of data manager.
	 *
	 * @param {Object} state store state
	 * @return {Array} temp data
	 */
	getDataManagerTempData(state) {
		return state.tempData.values;
	},
	/**
	 * Get current control values of temp data manager.
	 *
	 * @param {Object} state store state
	 * @return {Object} control values
	 */
	getDataManagerControls(state) {
		return state.controls;
	},
};

/**
 * @module getters
 */
export default getters;
