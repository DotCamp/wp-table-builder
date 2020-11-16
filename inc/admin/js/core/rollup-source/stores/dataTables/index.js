import Vuex from 'vuex';
import Vue from 'vue';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import subscriptions from './plugin';
import { objectPropertyFromString } from '../../functions';

// setup vuex for current vue instance
Vue.use(Vuex);

/**
 * Default store for data table.
 *
 * @type {Object}
 */
const storeOptions = {
	state,
	mutations,
	actions,
	getters,
	plugins: [subscriptions],
	strict: true,
};

/**
 * Deep merge object.
 *
 * @param {Object} source source object
 * @param {Object} target target object
 * @return {Object} merged object
 */
function objectDeepMerge(source, target) {
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
}

/**
 * Prepare a default state for given property.
 *
 * @param {Object} state state object
 * @param {*} target target value
 * @param {string} defaultKey key that will be used to store default
 */
// eslint-disable-next-line no-shadow
const prepareDefaults = (state, target) => {
	const targetValue = objectPropertyFromString(target, state);

	let value = targetValue;
	if (typeof value === 'object') {
		value = { ...targetValue };
	} else if (Array.isArray(targetValue)) {
		value = Array.from(targetValue);
	}
	// eslint-disable-next-line no-param-reassign
	state.defaults[target] = value;
};

/**
 * Create data table store.
 *
 * @param {Object} extraStoreOptions extra store options to be used
 * @return {Object} data table store
 */
const createStore = (extraStoreOptions = {}) => {
	// create defaults for datasource setup
	prepareDefaults(storeOptions.state, 'dataSource.setup');

	return new Vuex.Store(objectDeepMerge(storeOptions, extraStoreOptions));
};

export default createStore;
