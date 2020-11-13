/**
 * General functions that can be used through out app.
 */

/**
 * Get a property value from an object with a string key.
 
 * @param {string} stringKey key
 * @param {Object} target target object
 * @return {*} property value
 */
// eslint-disable-next-line import/prefer-default-export
export const objectPropertyFromString = (stringKey, target) => {
	// split string key for inner properties
	let splitKey = stringKey.split('.');

	if (!Array.isArray(splitKey)) {
		splitKey = [splitKey];
	}

	return splitKey.reduce((carry, item) => {
		return carry[item];
	}, target);
};

/**
 * Set object property from string.
 *
 * @param {string} stringKey key
 * @param {Object} target target object
 * @param {*} value value
 */
export const setObjectPropertyFromString = (stringKey, target, value) => {
	let splitKey = stringKey.split('.');

	if (!Array.isArray(splitKey)) {
		splitKey = [splitKey];
	}

	if (splitKey.length === 1) {
		// eslint-disable-next-line no-param-reassign
		target[splitKey[0]] = value;
	} else {
		const parents = splitKey.slice(0, splitKey.length - 1);

		const parent = parents.reduce((carry, item) => {
			return carry[item];
		}, target);

		parent[splitKey[splitKey.length - 1]] = value;
	}
};
