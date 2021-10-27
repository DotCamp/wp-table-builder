/**
 * Color picker store module.
 *
 * @type {Object}
 */
const colorPickerModule = {
	namespaced: true,
	state: () => ({
		activeId: null,
	}),
	getters: {
		/**
		 * Get active color picker id.
		 *
		 * @param {Object} state store state
		 * @return {null|string} active color picker id
		 */
		getActiveColorPickerId(state) {
			return state.activeId;
		},
	},
	mutations: {
		/**
		 * Set active color picker id.
		 *
		 * @param {Object} state store state
		 * @param {string} id new color picker id
		 */
		setActiveColorPicker(state, id) {
			// eslint-disable-next-line no-param-reassign
			state.activeId = id;
		},
	},
};

/**
 * @module colorPickerModule
 */
export default colorPickerModule;
