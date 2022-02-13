/* eslint-disable no-param-reassign */
/**
 * Embed store module.
 *
 * @type {Object}
 */
const embed = {
	namespaced: true,
	state: () => ({
		modalVisibility: false,
	}),
	getters: {
		visibility(state) {
			return state.modalVisibility;
		},
	},
	mutations: {
		showModal(state) {
			state.modalVisibility = true;
		},
		hideModal(state) {
			state.modalVisibility = false;
		},
	},
};

/**
 * @module embed
 */
export default embed;
