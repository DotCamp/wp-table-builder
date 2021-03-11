/**
 * Table data store mutations.
 *
 * @type {Object}
 */
const mutations = {
	/**
	 * Set active data object id.
	 *
	 * @param {Object} state table data store state
	 * @param {string} dataObjectId data object id
	 */
	setEditorActiveId(state, dataObjectId) {
		// eslint-disable-next-line no-param-reassign
		state.editor.activeId = dataObjectId;
	},
	/**
	 * Set app status to busy.
	 *
	 * @param {Object} state table data store state
	 */
	setBusy(state) {
		// eslint-disable-next-line no-param-reassign
		state.app.busy = true;
	},
	/**
	 * Reset app busy status.
	 *
	 * @param {Object} state table data store state
	 */
	resetBusy(state) {
		// eslint-disable-next-line no-param-reassign
		state.app.busy = false;
	},
};

/**
 * @module mutations
 */
export default mutations;
