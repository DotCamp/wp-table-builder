/**
 * Upsell store module.
 *
 * @type {Object}
 */
const upsellsModule = {
	namespaced: true,
	state: {
		upsellUrl: '',
	},
	getters: {
		getUpsellUrl(state) {
			return state.upsellUrl;
		},
	},
};

/**
 * @module upsellsModule
 */
export default upsellsModule;
