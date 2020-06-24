/**
 * Responsive class assignment for frontend operations.
 *
 * This file can be used as an UMD.
 */
(function assignToGlobal(key, context, factory) {
	if (typeof exports === 'object' && typeof module !== 'undefined') {
		module.exports = factory();
	} else {
		// eslint-disable-next-line no-param-reassign
		context[key] = factory();
	}
	// eslint-disable-next-line no-restricted-globals
})('WPTB_ResponsiveFrontend', self || global, () => {
	/**
	 * Object implementation for cell element operations
	 *
	 * @param {HTMLElement} cellElement cell element
	 * @constructor
	 */
	function CellObject(cellElement) {
		this.element = cellElement;
		this.modifications = {};

		/**
		 * Get cell element.
		 * @return {HTMLElement} cell element
		 */
		this.getElement = () => {
			return this.element;
		};

		/**
		 * Add attribute to cell element.
		 *
		 * This function have the ability to add/remove attributes from cell element.
		 *
		 * @param {string} attributeKey attribute name in camelCase format, for sub-keys, use dot object notation
		 * @param {any} attributeValue attribute value
		 */
		this.setAttribute = (attributeKey, attributeValue) => {
			let defaultVal = this.getElement()[attributeKey];
			if (this.modifications[attributeKey]) {
				defaultVal = this.modifications[attributeKey].default;
			}

			this.modifications[attributeKey] = { value: attributeValue, default: defaultVal };

			this.getElement()[attributeKey] = attributeValue;
		};

		/**
		 * Reset a modified attribute to its default value
		 *
		 * @param {string} attributeKey attribute name
		 */
		this.resetAttribute = (attributeKey) => {
			if (this.modifications[attributeKey]) {
				this.getElement()[attributeKey] = this.modifications[attributeKey].default;
				this.getElement()[attributeKey] = undefined;
			}
		};

		/**
		 * Reset all modified attributes of cell element to their default values.
		 */
		this.resetAllAttributes = () => {
			Object.keys(this.modifications).map((k) => {
				if (Object.prototype.hasOwnProperty.call(this.modifications, k)) {
					this.resetAttribute(k);
				}
			});
		};

		return {
			getElement: this.getElement,
			el: this.element,
			setAttribute: this.setAttribute,
			resetAllAttributes: this.resetAllAttributes,
		};
	}

	/**
	 * Object implementation for table element operations.
	 *
	 * @param {HTMLElement} tableEl table element
	 * @return {object} instance
	 * @constructor
	 */
	function TableObject(tableEl) {
		/**
		 * Table element
		 * @private
		 * @type {HTMLElement}
		 */
		this.tableElement = tableEl;

		/**
		 * Parsed table object.
		 *
		 * @private
		 * @type {array}
		 */
		this.parsedTable = [];

		this.rowCache = [];

		/**
		 * Assign table cells into row and column numbers
		 */
		this.parseTable = () => {
			const rows = Array.from(this.tableElement.querySelectorAll('tr'));

			// eslint-disable-next-line array-callback-return
			rows.map((r, ri) => {
				const cells = Array.from(r.querySelectorAll('td'));

				// eslint-disable-next-line array-callback-return
				cells.map((c) => {
					if (!this.parsedTable[ri]) {
						this.parsedTable[ri] = [];
					}

					this.parsedTable[ri].push(new CellObject(c));
				});
			});
		};

		/**
		 * Add a row to the table.
		 * @param {array} classList an array of class names to be added to row
		 */
		this.addRow = (classList) => {
			if (!Array.isArray(classList)) {
				// eslint-disable-next-line no-param-reassign
				classList = [classList];
			}

			const tableBody = this.tableElement.querySelector('tbody');

			const range = document.createRange();
			range.setStart(tableBody, 0);
			const tempRow = range.createContextualFragment(`<tr class="${classList.join(' ')}"></tr>`).childNodes[0];

			// add row to table body
			tableBody.appendChild(tempRow);

			// cache row for future use
			this.rowCache.push(tempRow);

			return { el: tempRow, id: this.rowCache.length - 1 };
		};

		/**
		 * Clear the contents of table element.
		 */
		this.clearTable = () => {
			// clear row cache
			this.rowCache = [];

			// clear children of `tbody` element
			this.tableElement.querySelector('tbody').innerHTML = '';
		};

		/**
		 * Get row element from cache.
		 *
		 * @param {number} id row id
		 * @return {null|HTMLElement} row element if present or null if not
		 */
		this.getRow = (id) => {
			if (this.rowCache[id]) {
				return this.rowCache[id];
			}

			console.warn(`[WPTB]: no row with id [${id}] found in the cache.`);
			return null;
		};

		/**
		 * Get maximum number of rows available at table.
		 *
		 * @return {number} maximum amount of rows
		 */
		this.maxRows = () => {
			return this.parsedTable.length;
		};

		/**
		 * Get the number of maximum available column count in the table.
		 *
		 * @return {number} maximum available column count
		 */
		this.maxColumns = () => {
			return this.parsedTable.reduce((p, c) => {
				if (c.length > p) {
					// eslint-disable-next-line no-param-reassign
					p = c.length;
				}

				return p;
			}, 0);
		};

		/**
		 * Get the table cell at specified row-column location.
		 *
		 * As in arrays, row and column numbering starts from number 0.
		 *
		 * @param {number} r row number
		 * @param {number} c column number
		 * @param {boolean} returnObject return object instead of HTMLElement
		 * @return {HTMLElement | null | CellObject} element if address is possible, null if not
		 */
		this.getCell = (r, c, returnObject = false) => {
			if (this.parsedTable[r][c]) {
				if (returnObject) {
					return this.parsedTable[r][c];
				}
				return this.parsedTable[r][c].el;
			}
			console.warn(`[WPTB]: no cell found at the given address of [${r}-${c}]`);
			return null;
		};

		/**
		 * Get cells at a given row.
		 *
		 * @param {number} rowId row id
		 * @return {array} cells in row
		 */
		this.getCellsAtRow = (rowId) => {
			const cells = [];
			for (let c = 0; c < this.maxColumns(); c += 1) {
				const tempCell = this.getCell(rowId, c);
				if (tempCell) {
					cells.push(tempCell);
				}
			}
			return cells;
		};

		/**
		 * Append the cell with given ids to a cached row
		 *
		 * @param {number} cellRowId cell row id
		 * @param {number} cellColumnId cell column id
		 * @param {number} rowId id of row in row cache
		 */
		this.appendToRow = (cellRowId, cellColumnId, rowId) => {
			const cachedRow = this.getRow(rowId);
			const cell = this.getCell(cellRowId, cellColumnId, true);

			if (cell && cachedRow) {
				cachedRow.appendChild(cell.getElement());
			}
			return cell;
		};

		this.parseTable();

		return {
			maxRows: this.maxRows,
			maxColumns: this.maxColumns,
			addRow: this.addRow,
			clearTable: this.clearTable,
			getCell: this.getCell,
			appendToRow: this.appendToRow,
			getCellsAtRow: this.getCellsAtRow,
		};
	}

	// default options for responsive class
	const responsiveClassDefaultOptions = {
		query: '.wptb-preview-table',
		defaultClasses: ['wptb-plugin-responsive-base'],
		bindToResize: false,
	};

	/**
	 * Class for handling operations related to responsive functionalities of tables.
	 *
	 * @constructor
	 * @param {object} options options object
	 */
	function ResponsiveFront(options = {}) {
		// merge default options with user sent options
		this.options = { ...responsiveClassDefaultOptions, ...options };

		this.elements = Array.from(document.querySelectorAll(this.options.query));

		this.elementObjects = this.elements.map((e) => {
			return {
				el: e,
				tableObject: new TableObject(e),
			};
		});

		/**
		 * Bind rebuilding of tables to window resize event.
		 */
		this.bindRebuildToResize = () => {
			window.addEventListener('resize', (e) => {
				this.rebuildTables(e.target.innerWidth);
			});
		};

		/**
		 * Get responsive directives of table element.
		 *
		 * @private
		 * @param {HTMLElement} el table element
		 * @return {object|null} JSON representation of the directive element, if not available, null will be returned
		 */
		this.getDirective = (el) => {
			const directiveString = el.dataset.wptbResponsiveDirectives;

			if (!directiveString) {
				return null;
			}

			return JSON.parse(atob(directiveString));
		};

		/**
		 * Add default classes to rebuilt tables.
		 *
		 * This classes are added to lay out a base style for the responsive table.
		 *
		 * @param {HTMLElement} el table element
		 */
		this.addDefaultClasses = (el) => {
			el.classList.add(this.options.defaultClasses);
		};

		/**
		 * Remove default classes from target table.
		 * @param {HTMLElement} el table element
		 */
		this.removeDefaultClasses = (el) => {
			el.classList.remove(this.options.defaultClasses);
		};

		/**
		 * Rebuild table in auto mode.
		 *
		 * Main characteristic of auto mode is table is rebuilt by stacking rows/columns on top of each other, leaving minimal effort from user to create a responsive table at breakpoints.
		 *
		 * @param {HTMLElement} tableEl table element
		 * @param {string} sizeRange range id for current screen size
		 * @param {object} autoOption mode options
		 * @param {TableObject} tableObj table object
		 */
		this.autoBuild = (tableEl, sizeRange, autoOption, tableObj) => {
			const direction = autoOption.cellStackDirection;
			const { topRowAsHeader } = autoOption;

			tableObj.clearTable();

			if (sizeRange === 'desktop') {
				this.buildDefault(tableObj);
				this.removeDefaultClasses(tableEl);
			} else {
				this.autoDirectionBuild(tableObj, direction, topRowAsHeader);
				this.addDefaultClasses(tableEl);
			}
		};

		/**
		 * Rebuild table with a direction to read cells.
		 *
		 * Direction in question in here is either by row or column:
		 * * row: cells will be read row by row, in each row starting from the first column
		 * * column: cells will be read column by column, in each column starting from the first row of the table
		 *
		 * @param {TableObject} tableObj table object
		 * @param {string} direction direction to read cells
		 * @param {boolean} topRowAsHeader use top row as header
		 */
		this.autoDirectionBuild = (tableObj, direction, topRowAsHeader = false) => {
			const rows = tableObj.maxRows();
			const columns = tableObj.maxColumns();
			const isRowStacked = direction === 'row';

			const rowStartIndex = topRowAsHeader ? 1 : 0;
			const topRowCellCount = tableObj.getCellsAtRow(0).length;

			if (topRowAsHeader) {
				const headerId = tableObj.addRow('wptb-row').id;
				const maxColumns = tableObj.maxColumns();

				for (let hc = 0; hc < maxColumns; hc += 1) {
					const tempCell = tableObj.appendToRow(0, hc, headerId);
					tempCell.resetAllAttributes();
				}
			}

			// TODO [erdembircan] this algorithm can be simplified, but don't do it until a future feature is added to this build function, this way, till that comes, this class can be debugged much easily and will be much more easy to read and understand
			if (isRowStacked) {
				for (let r = rowStartIndex; r < rows; r += 1) {
					for (let c = 0; c < columns; c += 1) {
						const rowId = tableObj.addRow('wptb-row').id;
						const tempCell = tableObj.appendToRow(r, c, rowId);
						tempCell.resetAllAttributes();
						if (topRowAsHeader) {
							tempCell.setAttribute('colSpan', topRowCellCount);
						}
					}
				}
			} else {
				for (let c = 0; c < columns; c += 1) {
					for (let r = rowStartIndex; r < rows; r += 1) {
						const rowId = tableObj.addRow('wptb-row').id;
						const tempCell = tableObj.appendToRow(r, c, rowId);
						tempCell.resetAllAttributes();
						if (topRowAsHeader) {
							tempCell.setAttribute('colSpan', topRowCellCount);
						}
					}
				}
			}
		};

		/**
		 * Build table in its default form.
		 *
		 * Default form of table is the layout it has in desktop breakpoint.
		 *
		 * @param {TableObject} tableObj table object
		 */
		this.buildDefault = (tableObj) => {
			const rows = tableObj.maxRows();
			const columns = tableObj.maxColumns();

			for (let r = 0; r < rows; r += 1) {
				const rowId = tableObj.addRow('wptb-row').id;
				for (let c = 0; c < columns; c += 1) {
					const tempCell = tableObj.appendToRow(r, c, rowId);
					// reset all modified attributes of cell to their default values
					tempCell.resetAllAttributes();
				}
			}
		};

		/**
		 * Calculate range id for given size value.
		 *
		 * @param {number} val value
		 * @param {object} stops an object containing stop ids as keys and respective sizes as values
		 * @return {string} range id
		 */
		this.calculateRangeId = (val, stops) => {
			// eslint-disable-next-line prefer-destructuring
			const sortedStops = Object.keys(stops).sort((a, b) => stops[a].width - stops[b].width);

			let rangeId = sortedStops[0];

			// eslint-disable-next-line array-callback-return
			sortedStops.map((s) => {
				if (val >= stops[s].width) {
					rangeId = s;
				}
			});

			return rangeId;
		};

		/**
		 * Rebuild table according to its responsive directives.
		 *
		 * @private
		 * @param {HTMLElement} el table element
		 * @param {number} size size in pixels
		 * @param {TableObject} tableObj table object instance
		 */
		this.rebuildTable = (el, size, tableObj) => {
			const directive = this.getDirective(el);

			if (directive) {
				if (!directive.responsiveEnabled) {
					this.buildDefault(tableObj);
					return;
				}

				const mode = directive.responsiveMode;

				// main build logic for different responsive modes should be named in the format of `{modeName}Build` to automatically call the associated function from here
				const buildCallable = this[`${mode}Build`];

				if (!size) {
					// eslint-disable-next-line no-param-reassign
					size = el.getBoundingClientRect().width;
				}

				const sizeRangeId = this.calculateRangeId(size, directive.breakpoints);

				if (buildCallable) {
					const modeOptions = directive.modeOptions[mode];
					buildCallable.call(this, el, sizeRangeId, modeOptions, tableObj);
				} else {
					throw new Error(`No build mode named as [${mode}] found.`);
				}
			}
		};

		/**
		 * Rebuild tables with the given screen size.
		 *
		 * @param {number} size screen size
		 */
		this.rebuildTables = (size) => {
			// eslint-disable-next-line array-callback-return
			this.elementObjects.map((o) => {
				this.rebuildTable(o.el, size, o.tableObject);
			});
		};

		if (this.options.bindToResize) {
			this.bindRebuildToResize();
		}

		return { rebuildTables: this.rebuildTables };
	}

	return ResponsiveFront;
});
