/**
 * Store module related app specific operations.
 *
 * @type {Object}
 */
const appModule = {
	namespaced: true,
	state: () => ({
		saveOperation: {
			enabled: false,
		},
	}),
	getters: {
		/**
		 * Current availability of save operation.
		 *
		 * @param {Object} state store state
		 */
		isSavingEnabled(state) {
			return state.saveOperation.enabled;
		},
	},
	mutations: {
		/**
		 * Set save operation availability.
		 *
		 * @param {Object} state store state
		 * @param {boolean} status status
		 */
		setSaveStatus(state, status) {
			// eslint-disable-next-line no-param-reassign
			state.saveOperation.enabled = status;
		},
	},
};

/**
 * @module appModule
 */
export default appModule;
