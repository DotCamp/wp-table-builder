/* eslint-disable no-param-reassign */
import Cookies from 'js-cookie';
import { stateWatchFunction } from '$Stores/general';
import { objectPropertyFromString } from '$Functions/index';

/**
 * State watch list.
 *
 * @type {Object}
 */
const stateWatchList = {};

/**
 * Get persistent state of global store.
 *
 * @return {undefined | store} persistent state
 */
export const getPersistentState = () => {
	let wptbCookie = Cookies.get('wptb');

	if (wptbCookie) {
		try {
			wptbCookie = JSON.parse(atob(wptbCookie));
		} catch (e) {
			// do nothing...
		}
	}

	return wptbCookie;
};

/**
 * Write state to document cookie.
 *
 * @param {Object} state store state
 * @param {Array} addresses an array of addresses to use while preparing data for write operation
 */
const writePersistentState = (state, addresses = []) => {
	const dataToWrite = {};

	// eslint-disable-next-line array-callback-return
	addresses.map((addr) => {
		const parts = addr.split('.');

		parts.reduce((carry, key, index) => {
			if (index < parts.length - 1) {
				if (!carry[key]) {
					carry[key] = {};
				}
			} else {
				carry[key] = objectPropertyFromString(addr, state);
			}

			return carry[key];
		}, dataToWrite);
	});

	Cookies.set('wptb', btoa(JSON.stringify(dataToWrite)));
};

/**
 * Prepare a map array for state values with persistent functionality enabled.
 *
 * @param {Object} state store state
 * @return {Array} an array of JSON style addresses for persistent state keys
 */
const preparePersistentMap = (state) => {
	const map = [];

	/**
	 * Get persistent addresses of values in store state.
	 *
	 * This function will push those addresses to map array in its closure
	 *
	 * @param {any} storeVal current store value
	 * @param {string} carryAddr carried address
	 */
	function getPersistentAddr(storeVal, carryAddr = '') {
		if (typeof storeVal === 'object' && storeVal !== null) {
			// eslint-disable-next-line no-underscore-dangle
			if (Object.prototype.hasOwnProperty.call(storeVal, '_persistent')) {
				map.push(carryAddr);
			} else {
				// eslint-disable-next-line array-callback-return
				Object.keys(storeVal).map((key) => {
					if (Object.prototype.hasOwnProperty.call(storeVal, key)) {
						getPersistentAddr(storeVal[key], `${carryAddr}${carryAddr === '' ? '' : '.'}${key}`);
					}
				});
			}
		}
	}

	getPersistentAddr(state);

	return map;
};

/**
 * Store subscriptions to watch various store events.
 *
 * @param {Object} store flux store
 */
const subscriptions = (store) => {
	const persistentMap = preparePersistentMap(store.state);

	stateWatchList.stateWrite = {
		watch: persistentMap,
		callBack: (currentStore) => {
			// only values of state which are marked as persistent will trigger a save operation for store state
			writePersistentState(currentStore.state, persistentMap);
		},
	};

	stateWatchFunction(store, stateWatchList);
};

/**
 * @module subscriptions
 */
export default subscriptions;
