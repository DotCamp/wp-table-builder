/* eslint-disable no-param-reassign */

/**
 * Data manager store mutations.
 *
 * @type {Object}
 */
const mutations = {
	/**
	 * Merge temp data object with the supplied object.
	 *
	 * @param {Object} state store state
	 * @param {Object} dataObject data object
	 */
	mergeTempData: (state, dataObject) => {
		state.tempData = { ...state.tempData, ...dataObject };
	},
};

/**
 * @module mutations
 */
export default mutations;
