/**
 * Selector helper functions for element data retrieval.
 *
 * One of the advanced functionality of selector module is, it can get/set values with a defined format so only raw values will be get and formatted values can be set. Format replace string is {$}. This operator will be replaced with the raw value of the control element. For example; a format of '{$}px' will be translated to '15px' in a control with a value of 15. When getting that value, 15 will be returned. While setting it, this value will be formatted into '15px'.
 *
 * Supported operation types:
 *    dataset
 *    class
 *    style
 *    attribute
 */

/**
 * Select element operation to get/set certain element attributes/properties.
 *
 * @param {HTMLElement} element html element
 * @param {string} type element attribute/property type
 * @return {DOMStringMap|(function(): *)| string} suitable operation for supplied arguments
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
		case 'class':
			operation = 'class';
			break;
		case 'attribute':
			operation = 'attribute';
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
 * Supported value types: dataset, style, classList
 *
 * @param {string} selector query string for element search
 * @return {{value: *, elements: *[]}}  returns an object of elements and its queried value
 */
function getTargetValue(selector) {
	const { query, type, key, format } = selector;
	const elements = [...document.querySelectorAll(query)];
	if (elements.length > 0) {
		const operation = operationSelect(elements[0], type);

		if (operation) {
			let value;
			if (operation === 'class') {
				value = elements[0].getAttribute('class');
			} else if (operation === 'attribute') {
				value = elements[0].getAttribute(key);
			} else {
				value = operation[key];
			}

			if (format) {
				const regExpFormat = format.replace('{$}', '(.+)');
				let testResult;
				const regExp = new RegExp(`^${regExpFormat}$`, 'g');

				if (operation === 'class') {
					value.split(' ').some((s) => {
						const result = regExp.exec(s);
						if (result === null) {
							return false;
						}
						testResult = result;
						return true;
					});
				} else {
					testResult = regExp.exec(value);
				}

				if (testResult) {
					// eslint-disable-next-line prefer-destructuring
					value = testResult[1];
				} else {
					value = null;
				}
			}

			return { elements, value, type, key, format };
		}
	}
	throw new Error(`no related operation found with a type of [${type}]`);
}

/**
 * Set value for an individual selector object.
 *
 * @param {Object} selector selector object
 * @param {any} value value to be assigned to selector element
 */
function setTargetValue(selector, value) {
	const { elements, type, key, format } = selector;
	if (Array.isArray(elements) && elements.length > 0) {
		// eslint-disable-next-line array-callback-return
		elements.map((s) => {
			const operation = operationSelect(s, type);

			// class type specific operations
			if (operation === 'class') {
				let currentClass = null;

				let val;
				// find if another class with the same format is present
				// if it is, it will signal us that this class should be removed before our formatted class can be added. this way class toggle operation will be provided with different class names with the same format
				// eslint-disable-next-line no-restricted-syntax
				for ([, val] of s.classList.entries()) {
					const regExpFormat = format.replace('{$}', '(.+)');
					const match = val.match(`^${regExpFormat}$`);
					if (match) {
						[, currentClass] = match;
					}
				}

				if (currentClass) {
					const toggleClass = format.replace('{$}', currentClass);
					// remove any class with the same format for toggle operation
					s.classList.remove(toggleClass);
				}

				const addClass = format.replace('{$}', value);
				s.classList.add(addClass);
			} else {
				let tempVal = value;

				if (format) {
					tempVal = format.replace('{$}', value);
					tempVal = tempVal.replace(new RegExp(/\\/g), '');
				}

				if (operation === 'attribute') {
					s.setAttribute(key, tempVal);
				} else {
					operation[key] = tempVal;
				}
			}
		});
	}
}

/**
 * Set values of target selectors.
 *
 * @param {Array} selectors an array of selector objects
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
 * @param {Array} selectors an array of selector objects
 * @return {Object} object with selector values
 */
function getAllValues(selectors) {
	const allObj = {
		elements: [],
		startupValue: null,
	};

	// eslint-disable-next-line array-callback-return
	selectors.map((s) => {
		let innerSelectors = [s];

		const { key } = s;

		// multiple key support
		if (Array.isArray(key)) {
			innerSelectors = [];

			// eslint-disable-next-line array-callback-return
			key.map((k) => {
				innerSelectors.push({ ...s, ...{ key: k } });
			});
		}

		// eslint-disable-next-line array-callback-return
		innerSelectors.map((selector, index) => {
			const elementValue = getTargetValue(selector);
			allObj.elements.push(getTargetValue(selector));
			if (selector.useAsStartup && index === 0) {
				allObj.startupValue = elementValue;
			}
		});
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
