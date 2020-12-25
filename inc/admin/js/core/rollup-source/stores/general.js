import Vuex from 'vuex';
import merge from 'deepmerge';
/**
 * Deep merge object.
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
			} else {
				// eslint-disable-next-line no-param-reassign
				source[k] = target[k];
			}
		}
	});

	return source;
};

/**
 * Create a basic store with the given store object.
 *
 * @param {Object} defaultStore default store object
 * @param {Object} extraStore extra store object
 * @return {Object} Vuex store
 */
export const createBasicStore = (defaultStore, extraStore) => {
	return new Vuex.Store(merge(defaultStore, extraStore));
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
