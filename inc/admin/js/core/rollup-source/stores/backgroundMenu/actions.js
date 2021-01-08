/**
 * Actions for background menu store.
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Clear selection.
	 *
	 * @param {Object} root store object
	 * @param {Function} root.commit mutation commit function
	 */
	clearSelection: ({ commit }) => {
		commit('setMenuSelectedTableElement', { type: null, item: null });
	},
};

/**
 * @module actions
 */
export default actions;
