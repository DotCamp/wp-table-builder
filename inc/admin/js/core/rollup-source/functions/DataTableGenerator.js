/**
 * UMD for data table generator.
 *
 * @param {string} key property name to assign to context
 * @param {Object} context context object
 * @param {Function} factory factory function
 */
(function assignToGlobal(key, context, factory) {
	if (typeof module !== 'undefined' && typeof exports === 'object') {
		module.exports = factory();
	}
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_DataTableGenerator', self || global, () => {
	/**
	 * Default mappings for element value binds.
	 *
	 * @type {Object}
	 */
	const defaultMappings = {
		default: ['text'],
		button: ['link'],
		star_rating: ['rating'],
		image: ['link'],
		circle_rating: ['percentage'],
		icon: ['icon'],
	};

	/**
	 * Deep merge object.
	 *
	 * @param {Object} source source object
	 * @param {Object} target target object
	 * @return {Object} merged object
	 */
	// eslint-disable-next-line import/prefer-default-export
	const objectDeepMerge = (source, target) => {
		// eslint-disable-next-line array-callback-return
		Object.keys(target).map((k) => {
			if (Object.prototype.hasOwnProperty.call(target, k)) {
				if (Object.prototype.hasOwnProperty.call(source, k)) {
					if (typeof source[k] === 'object') {
						// eslint-disable-next-line no-param-reassign
						source[k] = { ...source[k], ...target[k] };
					} else {
						// eslint-disable-next-line no-param-reassign
						source[k] = target[k];
					}
				}
			}
		});

		return source;
	};

	/**
	 * Get element id from a table element's class.
	 *
	 * @param {HTMLElement} tableElement table element
	 * @return {null|string} null if no id is found
	 */
	const parseTableElementId = (tableElement) => {
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
	const parseElementType = (tableElement) => {
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

	/**
	 * Operator type.
	 *
	 * @param {Object} options options object
	 * @param {Object} dataManager data manager instance
	 * @param {Object} factoryContext operator factory context
	 * @class
	 */
	function OperatorType(options, dataManager, factoryContext) {
		const defaultOptions = {
			name: 'default',
			methods: {
				/**
				 *
				 * @param {Object} bindingOptions an object of row binding options
				 * @return {number} maximum amount of rows this operator will generate.
				 */
				// eslint-disable-next-line no-unused-vars
				calculateMaxRows(bindingOptions) {
					return sliceResult(this.getOperatorResult(bindingOptions), bindingOptions).length;
				},
				/**
				 * Get operator result values.
				 *
				 * @param {Object} operatorOptions operator options to use
				 * @return {Array} generated values array based on operator
				 */
				// eslint-disable-next-line no-unused-vars
				getOperatorResult(operatorOptions) {
					return [];
				},
			},
		};

		// merge default options with the supplied ones
		this.options = objectDeepMerge(defaultOptions, options);

		// data manager
		this.dataManager = dataManager;

		// factory context
		this.factory = factoryContext;

		/**
		 * Raise option methods to instance context to use context related properties.
		 */
		const upliftMethodsToInstanceContext = () => {
			// eslint-disable-next-line array-callback-return
			Object.keys(this.options.methods).map((method) => {
				if (Object.prototype.hasOwnProperty.call(this.options.methods, method)) {
					this[method === 'getOperatorResult' ? 'innerOperatorResult' : method] = this.options.methods[
						method
					].bind(this);
				}
			});
		};

		/**
		 * Slice operator results according to demanded row amounts.
		 *
		 * @param {Array} results operator results
		 * @param {{rowAmount, rowCustomAmount}} options object
		 * @return {Array} sliced results array
		 */
		const sliceResult = (results, { rowAmount, rowCustomAmount }) => {
			const sliceAmount =
				// eslint-disable-next-line no-nested-ternary
				rowAmount === 'all'
					? results.length
					: rowCustomAmount > results.length
					? results.length
					: rowCustomAmount;

			return results.slice(0, sliceAmount);
		};

		/**
		 * Get operator process results.
		 *
		 * @param {Object} options options object
		 * @return {Array} final operator results
		 */
		// eslint-disable-next-line no-shadow
		this.getOperatorResult = (options) => {
			// eslint-disable-next-line prefer-spread
			// return sliceResult(this.innerOperatorResult(options), options);
			return this.innerOperatorResult(options);
		};

		upliftMethodsToInstanceContext();
	}

	/**
	 * Highest/lowest operator options.
	 *
	 * @type {Object}
	 */
	const highestLowest = {
		methods: {
			getOperatorResult({ compareColumn, operatorType }) {
				const newValuesArray = this.dataManager.getValues();
				newValuesArray.sort((a, b) => {
					const aVal = Number.parseFloat(this.dataManager.getColumnValueByIndex(0, compareColumn, [a]));
					const bVal = Number.parseFloat(this.dataManager.getColumnValueByIndex(0, compareColumn, [b]));

					return (aVal - bVal) * (operatorType === 'highest' ? -1 : 1);
				});

				return [newValuesArray[0]];
			},
		},
	};

	/**
	 * Common operator object for than operators.
	 *
	 * @type {Object}
	 */
	const thanOperators = {
		methods: {
			getOperatorResult({ compareColumn, operatorType, thanAmount }) {
				return this.dataManager.getValues().filter((row) => {
					const comparedColumnVal = Number.parseFloat(
						this.dataManager.getColumnValueByIndex(0, compareColumn, [row])
					);
					const parsedThanAmount = Number.parseFloat(thanAmount);

					return operatorType === 'higher'
						? comparedColumnVal > parsedThanAmount
						: comparedColumnVal < parsedThanAmount;
				});
			},
		},
	};

	/**
	 * Operator type options that will be used to generator operators in operator factory.
	 *
	 * @type {Object}
	 */
	const operatorTypeOptions = {
		highest: highestLowest,
		lowest: highestLowest,
		not: {
			methods: {
				notOperation(options) {
					const notOperator = options.operatorType2;
					const notOperatorOptions = { ...options, operatorType: notOperator };

					// execute second operator process to find generated rows for that operator
					const notOperationValues = this.factory
						.getOperator(notOperator)
						.getOperatorResult(notOperatorOptions)[0];

					const dataRowId = notOperationValues.rowId;

					// filter out rows generated by second operator process to perform not operation
					return this.dataManager.getValues().filter((row) => {
						return row.rowId !== dataRowId;
					});
				},
				getOperatorResult(options) {
					return this.notOperation(options);
				},
			},
		},
		higher: thanOperators,
		lower: thanOperators,
		equal: {
			methods: {
				getOperatorResult({ compareColumn, equalAmount }) {
					return this.dataManager.getValues().filter((row) => {
						return this.dataManager.getColumnValueByIndex(0, compareColumn, [row]) === equalAmount;
					});
				},
			},
		},
	};

	/**
	 * Operator factory for easy operator functions.
	 *
	 * @param {Object} operatorOptions individual operator options.
	 * @param {Object} dataManager DataManager instance
	 * @class
	 */
	function OperatorFactory(operatorOptions, dataManager) {
		/**
		 * Operator type instances.
		 *
		 * Operator name will be used as key and its instance will be used at its value.
		 * This object will be populated with instances based on OperatorType object at factory instance generation.
		 *
		 * @type {Object}
		 */
		let operatorTypeInstances = {};

		/**
		 * Get operator type instance.
		 *
		 * @param {string} operatorName operator name
		 * @return {Object} operator type instance
		 */
		this.getOperator = (operatorName) => {
			return operatorTypeInstances[operatorName];
		};

		/**
		 * Create operator type instances.
		 */
		const createOperators = () => {
			operatorTypeInstances = {};

			// eslint-disable-next-line array-callback-return
			Object.keys(operatorOptions).map((optionName) => {
				if (Object.prototype.hasOwnProperty.call(operatorOptions, optionName)) {
					operatorTypeInstances[optionName] = new OperatorType(
						{
							name: optionName,
							...operatorOptions[optionName],
						},
						dataManager,
						this
					);
				}
			});
		};

		/**
		 * Operator factory startup hook
		 */
		const startUp = () => {
			createOperators();
		};

		// start operator factory initialization
		startUp();
	}

	/**
	 * Data manager for various data operations.
	 *
	 * @param {Array} values values array
	 * @param {Object} bindings bindings object
	 * @class
	 */
	function DataManager(values = [], bindings = {}) {
		let innerValues = values;
		let innerBindings = bindings;

		/**
		 * Update values.
		 *
		 * @param {Array} newValues new values array
		 */
		this.updateValues = (newValues) => {
			innerValues = newValues;
		};

		/**
		 * Update bindings.
		 *
		 * @param {Object} newBindings
		 */
		this.updateBindings = (newBindings) => {
			innerBindings = newBindings;
		};

		/**
		 * Get id of a data column from index.
		 *
		 * @param {number} index column index
		 * @return {string} column id
		 */
		this.getColumnIdFromIndex = (index) => {
			return innerValues[0].values[index]?.colId;
		};

		/**
		 * Get all values of a column in data table.
		 *
		 * @param {string} columnId data table column id
		 * @param {Array} customValues custom values to use
		 * @return {Array} all values related to that column
		 */
		this.getColumnValues = (columnId, customValues = null) => {
			const valuesToUse = customValues || innerValues;
			return valuesToUse.reduce((carry, row) => {
				// eslint-disable-next-line array-callback-return
				row.values.map((cell) => {
					if (cell.colId === columnId) {
						carry.push(cell.value);
					}
				});

				return carry;
			}, []);
		};

		/**
		 * Get a column value by index.
		 *
		 * @param {number} index index
		 * @param {string} columnId column id
		 * @param {Array} customValues custom value array, is supplied values will be selected from here instead of store values
		 * @return {null|string} column value, null if none found on index or column id
		 */
		this.getColumnValueByIndex = (index, columnId, customValues = null) => {
			const columnValues = this.getColumnValues(columnId, customValues);

			let value = null;
			if (columnValues) {
				if (columnValues[index]) {
					value = columnValues[index];
				}
			}

			return value;
		};

		/**
		 * Get a row object by its id.
		 *
		 * @param {string} rowId row id
		 * @return {Object} row object
		 */
		this.getRowById = (rowId) => {
			return innerValues.filter((row) => row.rowId === rowId)[0];
		};

		/**
		 * Get binding with a specific id.
		 *
		 * @param {string} id id for the target binding
		 * @param {string|null} type binding type, null for none
		 */
		this.getBinding = (id, type) => {
			if (innerBindings[type]) {
				return innerBindings[type][id];
			}

			return null;
		};

		/**
		 * Get values of data manager.
		 * This function will return immutable version of values.
		 *
		 * @return {Array} values array
		 */
		this.getValues = () => {
			return Array.from(innerValues);
		};

		/**
		 * Get values of a data row from its index.
		 *
		 * @param {number} rowIndex row index
		 * @return {Array} row values
		 */
		this.getRowValuesByIndex = (rowIndex) => {
			return Array.from(innerValues)[rowIndex];
		};
	}

	/**
	 * Data table generator for frontend usage.
	 *
	 * @class
	 */
	function DataTableGenerator() {
		/**
		 * Data manager instance
		 *
		 * @type {Object}
		 */
		this.dataManager = {
			_dataManager: null,
			get instance() {
				/* eslint-disable no-underscore-dangle */
				if (!this._dataManager) {
					this._dataManager = new DataManager();
				}

				return this._dataManager;
				/* eslint-enable no-underscore-dangle */
			},
		};

		/**
		 * Operator factory instance.
		 *
		 * @type {Object}
		 */
		this.operatorFactory = new OperatorFactory(operatorTypeOptions, this.dataManager.instance);

		/**
		 * Update data manager instance.
		 *
		 * @param {Array} values values array
		 * @param {Object} bindings bindings object
		 */
		this.updateDataManager = (values = [], bindings = {}) => {
			this.dataManager.instance.updateValues(values);
			this.dataManager.instance.updateBindings(bindings);
		};

		/**
		 * Current bindings to be used for current generate process.
		 *
		 * @type {Object}
		 */
		this.currentBindings = {};

		/**
		 * Current values to be used for current generate process.
		 *
		 * @type {Object}
		 */
		this.currentValues = {};

		/**
		 * Parse target element into its cells and rows.
		 *
		 * @param {HTMLElement} table table element to be parsed
		 */
		const parseTable = (table) => {
			return Array.from(table.querySelectorAll('tr'));
		};

		/**
		 * Clear table body contents of a table.
		 *
		 * @param {HTMLElement} table table to be cleared
		 */
		const clearTable = (table) => {
			// eslint-disable-next-line no-param-reassign
			table.querySelector('tbody').innerHTML = '';
		};

		/**
		 * Get data table related id of a row element.
		 *
		 * @param {HTMLElement} rowElement row element
		 * @return {string|null} row element id, null if no id found
		 */
		const getRowId = (rowElement) => {
			return rowElement.dataset.dataTableRowId;
		};

		/**
		 * Get binding of a table element.
		 *
		 * @param {HTMLElement} tableElement table element
		 * @param {string} type binding type
		 * @return {null | string} binding
		 */
		const getTableElementBinding = (tableElement, type) => {
			const elementId = parseTableElementId(tableElement);
			let binding = null;

			if (elementId) {
				binding = this.dataManager.instance.getBinding(elementId, type);
			}

			return binding;
		};

		/**
		 * Get associated row binding for the given row element.
		 *
		 * @param {HTMLElement} rowElement row element
		 * @return {Object|null} binding for supplied row, null if no binding found
		 */
		const getRowBinding = (rowElement) => {
			const rowId = getRowId(rowElement);

			let binding = null;

			if (rowId) {
				binding = this.dataManager.instance.getBinding(rowId, 'row');
			}

			return binding;
		};

		/**
		 * Calculate maximum amount of rows that can be populated from a blueprint row.
		 *
		 * @param {HTMLElement} rowElement row element
		 */
		const calculateMaxRows = (rowElement) => {
			const rowBindingMode = getRowBinding(rowElement)?.mode;

			// if row binding mode is not defined for the row element, use auto as default
			if (rowBindingMode === 'auto' || !rowBindingMode) {
				return this.currentValues.length;
			}
			// max row calculations for operator mode
			if (rowBindingMode === 'operator') {
				const rowBindingOperatorObject = getRowBinding(rowElement).operator;

				return this.operatorFactory
					.getOperator(rowBindingOperatorObject.operatorType)
					?.calculateMaxRows(rowBindingOperatorObject);
			}

			const cells = Array.from(rowElement.querySelectorAll('td'));

			return cells.reduce((carry, cell) => {
				const tableElements = Array.from(cell.querySelectorAll('.wptb-ph-element'));

				// max amount of column values can be applied to this cell
				let maxValue = 0;
				// eslint-disable-next-line array-callback-return
				tableElements.map((element) => {
					const colBinding = getTableElementBinding(element, 'column');

					if (colBinding) {
						maxValue = Object.keys(colBinding)
							// TODO [erdembircan] rewrite this with filter > map
							// eslint-disable-next-line array-callback-return
							.map((key) => {
								if (Object.prototype.hasOwnProperty.call(colBinding, key)) {
									return colBinding[key];
								}
							})
							// eslint-disable-next-line no-shadow
							.reduce((carry, binding) => {
								const values = this.dataManager.instance.getColumnValues(binding);
								return Math.max(values.length, carry);
							}, 0);
					}
				});

				return Math.max(maxValue, carry);
			}, 1);
		};

		/**
		 * Value apply list for different table elements.
		 *
		 * @type {Object}
		 */
		const valueApplyList = {
			text: (tableElement, value) => {
				const { text } = value;
				if (text) {
					const pElement = tableElement.querySelector('p');
					// since tinyMCE wraps text content with native font style elements, should be applying text value to first child node of paragraph element
					pElement.childNodes[0].textContent = value.text;
				}
			},
			button: (tableElement, value) => {
				const { text, link } = value;
				if (text) {
					const pElement = tableElement.querySelector('p');
					// since tinyMCE wraps text content with native font style elements, should be applying text value to first child node of paragraph element
					pElement.childNodes[0].textContent = value.text;
				}
				if (link) {
					const anchorElement = tableElement.querySelector('a');
					if (anchorElement) {
						anchorElement.href = link;
					}
				}
			},
			star_rating: (tableElement, { rating }) => {
				if (rating) {
					const maxStarCount = Number.parseInt(tableElement.dataset.starCount, 10);
					const parsedValue = Number.parseFloat(rating);

					// limit star rating between maximum stars available on element and current rating
					const limitedRating = Math.min(maxStarCount, parsedValue);
					const roundedRating = Math.floor(limitedRating);

					const emptyStars = Array.from(tableElement.querySelectorAll('li.wptb-rating-star'));

					const fullStars = Array.from(tableElement.querySelectorAll('li.wptb-rating-star')).filter(
						(star, index) => {
							// clear any star rating on rating element
							star.classList.remove('wptb-rating-star-selected-full');
							star.classList.remove('wptb-rating-star-selected-half');

							return index < roundedRating;
						}
					);

					// eslint-disable-next-line array-callback-return
					fullStars.map((star) => {
						star.classList.add('wptb-rating-star-selected-full');
					});

					// add any remaining half star
					if (roundedRating !== limitedRating) {
						emptyStars[fullStars.length].classList.add('wptb-rating-star-selected-half');
					}
				}
			},
			image: (tableElement, { link }) => {
				if (link) {
					let imageElement = tableElement.querySelector('img');
					if (!imageElement) {
						imageElement = document.createElement('img');
						const imageParentAnchor = tableElement.querySelector('a');
						imageParentAnchor.innerHTML = '';

						imageParentAnchor.appendChild(imageElement);
						imageElement.width = 200;
						imageElement.height = 200;
					}

					imageElement.src = link;
				}
			},
			circle_rating: (tableElement, { percentage }) => {
				if (percentage) {
					// eslint-disable-next-line no-param-reassign
					tableElement.dataset.percentageCount = percentage;

					// eslint-disable-next-line no-param-reassign
					tableElement.querySelector('.wptb-rating-circle-wrapper span').textContent = `${percentage}%`;

					const circleSlice = tableElement.querySelector('.wptb-rating-circle-slice');

					circleSlice.style.clip =
						percentage <= 50 ? 'rect(0em, 1em, 1em, 0.5em)' : 'rect(auto, auto, auto, auto)';

					circleSlice.querySelector('.wptb-rating-circle-bar').style.transform = `rotate(${
						percentage > 50 ? 180 : 0
					}deg)`;

					// eslint-disable-next-line eqeqeq
					const limitedPercentage = Math.max(100, percentage) == percentage ? 100 : percentage;

					// eslint-disable-next-line no-param-reassign
					circleSlice.querySelector('.wptb-rating-circle-fill').style.transform = `rotate(${
						(360 / 100) * limitedPercentage
					}deg)`;
				}
			},
			text_icon_element: (tableElement, { text }) => {
				if (text) {
					const textElement = tableElement.querySelector('#wptbTextIconMainText');
					if (textElement) {
						textElement.textContent = text;
					}
				}
			},
			icon: (tableElement, { valueColumn }) => {
				if (valueColumn) {
					// TODO [erdembircan] icon element data generation
				}
			},
		};

		/**
		 * Add value to a table element.
		 *
		 * @param {HTMLElement} tableElement table element
		 * @param {*} value value
		 * @param {Object} mapper mapper object to map values to certain element properties
		 */
		const addValueToTableElement = (tableElement, value, mapper = null) => {
			const tableElementType = parseElementType(tableElement);

			let elementValue = value;

			if (mapper) {
				// decide which mapper object to use, if no mapper property is defined for current table element type, use default mapper object
				const mapperIndex = mapper[tableElementType] ?? mapper.default ?? ['text'];

				// create a new value object with mapped properties
				elementValue = {};
				// eslint-disable-next-line array-callback-return
				mapperIndex.map((mapIndex) => {
					elementValue[mapIndex] = value;
				});
			}

			if (valueApplyList[tableElementType]) {
				valueApplyList[tableElementType](tableElement, elementValue);
			}
		};

		/**
		 * Slice row data values according to its bindings.
		 *
		 * @param {Object} rowBindings row bindings
		 * @param {Array} rowValues row values
		 * @return {Array} sliced row data values
		 */
		const sliceRowDataValues = (rowBindings, rowValues) => {
			let slicedValues = rowValues;

			// null check for builder startup
			if (rowBindings && rowBindings.mode === 'operator') {
				const { rowAmount, rowCustomAmount } = rowBindings.operator;
				if (rowAmount === 'custom') {
					const sliceAmount = rowCustomAmount > rowValues.length ? rowValues.length : rowCustomAmount;
					slicedValues = slicedValues.slice(0, sliceAmount);
				}
			}

			return slicedValues;
		};

		/**
		 * Sort row data values.
		 *
		 * @param {Object} sortOptions options object
		 * @param {Array} rowValues row data values
		 * @return {Array} sorted row data values
		 */
		const sortRowDataValues = (sortOptions, rowValues) => {
			// immutable row value array
			const sortedValues = Array.from(rowValues);

			if (sortOptions) {
				const { sortType, sortDirection, sortTarget } = sortOptions;

				if (sortType && sortDirection && sortType && sortTarget !== 'none') {
					// eslint-disable-next-line array-callback-return
					sortedValues.sort((a, b) => {
						let aVal = this.dataManager.instance.getColumnValueByIndex(0, sortTarget, [a]);
						let bVal = this.dataManager.instance.getColumnValueByIndex(0, sortTarget, [b]);

						// sorting direction constant
						const directionVal = sortDirection === 'asc' ? 1 : -1;

						// sort by numbers
						if (sortType === '123') {
							aVal = Number.parseFloat(aVal);
							bVal = Number.parseFloat(bVal);

							return (aVal - bVal) * directionVal;
						}

						// sort by letters
						if (aVal > bVal) {
							return directionVal;
						}
						if (bVal < aVal) {
							return -1 * directionVal;
						}
						return 0;
					});
				}
			}

			return sortedValues;
		};

		/**
		 * Batch populate table elements with their assigned binding values.
		 *
		 * @param {Array} tableElements an array of table elements
		 * @param {number} rowIndex index of current row this table elements belongs to
		 * @param {Object} rowBindings row bindings for the parent row of the supplied table elements
		 * @param {Array} customValues custom values to use for populate operation
		 * @param {Object} customBindings custom bindings to use instead of element and rows defined ones
		 */
		const batchPopulateTableElements = (
			tableElements,
			rowIndex,
			rowBindings,
			customValues = null,
			customBindings = null
		) => {
			const sortedValues = sliceRowDataValues(
				rowBindings,
				sortRowDataValues(rowBindings?.sort, customValues || this.dataManager.instance.getValues())
			);

			// eslint-disable-next-line array-callback-return
			tableElements.map((tableElement) => {
				const bindingColIdObject =
					customBindings?.column[parseTableElementId(tableElement)] ||
					getTableElementBinding(tableElement, 'column');

				if (bindingColIdObject) {
					const value = {};

					// eslint-disable-next-line array-callback-return
					Object.keys(bindingColIdObject).map((key) => {
						if (Object.prototype.hasOwnProperty.call(bindingColIdObject, key)) {
							value[key] = this.dataManager.instance.getColumnValueByIndex(
								rowIndex,
								bindingColIdObject[key],
								sortedValues
							);
						}
					});

					if (value) {
						addValueToTableElement(tableElement, value);
					}
				}
			});
		};

		/**
		 * Get table elements from a supplied row element.
		 *
		 * @param {HTMLElement} rowElement row element
		 * @return {Array} table element array
		 *
		 */
		const getTableElementsFromRow = (rowElement) => {
			return Array.from(rowElement.querySelectorAll('.wptb-ph-element'));
		};

		/**
		 * Get table elements from a supplied table cell.
		 *
		 * @param {HTMLElement} cellElement cell element
		 * @return {Array} table element array
		 *
		 */
		const getTableElementsFromCell = (cellElement) => {
			return Array.from(cellElement.querySelectorAll('.wptb-ph-element'));
		};

		/**
		 * Logic for different row bindings.
		 *
		 * @type {Object}
		 */
		const rowBindingLogicList = {
			auto: (rowElement, rowIndex) => {
				const cells = Array.from(rowElement.querySelectorAll('td'));

				const rowElements = [];
				const autoBindings = cells.reduce((carry, cell, cellIndex) => {
					const cellTableElements = getTableElementsFromCell(cell);

					// add cell elements to row elements array
					rowElements.push(...cellTableElements);

					// get column value based on the index of the cell
					const currentColumnId = this.dataManager.instance.getColumnIdFromIndex(cellIndex);

					// eslint-disable-next-line array-callback-return
					cellTableElements.map((tableElement) => {
						if (currentColumnId) {
							const elementId = parseTableElementId(tableElement);

							const elementBindings = {};
							const elementType = parseElementType(tableElement);

							const availableBindingProperties = defaultMappings[elementType] || defaultMappings.default;

							// map element bindings to default binding
							// eslint-disable-next-line array-callback-return
							availableBindingProperties.map((prop) => {
								elementBindings[prop] = currentColumnId;
							});

							// assign bindings relative to current cell this element resides in
							// eslint-disable-next-line no-param-reassign
							carry[elementId] = elementBindings;
						}
					});
					return carry;
				}, {});

				batchPopulateTableElements(rowElements, rowIndex, getRowBinding(rowElement), null, {
					column: autoBindings,
				});
			},
			operator: (rowElement, rowIndex) => {
				const rowBindings = getRowBinding(rowElement);
				const operatorOptions = rowBindings.operator;

				batchPopulateTableElements(
					getTableElementsFromRow(rowElement),
					rowIndex,
					rowBindings,
					this.operatorFactory.getOperator(operatorOptions.operatorType).getOperatorResult(operatorOptions)
				);
			},
		};

		/**
		 * Generate necessary data for table elements based on binding row mode
		 *
		 * @param {string} mode row binding mode type
		 * @param {HTMLElement} rowElement row element
		 * @param {number} rowIndex current row index
		 * @param {Object} modeOptions extra mode options if necessary
		 */
		const applyRowBindings = (mode, rowElement, rowIndex, modeOptions = {}) => {
			rowBindingLogicList[mode](rowElement, rowIndex, modeOptions);
		};

		/**
		 * Populate and generate a row element based on blueprint row.
		 *
		 * @param {number} index current index of row
		 * @param {HTMLElement} blueprintRow blueprint row element
		 * @return {HTMLElement} generated row
		 */
		const populateRow = (index, blueprintRow) => {
			const clonedRow = blueprintRow.cloneNode(true);

			const rowBinding = getRowBinding(clonedRow);

			// give priority to row auto mode over element column bindings
			if (rowBinding && rowBinding.mode && rowBinding.mode !== 'none') {
				applyRowBindings(rowBinding.mode, clonedRow, index);
			} else {
				const rowElements = getTableElementsFromRow(clonedRow);
				batchPopulateTableElements(rowElements, index, rowBinding);
			}

			return clonedRow;
		};

		/**
		 * Populate a blueprint row.
		 *
		 * @param {HTMLElement} row blueprint row
		 * @return {Array} populated blueprint rows
		 */
		const populateBlueprint = (row) => {
			const maxRows = calculateMaxRows(row);
			const populatedRows = [];
			for (let i = 0; i < maxRows; i += 1) {
				populatedRows.push(populateRow(i, row));
			}

			return populatedRows;
		};

		/**
		 * Generate a data table
		 *
		 * @param {HTMLElement} sourceTable source table to be generated with data
		 * @param {Object} bindings data bindings
		 * @param {Object} values data cell values
		 * @return {HTMLElement} generated data table
		 */
		this.generateDataTable = (sourceTable, bindings, values) => {
			this.updateDataManager(values, bindings);
			this.currentBindings = bindings;
			this.currentValues = values;

			const clonedTable = sourceTable.cloneNode(true);
			const tableBody = clonedTable.querySelector('tbody');

			const parsedRows = parseTable(clonedTable);
			clearTable(clonedTable);

			const populatedRows = parsedRows.reduce((carry, blueprintRow) => {
				const pR = populateBlueprint(blueprintRow);

				// eslint-disable-next-line no-param-reassign
				carry = [...carry, ...pR];

				return carry;
			}, []);

			populatedRows.map((r) => tableBody.appendChild(r));

			return clonedTable;
		};

		/**
		 * Prepare data table for frontend.
		 *
		 * @param {HTMLElement} targetTable target table
		 */
		const prepareFrontendTable = (targetTable) => {
			// parse data table options from table dataset
			const dataTableOptions = JSON.parse(atob(targetTable.dataset.wptbDataTableOptions));

		// TODO [erdembircan] remove for production
		console.log(dataTableOptions);

			const mainWrapper = targetTable.parentNode;
			// remove blueprint table from DOM
			targetTable.remove();

			// TODO [erdembircan] remove for production
			console.log(`Data rows: ${dataTableOptions.dataManager.tempData.parsedData.values.length}`);

			// only generate table if data values are present
			if (dataTableOptions.dataManager.tempData.parsedData.values.length > 0) {
				const generatedTable = this.generateDataTable(
					targetTable,
					dataTableOptions.dataManager.bindings,
					dataTableOptions.dataManager.tempData.parsedData.values
				);

				// add generated table as our new table to DOM
				mainWrapper.appendChild(generatedTable);
			} else {
				// remove all traces of table element from dom
				mainWrapper.parentNode.remove();
			}
		};

		/**
		 * Generate data tables for frontend.
		 */
		this.frontendGenerateTables = () => {
			const tables = Array.from(document.querySelectorAll('.wptb-preview-table[data-wptb-data-table="true"]'));
			tables.map((table) => prepareFrontendTable(table));
		};
	}

	return new DataTableGenerator();
});
