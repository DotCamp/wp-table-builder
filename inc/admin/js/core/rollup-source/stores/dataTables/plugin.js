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
 * Watch function to be used at store event subscriptions.
 *
 * @param {Object} watchList watch list to be used
 * @param {Object} store store object
 * @return {Function} function to be called at action dispatch
 */
const mutationWatchFunction = (watchList, store) => (...args) => {
	const [payload] = args;
	if (watchList[payload.type]) {
		watchList[payload.type](...args, store);
	}
};

/**
 * State watch list.
 *
 * @type {Object}
 */
const stateWatchList = {
	tempData: {
		watch: (store) => () => {
			return store.getters.getDataManagerTempData;
		},
		callBack: (store) => () => {
			// set row count from table data
			store.commit('setRowCount', store.getters.getDataManagerTempData.length);

			// @deprecated
			// reset hover id in case of deleting currently hovered row/column
			// store.commit('setHoverId', null);
		},
	},
};

/**
 * State watch function.
 *
 * @param {Object} store vuex store object
 * @param {Object} watchList watch list
 */
const stateWatchFunction = (store, watchList) => {
	// eslint-disable-next-line array-callback-return
	Object.keys(watchList).map((k) => {
		if (Object.prototype.hasOwnProperty.call(watchList, k)) {
			const { watch, callBack } = watchList[k];

			// call callback functions before any mutation happened on store
			callBack(store)(watch(store)());

			store.watch(watch(store), callBack(store));
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
	// store.subscribeAction({
	// 	after: (action, state) => {
	// 		if (action.type === 'addColumnToDataManager') {
	// 			const colCount = store.getters.getColCount + 1;
	//
	// 			// set col count from table data
	// 			store.commit('setColCount', colCount);
	// 		}
	// 	},
	// });
};

/* @module subscriptions */
export default subscriptions;
