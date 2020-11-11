/* eslint-disable no-param-reassign */
/**
 * Data table mutations.
 *
 * @type {Object}
 */
const mutations = {
	/**
	 * Set app visibility.
	 *
	 * @param {Object} state data table state
	 * @param {boolean} visible visibility value
	 */
	appVisibility(state, visible) {
		state.visibility = visible;
	},
	/**
	 * Set screen.
	 *
	 * @param {Object} state data table state
	 * @param {string} screenName screen name
	 */
	setScreen(state, screenName) {
		state.screen = screenName;
	},
	/**
	 * Set soft selected source card id.
	 *
	 * @param {Object} state data table state
	 * @param {string} sourceId source card id
	 */
	setSoftSelected(state, sourceId) {
		state.dataSource.card.softSelectedId = sourceId;
	},
	/**
	 * Set  selected source id for source that will be initialized.
	 *
	 * @param {Object} state data table state
	 * @param {string} sourceId source card id
	 */
	setSetupSourceId(state, sourceId) {
		state.dataSource.setup.sourceId = sourceId;
	},
	/**
	 * Set csv delimiter.
	 *
	 * @param {Object} state data table state
	 * @param {string} delimiter csv delimiter
	 */
	updateCsvDelimiter(state, delimiter) {
		state.dataSource.setup.csv.controls.delimiter = delimiter;
	},
	/**
	 * Switch to data manaager tab and screen at any source setup.
	 *
	 * @param {Object} state data table state
	 * @param {string} sourceId active source setup id
	 */
	showDataManagerTabGroup(state, sourceId) {
		state.dataSource.setup[sourceId].controlGroupTab = 'dataManager';
	},
	/**
	 * Set active tab group for source setup.
	 *
	 * @param {Object} state data table state
	 * @param {{sourceId, tabId}} payload
	 */
	setActiveControlTabGroup(state, { sourceId, tabId }) {
		state.dataSource.setup[sourceId].controlGroupTab = tabId;
	},
	/**
	 * Set busy state of the app.
	 *
	 * @param {Object} state data table state
	 * @param {boolean} busyStatus busy status
	 */
	setBusy(state, busyStatus) {
		state.busy = busyStatus;
	},
	/**
	 * Clear contents of temp data manager.
	 *
	 * @param {Object} state data table state
	 */
	clearTempDataManager(state) {
		state.dataManager.tempData.values = [];
		state.dataManager.tempData.rowIds = [];
		state.dataManager.tempData.colIds = [];
	},
	/**
	 * Replace current data in temp data manager with new one.
	 *
	 * @param {Object} state data table state
	 * @param {Array} data data array
	 */
	setDataManagerTempData(state, data) {
		state.dataManager.tempData.values = data;
	},
	/**
	 * Set control value for data manager.
	 *
	 * @param {Object} state data table state
	 * @param {{key, value}} mutation payload
	 */
	setDataManagerControl(state, { key, value }) {
		state.dataManager.controls[key] = value;
	},
	/**
	 * Push a row id to data manager.
	 *
	 * @param {Object} state data table state
	 * @param {string} id id to be pushed
	 */
	pushDataManagerRowId(state, id) {
		state.dataManager.tempData.rowIds.push(id);
	},
	/**
	 * Push a column id to data manager.
	 *
	 * @param {Object} state data table state
	 * @param {string} id id to be pushed
	 */
	pushDataManagerColId(state, id) {
		state.dataManager.tempData.colIds.push(id);
	},
	/**
	 * Set current row count.
	 *
	 * @param {Object} state data table state
	 * @param {number} count count
	 */
	setRowCount(state, count) {
		state.dataManager.tempData.rowCount = count;
	},
	/**
	 * Set current column count.
	 *
	 * @param {Object} state data table state
	 * @param {number} count count
	 */
	setColCount(state, count) {
		state.dataManager.tempData.colCount = count;
	},
	/**
	 * Set status  for select operation.
	 *
	 * @param {Object} state data table state
	 * @param {boolean} status status
	 */
	setSelectStatus(state, status) {
		state.dataManager.select.active = status;
	},
	/**
	 * Reset select operation data.
	 *
	 * @param {Object} state data table state
	 */
	resetSelectData(state) {
		state.dataManager.select.hoverId = null;
		state.dataManager.select.clickId.resolve = null;
		state.dataManager.select.clickId.id = null;
		state.dataManager.select.callerId = null;
	},
	/**
	 * Set select operation type.
	 * Available types are 'row' and 'col'.
	 *
	 * @param {Object} state data table state
	 * @param {string} type type
	 */
	setSelectionType(state, type) {
		state.dataManager.select.type = type;
	},
	/**
	 * Set a resolve function to signal end for click operation.
	 *
	 * @param {Object} state data table state
	 * @param {Function} resolve resolve function
	 */
	setSelectIdResolve(state, resolve) {
		state.dataManager.select.clickId.resolve = resolve;
	},
	/**
	 * Set a unique id for the current select operation.
	 *
	 * @param {Object} state data table state
	 * @param {string} callerId caller id
	 */
	setSelectCallerId(state, callerId) {
		state.dataManager.select.callerId = callerId;
	},
	/**
	 * Set store if of selected cell.
	 *
	 * @param {Object} state data table state
	 * @param {string} id set id for selected cell
	 */
	setSelectId(state, id) {
		state.dataManager.select.clickId.id = id;
	},
};

export default mutations;
