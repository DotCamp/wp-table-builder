import createStore from '$Stores/builderStore';

/**
 * Wptb store UMD module.
 */
(function umd(key, context, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_Store', self || global, () => {
	/**
	 * Data store for builder.
	 *
	 * @param {Object} extraStoreOptions extra store options to use
	 *
	 * @class
	 */
	function WptbStore(extraStoreOptions = {}) {
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

	// eslint-disable-next-line camelcase
	const { store: storeData } = wptb_admin_object;

	/**
	 * App store for builder.
	 *
	 * @type {Object}
	 */
	const appStore = {
		state: {
			...storeData,
		},
		getters: {
			proStatus(state) {
				return state.pro;
			},
		},
	};

	/** @module WptbStore */
	return new WptbStore(appStore);
});
