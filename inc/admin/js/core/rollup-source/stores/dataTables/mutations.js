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
	 * Clear contents of temp data manager.
	 *
	 * @param {Object} state data table state
	 */
	clearTempDataManager(state) {
		state.dataManager.tempData.values = [];
		state.dataManager.tempData.rowIds = [];
		state.dataManager.tempData.colIds = [];
		state.dataManager.tempData.colCount = 0;
		state.dataManager.tempData.rowCount = 0;
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
	 * Set store id of selected cell.
	 *
	 * @param {Object} state data table state
	 * @param {string} id set id for selected cell
	 */
	setSelectId(state, id) {
		state.dataManager.select.clickId.id = id;
	},
	/**
	 * Set store id of hovered cell.
	 *
	 * @param {Object} state data table state
	 * @param {string} id set id for hovered cell
	 */
	setHoverId(state, id) {
		state.dataManager.select.hoverId = id;
	},
	/**
	 * Set value to a data cell object
	 *
	 * @param {Object} state data table state
	 * @param {{rowId, colId, value}} mutation payload
	 */
	setDataCellObjectValue(state, { rowId, colId, value }) {
		const rowObject = state.dataManager.tempData.values.find((r) => r.rowId === rowId);

		if (rowObject) {
			const cell = rowObject.values.find((c) => c.colId === colId);
			if (cell) {
				cell.value = value;
			}
		}
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
	 * Add a row data to data manager.
	 *
	 * @param {Object} state data table state
	 * @param {Object} rowData row data object
	 */
	addRowToDataTable(state, rowData) {
		state.dataManager.tempData.values.push(rowData);
	},
	/**
	 * Add a cell to a table data row.
	 *
	 * Since because of the logic of the tables, when used, this mutation should be applied to all rows of the data manager table.
	 *
	 * @param {Object} state data table state
	 * @param {{rowIndex, cellObject}} mutation payload object
	 */
	addCellToDataTableRow(state, { rowIndex, cellObject }) {
		if (rowIndex < state.dataManager.tempData.rowCount) {
			// create a new rowObject to trigger reactivity
			const rowObject = { ...state.dataManager.tempData.values[rowIndex] };
			rowObject.values.push(cellObject);

			state.dataManager.tempData.values.splice(rowIndex, 1, rowObject);
		}
	},
	/**
	 * Delete a row from data manager.
	 *
	 * @param {Object} state data table state
	 * @param {string} rowId row id
	 */
	deleteRowFromDataTable(state, rowId) {
		const rowIndex = state.dataManager.tempData.rowIds.indexOf(rowId);

		if (rowIndex > -1) {
			state.dataManager.tempData.values.splice(rowIndex, 1);

			// also delete row id from indexes
			state.dataManager.tempData.rowIds.splice(rowIndex, 1);
		}
	},
	/**
	 * Delete a column from data manager.
	 *
	 * @param {Object} state data table state
	 * @param {string} colId column id
	 */
	deleteColFromDataTable(state, colId) {
		const colIndex = state.dataManager.tempData.colIds.indexOf(colId);

		if (colIndex >= 0) {
			// generate new values to trigger reactivity
			const newValues = state.dataManager.tempData.values.reduce((carry, val) => {
				const nVal = { ...val };
				carry.push(nVal);
				return carry;
			}, []);

			// eslint-disable-next-line array-callback-return
			newValues.map((v) => {
				v.values.splice(colIndex, 1);
			});

			state.dataManager.tempData.values = newValues;

			// also delete col id from indexes
			state.dataManager.tempData.colIds.splice(colIndex, 1);

			// update column count
			state.dataManager.tempData.colCount -= 1;
		}
	},
	/**
	 * Set data source id as selected source.
	 *
	 * @param {Object} state data table state
	 * @param {string} sourceId source id
	 */
	setSelectedDataSource: (state, sourceId) => {
		state.dataSource.selected = sourceId;
	},
	/**
	 * Set parsed data object property values.
	 *
	 * @param {Object} state data table state
	 * @param {{key, value}} mutation payload
	 */
	setParsedData: (state, { key, value }) => {
		state.dataManager.tempData.parsedData[key] = value;
	},
	/**
	 * Set table as dirty
	 *
	 * @param {Object} state data table state
	 */
	setTableDirty: (state) => {
		if (state.tableIsActive) {
			new WPTB_TableStateSaveManager().tableStateSet();
		}
	},
	/**
	 * Set proxy for selection click id.
	 *
	 * @param {Object} state data table state
	 * @param {Proxy} proxy proxy object
	 */
	setClickIdProxy: (state, proxy) => {
		state.dataManager.select.clickId = proxy;
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
};

/** @module mutations */
export default mutations;
