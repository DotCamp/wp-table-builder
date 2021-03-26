import deepmerge from 'deepmerge';
/* eslint-disable no-param-reassign */
/**
 * Modal window store mutations.
 *
 * @type {Object}
 */
const mutations = {
	/**
	 * Set modal window message.
	 *
	 * @param {Object} state store state
	 * @param {string} message modal window message
	 */
	setMessage(state, message) {
		state.app.message = message;
	},
	/**
	 * Set modal window visibility.
	 *
	 * @param {Object} state store state
	 * @param {boolean} status modal window visibility
	 */
	setVisibility(state, status) {
		state.app.visibility = status;
	},
	/**
	 * Merge store state with given new state object
	 *
	 * @param {Object} state store state
	 * @param {Object} newState new state object
	 */
	mergeState(state, newState) {
		state.app = deepmerge(state.app, newState.app);
	},
	/**
	 * Set text content of positive button.
	 *
	 * @param {Object} state store state
	 * @param {string} positiveText positive button text
	 */
	setPositiveButton(state, positiveText) {
		state.app.buttons.positive = positiveText;
	},
	/**
	 * Set text content of negative button.
	 *
	 * @param {Object} state store state
	 * @param {string} negativeText positive button text
	 */
	setNegativeButton(state, negativeText) {
		state.app.buttons.negative = negativeText;
	},
	/**
	 * Set callback function for button clicks.
	 *
	 * @param {Object} state store state
	 * @param {Function} callback button callback
	 */
	setButtonCallback(state, callback) {
		if (typeof callback === 'function') {
			state.app.buttons.callback = callback;
		}
	},
};

/**
 * @module mutations
 */
export default mutations;
