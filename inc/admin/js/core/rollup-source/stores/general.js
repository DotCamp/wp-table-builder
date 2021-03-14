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
 * @return {Function} function to be called at action dispatch
 */
export const mutationWatchFunction = (watchList, store) => (...args) => {
	const [payload] = args;
	if (watchList[payload.type]) {
		watchList[payload.type](...args, store);
	}
};

/**
 * Watch a list of actions from a list.
 *
 * @param {Object} watchList watch list to be used
 * @param {Object} store store object
 * @return {Object} action subscribe object
 */
export const actionWatchFunction = (watchList, store) => {
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
