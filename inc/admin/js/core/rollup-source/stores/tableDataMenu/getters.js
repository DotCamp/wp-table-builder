/**
 * Table data store getters.
 *
 * @type {Object}
 */
const getters = {
	/**
	 * Get simple data objects.
	 * This objects have minimum amount of data for listing purposes.
	 *
	 * @param {Object} state store state
	 * @return {Array} simple data objects
	 */
	simpleDataObjects(state) {
		return state.dataSimple;
	},
	/**
	 * Get app busy status.
	 *
	 * @param {Object} state store state
	 * @return {boolean} busy status
	 */
	isBusy(state) {
		return state.app.bust;
	},
	/**
	 * Get active data object id on editor.
	 *
	 * @param {Object} state store state
	 * @return {string|null} active data object id
	 */
	getEditorActiveId(state) {
		return state.editor.activeId;
	},
	/**
	 * Get security properties.
	 *
	 * @param {Object} state store state
	 * @return {Function} security properties function
	 */
	getSecurityProps: (state) => (key) => {
		return state.security[key];
	},
};

/**
 * @module getters
 */
export default getters;
