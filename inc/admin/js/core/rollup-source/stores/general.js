import Vuex from 'vuex';
import deepmerge from 'deepmerge';

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
