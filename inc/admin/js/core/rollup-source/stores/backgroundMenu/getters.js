/**
 * Getter object for background menu store
 *
 * @type {{generalOptions: (function(*): function(*): *)}}
 */
const getters = {
	/**
	 * Get specified general option.
	 *
	 * @param {Object} state background menu state
	 * @return {Object} general options object
	 */
	generalOptions: (state) => (key) => {
		return state.options.general[key];
	},
	/**
	 * Get various enum types for store.
	 *
	 * @param {Object} state background menu state
	 * @return {Object} state types
	 */
	types: (state) => {
		return state.types;
	},
	/**
	 * Get currently selected table element.
	 *
	 * @param {Object} state background menu state
	 * @return {Object} selected element object
	 */
	currentSelection: (state) => {
		return state.selected;
	},
};

/** @module getters */
export default getters;
