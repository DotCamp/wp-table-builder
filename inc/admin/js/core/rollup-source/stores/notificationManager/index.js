import Vue from 'vue';
import Vuex from 'vuex';
import createState from './state';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

Vue.use(Vuex);

/**
 * Create new Vuex store for notification manager.
 *
 * @param {Object} root0 store object
 * @param {Object} root0.state store state
 */
// eslint-disable-next-line no-empty-pattern
const createStore = ({ state }) => {
	return new Vuex.Store({
		state: createState(state || {}),
		actions,
		mutations,
		getters,
		strict: true,
	});
};

export default createStore;
