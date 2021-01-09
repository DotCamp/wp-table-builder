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
	/**
	 * Clear hover states of background menu store.
	 *
	 * @param {Object} root store object
	 * @param {Function} root.commit mutation commit function
	 */
	clearHoverStates: ({ commit }) => {
		commit('updateHoveredRowElement', null);
		commit('updateHoveredCellElement', { element: null, index: null });
	},
};

/**
 * @module actions
 */
export default actions;
