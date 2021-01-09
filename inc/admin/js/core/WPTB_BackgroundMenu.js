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
	 * TODO [erdembircan] detailed explanation of component
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
				// ruleset to decide whether row has a custom bg color applied or not
				const customBgColorRuleSet = ['', null, undefined];
				const customBgColor = row.dataset.wptbBgColor;
				const hasCustomBgColor = !customBgColorRuleSet.includes(customBgColor);

				// eslint-disable-next-line no-param-reassign
				row.style.backgroundColor = hasCustomBgColor ? customBgColor : index % 2 === 0 ? evenBg : oddBg;
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
		 * Remove all highlight visuals from cells.
		 */
		const removeHighlights = () => {
			// remove any active highlighted cells
			const allCells = Array.from(getCurrentTable().querySelectorAll('td'));

			// eslint-disable-next-line array-callback-return
			allCells.map((cell) => {
				cell.classList.remove('wptb-highlighted');
			});
		};

		/**
		 * Extracted cell highlight logic to use with other parts of component.
		 *
		 * @param {Element} targetElement target element
		 * @param {boolean} multiSelection is multi selection active, multi selection should be enabled for elements after the first selected one onwards
		 */
		const highlightCellLogic = (targetElement, multiSelection = false) => {
			const currentTargetType = targetElement.nodeName.toLowerCase();

			if (!multiSelection) {
				removeHighlights();
			}

			// only add highlight style to table cell elements
			if (currentTargetType !== 'td') {
				// eslint-disable-next-line no-param-reassign
				targetElement = targetElement.parentNode;
			}

			targetElement.classList.add('wptb-highlighted');
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

			if (currentTargetType !== 'td') {
				targetElement = event.target.parentNode;
			}

			highlightCellLogic(targetElement);

			store.commit('setMenuSelectedTableElement', { type: store.state.types.selected.cell, item: targetElement });
		};

		/**
		 * Get column selection element.
		 *
		 * @return {Element} row selection element
		 */
		const getColumnSelector = () => {
			const rowSelectionClass = '.wptb-col-selection';
			return document.querySelector(rowSelectionClass);
		};

		/**
		 * Get column selection element.
		 *
		 * @return {Element} column selection element
		 */
		const getRowSelector = () => {
			const columnSelectionClass = '.wptb-row-selection';
			return document.querySelector(columnSelectionClass);
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
		 * Handle mouse over event for table cells.
		 *
		 * @param {Event} event event object
		 */
		const cellMouseEnter = (event) => {
			const targetElement = event.target;

			// find index of cell element relative to its container row element
			const index = Array.from(targetElement.parentNode.querySelectorAll('td')).reduce(
				(carry, current, cellIndex) => {
					return current === targetElement ? cellIndex : carry;
				},
				-1
			);

			// update hovered cell element on store
			store.commit('updateHoveredCellElement', { element: targetElement, index });
		};

		/**
		 * Get all cells at the given column index.
		 *
		 * @param {number | string} columnIndex column index
		 */
		const getCellsAtColumnIndex = (columnIndex) => {
			// parse index to an integer if its type is not a number
			const parsedIndex = typeof columnIndex === 'number' ? columnIndex : Number.parseInt(columnIndex, 10);

			const cells = [];
			// eslint-disable-next-line no-restricted-globals
			if (!isNaN(parsedIndex)) {
				// eslint-disable-next-line array-callback-return
				Array.from(getCurrentTable().querySelectorAll('tr')).map((row) => {
					const [cellAtIndex] = Array.from(row.querySelectorAll('td')).splice(parsedIndex, 1);

					// only push the cell to found ones if there is a cell at the given index
					if (cellAtIndex) {
						cells.push(cellAtIndex);
					}
				});
			}

			return cells;
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
			rowSelector.classList.add('wptb-bg-selection-visible');
			rowSelector.style.height = `${height}px`;
			rowSelector.style.top = `${y - parentY}px`;

			// since row selector is hidden with 'display: none' css rule, should get its size values after it becomes visible
			const { width: selectorWidth } = getRowSelector().getBoundingClientRect();
			rowSelector.style.left = `${x - parentX - selectorWidth}px`;
		};

		/**
		 * Calculate position of column selector element.
		 *
		 * @param {number | string} index index of the column relative to current table
		 */
		const columnSelectorPosition = (index) => {
			const cellsAtIndex = getCellsAtColumnIndex(index);

			if (cellsAtIndex.length > 0) {
				const colSelector = getColumnSelector();

				// select the cell width lowest width value to use as a pivot point
				const cellToUse = cellsAtIndex.reduce((carry, cell) => {
					return carry.offsetWidth > cell.offsetWidth ? cell : carry;
				}, cellsAtIndex[0]);

				const { x: parentX } = document.querySelector('.wptb-table-setup').getBoundingClientRect();
				const { width, x } = cellToUse.getBoundingClientRect();

				colSelector.classList.add('wptb-bg-selection-visible');
				colSelector.style.left = `${x - parentX}px`;
				colSelector.style.top = `${-colSelector.offsetHeight}px`;
				colSelector.style.width = `${width}px`;
			}
		};

		/**
		 * Selecting an entire row operation handler.
		 */
		const selectRow = () => {
			const currentActiveRow = store.getters.hoveredRow;

			if (currentActiveRow) {
				const [first, ...rest] = Array.from(currentActiveRow.querySelectorAll('td'));

				// don't activate multi highlight for first element to clear any previous highlighted cell
				highlightCellLogic(first);

				// activate multi highlight for the rest
				// eslint-disable-next-line array-callback-return
				rest.map((cell) => {
					highlightCellLogic(cell, true);
				});

				store.commit('setMenuSelectedTableElement', {
					type: store.getters.types.selected.row,
					item: currentActiveRow,
				});
			}
		};

		/**
		 * Select cells of an entire column.
		 *
		 * This function will use store index value to determine which column to use.
		 */
		const selectColumn = () => {
			const { index } = store.getters.hoveredCell;

			if (index !== null) {
				const [first, ...rest] = getCellsAtColumnIndex(index);
				highlightCellLogic(first);
				// eslint-disable-next-line array-callback-return
				rest.map((cell) => {
					highlightCellLogic(cell, true);
				});

				store.commit('setMenuSelectedTableElement', {
					type: store.getters.types.selected.column,
					item: [first, ...rest],
				});
			}
		};

		/**
		 * Add a container that will contain row and column selectors.
		 */
		const addSelectorToolbox = () => {
			// main toolbox wrapper
			const toolbox = document.createElement('div');
			toolbox.classList.add('wptb-bg-color-selectors');

			// row selector
			const rowSelector = document.createElement('div');
			rowSelector.classList.add('wptb-row-selection', 'wptb-bg-selection-item');
			rowSelector.title = 'Select row';

			WPTB_IconManager.getIcon('arrow-alt-circle-right', 'wptb-selector-icon-wrapper').then((icon) => {
				rowSelector.appendChild(icon);
			});

			const colSelector = document.createElement('div');
			colSelector.classList.add('wptb-col-selection', 'wptb-bg-selection-item');
			colSelector.title = 'Select column';
			WPTB_IconManager.getIcon('arrow-alt-circle-down', 'wptb-selector-icon-wrapper').then((icon) => {
				colSelector.appendChild(icon);
			});

			// add column selector click event
			colSelector.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();

				selectColumn();
			});

			// add row selector to toolbox
			toolbox.appendChild(rowSelector);

			// add column selector to toolbox
			toolbox.appendChild(colSelector);

			// add toolbox element to its parent container
			document.querySelector('.wptb-builder-content .wptb-table-setup').appendChild(toolbox);
		};

		/**
		 * Assign row select handlers for current table.
		 */
		const assignRowClickHandler = () => {
			const selectorToolbox = document.querySelector('wptb-bg-color-selectors');

			if (!selectorToolbox) {
				addSelectorToolbox();
			}

			const rowSelector = getRowSelector();

			rowSelector.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();

				selectRow();
			});

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
				rowSelector.classList.remove('wptb-bg-selection-visible');
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
				cell.addEventListener('mouseenter', cellMouseEnter);
			});
		};

		/**
		 * Remove cell click handlers from data cells.
		 */
		const removeCellHandlers = () => {
			const cells = Array.from(getCurrentTable().querySelectorAll('td'));

			// eslint-disable-next-line array-callback-return
			cells.map((cell) => {
				cell.removeEventListener('click', highlightCell);
				cell.removeEventListener('mouseenter', cellMouseEnter);
			});

			// hide column selector element
			getColumnSelector().classList.remove('wptb-bg-selection-visible');
		};

		/**
		 * Clear specific states from store.
		 */
		const clearStates = () => {
			store.dispatch('clearSelection');
			store.dispatch('clearHoverStates');
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
					removeCellHandlers();
					removeRowHandlers();
					removeHighlights();
					clearStates();
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
					case 'updateHoveredCellElement':
						columnSelectorPosition(payload.index);
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
