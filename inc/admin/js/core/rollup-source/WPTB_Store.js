import { objectDeepMerge } from './stores/general';

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
		// default store object that holds base and basic functionality for store object.
		let store = {};
		const subscribeList = {};

		// merge default store with supplied extra options
		store = objectDeepMerge(store, extraStoreOptions);

		// state getter/setter
		Object.defineProperty(this, 'state', {
			get() {
				return { ...store.state };
			},
			set() {
				throw new Error('you can not mutate state directly, use mutations instead');
			},
		});

		/**
		 * Call defined getters.
		 *
		 * @param {string} getterName name of getter function
		 */
		this.get = (getterName) => {
			if (store.getters[getterName]) {
				return store.getters[getterName]({ ...store.state });
			}
			throw new Error(`no getter found with the given name of '${getterName}'`);
		};

		/**
		 * Call subscriptions of a mutation.
		 *
		 * @param {string} mutationName mutation name
		 * @param {null | string | number | Object | Array} value mutation value
		 */
		const handleSubscription = (mutationName, value) => {
			if (subscribeList[mutationName]) {
				// eslint-disable-next-line array-callback-return
				subscribeList[mutationName].map((callback) => {
					callback(value, store.state);
				});
			}
		};

		/**
		 * Commit function that will be used at the base level.
		 *
		 * @param {Object} root0 payload object
		 * @param {string} root0.type mutation type
		 * @param {null | string | number | Array | Object} root0.value payload value
		 */
		const innerCommit = ({ type, value }) => {
			store.mutations[type](store.state, value);
			handleSubscription(type, value);
		};

		/**
		 * Commit a mutation to change store state.
		 *
		 * @param {string} mutationName name of the commit
		 * @param {null | string | number | Array | Object} value value
		 */
		this.commit = (mutationName, value) => {
			if (value !== undefined && mutationName) {
				innerCommit({ type: mutationName, value });
			} else {
				throw new Error(`no commit found with the given name of '${mutationName}'`);
			}
		};

		/**
		 * Subscribe to store mutations.
		 *
		 * @param {string} mutationName mutation name
		 * @param {Function} callback callback function that will be executed after mutation is done.This function will be getting mutation value as first argument and store state as second
		 */
		this.subscribe = (mutationName, callback) => {
			// don't allow any mutation to be on the subscribe list if they are not defined at store
			if (store.mutations[mutationName]) {
				// prepare mutation subscribe list
				if (!subscribeList[mutationName]) {
					subscribeList[mutationName] = [];
				}
				subscribeList[mutationName].push(callback);
			} else {
				throw new Error(`no mutation found to subscribe to with the given name of '${mutationName}'`);
			}
		};
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
			controls: {
				colorPicker: {
					activeId: null,
				},
			},
			...storeData,
		},
		getters: {
			getActiveColorPickerId(state) {
				return state.controls.colorPicker.activeId;
			},
			proStatus(state) {
				return state.pro;
			},
		},
		mutations: {
			setActiveColorPicker(state, id) {
				// eslint-disable-next-line no-param-reassign
				state.controls.colorPicker.activeId = id;
			},
		},
	};

	/** @module WptbStore */
	return new WptbStore(appStore);
});
