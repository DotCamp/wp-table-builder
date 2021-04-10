import { stateWatchFunction, actionWatchFunction } from '../general';

/**
 * Action watch list.
 *
 * @type {Object}
 */
const actionWatchList = {
	before: {},
	after: {
		setDataCellValue: (payload, state, store) => {
			store.commit('setSetupSourceDataCreatedStatus', true);
		},
	},
};

/**
 * State watch list.
 *
 * @type {Object}
 */
const stateWatchList = {
	syncDataObject: {
		watch: ['dataManager.controls', 'dataManager.tempData', 'dataSource.setup.title'],
		callBack: (store) => () => {
			store.dispatch('syncDataObject');

			// @deprecated
			// const currentDataObject = store.getters.getDataObject;
			//
			// // update data object with various fields from store state
			// const mergeData = {
			// 	controls: store.state.dataManager.controls,
			// 	title: store.getters.getDataObjectTitle,
			// };
			//
			// const mergedData = { ...currentDataObject, ...mergeData };
			//
			// store.commit('setDataObject', mergedData);
		},
	},
	dirtyTable: {
		watch: ['dataManager.tempData.values', 'dataManager.controls', 'dataManager.bindings'],
		callBack: (store) => () => {
			store.commit('setTableDirty');
		},
	},
};

/**
 * Store subscriptions to watch various store events.
 *
 * @param {Object} store flux store
 */
const subscriptions = (store) => {
	stateWatchFunction(store, stateWatchList);
	actionWatchFunction(actionWatchList, store);
};

/* @module subscriptions */
export default subscriptions;
