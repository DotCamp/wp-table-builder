import { actionWatchFunction, mutationWatchFunction, stateWatchFunction } from '../../general';

/**
 * Mutation watch list.
 *
 * Keys for mutation types, and values for function to be called when specified mutation type is applied.
 *
 * @type {Object}
 */
const mutationWatchList = {
	addRowToDataTable: ({ payload }, state, store) => {
		const colCount = Math.max(payload.values.length, store.getters.getColCount);

		// set col count from table data
		store.commit('setColCount', colCount);
	},
};

/**
 * Action watch list.
 *
 * Keys for action types, and values for function to be called when specified action type is applied.
 *
 * @type {Object}
 */
const actionWatchList = {
	before: {},
	after: {
		addColumnToDataManager: (payload, state, store) => {
			const colCount = store.getters.getColCount + 1;

			// set col count from table data
			store.commit('setColCount', colCount);
		},
	},
};

/**
 * State watch list.
 *
 * @type {Object}
 */
const stateWatchList = {
	tempData: {
		callAtStart: true,
		watch: 'dataManager.tempData.values',
		callBack: (store) => () => {
			// set row count from table data
			store.commit('setRowCount', store.getters.getDataManagerTempData.length);
		},
	},
	headerRow: {
		watch: ['dataManager.controls.indexRow'],
		callBack: (store) => () => {
			const { indexRow } = store.state.dataManager.controls;

			const deleteIds = [];
			// delete all rows that are generated for header that are not current index row
			// eslint-disable-next-line array-callback-return
			store.state.dataManager.tempData.values.map((r) => {
				if (r.rowId !== indexRow && r.generatedForHeader) {
					deleteIds.push(r.rowId);
				}
			});

			// eslint-disable-next-line array-callback-return
			deleteIds.map((id) => {
				store.commit('deleteRowFromDataTable', id);
			});
		},
	},
};

/**
 * Store subscriptions for data manager
 *
 * @param {Object} store store object
 */
const subscriptions = (store) => {
	// TODO [erdembircan] remove for production
	console.log('module subscriptions called');

	stateWatchFunction(store, stateWatchList);
	mutationWatchFunction(mutationWatchList, store);
	actionWatchFunction(actionWatchList, store);
};

/**
 * @module subscriptions
 */
export default subscriptions;
