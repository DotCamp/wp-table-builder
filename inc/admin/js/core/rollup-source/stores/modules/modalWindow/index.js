import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

/**
 * Modal window store options.
 *
 * @type {Object}
 */
const defaultOptions = {
	state,
	getters,
	mutations,
	actions,
	strict: true,
};

/**
 * @module defaultOptions
 */
export default defaultOptions;
