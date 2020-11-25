/**
 * Data table generator for frontend usage.
 *
 * @class
 */
function DataTableGenerator() {
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
	 * Populate a blueprint row.
	 *
	 * @param {HTMLElement} row blueprint row
	 * @param {Object} bindings bindings
	 * @param {Object} values values
	 * @return {Array} populated blueprint rows
	 */
	const populateBlueprint = (row, bindings, values) => {
		return [row];
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
