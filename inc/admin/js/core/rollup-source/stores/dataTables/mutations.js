import { setObjectPropertyFromString } from '../../functions';

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
	 * Set status of data created from source.
	 *
	 * This will mark whether some sort of data is ready on data manager or not.
	 *
	 * @param {Object} state data table state
	 * @param {boolean} status status
	 */
	setSetupSourceDataCreatedStatus(state, status) {
		state.dataSource.setup.sourceDataCreated = status;
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
	 * Replace current data in temp data manager with new one.
	 *
	 * @param {Object} state data table state
	 * @param {Array} data data array
	 */
	setDataManagerTempData(state, data) {
		state.dataManager.tempData.values = data;
	},
	/**
	 * Reset a property to its default values if defined.
	 *
	 * @param {Object} state data table state
	 * @param {string} target target property nam
	 */
	resetToDefaults(state, target) {
		const defaultValue = state.defaults[target];

		if (defaultValue) {
			setObjectPropertyFromString(target, state, defaultValue);
		}
	},
	/**
	 * Set data source id as selected source.
	 *
	 * @param {Object} state data table state
	 * @param {string} sourceId source id
	 */
	setSelectedDataSource: (state, sourceId) => {
		state.dataSource.dataObject.type = sourceId;
	},
	/**
	 * Set table as dirty
	 *
	 * @param {Object} state data table state
	 */
	setTableDirty: (state) => {
		// TODO [erdembircan] uncomment for production
		// if (state.tableIsActive) {
		// 	new WPTB_TableStateSaveManager().tableStateSet();
		// }
	},
	/**
	 * Set column binding of an element with given id and sub index.
	 *
	 * @param {Object} state data table state
	 * @param {{id, value, subIndex}} mutation payload
	 */
	setColumnBindingForElement: (state, { id, value, subIndex }) => {
		const bindings = { ...state.dataManager.bindings };
		// create a fresh object for the element binding if there isn't  any
		if (!bindings.column[id]) {
			bindings.column[id] = {};
		}
		bindings.column[id][subIndex] = value;
		state.dataManager.bindings = bindings;
	},
	/**
	 * Set row binding of an of a row with given id and sub index.
	 *
	 * @param {Object} state data table state
	 * @param {{id, value, subIndex}} mutation payload
	 */
	setRowBindingForId: (state, { id, value, subIndex }) => {
		const bindings = { ...state.dataManager.bindings };

		if (!bindings.row[id]) {
			bindings.row[id] = {};
		}

		let finalValue = value;

		if (typeof value === 'object') {
			finalValue = { ...finalValue };
		}

		bindings.row[id][subIndex] = finalValue;
		state.dataManager.bindings = bindings;
	},
	/**
	 * Set a target table.
	 *
	 * @param {Object} state data table state
	 * @param {HTMLElement | null} tableElement table element to set
	 */
	setTargetTable: (state, tableElement) => {
		state.targetTable = tableElement;
	},
	/**
	 * Set whether there is an active table on builder
	 *
	 * @param {Object} state data table state
	 * @param {boolean} status status
	 */
	setTableActiveStatus: (state, status) => {
		state.tableIsActive = status;
	},
	/**
	 * Set data object.
	 *
	 * @param {Object} state data table state
	 * @param {Object} dataObject data object
	 */
	setDataObject: (state, dataObject) => {
		state.dataSource.dataObject = dataObject;
	},
};

/** @module mutations */
export default mutations;
