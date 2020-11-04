import Vuex from 'vuex';
import Vue from 'vue';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

// setup vuex for current vue instance
Vue.use(Vuex);

/**
 * Flux store for data table.
 *
 * @type {Object}
 */
const store = new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
});

export default store;
