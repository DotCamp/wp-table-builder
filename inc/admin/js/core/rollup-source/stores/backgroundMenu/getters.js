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
};

/** @module getters */
export default getters;
