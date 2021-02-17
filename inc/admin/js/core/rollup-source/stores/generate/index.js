import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import { createBasicStore } from '../general';

// setup vuex
Vue.use(Vuex);

/**
 * Default store for generate component.
 *
 * @type {Object}
 */
const defaultStore = {
	state: {},
	getters,
};

/**
 * Create generate related store.
 *
 * @param {Object} storeOptions store options object
 * @return {Object} generate store object
 */
const createStore = (storeOptions = {}) => {
	return createBasicStore(defaultStore, storeOptions);
};

/** @module createStore */
export default createStore;
