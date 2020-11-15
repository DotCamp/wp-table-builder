/**
 * Mutation watch list.
 *
 * Keys for mutation types, and values for function to be called when specified mutation type is applied.
 *
 * @type {Object}
 */
const mutationWatchList = {
	addRowToDataTable: ({ payload }, state, store) => {
		// set row count from table data
		store.commit('setRowCount', store.getters.getDataManagerTempData.length);

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
	addColumnToDataManager: (payload, state, store) => {
		const colCount = store.getters.getColCount + 1;

		// set col count from table data
		store.commit('setColCount', colCount);
	},
};

/**
 * Watch function to be used at store event subscriptions.
 *
 * @param {Object} watchList watch list to be used
 * @param {Object} store store object
 * @return {Function} function to be called at action dispatch
 */
const watchFunction = (watchList, store) => (...args) => {
	const [payload] = args;
	if (watchList[payload.type]) {
		watchList[payload.type](...args, store);
	}
};

/**
 * Store subscriptions to watch various store events.
 *
 * @param {Object} store flux store
 */
const subscriptions = (store) => {
	store.subscribe(watchFunction(mutationWatchList, store));
	store.subscribeAction(watchFunction(actionWatchList, store));
};

/* @module subscriptions */
export default subscriptions;
