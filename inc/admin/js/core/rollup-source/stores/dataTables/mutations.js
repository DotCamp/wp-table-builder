/* eslint-disable no-param-reassign */
/**
 * Data table mutations.
 *
 * @type {Object}
 */
const mutations = {
	/**
	 *
	 * @param {Object} state data table state
	 * @param {boolean} visible visibility value
	 */
	appVisibility(state, visible) {
		state.visiblity = visible;
	},
};

export default mutations;
