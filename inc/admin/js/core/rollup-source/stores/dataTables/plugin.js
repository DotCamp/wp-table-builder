import { objectPropertyFromString } from '../../functions';
import {mutationWatchFunction} from '../general';

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
 * Watch a list of actions from a list.
 *
 * @param {Object} watchList watch list to be used
 * @param {Object} store store object
 * @return {Object} action subscribe object
 */
const actionWatchFunction = (watchList, store) => {
	return {
		before: (action, state) => {
			if (watchList.before[action.type]) {
				watchList.before[action.type](action, state, store);
			}
		},
		after: (action, state) => {
			if (watchList.after[action.type]) {
				watchList.after[action.type](action, state, store);
			}
		},
	};
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
	dirtyTable: {
		watch: ['dataManager.tempData.values', 'dataManager.controls', 'dataManager.bindings'],
		callBack: (store) => () => {
			store.commit('setTableDirty');
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
 * State watch function.
 *
 * @param {Object} store vuex store object
 * @param {Object} watchList watch list */
const stateWatchFunction = (store, watchList) => {
	// eslint-disable-next-line array-callback-return
	Object.keys(watchList).map((k) => {
		if (Object.prototype.hasOwnProperty.call(watchList, k)) {
			let { watch, callBack, callAtStart } = watchList[k];

			if (!Array.isArray(watch)) {
				watch = [watch];
			}

			const stateGetter = (keyString, storeObject) => () => {
				return objectPropertyFromString(keyString, storeObject.state);
			};

			// eslint-disable-next-line array-callback-return
			watch.map((w) => {
				if (callAtStart) {
					callBack(store)(stateGetter(w, store)());
				}
				store.watch(stateGetter(w, store), callBack(store), { deep: true });
			});
		}
	});
};

/**
 * Store subscriptions to watch various store events.
 *
 * @param {Object} store flux store
 */
const subscriptions = (store) => {
	stateWatchFunction(store, stateWatchList);

	store.subscribe(mutationWatchFunction(mutationWatchList, store));
	store.subscribeAction(actionWatchFunction(actionWatchList, store));
};

/* @module subscriptions */
export default subscriptions;
