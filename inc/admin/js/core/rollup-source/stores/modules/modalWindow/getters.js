/**
 * Modal window store getters.
 *
 * @type {Object}
 */
const getters = {
	/**
	 * Get current message of modal window.
	 *
	 * @param {Object} state store state
	 * @return {string} message
	 */
	message(state) {
		return state.app.message;
	},
	/**
	 * Get visibility of modal window.
	 *
	 * @param {Object} state store state
	 * @return {boolean} visibility status
	 */
	visibility(state) {
		return state.app.visibility;
	},
	/**
	 * Get backup of modal window.
	 *
	 * @param {Object} state store state
	 * @return {Object} backup object
	 */
	stateBackup(state) {
		return state.backup;
	},
	/**
	 * Get text of positive button.
	 *
	 * @param {Object} state store state
	 * @return {string|null} positive button text
	 */
	positiveButton(state) {
		return state.app.buttons.positive;
	},
	/**
	 * Get text of negative button.
	 *
	 * @param {Object} state store state
	 * @return {string|null} positive button text
	 */
	negativeButton(state) {
		return state.app.buttons.negative;
	},
	/**
	 * Get callback for buttons.
	 *
	 * @param {Object} state store state
	 * @return {Function|null} positive button text
	 */
	buttonCallback(state) {
		return state.app.buttons.callback;
	},
};

/**
 * @module getters
 */
export default getters;
