import { __ } from '@wordpress/i18n';
/**
 * Data table getter methods.
 *
 * @type {Object}
 */
const getters = {
	/**
	 * Get visibility state.
	 *
	 * @param {Object} state store state
	 * @return {boolean} visibility
	 */
	isVisible(state) {
		return state.visibility;
	},
	/**
	 * Get current screen of data table.
	 *
	 * @param {Object} state store state
	 * @return {string} current screen
	 */
	currentScreen(state) {
		return state.screen;
	},
	/**
	 * Get translated text from store.
	 *
	 * @param {Object} state store state
	 * @return {Function} function to get translation
	 */
	translation(state) {
		return (key) => {
			return state.strings[key];
		};
	},
};

export default getters;
