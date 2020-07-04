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
	 * Log a message to console.
	 *
	 * @param {string} message message to be logged
	 * @param {string} type console log type (e.g info, warn, error)
	 */
	function logToConsole(message, type = 'log') {
		if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
			if (console[type]) {
				console[type](`[WPTB]: ${message}`);
			} else {
				throw new Error(`no logging type found with given type value of [${type}]`);
			}
		}
	}

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
		 * @param {boolean} append append the value or replace it
		 * @param {string} glue glue to join attribute value if append option is enabled
		 */
		this.setAttribute = (attributeKey, attributeValue, append = false, glue = ',') => {
			let defaultVal = this.getElement()[attributeKey];

			// if attribute value is a function or an object, it means we pulled a whole declaration instead of only inline attribute values, in that case, use getAttribute to get only inline values related to that attribute
			if (typeof defaultVal === 'function' || typeof defaultVal === 'object') {
				defaultVal = this.getElement().getAttribute(attributeKey);
			}

			// if there is already a default value defined, use that instead
			if (this.modifications[attributeKey]) {
				defaultVal = this.modifications[attributeKey].default;
			}

			let currentVal = defaultVal;

			// join attributes
			if (append) {
				currentVal += `${currentVal}${glue}${attributeValue}`;
			} else {
				currentVal = attributeValue;
			}

			this.modifications[attributeKey] = { value: currentVal, default: defaultVal };

			this.getElement()[attributeKey] = currentVal;
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
		 * Table element.
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
		 * An array of created table rows elements that are id'd according to their index in array.
		 * @type {[HTMLElement]}
		 */
		this.rowCache = [];

		/**
		 * Original table elements minus the cells.
		 * @type {{rows: []}}
		 * @private
		 */
		this.originals = { rows: [] };

		/**
		 * Row colors of original table.
		 * @type {{even: string, header: string, odd: string}}
		 * @private
		 */
		this.rowColors = {
			header: null,
			even: null,
			odd: null,
		};

		/**
		 * Assign table cells into row and column numbers.
		 * @private
		 */
		this.parseTable = () => {
			const rows = Array.from(this.tableElement.querySelectorAll('tr'));

			// eslint-disable-next-line array-callback-return
			rows.map((r, ri) => {
				// cache original rows for future use
				this.originals.rows.push(r);

				const cells = Array.from(r.querySelectorAll('td'));

				// eslint-disable-next-line array-callback-return
				cells.map((c) => {
					if (!this.parsedTable[ri]) {
						this.parsedTable[ri] = [];
					}

					this.parsedTable[ri].push(new CellObject(c));
				});
			});
			this.parseRowColors(rows);
		};

		/**
		 * Parse row colors of original table for futures uses.
		 * @param {[HTMLElement]} rows html row elements
		 * @private
		 */
		this.parseRowColors = (rows) => {
			if (!rows || rows.length <= 0) {
				logToConsole('no rows are found to parse their colors', 'error');
			}

			const headerRowColor = rows[0].style.backgroundColor === '' ? null : rows[0].style.backgroundColor;

			// header row color
			this.rowColors.header = headerRowColor;

			// eslint-disable-next-line no-nested-ternary
			// calculate needed number of rows to get even and odd row background colors
			const rowsNeeded = rows.length / 3 >= 1 ? 0 : rows.length === 1 ? 2 : (rows.length - 1) % 2;

			// create additional rows and add them to table to get their row background colors since table row count may be lower to get even/odd rows
			for (let rn = 0; rn < rowsNeeded; rn += 1) {
				const tempRow = document.createElement('tr');

				this.tableElement.querySelector('tbody').appendChild(tempRow);
				rows.push(tempRow);
			}

			// even & odd row colors
			this.rowColors.even = getComputedStyle(rows[1]).backgroundColor;
			this.rowColors.odd = getComputedStyle(rows[2]).backgroundColor;

			// remove created rows from DOM
			for (let r = 0; r < rowsNeeded; r += 1) {
				rows[rows.length - (r + 1)].remove();
			}
		};

		/**
		 * Add a row to the table.
		 * @param {array} classList an array of class names to be added to row
		 * @param {boolean} fromOriginals use rows from original table instead of creating a new one
		 * @param {number} originalIndex original row index
		 */
		this.addRow = (classList, fromOriginals = false, originalIndex = 0) => {
			if (!Array.isArray(classList)) {
				// eslint-disable-next-line no-param-reassign
				classList = [classList];
			}

			const tableBody = this.tableElement.querySelector('tbody');
			let tempRow;

			if (!fromOriginals) {
				const range = document.createRange();
				range.setStart(tableBody, 0);
				// eslint-disable-next-line prefer-destructuring
				tempRow = range.createContextualFragment(`<tr class="${classList.join(' ')}"></tr>`).childNodes[0];
			} else {
				tempRow = this.originals.rows[originalIndex];
			}

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
			logToConsole(`no row with id [${id}] found in the cache.`, 'warn');
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
			try {
				if (this.parsedTable[r][c]) {
					if (returnObject) {
						return this.parsedTable[r][c];
					}
					return this.parsedTable[r][c].el;
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				logToConsole(`no cell found at the given address of [${r}-${c}]`, 'warn');
				return null;
			}
			// eslint-disable-next-line no-console
			logToConsole(`no cell found at the given address of [${r}-${c}]`, 'warn');
			return null;
		};

		/**
		 * Get cells at a given row.
		 *
		 * @param {number} rowId row id
		 * @param {boolean} returnObj return an array of CellObject instead
		 * @return {array} cells in row
		 */
		this.getCellsAtRow = (rowId, returnObj = false) => {
			const cells = [];
			for (let c = 0; c < this.maxColumns(); c += 1) {
				const tempCell = this.getCell(rowId, c, returnObj);
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
			rowColors: this.rowColors,
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
			const direction = autoOption.cellStackDirection[sizeRange];
			// eslint-disable-next-line prefer-destructuring
			const topRowAsHeader = autoOption.topRowAsHeader[sizeRange];

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
		 * @param {string} direction direction to read cells, possible options [row, column]
		 * @param {boolean} topRowAsHeader use top row as header
		 * @param {number} cellsPerRow cells per row
		 */
		this.autoDirectionBuild = (tableObj, direction, topRowAsHeader = false, cellsPerRow = 1) => {
			const rows = tableObj.maxRows();
			const columns = tableObj.maxColumns();
			const isRowStacked = direction === 'row';

			// build table with top row as header
			if (topRowAsHeader) {
				this.headerBuild(tableObj, direction, cellsPerRow);
			} else {
				// cell stack direction is selected as row
				// for future new functionality additions, keep different cell stack direction logic separate instead of generalizing the inner logic
				// eslint-disable-next-line no-lonely-if
				if (isRowStacked) {
					const allCellsByRow = [];

					// get cells by reading row by row
					for (let r = 0; r < rows; r += 1) {
						// eslint-disable-next-line no-loop-func
						tableObj.getCellsAtRow(r, true).forEach((c) => allCellsByRow.push(c));
					}

					const cellCount = allCellsByRow.length;

					for (let c = 0; c < cellCount; c += cellsPerRow) {
						const rowId = tableObj.addRow('wptb-row').id;

						// place cells by 'cells by row' option value
						for (let pR = 0; pR < cellsPerRow; pR += 1) {
							const tempCell = allCellsByRow[c + pR];

							if (tempCell) {
								tableObj.appendElementToRow(tempCell.getElement(), rowId);

								tempCell.resetAllAttributes();
								tempCell.setAttribute('style', 'width: 100% !important');
								tempCell.setAttribute('colSpan', 1);
								tempCell.setAttribute('rowSpan', 1);
							}
						}
					}
				}
				// cell stack direction is selected as column
				else {
					const allCellsByCol = [];
					const rowStartIndex = 0;

					// read all cells column by column
					for (let c = 0; c < columns; c += 1) {
						for (let r = rowStartIndex; r < rows; r += 1) {
							const tCell = tableObj.getCell(r, c, true);
							if (tCell) {
								allCellsByCol.push(tCell);
							}
						}
					}

					const cellCount = allCellsByCol.length;

					for (let c = 0; c < cellCount; c += cellsPerRow) {
						const rowId = tableObj.addRow('wptb-row').id;

						for (let cR = 0; cR < cellsPerRow; cR += 1) {
							const tempCell = allCellsByCol[c + cR];

							if (tempCell) {
								tableObj.appendElementToRow(tempCell.getElement(), rowId);

								tempCell.resetAllAttributes();
								tempCell.setAttribute('style', 'width: 100% !important');
								tempCell.setAttribute('colSpan', 1);
								tempCell.setAttribute('rowSpan', 1);
							}
						}
					}
				}
			}
		};

		/**
		 * Build table with top row assigned as header.
		 *
		 * @param {TableObject} tableObj table object
		 * @param {string} direction cell stack direction, possible options are [row, column]
		 * @param {number} itemsPerHeader items bound to each header element
		 */
		this.headerBuild = (tableObj, direction, itemsPerHeader = 1) => {
			// cells at header
			// applying header row color to cells
			const headerCells = tableObj.getCellsAtRow(0, true).map((h) => {
				h.setAttribute('style', `background-color: ${tableObj.rowColors.header}`, true, ';');
				return h;
			});

			const stackedAsColumn = direction === 'column';

			// row count
			const rows = tableObj.maxRows();
			// column count
			const columns = tableObj.maxColumns();

			const rowBorderStyle = '3px solid gray';

			// stack direction is column
			if (stackedAsColumn) {
				/**
				 * Add header cells as new row to table.
				 * @param {boolean} addBorder add top border to header row
				 */
				// eslint-disable-next-line no-inner-declarations
				function addHeaderCells(addBorder = false) {
					const rowObj = tableObj.addRow('wptb-row');

					if (addBorder) {
						rowObj.el.style.borderTop = rowBorderStyle;
					}

					// eslint-disable-next-line array-callback-return
					headerCells.map((h) => {
						// clone header cell to reuse it for multiple rows
						tableObj.appendElementToRow(h.el.cloneNode(true), rowObj.id);
					});
				}

				// count of header rows that will be created
				const headerCount = Math.ceil((rows - 1) / itemsPerHeader);
				// row index on original table
				let currentOriginalRow = 1;
				for (let r = 0; r < headerCount; r += 1) {
					// create header row and add to table
					addHeaderCells(r > 0);
					for (let c = 0; c < itemsPerHeader; c += 1) {
						// break iteration when current row surpasses original row amount
						if (currentOriginalRow >= rows) {
							break;
						}
						const rowObj = tableObj.addRow('wptb-row');

						// apply row color relative to current header row
						rowObj.el.style.backgroundColor = tableObj.rowColors[c % 2 === 0 ? 'even' : 'odd'];
						for (let cc = 0; cc < columns; cc += 1) {
							tableObj.appendToRow(currentOriginalRow, cc, rowObj.id);
						}
						currentOriginalRow += 1;
					}
				}
			} else {
				// number of headers that will be created
				const headerCount = Math.ceil((rows - 1) / itemsPerHeader);

				let currentOriginalRow = 1;

				for (let hc = 0; hc < headerCount; hc += 1) {
					for (let c = 0; c < columns; c += 1) {
						const rowObj = tableObj.addRow('wptb-row');

						// clear out row color to override row color with cell colors
						rowObj.el.style.background = 'none';

						if (hc > 0 && c === 0) {
							rowObj.el.style.borderTop = rowBorderStyle;
						}

						tableObj.appendElementToRow(headerCells[c].el.cloneNode(true), rowObj.id);

						for (let r = 0; r < itemsPerHeader; r += 1) {
							if (currentOriginalRow + r >= rows) {
								break;
							}

							const currentCell = tableObj.appendToRow(currentOriginalRow + r, c, rowObj.id);

							// color index for the cell, this will be used to reflect table row colors to cells. currently, grouping up the same items with the same color code
							let colorIndex = (currentOriginalRow + r + hc) % 2 === 0 ? 'even' : 'odd';

							// for better visuals and distinction for tables with 1 item per header, using this calculation for color index
							if (itemsPerHeader === 1) {
								colorIndex = currentOriginalRow % 2 === 0 ? 'even' : 'odd';
							}

							currentCell.setAttribute(
								'style',
								`background-color: ${tableObj.rowColors[colorIndex]}`,
								true,
								';'
							);
						}
					}
					currentOriginalRow += itemsPerHeader;
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
				const rowId = tableObj.addRow('', true, r).id;
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
					// this.buildDefault(tableObj);
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
