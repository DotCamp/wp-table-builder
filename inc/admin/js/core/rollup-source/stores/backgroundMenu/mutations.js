/**
 * Background menu mutations.
 *
 * @type {Object}
 */
const mutations = {
	setGeneralOption: (state, { subKey, value }) => {
		// eslint-disable-next-line no-param-reassign
		state.options.general[subKey] = value;
	},
};

/** @module mutations */
export default mutations;
