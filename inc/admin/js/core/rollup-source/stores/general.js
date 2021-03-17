import Vuex from 'vuex';
import deepmerge from 'deepmerge';
import { objectPropertyFromString } from '../functions';

/**
 * Deep merge object.
 *
 * @deprecated
 *
 * @param {Object} source source object
 * @param {Object} target target object
 * @return {Object} merged object
 */
// eslint-disable-next-line import/prefer-default-export
export const objectDeepMerge = (source, target) => {
	// eslint-disable-next-line array-callback-return
	Object.keys(target).map((k) => {
		if (Object.prototype.hasOwnProperty.call(target, k)) {
			if (Object.prototype.hasOwnProperty.call(source, k)) {
				if (typeof source[k] === 'object') {
					// eslint-disable-next-line no-param-reassign
					source[k] = { ...source[k], ...target[k] };
				} else {
					// eslint-disable-next-line no-param-reassign
					source[k] = target[k];
				}
			}
		}
	});

	return source;
};

/**
 * Merge default translation getter into your getters object.
 *
 * @param {Object} getters getters object
 * @return {Object} merged getters object
 */
export const defaultTranslationGetter = (getters) => {
	return deepmerge(getters, {
		translation: (state) => (key) => {
			return state.strings[key];
		},
	});
};

/**
 * Create a basic store with the given store object.
 *
 * @param {Object} defaultStore default store object
 * @param {Object} extraStore extra store object
 * @return {Object} Vuex store
 */
export const createBasicStore = (defaultStore, extraStore) => {
	return new Vuex.Store(deepmerge(defaultStore, extraStore));
};

/**
 * Watch function to be used at store event subscriptions.
 *
 * @param {Object} watchList watch list to be used
 * @param {Object} store store object
 */
export const mutationWatchFunction = (watchList, store) => {
	store.subscribe((...args) => {
		const [payload] = args;
		if (watchList[payload.type]) {
			watchList[payload.type](...args, store);
		}
	});
};

/**
 * Watch a list of actions from a list.
 *
 * @param {Object} watchList watch list to be used
 * @param {Object} store store object
 */
export const actionWatchFunction = (watchList, store) => {
	/**
	 * Execute bulk handler.
	 *
	 * @param {string} actionOrder action order
	 * @param {Object} action action payload
	 * @param {Object} state state object
	 */
	function executeBulkHandler(actionOrder, action, state) {
		if (watchList.bulk && watchList.bulk[actionOrder]) {
			const bulkList = watchList.bulk[actionOrder];
			// eslint-disable-next-line array-callback-return
			Object.keys(bulkList).map((bulkId) => {
				if (Object.prototype.hasOwnProperty.call(bulkList, bulkId)) {
					if (bulkList[bulkId].actions.includes(action.type)) {
						bulkList[bulkId].handler(action, state, store);
					}
				}
			});
		}
	}

	store.subscribeAction({
		before: (action, state) => {
			if (watchList.before[action.type]) {
				watchList.before[action.type](action, state, store);
			}
			executeBulkHandler('before', action, state);
		},
		after: (action, state) => {
			if (watchList.after[action.type]) {
				watchList.after[action.type](action, state, store);
			}
			executeBulkHandler('after', action, state);
		},
	});
};

/**
 * State watch function.
 *
 * @param {Object} store vuex store object
 * @param {Object} watchList watch list */
export const stateWatchFunction = (store, watchList) => {
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
