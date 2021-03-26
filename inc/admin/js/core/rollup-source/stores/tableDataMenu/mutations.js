/* eslint-disable no-param-reassign */
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
	/**
	 * Set a menu message.
	 *
	 * @param {Object} state table data store state
	 * @param {string} content message content
	 */
	setOkMessage(state, content) {
		this.state.app.message.type = 'ok';
		this.state.app.message.content = content;
	},
	/**
	 * Set a menu error message.
	 *
	 * @param {Object} state table data store state
	 * @param {string} content message content
	 */
	setErrorMessage(state, content) {
		this.state.app.message.type = 'error';
		this.state.app.message.content = content;
	},
	/**
	 * Set app to dirty
	 *
	 * @param {Object} state table data store state
	 */
	setAppDirty(state) {
		state.app.dirty = true;
	},
	/**
	 * Reset app to dirty
	 *
	 * @param {Object} state table data store state
	 */
	resetAppDirtyStatus(state) {
		state.app.dirty = false;
	},
	/**
	 * Set simple data objects
	 *
	 * @param {Object} state table data store state
	 * @param {Array} objects simple data objects array
	 */
	setSimpleDataObjects(state, objects) {
		state.dataSimple = objects;
	},
};

/**
 * @module mutations
 */
export default mutations;
