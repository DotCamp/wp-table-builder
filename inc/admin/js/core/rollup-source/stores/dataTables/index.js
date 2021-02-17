import Vuex from 'vuex';
import Vue from 'vue';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import subscriptions from './plugin';
import { objectPropertyFromString } from '../../functions';
import { createBasicStore } from '../general';

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
 * Prepare a default state for given property.
 *
 * @param {Object} state state object
 * @param {*} target target value
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

	return createBasicStore(storeOptions, extraStoreOptions);
};

/** @module createStore */
export default createStore;
