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
	 * Object implementation for cell element operations.
	 * If an empty cellElement parameter is given, a fresh cell element will be created.
	 *
	 * @param {HTMLElement | null} cellElement cell element
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

		this.createCellElement = () => {
			return document.createElement('td');
		};

		// create a new cell element if no cellElement argument is given with constructor function
		if (!cellElement) {
			this.element = this.createCellElement();
		}

		/**
		 * Add attribute to cell element.
		 *
		 * This function have the ability to add/remove attributes from cell element.
		 * All attributes modified with this function will be cached with their before value for an easy reset on demand.
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
				this.modifications[attributeKey] = undefined;
			}
		};

		/**
		 * Reset all modified attributes of cell element to their default values.
		 */
		this.resetAllAttributes = () => {
			// eslint-disable-next-line array-callback-return
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

		/**
		 * An array of created table rows elements that are id'd according to their index in array
		 * @type {[HTMLElement]}
		 */
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

			// eslint-disable-next-line no-console
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
			// eslint-disable-next-line no-console
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

		/**
		 * Append html element to a cached row.
		 *
		 * @param {HTMLElement} el element
		 * @param {number} rowId if of row in row cache
		 */
		this.appendElementToRow = (el, rowId) => {
			const cachedRow = this.getRow(rowId);

			if (el && cachedRow) {
				cachedRow.appendChild(el);
			}
		};

		this.parseTable();

		return {
			maxRows: this.maxRows,
			maxColumns: this.maxColumns,
			addRow: this.addRow,
			clearTable: this.clearTable,
			getCell: this.getCell,
			appendToRow: this.appendToRow,
			appendElementToRow: this.appendElementToRow,
			getCellsAtRow: this.getCellsAtRow,
			el: this.tableElement,
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
			// eslint-disable-next-line prefer-destructuring
			const topRowAsHeader = autoOption.topRowAsHeader;

			const cellsPerRow = autoOption.cellsPerRow[sizeRange];

			tableObj.clearTable();

			if (sizeRange === 'desktop') {
				this.buildDefault(tableObj);
				this.removeDefaultClasses(tableEl);
			} else {
				this.autoDirectionBuild(tableObj, direction, topRowAsHeader, cellsPerRow);
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
		 * @param {number} cellsPerRow cells per row
		 */
		this.autoDirectionBuild = (tableObj, direction, topRowAsHeader = false, cellsPerRow = 1) => {
			const rows = tableObj.maxRows();
			const columns = tableObj.maxColumns();
			const isRowStacked = direction === 'row';

			const rowStartIndex = topRowAsHeader ? 1 : 0;
			// const topRowCellCount = tableObj.getCellsAtRow(0).length;

			if (topRowAsHeader) {
				const headerId = tableObj.addRow('wptb-row').id;
				const maxColumns = tableObj.maxColumns();

				// in order for cell per row functionality to work at every number of cells (even/odd), will be wrapping the top row inside a table so that wrapper cell can be adjusted to colspan any
				const wrapperCell = new CellObject();
				tableObj.appendElementToRow(wrapperCell.getElement(), headerId);

				// because class, responsible for styling(in our case specifically padding) of cell elements are bound to parent child related class naming, all cell elements under main table is susceptible to a padding, which also includes our wrapper cell. because of this, resetting padding value of wrapper cell. in the future, if any layout defining style options are added in that way, reset them here too
				wrapperCell.setAttribute('style', 'padding:0px');

				// classes of main table element. this classes will be added to wrapper table to reflect the same styling options to header cells
				const mainTableClasses = tableObj.el.getAttribute('class');

				const tempTableRange = document.createRange();
				tempTableRange.setStart(wrapperCell.getElement(), 0);
				const tempTableStringified = `<table class="${mainTableClasses}"><tbody><tr></tr></tbody></table>`;
				const tempTable = tempTableRange.createContextualFragment(tempTableStringified).childNodes[0];

				// wrapper table style overrides
				tempTable.style.margin = 0;
				tempTable.style.width = '100%';

				wrapperCell.getElement().appendChild(tempTable);

				// add necessary colspan value to support 'cells per row' option with 'top row as header' option is enabled
				wrapperCell.setAttribute('colSpan', cellsPerRow);

				const tempWrapperRow = tempTable.querySelector('tr');
				for (let hc = 0; hc < maxColumns; hc += 1) {
					// const tempCell = tableObj.appendToRow(0, hc, headerId);
					const tempCell = tableObj.getCell(0, hc, true);
					if (tempCell) {
						tempWrapperRow.appendChild(tempCell.getElement());
						tempCell.resetAllAttributes();
						tempCell.setAttribute('style', 'width: 100%');
					}
				}
			}

			if (isRowStacked) {
				for (let r = rowStartIndex; r < rows; r += 1) {
					for (let c = 0; c < columns; c += cellsPerRow) {
						const rowId = tableObj.addRow('wptb-row').id;
						for (let pR = 0; pR < cellsPerRow; pR += 1) {
							const tempCell = tableObj.appendToRow(r, c + pR, rowId);
							if (tempCell) {
								tempCell.resetAllAttributes();
								tempCell.setAttribute('colSpan', 1);
								tempCell.setAttribute('rowSpan', 1);
							}
						}
					}
				}
			} else {
				for (let c = 0; c < columns; c += 1) {
					for (let r = rowStartIndex; r < rows; r += cellsPerRow) {
						const rowId = tableObj.addRow('wptb-row').id;
						const tempCell = tableObj.appendToRow(r, c, rowId);
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
					if (tempCell) {
						tempCell.resetAllAttributes();
					}
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
			if (!size) {
				// eslint-disable-next-line no-param-reassign
				size = window.innerWidth;
			}
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
