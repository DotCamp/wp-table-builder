/**
 * Data manager store actions.
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Add temp data to data manager.
	 *
	 * @param {Object} root vuex store object
	 * @param {Function} root.commit vuex store commit function
	 * @param {Function} root.dispatch vuex store action function
	 * @param {Object} payload action payload object
	 * @param {Object} payload.data data
	 */
	addDataManagerTempData({ commit, dispatch }, { data }) {
		const confirmedData = Array.isArray(data) ? data : [];

		const maxCellsPerRow = confirmedData.reduce((carry, item) => {
			return Math.max(item.length, carry);
		}, 0);

		// fill missing cells per rows to maximum column count
		// eslint-disable-next-line array-callback-return
		confirmedData.map((r) => {
			if (r.length < maxCellsPerRow) {
				const difference = maxCellsPerRow - r.length;

				for (let i = 0; i < difference; i += 1) {
					r.push('');
				}
			}
		});

		commit('clearTempDataManager');

		confirmedData.map(async (r) => {
			await dispatch('addRowToDataManager', r);
		});

		commit('setHoverId', null);
	},
	/**
	 * Generate a new row for data table manager.
	 *
	 * @param {Object} root vuex store object
	 * @param {Object} root.getters vuex store getter
	 * @param {Function} root.dispatch vuex store action function
	 * @param {Function} root.commit vuex store mutation function
	 * @param {Array} colValues column values
	 * @return {Function} generated new row object
	 */
	generateRow({ commit, getters, dispatch }, colValues) {
		const rowId = getters.generateUniqueId();
		commit('pushDataManagerRowId', rowId);

		const rowObj = { rowId, values: [] };

		// eslint-disable-next-line array-callback-return
		colValues.map(async (value, i) => {
			const cellObject = await dispatch('generateCell', { value, index: i });
			rowObj.values.push(cellObject);
		});

		return rowObj;
	},
	/**
	 * Add a new row to data manager.
	 *
	 * @async
	 * @param {Object} root vuex store object
	 * @param {Object} root.getters vuex store getter
	 * @param {Function} root.dispatch vuex store action function
	 * @param {Function} root.commit vuex store mutation function
	 * @param {Array} colValues values for columns
	 */
	async addRowToDataManager({ getters, dispatch, commit }, colValues = []) {
		let innerColValues = colValues;

		if (colValues.length === 0) {
			innerColValues = Array.from(new Array(getters.getColCount)).map(() => '');
		}

		const rowObject = await dispatch('generateRow', innerColValues);
		commit('addRowToDataTable', rowObject);
	},
	/**
	 * Generate a new cell object.
	 *
	 * @param {Object} root vuex store object
	 * @param {Object} root.getters vuex store getter
	 * @param {Function} root.commit vuex store mutation function
	 * @param {Object} payload payload object
	 * @param {string|number} payload.value value
	 * @param {number} payload.index column index
	 *
	 * @return {Object} cell object
	 */
	generateCell({ getters, commit }, { value, index }) {
		let colId = getters.getDataManagerColId(index);
		if (!colId) {
			colId = getters.generateUniqueId();
			commit('pushDataManagerColId', colId);
		}
		return { colId, value };
	},
	/**
	 * Add a row object as a header to data values
	 *
	 * @param {Object} root vuex store object
	 * @param {Function} root.commit vuex store mutation function
	 *
	 * @param {Object} rowObject row object
	 */
	addRowObjectAsHeader({ commit }, rowObject) {
		// add property that will mark this row object as created for only column name purposes
		// eslint-disable-next-line no-param-reassign
		rowObject.generatedForHeader = true;

		commit('setDataManagerControl', { key: 'indexRow', value: rowObject.rowId });
		commit('addRowToDataTable', rowObject);
	},
	/**
	 * Add a column to data manager.
	 *
	 * @param {Object} root vuex store object
	 * @param {Function} root.commit vuex store mutation function
	 * @param {Object} root.getters vuex store getter
	 * @param {Function} root.dispatch vuex store action function
	 * @param {string} value value of the newly added cells
	 */
	async addColumnToDataManager({ commit, getters, dispatch }, value = '') {
		const colCount = getters.getColCount;
		const rowCount = getters.getRowCount;

		await Array.from(new Array(rowCount))
			.map(() => '')
			.map(async (r, rowIndex) => {
				const cellObject = await dispatch('generateCell', { value, index: colCount });
				commit('addCellToDataTableRow', { rowIndex, cellObject });
			});
	},
	/**
	 * Delete a row object from data manager table.
	 *
	 * @param {Object} root vuex store object
	 * @param {Function} root.commit vuex store mutation function
	 * @param {Object} root.getters vuex store getter
	 * @param {string} rowId row id
	 */
	deleteDataTableRow({ commit, getters }, rowId) {
		const index = getters.getDataManagerIndexFromId(rowId);
		commit('deleteRowFromDataTable', rowId);

		// calculate hover id that will be focused on after delete operation
		const hoverRowIndex = index - 1 >= 0 ? index - 1 : index;
		const hoverRowId = getters.getDataManagerRowId(hoverRowIndex);
		const { colId } = getters.parseCellId(getters.getHoverId);
		commit('setHoverId', getters.formCellId(hoverRowId, colId));
	},
	/**
	 * Delete a column object from data manager table.
	 *
	 * @param {Object} root vuex store object
	 * @param {Function} root.commit vuex store mutation function
	 * @param {string} colId column id
	 */
	deleteDataTableCol({ commit }, colId) {
		commit('deleteColFromDataTable', colId);
		commit('setHoverId', null);
	},
	/**
	 * Set value of data cell.
	 *
	 * @param {Object} root vuex store object
	 * @param {Object} root.getters vuex store getter
	 * @param {Function} root.commit vuex store mutation function
	 * @param {Object} payload action payload
	 * @param {string} payload.cellId cell id
	 * @param {string|number} payload.value cell value
	 */
	setDataCellValue({ getters, commit }, { cellId, value }) {
		const { rowId, colId } = getters.parseCellId(cellId);

		commit('setDataCellObjectValue', { rowId, colId, value });
		// @deprecated
		// commit('setSetupSourceDataCreatedStatus', true);
	},
	/**
	 * Set up a proxy for selection click id.
	 *
	 * @param {Object} root vuex store object
	 * @param {Function} root.commit vuex store mutation function
	 */
	setUpSelectionIdProxy({ commit }) {
		const selectId = {
			id: null,
			resolve: null,
		};

		const clickIdHandler = {
			set(obj, prop, val) {
				if (prop === 'resolve') {
					// eslint-disable-next-line no-param-reassign
					obj[prop] = val;
				} else {
					// eslint-disable-next-line no-param-reassign
					obj[prop] = val;
					// if resolve property is defined, call it with assigned value
					if (obj.resolve) {
						obj.resolve(val);
					}
				}

				return true;
			},
		};

		// set proxy for clicked cell id of select operation
		commit('setClickIdProxy', new Proxy(selectId, clickIdHandler));
	},
};

/**
 * @module actions
 */
export default actions;
