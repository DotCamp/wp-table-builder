import createStore from '$Stores/index';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import subscriptions from './plugin';

/**
 * Default store object for background menu.
 *
 * @type {Object}
 */
const defaultStore = { state, getters, mutations, actions, plugins: [subscriptions], strict: true };

/** @module createStore */
export default createStore(defaultStore);
