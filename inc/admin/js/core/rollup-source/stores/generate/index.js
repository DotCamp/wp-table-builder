import Vue from 'vue';
import Vuex from 'vuex';

// setup vuex
Vue.use(Vuex);

/**
 * Create generate related store
 *
 * @param {Object} storeOptions store options object
 * @return {Object} generate store object
 */
const createStore = (storeOptions) => {
	return new Vuex.Store(storeOptions);
};

/** @module createStore */
export default createStore;
