/* eslint-disable no-param-reassign */

/**
 * Data manager store mutations.
 *
 * @type {Object}
 */
const mutations = {
	/**
	 * Merge temp data object with the supplied object.
	 *
	 * @param {Object} state store state
	 * @param {Object} dataObject data object
	 */
	mergeTempData: (state, dataObject) => {
		state.tempData = { ...state.tempData, ...dataObject };
	},
	/**
	 * Clear contents of temp data manager.
	 *
	 * @param {Object} state data table state
	 */
	clearTempDataManager(state) {
		state.tempData.values = [];
		state.tempData.rowIds = [];
		state.tempData.colIds = [];
		state.tempData.colCount = 0;
		state.tempData.rowCount = 0;
	},
	/**
	 * Push a row id to data manager.
	 *
	 * @param {Object} state data table state
	 * @param {string} id id to be pushed
	 */
	pushDataManagerRowId(state, id) {
		state.tempData.rowIds.push(id);
	},
	/**
	 * Push a column id to data manager.
	 *
	 * @param {Object} state data table state
	 * @param {string} id id to be pushed
	 */
	pushDataManagerColId(state, id) {
		state.tempData.colIds.push(id);
	},
	/**
	 * Add a row data to data manager.
	 *
	 * @param {Object} state data table state
	 * @param {Object} rowData row data object
	 */
	addRowToDataTable(state, rowData) {
		state.tempData.values.push(rowData);
	},
	/**
	 * Set store id of hovered cell.
	 *
	 * @param {Object} state data table state
	 * @param {string} id set id for hovered cell
	 */
	setHoverId(state, id) {
		state.select.hoverId = id;
	},
	/**
	 * Set control value for data manager.
	 *
	 * @param {Object} state data table state
	 * @param {Object} payload mutation payload
	 * @param {string} payload.key control key
	 * @param {string|number|boolean} payload.value control value
	 */
	setDataManagerControl(state, { key, value }) {
		state.controls[key] = value;
	},
	/**
	 * Set parsed data object property values.
	 *
	 * @param {Object} state data table state
	 * @param {Object} payload mutation payload
	 * @param {string} payload.key data key
	 * @param {string|number|boolean} payload.value data value
	 */
	setParsedData: (state, { key, value }) => {
		state.tempData.parsedData[key] = value;
	},
	/**
	 * Set current column count.
	 *
	 * @param {Object} state data table state
	 * @param {number} count count
	 */
	setColCount(state, count) {
		state.tempData.colCount = count;
	},
	/**
	 * Set current row count.
	 *
	 * @param {Object} state data table state
	 * @param {number} count count
	 */
	setRowCount(state, count) {
		state.tempData.rowCount = count;
	},
	/**
	 * Add a cell to a table data row.
	 *
	 * Since because of the logic of the tables, when used, this mutation should be applied to all rows of the data manager table.
	 *
	 * @param {Object} state data table state
	 * @param {Object} payload mutation payload object
	 * @param {number} payload.rowIndex row index
	 * @param {Object} payload.cellObject cell object to be added
	 */
	addCellToDataTableRow(state, { rowIndex, cellObject }) {
		if (rowIndex < state.tempData.rowCount) {
			// create a new rowObject to trigger reactivity
			const rowObject = { ...state.tempData.values[rowIndex] };
			rowObject.values.push(cellObject);

			state.tempData.values.splice(rowIndex, 1, rowObject);
		}
	},
	/**
	 * Set value to a data cell object
	 *
	 * @param {Object} state data table state
	 * @param {Object} payload mutation payload
	 * @param {string} payload.rowId cell row id
	 * @param {string} payload.colId cell column id
	 * @param {string|number} payload.value cell column value
	 */
	setDataCellObjectValue(state, { rowId, colId, value }) {
		const rowObject = state.tempData.values.find((r) => r.rowId === rowId);

		if (rowObject) {
			const cell = rowObject.values.find((c) => c.colId === colId);
			if (cell) {
				cell.value = value;
			}
		}
	},
	/**
	 * Delete a row from data manager.
	 *
	 * @param {Object} state data table state
	 * @param {string} rowId row id
	 */
	deleteRowFromDataTable(state, rowId) {
		const rowIndex = state.tempData.rowIds.indexOf(rowId);

		if (rowIndex > -1) {
			state.tempData.values.splice(rowIndex, 1);

			// also delete row id from indexes
			state.tempData.rowIds.splice(rowIndex, 1);
		}
	},
	/**
	 * Delete a column from data manager.
	 *
	 * @param {Object} state data table state
	 * @param {string} colId column id
	 */
	deleteColFromDataTable(state, colId) {
		const colIndex = state.tempData.colIds.indexOf(colId);

		if (colIndex >= 0) {
			// generate new values to trigger reactivity
			const newValues = state.tempData.values.reduce((carry, val) => {
				const nVal = { ...val };
				carry.push(nVal);
				return carry;
			}, []);

			// eslint-disable-next-line array-callback-return
			newValues.map((v) => {
				v.values.splice(colIndex, 1);
			});

			state.tempData.values = newValues;

			// also delete col id from indexes
			state.tempData.colIds.splice(colIndex, 1);

			// update column count
			state.tempData.colCount -= 1;
		}
	},
	/**
	 * Set store id of selected cell.
	 *
	 * @param {Object} state data table state
	 * @param {string} id set id for selected cell
	 */
	setSelectId(state, id) {
		state.select.clickId.id = id;
	},
	/**
	 * Set proxy for selection click id.
	 *
	 * @param {Object} state data table state
	 * @param {Proxy} proxy proxy object
	 */
	setClickIdProxy: (state, proxy) => {
		state.select.clickId = proxy;
	},
};

/**
 * @module mutations
 */
export default mutations;
