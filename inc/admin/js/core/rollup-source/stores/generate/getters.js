/**
 * Generate component store getters.
 *
 * @type {Object}
 */
const getters = {
	// eslint-disable-next-line no-shadow
	appData: (state) => {
		return state;
	},
	// eslint-disable-next-line no-shadow
	isDevBuild: (state) => () => {
		return state.env !== 'production';
	},
	strings: (state) => {
		return state.strings;
	},
};

/** @module getters */
export default getters;
