import Vue from 'vue';
import Vuex from 'vuex';
import { createBasicStore } from '../general';
import getters from './getters';

// setup vuex for current vue instance
Vue.use(Vuex);

// default store for responsive component
const defaultStore = {
	state: {},
	getters,
};

/**
 * Create responsive store component.
 *
 * @param {Object} extraOptions extra option
 * @return {Object} responsive component store
 */
const createStore = (extraOptions) => {
	return createBasicStore(defaultStore, extraOptions);
};

/** @module createStore */
export default createStore;
