import { parseTableElementId } from '.';
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
	 * Get all values of a column in data table.
	 *
	 * @param {string} columnId data table column id
	 * @return {Array} all values related to that column
	 */
	const getColumnValues = (columnId) => {
		return this.currentValues.reduce((carry, row) => {
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
					const values = getColumnValues(colBinding);
					maxValue = values.length;
				}
			});

			return Math.max(maxValue, carry);
		}, 1);
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

		const rowElements = Array.from(clonedRow.querySelectorAll('.wptb-ph-element'));

		// eslint-disable-next-line array-callback-return
		rowElements.map((tableElement) => {
			// TODO [erdembircan] apply bind data value to table element if there is any
		});

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
