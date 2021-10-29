import Vue from 'vue';
import Vuex from 'vuex';
import { createBasicStore } from '$Stores/general';
import modules from './modules';
import subscriptions from '$Stores/builderStore/plugin';

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

function BuilderStore() {
	Vue.use(Vuex);

	// eslint-disable-next-line camelcase
	const { store: storeData } = wptb_admin_object;

	const extraStoreOptions = {
		state: {
			...storeData,
		},
		getters: {
			proStatus(state) {
				return state.pro;
			},
		},
	};

	const builderStore = createStore(extraStoreOptions);

	/**
	 * Compatibility function for store getters.
	 *
	 * @param {string} getterId getter id
	 * @return {any} getter operation result
	 */
	builderStore.get = (getterId) => {
		return builderStore.getters[getterId];
	};

	return builderStore;
}

/**
 * @module createStore
 */
export default new BuilderStore();
