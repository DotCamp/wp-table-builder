import deepmerge from 'deepmerge';
import actions from './actions';
import state from './state';
import mutations from './mutations';
import getters from './getters';
import subscriptions from './plugin';

/**
 * Default store options.
 *
 * @type {Object}
 */
export const defaultStoreOptions = {
	state,
	mutations,
	getters,
	actions,
	plugins: [subscriptions],
	strict: true,
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
