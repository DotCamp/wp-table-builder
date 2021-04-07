import deepmerge from 'deepmerge';

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
	 * Get simple version of a data object.
	 *
	 * @param {Object} state store state
	 * @return {Function} function to use for get operation
	 */
	getDataObjectSimple: (state) => (id) => {
		const [filteredObjects] = state.dataSimple.filter((data) => {
			return data.ID === id;
		});

		return filteredObjects;
	},
	/**
	 * Get app busy status.
	 *
	 * @param {Object} state store state
	 * @return {boolean} busy status
	 */
	getBusyState(state) {
		return state.app.busy;
	},
	/**
	 * Get app busy status.
	 *
	 * Compatibility function fow withStoreBusy mixin.
	 *
	 * @param {Object} state store state
	 * @return {boolean} busy status
	 */
	busyStatus(state) {
		return state.app.busy;
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
	/**
	 * Get message properties.
	 *
	 * @param {Object} state store state
	 * @return {Object} message object
	 */
	getMessageObject(state) {
		return state.app.message;
	},
	isVisible(state) {
		return state.visibility;
	},
	getCurrentSourceSetupTab(state) {
		return state.setupTab;
	},
	/**
	 * Get dirty status.
	 *
	 * @param {Object} state store state
	 * @return {boolean} is dirty or not
	 */
	isDirty(state) {
		return state.app.dirty;
	},
	/**
	 * Prepare data object by updating various fields from data manager.
	 *
	 * @param {Object} state store state
	 * @return {Function} function to get prepared data object
	 */
	prepareDataObject: (state) => (dataObject) => {
		const { controls, tempData } = deepmerge({}, state.dataManager);
		const preparedDataObject = deepmerge({}, dataObject);

		preparedDataObject.controls = controls;
		preparedDataObject.content = tempData;

		return preparedDataObject;
	},
	/**
	 * Get backup for data.
	 *
	 * @param {Object} state store state
	 * @return {Object} data backup
	 */
	getDataBackup(state) {
		return state.dataBackup;
	},
	/**
	 * Get type for data object.
	 *
	 * @param {Object} state store state
	 * @return {string | null} data object type
	 */
	getCurrentDataObjectType(state) {
		return state.dataBackup?.type || null;
	},
};

/**
 * @module getters
 */
export default getters;
