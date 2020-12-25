import createStore from '../index';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import { subscriptions } from './plugin';

/**
 * Default store object for background menu.
 *
 * @type {Object}
 */
const defaultStore = { state, getters, mutations, plugins: [subscriptions], strict: true };

/** @module createStore */
export default createStore(defaultStore);
