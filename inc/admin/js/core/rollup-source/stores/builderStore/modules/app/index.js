/**
 * Save operation types.
 *
 * @type {Object}
 */
export const saveOperationTypes = {
	TABLE: 'table',
	TEMPLATE: 'template',
};

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
			currentType: saveOperationTypes.TABLE,
			saveOperationTypes,
		},
	}),
	getters: {
		/**
		 * Predefined save operation types.
		 *
		 * @param {Object} state store state
		 * @return {Object} types
		 */
		saveOperationTypes(state) {
			return state.saveOperation.saveOperationTypes;
		},
		/**
		 * Current availability of save operation.
		 *
		 * @param {Object} state store state
		 */
		isSavingEnabled(state) {
			return state.saveOperation.enabled;
		},
		/**
		 * Current type of save operation.
		 *
		 * @param {Object} state store state
		 * @return {string} save type
		 */
		currentSaveType(state) {
			return state.saveOperation.currentType;
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
		/**
		 * Set type of future save operations.
		 *
		 * @param {Object} state store state
		 * @param {string} type save operation type
		 */
		setSaveType(state, type) {
			// eslint-disable-next-line no-param-reassign
			state.saveOperation.currentType = type;
		},
	},
};

/**
 * @module appModule
 */
export default appModule;
