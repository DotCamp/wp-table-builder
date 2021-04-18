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
	 * Get soft selected source card id.
	 *
	 * Soft selected card is the one that is selected but not confirmed.
	 *
	 * @param {Object} state store state
	 * @return {string} soft selected card id
	 */
	getSoftSelectedSourceCardId(state) {
		return state.dataSource.card.softSelectedId;
	},
	/**
	 * Get pro version status of the plugin.
	 *
	 * @param {Object} state store state
	 * @return {boolean} pro version status
	 */
	getProStatus(state) {
		return state.proEnabled;
	},
	/**
	 * Get active tab group id for source setup
	 *
	 * @param {Object} state store state
	 * @return {Function} function to get active setup group tab
	 */
	currentSetupGroupTab: (state) => (sourceId) => {
		return state.dataSource.setup[sourceId].controlGroupTab;
	},
	/**
	 * Get active tab group id for source setup.
	 *
	 * @param {Object} state store state
	 * @param {Object} getters getters
	 * @return {boolean} source setup or not
	 */
	// eslint-disable-next-line no-shadow
	isActiveScreenSourceSetup(state, getters) {
		const { currentScreen } = getters;

		return currentScreen.match(/^(.+)Setup$/g);
	},
	/**
	 * Get active tab group id for source setup.
	 *
	 * @param {Object} state store state
	 * @return {boolean} app busy status
	 */
	busyStatus(state) {
		return state.busy;
	},
	/**
	 * @deprecated
	 * Whether any data source is imported on setup.
	 *
	 * @param {Object} state store state
	 * @return {boolean} imported or not
	 */
	isSetupDataImported(state) {
		return Array.isArray(state.dataManager.tempData) ? state.dataManager.tempData.values.length > 0 : false;
	},
	/**
	 * Get current control values for given source
	 *
	 * @param {Object} state store state
	 */
	getSetupControls: (state) => (sourceId) => {
		return state.dataSource.setup[sourceId].controls;
	},
	/**
	 * Get status of source data created property.
	 *
	 * @param {Object} state store state
	 * @return {boolean} created or not
	 */
	isSourceDataCreated(state) {
		return state.dataSource.setup.sourceDataCreated;
	},
	/**
	 * Get data values of temp data manager.
	 *
	 * @param {Object} state store state
	 * @return {Array} temp data manager data
	 */
	getDataManagerData(state) {
		return state.dataManager.data;
	},
	/**
	 * Get selected and generated data source id.
	 *
	 * @param {Object} state store state
	 * @return {*} generated data source id
	 */
	getSelectedDataSource: (state) => {
		return state.dataSource.dataObject.type;
	},
	/**
	 * Get id of the current source in setup.
	 *
	 * @param {Object} state store state
	 * @return {*} source id
	 */
	getCurrentSourceSetupId: (state) => {
		return state.dataSource.setup.sourceId;
	},
	/**
	 * Get tab id of the current active source setup.
	 *
	 * @param {Object} state store state
	 * @param {Object} getters store getters
	 * @return {string} tab id
	 */
	// eslint-disable-next-line no-shadow
	getCurrentSourceSetupTab: (state, getters) => {
		return getters.currentSetupGroupTab(getters.getCurrentSourceSetupId);
	},
	/**
	 * Get column binding of a given element.
	 *
	 * @param {Object} state store state
	 * @param {Object} getters store getters
	 * @return {Function} a function to retrieve column binding
	 */
	// eslint-disable-next-line no-shadow
	getColumnBindingForElement: (state, getters) => (elementId) => {
		return getters.getBindings.column[elementId];
	},
	/**
	 * Get row binding of a given row.
	 *
	 * @param {Object} state store state
	 * @param {Object} getters store getters
	 * @return {Function} a function to retrieve row binding
	 */
	// eslint-disable-next-line no-shadow
	getRowBindingByRowId: (state, getters) => (rowId) => {
		return getters.getBindings.row[rowId];
	},
	/**
	 * Get all data bindings.
	 *
	 * @param {Object} state store state
	 * @return {Object} data bindings object
	 */
	getBindings: (state) => {
		return state.dataManager.bindings;
	},
	/**
	 * Get data manager object.
	 *
	 * @param {Object} state store state
	 * @return {Object} data manager object
	 */
	getDataManager: (state) => {
		return state.dataManager;
	},
	/**
	 * Get data object including data object post type related properties.
	 *
	 * @param {Object} state store state
	 */
	getDataObject: (state) => {
		return state.dataSource.dataObject;
	},
	/**
	 * Get temp data object.
	 *
	 * @param {Object} state store state
	 * @return {Object} temp data object
	 */
	getTempDataObject: (state) => {
		return state.dataManager.tempData;
	},
	/**
	 * Get data object title.
	 *
	 * @param {Object} state store state
	 * @return {string} current data object title
	 */
	getDataObjectTitle: (state) => {
		return state.dataSource.setup.title;
	},
	/**
	 * Get server ajax url.
	 *
	 * @param {Object} state store state
	 * @return {string} ajax url
	 */
	getAjaxUrl: (state) => {
		return state.security.ajaxUrl;
	},
	/**
	 * Get security data of a given security id.
	 *
	 * @param {Object} state store state
	 * @return {Function} function to get specific security data
	 */
	getSecurityData: (state) => (dataId) => {
		let securityData = null;
		if (state.security[dataId]) {
			securityData = state.security[dataId];
		}

		return securityData;
	},
	getSetupActiveStatus(state) {
		return state.dataSource.setup.setupActive;
	},
};

export default getters;
