import createStore from '../index';
import state from './state';
import getters from './getters';
import mutations from './mutations';

/**
 * Default store object for background menu.
 *
 * @type {Object}
 */
const defaultStore = { state, getters, mutations, strict: true };

/** @module createStore */
export default createStore(defaultStore);
