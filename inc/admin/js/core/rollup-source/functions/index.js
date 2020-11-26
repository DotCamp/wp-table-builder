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

/**
 * Get element id from a table element's class.
 *
 * @param {HTMLElement} tableElement table element
 * @return {null|string} null if no id is found
 */
export const parseTableElementId = (tableElement) => {
	if (tableElement) {
		const activeElementIdArray = tableElement
			.getAttribute('class')
			.split(' ')
			.filter((c) => {
				const regExp = new RegExp(/^wptb-element-(.+)-(\d+)$/, 'g');
				return regExp.test(c);
			})[0];

		if (activeElementIdArray) {
			return activeElementIdArray.replace('wptb-element-', '');
		}
	}
	return null;
};
/**
 * Find table element type from its class.
 *
 * @param {HTMLElement} tableElement table element
 * @return {null|string} null if no type is found
 */
export const parseElementType = (tableElement) => {
	if (tableElement) {
		const activeElementKindArray = tableElement
			.getAttribute('class')
			.split(' ')
			.filter((c) => {
				const regExp = new RegExp(/^wptb-element-(.+)-(\d+)$/, 'g');
				return regExp.test(c);
			})[0];

		if (activeElementKindArray) {
			const regExp = new RegExp(/^wptb-element-(.+)-(\d+)$/, 'g');
			const [, elementType] = regExp.exec(activeElementKindArray);
			return elementType;
		}
	}
	return null;
};
