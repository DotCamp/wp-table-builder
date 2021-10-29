/**
 * Night mode store module.
 *
 * @type {Object}
 */
const nightMode = {
	namespaced: true,
	state: () => ({ activated: false }),
	getters: {
		isActive(state) {
			return state.activated;
		},
	},
	mutations: {
		setNightMode(state, status) {
			// eslint-disable-next-line no-param-reassign
			state.activated = status;
		},
	},
};

/**
 * @module nightMode
 */
export default nightMode;
