/* eslint-disable no-param-reassign */
import { stateWatchFunction } from '$Stores/general';

/**
 * State watch list.
 *
 * @type {Object}
 */
const stateWatchList = {
	proStatus: {
		watch: 'pro',
		callBack: (store, n) => {
			if (n) {
				// disable pro status changes from outside sources
				store.state.pro = false;
			}
		},
	},
};

/**
 * Store subscriptions to watch various store events.
 *
 * @param {Object} store flux store
 */
const subscriptions = (store) => {
	stateWatchFunction(store, stateWatchList);
};

/**
 * @module subscriptions
 */
export default subscriptions;
