import deepmerge from 'deepmerge';
import state from './state';
import mutations from './mutations';
import getters from './getters';

/**
 * Default store options.
 *
 * @type {Object}
 */
export const defaultStoreOptions = {
	state,
	mutations,
	getters,
};

/**
 * Get module options.
 *
 * @param {Object} extraStoreOptions extra store options
 * @return {Object} merged module store options
 */
const getModuleOptions = (extraStoreOptions) => {
	return deepmerge(defaultStoreOptions, extraStoreOptions);
};

/**
 * @module getModuleOptions
 */
export default getModuleOptions;
