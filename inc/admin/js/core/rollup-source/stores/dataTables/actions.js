/**
 * Data table store actions.
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Change DOM visibility of app.
	 *
	 * @param {Function} commit mutation commit function
	 * @param {boolean} value visibility value
	 */
	setComponentVisibility({ commit }, value) {
		commit('appVisibility', value);
	},
	/**
	 * Change current screen.
	 *
	 * @param {Function} commit mutation commit function
	 * @param {string} screenName screen name to assign as current
	 */
	setCurrentScreen({ commit }, screenName) {
		commit('setScreen', screenName);
	},
	/**
	 * Change current screen.
	 *
	 * @param {Function} commit mutation commit function
	 */
	setCurrentScreenToDataSourceSelection({ commit }) {
		commit('setScreen', `DataSourceSelection`);
		commit('resetToDefaults', 'dataSource.setup');
	},
	/**
	 * Soft select a source card.
	 *
	 * @param {{commit}} mutation commit function
	 * @param {string} sourceId selected source id
	 */
	softSelectCard({ commit }, sourceId) {
		commit('setSoftSelected', sourceId);
	},
	/**
	 * Start setup process for selected source type.
	 *
	 * For source setup to work, name your setup components as `SourceName`Setup where
	 *`SourceName` being the id for that source.
	 *
	 * @param {{commit, dispatch}} mutation commit function
	 * @param {string} sourceId selected source id
	 */
	startSourceSetup({ commit, dispatch }, sourceId) {
		// set source id
		commit('setSetupSourceId', sourceId);

		// clear temp data manager
		commit('clearTempDataManager');

		// set screen
		const screenName = `${sourceId[0].toUpperCase() + sourceId.slice(1)}Setup`;

		dispatch('setCurrentScreen', screenName);
	},
	/**
	 * Add temp data to data manager.
	 *
	 * @param {{commit, getters}} vuex store object
	 * @param {{data, markAsImported}} data data array
	 */
	addDataManagerTempData({ commit, getters }, { data, markAsImported }) {
		if (markAsImported === undefined) {
			// eslint-disable-next-line no-param-reassign
			markAsImported = true;
		}

		const confirmedData = Array.isArray(data) ? data : [];
		commit('clearTempDataManager');

		// generate ids for rows
		// eslint-disable-next-line array-callback-return,no-unused-vars
		confirmedData.map((_) => {
			commit('pushDataManagerRowId', getters.generateUniqueId());
		});

		// find maximum amount of column numbers
		const maxCol = confirmedData.reduce((carry, current) => {
			const currentLength = current.length;
			return Math.max(currentLength, carry);
		}, 0);

		// generate ids for columns
		for (let i = 0; i < maxCol; i += 1) {
			commit('pushDataManagerColId', getters.generateUniqueId());
		}

		// set maximum column amount
		commit('setColCount', maxCol);

		// set maximum row amount
		commit('setRowCount', confirmedData.length);

		// form data object
		const formedData = confirmedData.reduce((carry, item, index) => {
			const rowObj = { rowId: getters.getDataManagerRowId(index), values: [] };

			// eslint-disable-next-line array-callback-return
			item.map((c, i) => {
				rowObj.values.push({ colId: getters.getDataManagerColId(i), value: c });
			});

			carry.push(rowObj);

			return carry;
		}, []);

		commit('setDataManagerTempData', formedData);

		if (markAsImported) {
			// mark data created status
			commit('setSetupSourceDataCreatedStatus', true);
		}
	},
	/**
	 * Set tab of current active source setup.
	 *
	 * @param {{state,commit}} vuex store object
	 * @param {string} tabId tab id to change to
	 */
	setActiveTabGroupForCurrentSource({ state, commit }, tabId) {
		commit('setActiveControlTabGroup', { sourceId: state.dataSource.setup.sourceId, tabId });
	},
	/**
	 * Start select operation.
	 *
	 * @async
	 * @param {{commit}} vuex store object
	 * @param {string} callerId id of the component that started the operation
	 * @return {Promise} Promise object
	 */
	startRowSelectOperation({ commit }, callerId) {
		// set app to busy
		commit('setBusy', true);

		// reset selection data
		commit('resetSelectData');

		// enable row selection
		commit('setSelectionType', 'row');

		// enable select operation
		commit('setSelectStatus', true);

		// set operation caller id
		commit('setSelectCallerId', callerId);

		// send back a promise object which will be resolved when click operation occurs
		return new Promise((res) => {
			commit('setSelectIdResolve', (val) => {
				// end selection operation
				commit('setSelectStatus', false);
				commit('resetSelectData');

				// set app to idle
				commit('setBusy', false);

				res(val);
			});
		});
	},
	/**
	 * Cancel active select operation.
	 *
	 * @param {{state, commit}} vuex store object
	 */
	cancelRowSelectOperation({ state, commit }) {
		commit('setSelectStatus', false);
		state.dataManager.select.clickId.resolve(null);
		commit('resetSelectData');
	},
	/**
	 * Set value of data cell.
	 *
	 * @param {{getters}} vuex store object
	 * @param {{cellId, value}} payload
	 *
	 */
	setDataCellValue({ getters, commit }, { cellId, value }) {
		const { rowId, colId } = getters.parseCellId(cellId);

		commit('setDataCellObjectValue', { rowId, colId, value });
		commit('setSetupSourceDataCreatedStatus', true);
	},
};

export default actions;
