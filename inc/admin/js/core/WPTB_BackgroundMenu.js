/**
 * UMD for background menu setup.
 */
(function umd(key, context, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_BackgroundMenu', self || global, function wptbBackgroundMenuSetup() {
	/**
	 * Background menu component.
	 *
	 * @class
	 */
	function BackgroundMenu() {
		// whether setup operation done or not
		this.initialized = false;

		// flux store that will be used with menu
		let store = null;

		/**
		 * Get current active table on builder.
		 *
		 * @return {HTMLElement | null} found active table
		 */
		const getCurrentTable = () => {
			return document.querySelector('.wptb-table-setup .wptb-preview-table');
		};

		/**
		 * Get background specific options from table attributes.
		 */
		const parseOptionsFromTable = () => {
			const currentTable = getCurrentTable();

			const headerBg = currentTable.dataset.wptbHeaderBackgroundColor;
			const evenBg = currentTable.dataset.wptbEvenRowBackgroundColor;
			const oddBg = currentTable.dataset.wptbOddRowBackgroundColor;

			return {
				row: {
					headerBg,
					evenBg,
					oddBg,
				},
			};
		};

		/**
		 * Apply color value to element.
		 *
		 * @param {string | null} colorVal color value
		 * @param {Element} element html element
		 */
		const applyColor = (colorVal, element) => {
			if (colorVal === '' || colorVal === null) {
				// eslint-disable-next-line no-param-reassign
				element.style.removeProperty('background-color');
			} else {
				// eslint-disable-next-line no-param-reassign
				element.style.backgroundColor = colorVal;
			}
		};

		/**
		 * Row specific operations.
		 *
		 * @param {Object} rowOptions row options object
		 * @param {string} rowOptions.headerBg header color
		 * @param {string} rowOptions.evenBg even row color
		 * @param {string} rowOptions.oddBg odd row color
		 */
		const rowOperations = ({ headerBg, evenBg, oddBg }) => {
			const currentTable = getCurrentTable();

			const [header, ...rest] = Array.from(currentTable.querySelectorAll('tr'));

			// apply header row color
			applyColor(headerBg, header);

			// apply even/odd row color
			// eslint-disable-next-line array-callback-return
			rest.map((row, index) => {
				// eslint-disable-next-line no-param-reassign
				row.style.backgroundColor = index % 2 === 0 ? evenBg : oddBg;
			});
		};

		/**
		 * Apply background options to table.
		 *
		 * @param {null | Object} suppliedOptions options object, if supplied, these options will be used instead of parsing from table itself
		 */
		this.applyOptions = (suppliedOptions = null) => {
			const { row: rowOptions } = suppliedOptions || parseOptionsFromTable();

			rowOperations(rowOptions);
		};

		/**
		 * Highlight selected data cell element.
		 *
		 * @param {Event} event click event
		 */
		const highlightCell = (event) => {
			event.preventDefault();
			event.stopPropagation();

			const currentTargetType = event.target.nodeName.toLowerCase();

			let targetElement = event.target;

			// remove any active highlighted cells
			const allCells = Array.from(getCurrentTable().querySelectorAll('td'));

			// eslint-disable-next-line array-callback-return
			allCells.map((cell) => {
				cell.classList.remove('wptb-highlighted');
			});

			// only add highlight style to table cell elements
			if (currentTargetType !== 'td') {
				targetElement = event.target.parentNode;
			}

			targetElement.classList.add('wptb-highlighted');

			store.commit('setMenuSelectedTableElement', { type: store.state.types.selected.cell, item: targetElement });
		};

		/**
		 * Get row selection element.
		 *
		 * @return {Element} row selection element
		 */
		const getRowSelector = () => {
			const rowSelectionClass = '.wptb-row-selection';
			return document.querySelector(rowSelectionClass);
		};

		/**
		 * Handle mouse over event for table rows.
		 *
		 * @param {Event} event event object
		 */
		const rowMouseEnter = (event) => {
			// update hovered row element on store
			store.commit('updateHoveredRowElement', event.target);
		};

		/**
		 * Calculate row selector position relative to supplied table row element.
		 *
		 * @param {Element} targetRow target row element
		 */
		const rowSelectorPosition = (targetRow) => {
			const { x: parentX, y: parentY } = document.querySelector('.wptb-table-setup').getBoundingClientRect();
			const { height, x, y } = targetRow.getBoundingClientRect();

			const rowSelector = getRowSelector();
			rowSelector.style.display = 'block';
			rowSelector.style.height = `${height}px`;
			rowSelector.style.top = `${y - parentY}px`;

			// since row selector is hidden with 'display: none' css rule, should get its size values after it becomes visible
			const { width: selectorWidth } = getRowSelector().getBoundingClientRect();
			rowSelector.style.left = `${x - parentX - selectorWidth}px`;
		};

		/**
		 * Assign row select handlers for current table.
		 */
		const assignRowClickHandler = () => {
			const rowSelectionClass = 'wptb-row-selection';
			let rowSelector = getRowSelector();

			if (!rowSelector) {
				rowSelector = document.createElement('div');
				rowSelector.classList.add(rowSelectionClass);

				document.querySelector('.wptb-builder-content .wptb-table-setup').appendChild(rowSelector);
			}

			const rows = Array.from(getCurrentTable().querySelectorAll('tr'));

			// eslint-disable-next-line array-callback-return
			rows.map((row) => {
				row.addEventListener('mouseenter', rowMouseEnter);
			});
		};

		/**
		 * Remove row related event listeners and handlers
		 */
		const removeRowHandlers = () => {
			// eslint-disable-next-line array-callback-return
			Array.from(getCurrentTable().querySelectorAll('tr')).map((row) => {
				// remove event listener for each row element on table
				row.removeEventListener('mouseenter', rowMouseEnter);
			});

			const rowSelector = getRowSelector();
			if (rowSelector) {
				// hide row selector element if any found
				rowSelector.style.display = 'none';
			}

			// clear up last hovered row element value
			store.commit('updateHoveredRowElement', null);
		};

		/**
		 * Assign cell click handlers to data cells.
		 */
		const assignCellClickHandlers = () => {
			const cells = Array.from(getCurrentTable().querySelectorAll('td'));

			// eslint-disable-next-line array-callback-return
			cells.map((cell) => {
				cell.addEventListener('click', highlightCell);
			});
		};

		/**
		 * Remove cell click handlers from data cells.
		 */
		const removeCellClickHandlers = () => {
			const cells = Array.from(getCurrentTable().querySelectorAll('td'));

			// eslint-disable-next-line array-callback-return
			cells.map((cell) => {
				cell.removeEventListener('click', highlightCell);
			});
		};

		/**
		 * Initialize hook for component.
		 */
		this.init = () => {
			// initialize background menu on correct section change
			document.addEventListener('wptbSectionChanged', ({ detail }) => {
				// only run setup once
				if (!this.initialized && detail === 'background_menu') {
					WPTB_ControlsManager.callControlScript('BackgroundMenu', 'wptb-background-menu');
					this.initialized = true;
				}

				if (WPTB_Helper.getPreviousSection() !== 'background_menu' && detail === 'background_menu') {
					assignCellClickHandlers();
					assignRowClickHandler();
				}

				if (WPTB_Helper.getPreviousSection() === 'background_menu' && detail !== 'background_menu') {
					removeCellClickHandlers();
					removeRowHandlers();
				}
			});

			// reapply options after table changed events
			document.addEventListener('wp-table-builder/table-changed/after', () => {
				this.applyOptions();
			});
		};

		/**
		 * Watch store mutations.
		 *
		 * @param {Object} suppliedStore store object
		 */
		// eslint-disable-next-line no-shadow
		const watchStoreMutations = (suppliedStore) => {
			suppliedStore.subscribe(({ type, payload }) => {
				switch (type) {
					case 'updateHoveredRowElement':
						if (payload) {
							// update row selector position on hovered row element changes
							rowSelectorPosition(payload);
						}
						break;
					default:
						break;
				}
			});
		};

		/**
		 * Define a flux store for background menu.
		 *
		 * @param {Object} storeObject store object
		 */
		this.addStore = (storeObject) => {
			if (!store) {
				store = storeObject;
				watchStoreMutations(store);
			}
		};
	}

	// create singleton instance for background menu component
	const singletonInstance = new BackgroundMenu();

	// initialize background menu component
	singletonInstance.init();

	return singletonInstance;
});
