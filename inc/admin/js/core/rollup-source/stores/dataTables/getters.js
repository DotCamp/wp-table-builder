import { generateUniqueId } from '../../functions';
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
		return generateUniqueId(length);
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
		return null;
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
	 * Get current row count.
	 *
	 * @param {Object} state data table state
	 * @return {number} column count
	 */
	getRowCount(state) {
		return state.dataManager.tempData.rowCount;
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
		const idObject = { rowId: null, colId: null };
		if (formedId !== null) {
			const [rowId, colId] = formedId.split('-');
			idObject.rowId = rowId;
			idObject.colId = colId;
		}

		return idObject;
	},
	/**
	 * Form a cell id from row and col ids.
	 *
	 * @return {function(*, *): string} cell id form function
	 */
	formCellId: () => (rowId, colId) => {
		return `${rowId}-${colId}`;
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
	/**
	 * Get hover id of current hovered cell.
	 *
	 * @param {Object} state store state
	 * @return {null|string} hover id of the hovered data table cell
	 */
	getHoverId: (state) => {
		return state.dataManager.select.hoverId;
	},
	/**
	 * Get index of given type and id from data manager ids.
	 *
	 * @param {Object} state store state
	 * @return {Function} function to be used to determine index from id.
	 */
	getDataManagerIndexFromId: (state) => (id, type = 'row') => {
		return state.dataManager.tempData[`${type}Ids`].indexOf(id);
	},
	/**
	 * Get selected and generated data source id.
	 *
	 * @param {Object} state store state
	 * @return {*} generated data source id
	 */
	getSelectedDataSource: (state) => {
		return state.dataSource.selected;
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
	 * Get parsed values of data table.
	 *
	 * This object will contain separated values of header and body values of data table.
	 *
	 * @param {Object} state store state
	 * @return {Object} parsed data object
	 */
	parsedData: (state) => {
		return state.dataManager.tempData.parsedData;
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
};

export default getters;
