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
	 * Get current control values of temp data manager.
	 *
	 * @param {Object} state store state
	 * @return {Object} control values
	 */
	getDataManagerControls(state) {
		return state.dataManager.controls;
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
	 * Get temp data values of data manager.
	 *
	 * @param {Object} state store state
	 * @return {Array} temp data
	 */
	getDataManagerTempData(state) {
		return state.dataManager.tempData.values;
	},
	/**
	 * Generate unique id.
	 *
	 * @return {Function} generate function
	 */
	generateUniqueId: () => (length = 5) => {
		const variables = ['a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5'];
		let key = '';

		for (let i = 0; i < length; i += 1) {
			key += variables[Math.floor(Math.random() * variables.length)];
		}

		return key;
	},
	/**
	 * Get data manager row id of a given index.
	 *
	 * @param {Object} state store state
	 * @return {function(*): (*|0)} function that can be used with an argument
	 */
	getDataManagerRowId: (state) => (index) => {
		if (state.dataManager.tempData.rowIds[index]) {
			return state.dataManager.tempData.rowIds[index];
		}
		return null;
	},
	/**
	 * Get data manager column id of a given index.
	 *
	 * @param {Object} state store state
	 * @return {function(*): (*|0)} function that can be used with an argument
	 */
	getDataManagerColId: (state) => (index) => {
		if (state.dataManager.tempData.colIds[index]) {
			return state.dataManager.tempData.colIds[index];
		}
		return 0;
	},
	/**
	 * Get current column count.
	 *
	 * @param {Object} state data table state
	 * @return {number} column count
	 */
	getColCount(state) {
		return state.dataManager.tempData.colCount;
	},
	/**
	 * Get data related to select operation.
	 *
	 * @param {Object} state store state
	 * @return {Object} select operation related data
	 */
	getSelectOperationData(state) {
		return state.dataManager.select;
	},
	/**
	 * Is data selection active on data table manager.
	 *
	 * @param {Object} state store state
	 * @return {boolean} active or not
	 */
	isDataSelectionActive(state) {
		return state.dataManager.select.active;
	},
	/**
	 * Get row and column ids of a cell from a formed id.
	 *
	 * @return {function(*): {colId: *, rowId: *}} function that will be used to parse cell id
	 */
	parseCellId: () => (formedId) => {
		const [rowId, colId] = formedId.split('-');

		return { rowId, colId };
	},
	/**
	 * Get data cell object
	 *
	 * @param {Object} state store state
	 * @param {Object} getters store getters
	 */
	// eslint-disable-next-line no-shadow
	getDataCellObject: (state, getters) => (rowId, colId) => {
		const dataValues = getters.getDataManagerTempData;

		const row = dataValues.find((r) => {
			return r.rowId === rowId;
		});

		if (row) {
			const cellObjects = row.values;
			return cellObjects.find((c) => c.colId === colId);
		}

		return null;
	},
};

export default getters;