import { parseTableElementId, parseElementType } from '.';
/**
 * Data table generator for frontend usage.
 *
 * @class
 */
function DataTableGenerator() {
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
	 * Get id of a data column from index.
	 *
	 * @param {number} index column index
	 * @return {string} column id
	 */
	const getColumnIdFromIndex = (index) => {
		return this.currentValues[0].values[index].colId;
	};

	/**
	 * Get all values of a column in data table.
	 *
	 * @param {string} columnId data table column id
	 * @return {Array} all values related to that column
	 */
	const getColumnValues = (columnId) => {
		return this.currentValues.reduce((carry, row) => {
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
	 * @return {null|string} column value, null if none found on index or column id
	 */
	const getColumnValueByIndex = (index, columnId) => {
		const columnValues = getColumnValues(columnId);

		let value = null;
		if (columnValues) {
			if (columnValues[index]) {
				value = columnValues[index];
			}
		}

		return value;
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
	 * Get binding with a specific id.
	 *
	 * @param {string} id id for the target binding
	 * @param {string|null} type binding type, null for none
	 */
	const getBinding = (id, type) => {
		if (this.currentBindings[type]) {
			return this.currentBindings[type][id];
		}

		return null;
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
			binding = getBinding(elementId, type);
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
			binding = getBinding(rowId, 'row');
		}

		return binding;
	};

	/**
	 * Calculate maximum amount of rows that can be populated from a blueprint row.
	 *
	 * @param {HTMLElement} rowElement row element
	 */
	const calculateMaxRows = (rowElement) => {
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
							const values = getColumnValues(binding);
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

		valueApplyList[tableElementType](tableElement, elementValue);
	};

	/**
	 * Batch populate table elements with their assigned binding values.
	 *
	 * @param {Array} tableElements an array of table elements
	 * @param {number} rowIndex index of current row this table elements belongs to
	 */
	const batchPopulateTableElements = (tableElements, rowIndex) => {
		// eslint-disable-next-line array-callback-return
		tableElements.map((tableElement) => {
			const bindingColIdObject = getTableElementBinding(tableElement, 'column');
			if (bindingColIdObject) {
				const value = {};

				// eslint-disable-next-line array-callback-return
				Object.keys(bindingColIdObject).map((key) => {
					if (Object.prototype.hasOwnProperty.call(bindingColIdObject, key)) {
						value[key] = getColumnValueByIndex(rowIndex, bindingColIdObject[key]);
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

			// eslint-disable-next-line array-callback-return
			cells.map((cell, cellIndex) => {
				const cellTableElements = getTableElementsFromCell(cell);

				// get column value based on the index of the cell
				const currentColumnId = getColumnIdFromIndex(cellIndex);
				const columnValue = getColumnValueByIndex(rowIndex, currentColumnId);

				// eslint-disable-next-line array-callback-return
				cellTableElements.map((tableElement) => {
					if (columnValue) {
						addValueToTableElement(tableElement, columnValue, { default: ['text'], button: ['link'] });
					}
				});
			});
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
		if (rowBinding && rowBinding.mode && rowBinding.mode === 'auto') {
			applyRowBindings('auto', clonedRow, index);
		} else {
			const rowElements = getTableElementsFromRow(clonedRow);
			batchPopulateTableElements(rowElements, index);
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
		this.currentBindings = bindings;
		this.currentValues = values;
		return new Promise((res) => {
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

			return res(clonedTable);
		});
	};
}

/** @module DataTableGenerator */
export default new DataTableGenerator();
