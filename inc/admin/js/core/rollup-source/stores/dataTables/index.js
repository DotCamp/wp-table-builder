import Vuex from 'vuex';
import Vue from 'vue';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

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
 * Create data table store.
 *
 * @param {Object} extraStoreOptions extra store options to be used
 * @return {Object} data table store
 */
const createStore = (extraStoreOptions = {}) => {
	return new Vuex.Store(objectDeepMerge(storeOptions, extraStoreOptions));
};

export default createStore;
