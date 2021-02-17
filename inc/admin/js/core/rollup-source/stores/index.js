import Vue from 'vue';
import Vuex from 'vuex';
import merge from 'deepmerge';
import { createBasicStore } from './general';

// setup vuex
Vue.use(Vuex);

/**
 * Create store.
 *
 * @param {Object} defaultStore default store
 * @return {Object} created flux store
 */
const createStore = (defaultStore = {}) => {
	// base store object that contains helpful store elements
	const baseStore = {
		state: {
			strings: {},
		},
		getters: {
			translation: (state) => (key) => {
				return state.strings[key];
			},
		},
	};

	return (storeOptions) => {
		// merge base store with supplied default store
		const mergedDefaultStore = merge(defaultStore, baseStore);

		return createBasicStore(mergedDefaultStore, storeOptions);
	};
};

/** @module createStore */
export default createStore;
