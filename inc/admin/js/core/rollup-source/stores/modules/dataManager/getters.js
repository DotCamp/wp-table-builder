/**
 * Data manager store getters.
 *
 * @type {Object}
 */
const getters = {
	/**
	 * Get temp data values of data manager.
	 *
	 * @param {Object} state store state
	 * @return {Array} temp data
	 */
	getDataManagerTempData(state) {
		return state.tempData.values;
	},
	/**
	 * Get current control values of temp data manager.
	 *
	 * @param {Object} state store state
	 * @return {Object} control values
	 */
	getDataManagerControls(state) {
		return state.controls;
	},
	/**
	 * Get current column count.
	 *
	 * @param {Object} state data table state
	 * @return {number} column count
	 */
	getColCount(state) {
		return state.tempData.colCount;
	},
	/**
	 * Get current row count.
	 *
	 * @param {Object} state data table state
	 * @return {number} column count
	 */
	getRowCount(state) {
		return state.tempData.rowCount;
	},
	/**
	 * Generate unique id.
	 *
	 * @return {Function} generate function
	 */
	generateUniqueId: () => (length = 11) => {
		const variables = 'abcdef0123456789'.split('');
		let key = '';

		for (let i = 0; i < length; i += 1) {
			key += variables[Math.floor(Math.random() * variables.length)];
		}

		return key;
	},
	/**
	 * Get data manager column id of a given index.
	 *
	 * @param {Object} state store state
	 * @return {function(*): (*|0)} function that can be used with an argument
	 */
	getDataManagerColId: (state) => (index) => {
		if (state.tempData.colIds[index]) {
			return state.tempData.colIds[index];
		}
		return null;
	},
	/**
	 * Is data selection active on data table manager.
	 *
	 * @param {Object} state store state
	 * @return {boolean} active or not
	 */
	isDataSelectionActive(state) {
		return state.select.active;
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
		return state.tempData.parsedData;
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
	 * Get hover id of current hovered cell.
	 *
	 * @param {Object} state store state
	 * @return {null|string} hover id of the hovered data table cell
	 */
	getHoverId: (state) => {
		return state.select.hoverId;
	},
	/**
	 * Get data related to select operation.
	 *
	 * @param {Object} state store state
	 * @return {Object} select operation related data
	 */
	getSelectOperationData(state) {
		return state.select;
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
	 * Get data manager row id of a given index.
	 *
	 * @param {Object} state store state
	 * @return {function(*): (*|0)} function that can be used with an argument
	 */
	getDataManagerRowId: (state) => (index) => {
		if (state.tempData.rowIds[index]) {
			return state.tempData.rowIds[index];
		}
		return null;
	},
	/**
	 * Get index of given type and id from data manager ids.
	 *
	 * @param {Object} state store state
	 * @return {Function} function to be used to determine index from id.
	 */
	getDataManagerIndexFromId: (state) => (id, type = 'row') => {
		return state.tempData[`${type}Ids`].indexOf(id);
	},
};

/**
 * @module getters
 */
export default getters;
