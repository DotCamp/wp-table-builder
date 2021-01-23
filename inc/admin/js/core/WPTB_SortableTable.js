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
})('WPTB_SortableTable', self || global, () => {
	function WPTB_SortTable(options = {}) {
		const table = (this.table = options.table);
		WPTB_RecalculateIndexes(table);
		const thisObject = this;
		this.itemsPerHeader = 0;
		this.tableMaxCols = table.maxCols;
		this.cellsStylesScheme = {};
		this.rowsStylesScheme = {};

		/**
		 * sets the table to sort mode
		 *
		 * @param {string} type
		 * @param {boolean} active
		 * @param {number} number
		 */
		this.sortModeSwitcher = function (type, active) {
			if(active) {
				this.sortModeSwitcher('horizontal', false);
				this.sortModeSwitcher('vertical', false);
			}

			if (type === 'vertical') {
				this.table.removeEventListener('click', this.sortableTableVerticalStart, false);

				if (active) {
					this.sortingCellMouseMoveSwitcher('vertical', true);
					this.table.addEventListener('click', this.sortableTableVerticalStart, false);
					this.table.dataset.wptbSortableTableVertical = '1';
					this.createTableElementsStylesScheme('td');
					this.createTableElementsStylesScheme('tr');
				} else {
					this.sortingCellMouseMoveSwitcher('vertical', false);
					delete this.table.dataset.wptbSortableTableVertical;
				}
			} else if (type === 'horizontal') {
				this.table.removeEventListener('click', this.sortableTableHorizontalStart, false);

				if (active) {
					this.sortingCellMouseMoveSwitcher('horizontal', true);
					this.table.addEventListener('click', this.sortableTableHorizontalStart, false);
					this.table.dataset.wptbSortableTableHorizontal = '1';
					this.createTableElementsStylesScheme('td');
					this.createTableElementsStylesScheme('tr');
				} else {
					this.sortingCellMouseMoveSwitcher('horizontal', false);
					delete this.table.dataset.wptbSortableTableHorizontal;
				}
			}
		};

		/**
		 * changes table object for old reconstruction table type
		 *
		 * @param {boolean}start
		 * @returns {*}
		 */
		this.tableObjectChange = function (start = true) {
			if(this.table.classList.contains('wptb-mobile-view-active') && start) {
				this.table = table.parentNode.parentNode.querySelector('.wptb-preview-table-mobile');
			} else if(this.table.classList.contains('wptb-preview-table-mobile') && !start) {
				this.table = table.parentNode.querySelector('.wptb-preview-table');
			}
			return this.table;
		}

		/**
		 * fills the object with data about cell styles for all locations (create scheme)
		 *
		 * @param elemSelector
		 */
		this.createTableElementsStylesScheme = function (elemSelector) {
			this.tableObjectChange();
			let elements = this.table.querySelectorAll(elemSelector);
			if(elements.length) {
				for(let i = 0; i < elements.length; i++) {
					let elem = elements[i];
					let cellFullStyleObj = window.getComputedStyle(elem, null);
					let backgroundColor = cellFullStyleObj.getPropertyValue( 'background-color' );
					let objectKey = '';
					if(elemSelector === 'td') {
						objectKey = elem.dataset.xIndex + '-' + elem.dataset.yIndex;
						this.cellsStylesScheme[objectKey] = {backgroundColor};
					} else if(elemSelector === 'tr') {
						objectKey = String(i);
						this.rowsStylesScheme[objectKey] = {backgroundColor};
					}

				}
			}

			this.tableObjectChange(false);
		}

		/**
		 * applies saved cell styles data to all cells
		 *
		 * @param elemSelector
		 */
		this.reassignElementsStyles = function (elemSelector) {
			this.tableObjectChange();
			let elements = this.table.querySelectorAll(elemSelector);
			let elementsStylesScheme;
			if(elemSelector === 'td') {
				elementsStylesScheme = this.cellsStylesScheme;
			} else if(elemSelector === 'tr') {
				elementsStylesScheme = this.rowsStylesScheme;
			}
			if(elements.length) {
				for(let i = 0; i < elements.length; i++) {
					let elem = elements[i];
					let objectKey = '';
					if(elemSelector === 'td') {
						objectKey = elem.dataset.xIndex + '-' + elem.dataset.yIndex;
					} else if(elemSelector === 'tr') {
						objectKey = i;
					}
					if(elementsStylesScheme.hasOwnProperty(objectKey)) {
						let elemStyles = elementsStylesScheme[objectKey];
						for(let key in elemStyles) {
							elem.style[key] = elemStyles[key];
						}
					}
				}
			}
			this.tableObjectChange(false);
		}

		/**
		 * checks whether the table should be in the sort state
		 * and connects the necessary handlers
		 *
		 * @param {object} responsiveFront
		 */
		this.sortableTableInitialization = function (responsiveFront) {
			let typeFirst;
			let typeSecond;
			if (this.table.dataset.wptbSortableTableVertical && this.table.dataset.wptbSortableTableVertical === '1') {
				typeFirst = 'vertical';
				typeSecond = 'horizontal';
			} else if (
				this.table.dataset.wptbSortableTableHorizontal &&
				this.table.dataset.wptbSortableTableHorizontal === '1'
			) {
				typeFirst = 'horizontal';
				typeSecond = 'vertical';
			}

			if(!typeFirst || typeof typeFirst !== 'string' || !typeSecond || typeof typeSecond !== 'string') return;

			let switchMode = WPTB_GetDirectionAfterReconstruction(this.table, typeFirst, typeSecond, 'vertical', responsiveFront);

			if(typeof switchMode === 'object' && switchMode.hasOwnProperty('switch')) {
				function sortModeSwitcherRun (e) {
					let switchModeObj = switchMode.switch(e);
					if(typeof switchModeObj === 'object') {
						this.itemsPerHeader = switchModeObj.itemsPerHeader;
						if(switchModeObj.hasOwnProperty('newTable')) {
							let tableOld = this.table;
							this.table = switchModeObj.newTable;
							this.sortModeSwitcher(switchModeObj.type[0], true);
							this.table = tableOld;
						} else {
							this.sortModeSwitcher(switchModeObj.type[0], true);
						}
					}
				}
				sortModeSwitcherRun.call(thisObject);
				this.table.addEventListener(
					'table:rebuilt',
					function (e) {
						sortModeSwitcherRun.call(thisObject, e);
					},
					false
				);
			}
		};

		/**
		 * adds and deletes mousemove and mouseleave events handlers when happens switch sorting mode
		 * and also can add necessary attributes
		 *
		 * @param {string} type
		 * @param {boolean} active
		 */
		this.sortingCellMouseMoveSwitcher = function (type, active) {
			/**
			 * removes and adds mousemove and mouseleave events handlers
			 *
			 * @param {HTMLElement} td
			 * @param {func} sCMM
			 * @param {boolean} active
			 */
			function s(td, sCMM, active) {
				td.removeEventListener('mousemove', sCMM, false);
				td.removeEventListener('mouseleave', tdMouseLeave, false);
				if (active) {
					td.addEventListener('mousemove', sCMM, false);
					td.addEventListener('mouseleave', tdMouseLeave, false);
				}
			}

			/**
			 * removes and adds data sorted attributes
			 *
			 * @param {HTMLElement} td
			 * @param {string} dataAttr
			 * @param {boolean} active
			 */
			function dataAttrSortChange(td, dataAttr, active) {
				if (active) {
					if (!td.dataset[dataAttr] || td.dataset[dataAttr] !== 'desk-disabled') {
						td.dataset[dataAttr] = 'ask';
					} else {
						td.dataset[dataAttr] = 'desk';
					}
				} else if (td.dataset[dataAttr] === 'ask') {
					td.dataset[dataAttr] = 'ask-disabled';
				} else if (td.dataset[dataAttr] === 'desk') {
					td.dataset[dataAttr] = 'desk-disabled';
				}
			}

			// removes all mousemove and mouseleave events handlers
			// and also removes all data sorted attributes from all cells
			let tds = this.table.querySelectorAll('td');
			if (tds.length) {
				tds = [...tds];
				tds.map((td) => {
					s(td, sortingCellMouseMoveVertical, false);
					dataAttrSortChange(td, 'sortedVertical', false);
					s(td, sortingCellMouseMoveHorizontal, false);
					dataAttrSortChange(td, 'sortedHorizontal', false);
				});
			}

			// if active === true sets sorted events handlers
			// and data sorted attributes for all cells
			if (active) {
				if (type === 'vertical') {
					let rowsLength = this.table.rows.length;
					let dataYIndexStart = 0;
					while (rowsLength > 0) {
						let tds = this.table.querySelectorAll(`[data-y-index="${dataYIndexStart}"]`);
						tds = [...tds];
						tds.map((td) => {
							s(td, sortingCellMouseMoveVertical, active);
							dataAttrSortChange(td, 'sortedVertical', active);
						});

						if (this.itemsPerHeader) {
							rowsLength -= this.itemsPerHeader + 1;
							dataYIndexStart += this.itemsPerHeader + 1;
						} else {
							rowsLength = 0;
						}
					}
				} else if (type === 'horizontal') {
					let tds = this.table.querySelectorAll('[data-x-index="0"]');
					tds = [...tds];
					tds.map((td) => {
						let tdsPerAfter = this.table.querySelectorAll(`[data-y-index="${td.dataset.yIndex}"]`);
						if(tdsPerAfter.length > 2) {
							s(td, sortingCellMouseMoveHorizontal, active);
							dataAttrSortChange(td, 'sortedHorizontal', active);
						}
					});
				}
			}
		};

		/**
		 * adds a sortable-hover class for a cell when the cursor is over the sort icon (arrow)
		 *
		 * @param {event} e
		 * @param {string} type
		 * @param {HTMLElement} element td
		 */
		function sortingCellMouseMov(e, type, element) {
			if (e.target.tagName === 'TD') {
				const x = e.offsetX == undefined ? e.layerX : e.offsetX;
				const y = e.offsetY == undefined ? e.layerY : e.offsetY;
				let xMatch = false;
				if ((type === 'vertical' && e.target.clientWidth - x <= 35) || (type === 'horizontal' && x <= 35)) {
					xMatch = true;
				}
				if (xMatch && (e.target.clientHeight - 35) / 2 < y && (e.target.clientHeight + 35) / 2 > y) {
					element.classList.add('sortable-hover');
				} else {
					element.classList.remove('sortable-hover');
				}
			} else {
				element.classList.remove('sortable-hover');
			}
		}

		/**
		 * calls sortingCellMouseMov with the type parameter set to vertical
		 *
		 * @param {event} e
		 */
		function sortingCellMouseMoveVertical(e) {
			sortingCellMouseMov(e, 'vertical', this);
		}

		/**
		 * calls sortingCellMouseMov with the type parameter set to horizontal
		 *
		 * @param {event} e
		 */
		function sortingCellMouseMoveHorizontal(e) {
			sortingCellMouseMov(e, 'horizontal', this);
		}

		/**
		 * remove sortable-hover class from cell when cursor leave cell
		 */
		function tdMouseLeave() {
			this.classList.remove('sortable-hover');
		}

		/**
		 * function for sorting the table vertically by the numeric content of cells
		 *
		 * @param {event} e
		 * @param {HTMLElement} table
		 * @param {string} type
		 */
		function sortableTable(e, type) {
			if (
				e.target &&
				e.target.tagName === 'TD' &&
				!table.parentNode.classList.contains('wptb-preview-table-manage-cells')
			) {
				const table = e.currentTarget;
				let tableWasSorted = false;
				if (type === 'vertical' && e.target.dataset.hasOwnProperty('sortedVertical')) {
					/**
					 * if table have enabled param topRowAsHeader and sellsStackDirection is column
					 * the top and bottom rows that will not be sorted are temporarily removed from the table
					 */
					const tableRowsBefore = [];
					const tableRowsAfter = [];
					if (this.itemsPerHeader && this.itemsPerHeader < table.rows.length) {
						WPTB_RecalculateIndexes(table);
						const tableRowsArr = [...table.rows];
						const tableLastCont = table.querySelector('tbody') ? table.querySelector('tbody') : table;
						for (let i = 0; i < tableRowsArr.length; i++) {
							if (i < e.target.dataset.yIndex) {
								tableRowsBefore.push(tableRowsArr[i]);
								tableLastCont.removeChild(tableRowsArr[i]);
							} else if (i > parseInt(e.target.dataset.yIndex, 10) + this.itemsPerHeader) {
								tableRowsAfter.push(tableRowsArr[i]);
								tableLastCont.removeChild(tableRowsArr[i]);
							}
						}
						WPTB_RecalculateIndexes(table);
					}

					let tds = table.querySelectorAll(`[data-x-index="${e.target.dataset.xIndex}"]`);
					tds = [...tds];

					/**
					 * preparing table for sorting
					 */
					let rowspan;
					let rowNum;
					tds.map((td) => {
						if (!(rowspan = parseInt(td.rowSpan, 10))) {
							rowspan = 1;
						}
						rowNum = td.dataset.yIndex;
						WPTB_CutGlueTable.cutTableHorizontally(rowNum, table);
						rowNum += rowspan;
						WPTB_CutGlueTable.cutTableHorizontally(rowNum, table);
					});

					const rowsValuesArr = [];
					let rowsTdFirst;
					let tdYCoordsRowSpanPrevious = 0;
					const tableRowsPushed = [];
					for (let i = 0; i < tds.length; i++) {
						const tdsChanged = changeSortingTdsCollection(
							e,
							table,
							tds,
							i,
							tdYCoordsRowSpanPrevious,
							'vertical'
						);
						if (tdsChanged && tdsChanged.hasOwnProperty('i')) {
							tds = tdsChanged.tds;
							i = tdsChanged.i;
							continue;
						} else if (tdsChanged) {
							tds = tdsChanged.tds;
						}

						const td = tds[i];

						let tdRowspan = parseInt(td.rowSpan, 10);
						if (!tdRowspan) tdRowspan = 1;

						tdYCoordsRowSpanPrevious = parseInt(td.dataset.yIndex, 10) + tdRowspan;

						const textElementsValues = textElementsValuesGet(td);

						const rowsTd = [];
						for (let j = 0; j < tdRowspan; j++) {
							rowsTd.push(table.rows[parseInt(td.dataset.yIndex, 10) + j]);
							tableRowsPushed.push(parseInt(td.dataset.yIndex, 10) + j);
						}
						if (td.dataset.yIndex > 0) {
							rowsValuesArr.push({
								rowsTd,
								value: textElementsValues,
							});
						} else {
							rowsTdFirst = rowsTd;
						}
					}

					const orderBy = setSortedAscDataAttr(e, 'sortedVertical');
					if (!orderBy) return;

					if (rowsValuesArr.length) rowsValuesArr.sort((prev, next) => sortOrder(orderBy, prev, next));

					rowsValuesArr.unshift({ rowsTd: rowsTdFirst });

					if (rowsValuesArr.length < table.rows.length) {
						for (let i = 0; i < table.rows.length; i++) {
							if (tableRowsPushed.indexOf(i) > -1) continue;
							const rowsTd = [];
							rowsTd.push(table.rows[i]);

							rowsValuesArr.push({
								rowsTd,
							});
						}
					}

					const tBody = table.querySelector('tbody');
					tBody.innerHTML = '';

					rowsValuesArr.map((rowsValObj) => {
						rowsValObj.rowsTd.map((row) => {
							tBody.appendChild(row);
						});
					});

					/**
					 * returning previously deleted rows
					 */
					if (tableRowsBefore.length) {
						const tableLastCont = table.querySelector('tbody') ? table.querySelector('tbody') : table;
						if (tableLastCont) {
							const trRef = tableLastCont.querySelector('tr');
							tableRowsBefore.map((tr) => {
								tableLastCont.insertBefore(tr, trRef);
							});
						}
					}
					if (tableRowsAfter.length) {
						const tableLastCont = table.querySelector('tbody') ? table.querySelector('tbody') : table;
						if (tBody) {
							tableRowsAfter.map((tr) => {
								tableLastCont.appendChild(tr);
							});
						}
					}

					WPTB_RecalculateIndexes(table);

					WPTB_CutGlueTable.glueTableHorizontally(table);

					tableWasSorted = true;
				} else if (type === 'horizontal' && e.target.dataset.xIndex === '0') {
					let tds = table.querySelectorAll(`[data-y-index="${e.target.dataset.yIndex}"]`);
					tds = [...tds];

					// preparing table for sorting
					let colspan;
					let colNum;
					tds.map((td) => {
						if (!(colspan = parseInt(td.colSpan, 10))) {
							colspan = 1;
						}
						colNum = td.dataset.xIndex;
						WPTB_CutGlueTable.cutTableVertically(colNum, table);
						colNum += colspan;
						WPTB_CutGlueTable.cutTableVertically(colNum, table);
					});

					const columnsValuesArr = [];
					let columnsTdFirst;

					let tdXCoordsColSpanPrevious = 0;
					for (let i = 0; i < tds.length; i++) {
						const tdsChanged = changeSortingTdsCollection(
							e,
							table,
							tds,
							i,
							tdXCoordsColSpanPrevious,
							'horizontal'
						);
						if (tdsChanged && tdsChanged.hasOwnProperty('i')) {
							tds = tdsChanged.tds;
							i = tdsChanged.i;
							continue;
						} else if (tdsChanged) {
							tds = tdsChanged.tds;
						}

						const td = tds[i];
						let tdColspan = parseInt(td.colSpan, 10);
						if (!tdColspan) tdColspan = 1;

						tdXCoordsColSpanPrevious = parseInt(td.dataset.xIndex, 10) + tdColspan;

						const textElementsValues = textElementsValuesGet(td);
						const columnsTd = [];
						for (let j = 0; j < tdColspan; j++) {
							const tdsColumn = [
								...table.querySelectorAll(`[data-x-index="${parseInt(td.dataset.xIndex, 10) + j}"]`),
							];
							columnsTd.push(tdsColumn);
						}
						if (td.dataset.xIndex > 0) {
							columnsValuesArr.push({
								columnsTd,
								value: textElementsValues,
							});
						} else {
							columnsTdFirst = columnsTd;
						}
					}

					const orderBy = setSortedAscDataAttr(e, 'sortedHorizontal');
					if (!orderBy) return;

					if (columnsValuesArr.length) columnsValuesArr.sort((prev, next) => sortOrder(orderBy, prev, next));

					columnsValuesArr.unshift({ columnsTd: columnsTdFirst });

					if (columnsValuesArr.length < table.maxCols) {
						const difference = table.maxCols - columnsValuesArr.length;
						for (let i = 0; i < difference; i++) {
							const tdsColumn = [
								...table.querySelectorAll(
									`[data-x-index="${parseInt(table.maxCols, 10) - parseInt(difference, 10) + i}"]`
								),
							];

							columnsValuesArr.push({
								columnsTd: [tdsColumn],
							});
						}
					}

					for (let i = 0; i < table.rows.length; i++) {
						table.rows[i].innerHTML = '';
					}

					columnsValuesArr.map((columnsValObj) => {
						columnsValObj.columnsTd.map((tdsColumn) => {
							tdsColumn.map((td) => {
								table.rows[td.dataset.yIndex].appendChild(td);
							});
						});
					});

					WPTB_RecalculateIndexes(table);

					WPTB_CutGlueTable.glueTableVertically(table);

					tableWasSorted = true;
				}

				if (tableWasSorted) {
					removeCellsAttrAfterDivision(table);

					if (table.hasOwnProperty('tableSM')) {
						const tableSM = table.tableSM();
						new tableSM().tableStateSet();
					}

					this.reassignElementsStyles('td');
					this.reassignElementsStyles('tr');
				}
			}
		}

		/**
		 * Function that sets the data-attribute with the number of the row or column
		 * that the table was sorted by. Returns the number of a row or column
		 *
		 * @param {event} e
		 * @param {string} dataAttr
		 * @returns {null|boolean}
		 */
		function setSortedAscDataAttr(e, dataAttr) {
			if (
				e.currentTarget &&
				(e.currentTarget.classList.contains('wptb-preview-table') ||
					e.currentTarget.classList.contains('wptb-preview-table-mobile'))
			) {
				if (!e.target.dataset[dataAttr] || e.target.dataset[dataAttr] === 'ask') {
					e.target.dataset[dataAttr] = 'desk';
				} else {
					e.target.dataset[dataAttr] = 'ask';
				}

				return e.target.dataset[dataAttr];
			}

			return false;
		}

		/**
		 * defines the sorting order
		 *
		 * @param {string} orderBy
		 * @param prev
		 * @param next
		 * @returns {number}
		 */
		function sortOrder(orderBy = 'ask', prev, next) {
			let prevValue = prev.value;
			let nextValue = next.value;
			if (parseInt(prevValue) && parseInt(nextValue)) {
				prevValue = parseInt(prevValue);
				nextValue = parseInt(nextValue);
			}

			if (orderBy === 'ask') {
				if (prevValue < nextValue) {
					return -1;
				}
				if (prevValue === nextValue) {
					return 0;
				}
				return 1;
			}
			if (prevValue < nextValue) {
				return 1;
			}
			if (prevValue === nextValue) {
				return 0;
			}
			return -1;
		}

		/**
		 * return cell text elements values
		 *
		 * @param cell {HTMLElement}
		 * @returns {string}
		 */
		function textElementsValuesGet(cell) {
			let textElements = cell.querySelectorAll('.wptb-text-container');
			textElements = [...textElements];
			let value = '';
			for (let j = 0; j < textElements.length; j++) {
				value += textElements[j].innerText;
				if (j !== textElements.length - 1) value += ' ';
			}

			return value;
		}

		/**
		 * adds cells to the collection of cells in the row or column that the table is sorted by.
		 * These added cells are not originally were added in the collection,
		 * because they are combined with cells from higher rows or left-side columns
		 *
		 * @param {event} e
		 * @param {HTMLElement} table
		 * @param {array} tds
		 * @param {number} i
		 * @param {number} tdIndexSpanPrev
		 * @param {string} type
		 * @returns {{tds: *}|boolean|{tds: *, i: *}}
		 */
		function changeSortingTdsCollection(e, table, tds, i, tdIndexSpanPrev, type) {
			const td = tds[i];
			let tdsCollectionChanged = false;
			let collectionTds;
			let collectionTdsJSpan;
			let collectionTdsJSpanProperty;
			let indexName;
			let indexNameCamelCase;
			let indexNamePerpendicularCamelCase;
			let tdSpanProperty;
			// max rows or columns column
			let tableGroupCount;

			if (type === 'vertical') {
				collectionTdsJSpanProperty = 'colSpan';
				indexName = 'data-y-index';
				indexNameCamelCase = 'yIndex';
				indexNamePerpendicularCamelCase = 'xIndex';
				tdSpanProperty = 'rowSpan';
				tableGroupCount = table.rows.length;
			} else if (type === 'horizontal') {
				collectionTdsJSpanProperty = 'rowSpan';
				indexName = 'data-x-index';
				indexNameCamelCase = 'xIndex';
				indexNamePerpendicularCamelCase = 'yIndex';
				tdSpanProperty = 'colSpan';
				tableGroupCount = table.maxCols;
			}

			if (td.dataset[indexNameCamelCase] - tdIndexSpanPrev > 0) {
				collectionTds = table.querySelectorAll(`[${indexName}="${tdIndexSpanPrev}"]`);

				for (let j = 0; j < collectionTds.length; j++) {
					collectionTdsJSpan = collectionTds[j][collectionTdsJSpanProperty];
					if (!collectionTdsJSpan) collectionTdsJSpan = 1;

					if (
						collectionTds[j].dataset[indexNamePerpendicularCamelCase] <
							e.target.dataset[indexNamePerpendicularCamelCase] &&
						parseInt(collectionTds[j].dataset[indexNamePerpendicularCamelCase], 10) +
							parseInt(collectionTdsJSpan, 10) >
							e.target.dataset[indexNamePerpendicularCamelCase]
					) {
						tds.splice(i, 0, collectionTds[j]);
						tdsCollectionChanged = true;
						i--;
						break;
					}
				}
			}

			if (tdsCollectionChanged) return { tds, i };

			let tdSpan = parseInt(td[tdSpanProperty], 10);
			if (!tdSpan) tdSpan = 1;
			if (i == tds.length - 1 && parseInt(td.dataset[indexNameCamelCase], 10) + tdSpan < tableGroupCount) {
				collectionTds = table.querySelectorAll(
					`[${indexName}="${parseInt(td.dataset[indexNameCamelCase], 10) + tdSpan}"]`
				);
				for (let j = 0; j < collectionTds.length; j++) {
					collectionTdsJSpan = collectionTds[j][collectionTdsJSpanProperty];
					if (!collectionTdsJSpan) collectionTdsJSpan = 1;

					if (
						collectionTds[j].dataset[indexNamePerpendicularCamelCase] <
							e.target.dataset[indexNamePerpendicularCamelCase] &&
						parseInt(collectionTds[j].dataset[indexNamePerpendicularCamelCase], 10) +
							parseInt(collectionTdsJSpan, 10) >
							e.target.dataset[indexNamePerpendicularCamelCase]
					) {
						tds.push(collectionTds[j]);
						tdsCollectionChanged = true;
						break;
					}
				}
			}

			if (tdsCollectionChanged) return { tds };
			return false;
		}

		/**
		 * remove cells attributes which were used for division table
		 *
		 * @param {HTMLElement} table
		 */
		function removeCellsAttrAfterDivision(table) {
			const tdsAll = [...table.getElementsByTagName('td')];
			for (let i = 0; i < tdsAll.length; i++) {
				if (tdsAll[i].hasAttribute('data-same-cell-before-division')) {
					tdsAll[i].removeAttribute('data-same-cell-before-division');
				}
			}
		}

		/**
		 * function for run sorting table vertically
		 *
		 * @param {event} e
		 */
		this.sortableTableVerticalStart = function (e) {
			sortableTable.call(thisObject, e, 'vertical');
		};

		/**
		 * function for run sorting table horizontally
		 *
		 * @param {event} e
		 */
		this.sortableTableHorizontalStart = function (e) {
			sortableTable.call(thisObject, e, 'horizontal');
		};

		return this;
	}

	return WPTB_SortTable;
});
