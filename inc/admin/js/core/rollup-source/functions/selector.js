/**
 * Selector helper functions for element data retrieval.
 */

/**
 * Select element operation to get/set certain element attributes/properties.
 *
 * @param {HTMLElement} element html element
 * @param {string} type element attribute/property type
 * @returns {DOMStringMap|(function(): *)} suitable operation for supplied arguments
 */
function operationSelect(element, type) {
	let operation = null;
	switch (type) {
		case 'dataset':
			operation = element.dataset;
			break;
		case 'style':
			operation = element.style;
			break;
		default:
			operation = element.dataset;
			break;
	}

	return operation;
}

/**
 * Get value of HTMLElement.
 *
 * Supported value types: dataset
 *
 * @param {string} selector query string for element search
 * @returns {{value: *, element: HTMLElement}}  returns an object of element and its queried value
 */
function getTargetValue(selector) {
	const { query, type, key } = selector;
	const element = document.querySelector(query);

	const operation = operationSelect(element, type);

	if (operation) {
		return { element, value: operation[key], type, key };
	}
	throw new Error(`no related operation found with a type of [${type}]`);
}

/**
 * Set value for an individual selector object.
 *
 * @param {object} selector selector object
 * @param {any} value value to be assigned to selector element
 */
function setTargetValue(selector, value) {
	const { element, type, key } = selector;
	const operation = operationSelect(element, type);

	operation[key] = value;
}

/**
 * Set values of target selectors.
 *
 * @param {array} selectors an array of selector objects
 * @param {any} value value to be assigned to selector elements
 */
function setAllValues(selectors, value) {
	// eslint-disable-next-line array-callback-return
	selectors.map((s) => {
		setTargetValue(s, value);
	});
}

/**
 * Get all values from an array of selectors.
 *
 * @param {array} selectors an array of selector objects
 * @returns {{startupValue: null, elements: []}} object with selector values
 */
function getAllValues(selectors) {
	const allObj = {
		elements: [],
		startupValue: null,
	};

	// eslint-disable-next-line array-callback-return
	selectors.map((s) => {
		const elementValue = getTargetValue(s);
		allObj.elements.push(getTargetValue(s));
		if (s.useAsStartup) {
			allObj.startupValue = elementValue;
		}
	});

	// if no startup value is defined, use the value of the first element
	if (!allObj.startupValue) {
		allObj.startupValue = allObj.elements[0].value;
	}

	return allObj;
}

/**
 * @module selector module
 */
export default { getTargetValue, getAllValues, setTargetValue, setAllValues };
