/**
 * Responsive class assignment for frontend operations.
 *
 * This function can be used as an UMD
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
		 * Assign table cells into row and column numbers
		 */
		this.parseTable = () => {
			const rows = Array.from(this.tableElement.querySelectorAll('tr'));

			rows.map((r, ri) => {
				const cells = Array.from(r.querySelectorAll('td'));

				cells.map((c) => {
					if (!this.parsedTable[ri]) {
						this.parsedTable[ri] = [];
					}

					this.parsedTable[ri].push(c);
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

			const range = document.createRange();
			range.setStart(this.tableElement, 0);
			const tempRow = range.createContextualFragment(`<tr class="${classList.join(' ')}"></tr>`);

			this.tableElement.appendChild(tempRow);
		};

		/**
		 * Clear the contents of table element
		 */
		this.clearTable = () => {
			this.tableElement.innerHTML = '';
		};

		this.parseTable();

		return { parsedTable: this.parsedTable, addRow: this.addRow, clearTable: this.clearTable };
	}

	// default options for responsive class
	const responsiveClassDefaultOptions = {
		query: '.wptb-preview-table',
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
		 * Rebuild table in auto mode.
		 *
		 * @param {HTMLElement} tableEl table element
		 * @param {string} sizeRange range id for current screen size
		 * @param {object} autoOption mode options
		 */
		this.autoBuild = (tableEl, sizeRange, autoOption) => {
			const tableObject = new TableObject(tableEl);
			const direction = autoOption.cellStackDirection;

			tableObject.clearTable();
		};

		/**
		 * Calculate range id for given size value.
		 *
		 * @param {number} val value
		 * @param {object} stops an object containing stop ids as keys and respectible sizes as values
		 * @return {string} range id
		 */
		this.calculateRangeId = (val, stops) => {
			// eslint-disable-next-line prefer-destructuring
			const sortedStops = Object.keys(stops).sort((a, b) => stops[a] - stops[b]);

			let rangeId = sortedStops[0];

			sortedStops.map((s) => {
				if (val >= stops[s]) {
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
		 */
		this.rebuildTable = (el, size) => {
			const directive = this.getDirective(el);

			if (directive) {
				const mode = directive.responsiveMode;

				// main build logic for different responsive modes should be named in the format of `{modeName}Build` to automatically call the associated function from here
				const buildCallable = this[`${mode}Build`];
				const sizeRangeId = this.calculateRangeId(size, directive.stops);

				if (buildCallable) {
					const modeOptions = directive.modeOptions[mode];
					buildCallable.call(this, el, sizeRangeId, modeOptions);
				} else {
					throw new Error(`No build mode named as [${mode}] found.`);
				}
			}
		};

		/**
		 * Batch rebuild tables.
		 */
		this.rebuildTables = (size) => {
			// eslint-disable-next-line array-callback-return
			this.elements.map((e) => {
				this.rebuildTable(e, size);
			});
		};

		return { rebuildTables: this.rebuildTables };
	}

	return ResponsiveFront;
});
