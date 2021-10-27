import Vue from 'vue';
import Vuex from 'vuex';
import { createBasicStore } from '$Stores/general';
import modules from './modules';
import subscriptions from '$Stores/builderStore/plugin';

Vue.use(Vuex);

/**
 * Default store for builder.
 *
 * @type {Object}
 */
const defaultStore = {
	strict: true,
	modules,
	plugins: [subscriptions],
};

/**
 * Create a store for builder.
 *
 * @param {Object} extraStoreOptions extra store options to add to default one
 * @return {Object} vuex store for builder
 */
const createStore = (extraStoreOptions) => {
	return createBasicStore(defaultStore, extraStoreOptions);
};

/**
 * @module createStore
 */
export default createStore;
