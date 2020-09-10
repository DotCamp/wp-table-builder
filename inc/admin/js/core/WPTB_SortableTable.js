const WPTB_SortableTable = function (table) {
	this.wptbTableSetup = table.parentNode;
	this.tableId = WPTB_Helper.getTableId();

	/**
	 * sets the table to sort mode
	 * @param type
	 * @param active
	 */
	this.sortModeSwitcher = function (type, active) {
		if (type === 'vertical') {
			this.wptbTableSetup.removeEventListener('click', this.sortableTableVerticalStart, false);

			if (active) {
				this.wptbTableSetup.addEventListener('click', this.sortableTableVerticalStart, false);
				this.wptbTableSetup.dataset.wptbSortableTableVertical = '1';
				this.sortModeSwitcher('horizontal', false);
			} else {
				delete this.wptbTableSetup.dataset.wptbSortableTableVertical;
			}
		} else if (type === 'horizontal') {
			this.wptbTableSetup.removeEventListener('click', this.sortableTableHorizontalStart, false);

			if (active) {
				this.wptbTableSetup.addEventListener('click', this.sortableTableHorizontalStart, false);
				this.wptbTableSetup.dataset.wptbSortableTableHorizontal = '1';
				this.sortModeSwitcher('vertical', false);
			} else {
				delete this.wptbTableSetup.dataset.wptbSortableTableHorizontal;
			}
		}
	};

	/**
	 * checks whether the table should be in the sort state
	 * and connects the necessary handlers
	 */
	this.sortableTableInitialization = function () {
		if (
			this.wptbTableSetup.dataset.wptbSortableTableVertical &&
			this.wptbTableSetup.dataset.wptbSortableTableVertical === '1'
		) {
			this.sortModeSwitcher('vertical', true);
		} else if (
			this.wptbTableSetup.dataset.wptbSortableTableHorizontal &&
			this.wptbTableSetup.dataset.wptbSortableTableHorizontal === '1'
		) {
			this.sortModeSwitcher('horizontal', true);
		}
	};

	/**
	 * function for sorting the table vertically by the numeric content of cells
	 * @param e
	 * @param table
	 */
	function sortableTable(e, table, type) {
		if (e.target && e.target.tagName === 'TD') {
			let tableWasSorted = false;
			if (type === 'vertical' && e.target.dataset.yIndex === '0') {
				let tds = table.querySelectorAll(`[data-x-index="${e.target.dataset.xIndex}"]`);
				tds = [...tds];

				// preparing table for sorting
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

				const orderByAsc = setSortedAscDataAttr(e, 'sortedAscVertical');
				if (orderByAsc === null) return;

				if (rowsValuesArr.length) rowsValuesArr.sort((prev, next) => sortOrder(orderByAsc, prev, next));

				rowsValuesArr.unshift({ rowsTd: rowsTdFirst });

				const tBody = table.querySelector('tbody');
				tBody.innerHTML = '';

				rowsValuesArr.map((rowsValObj) => {
					rowsValObj.rowsTd.map((row) => {
						tBody.appendChild(row);
					});
				});

				table.recalculateIndexes();

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

				const orderByAsc = setSortedAscDataAttr(e, 'sortedAscHorizontal');
				if (orderByAsc === null) return;

				if (columnsValuesArr.length) columnsValuesArr.sort((prev, next) => sortOrder(orderByAsc, prev, next));

				columnsValuesArr.unshift({ columnsTd: columnsTdFirst });

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

				table.recalculateIndexes();

				WPTB_CutGlueTable.glueTableVertically(table);

				tableWasSorted = true;
			}

			if (tableWasSorted) {
				removeCellsAttrAfterDivision(table);

				const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
				wptbTableStateSaveManager.tableStateSet();
			}
		}
	}

	/**
	 * Function that sets the data-attribute with the number of the row or column
	 * that the table was sorted by. Returns the number of a row or column
	 * @param e
	 * @param dataAttr
	 * @returns {null|boolean}
	 */
	function setSortedAscDataAttr(e, dataAttr) {
		let cellIndex = '';
		if (dataAttr === 'sortedAscVertical') {
			cellIndex = 'xIndex';
		} else if (dataAttr === 'sortedAscHorizontal') {
			cellIndex = 'yIndex';
		}
		if (e.currentTarget && e.currentTarget.classList.contains('wptb-table-setup')) {
			if (
				e.currentTarget.dataset[dataAttr] &&
				e.currentTarget.dataset[dataAttr] === e.target.dataset[cellIndex]
			) {
				delete e.currentTarget.dataset[dataAttr];
				return false;
			}
			e.currentTarget.dataset[dataAttr] = e.target.dataset[cellIndex];
			return true;
		}

		return null;
	}

	/**
	 * defines the sorting order
	 * @param orderByAsc
	 * @param prev
	 * @param next
	 * @returns {number}
	 */
	function sortOrder(orderByAsc = true, prev, next) {
		let prevValue = prev.value;
		let nextValue = next.value;
		if (parseInt(prevValue) && parseInt(nextValue)) {
			prevValue = parseInt(prevValue);
			nextValue = parseInt(nextValue);
		}

		if (orderByAsc) {
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
	 * @param cell {HTMLElement}
	 * @returns {string}
	 */
	function textElementsValuesGet(cell) {
		let textElements = cell.querySelectorAll('.wptb-text-container');
		textElements = [...textElements];
		let value = '';
		for (let j = 0; j < textElements.length; j++) {
			const p = textElements[j].querySelector('p');
			value += p.innerText;
			if (j !== textElements.length - 1) value += ' ';
		}

		return value;
	}

	/**
	 * adds cells to the collection of cells in the row or column that the table is sorted by.
	 * These added cells are not originally were added in the collection,
	 * because they are combined with cells from higher rows or left-side columns
	 * @param table
	 * @param tds
	 * @param i
	 * @param tdIndexSpanPrev
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
						parseInt(collectionTdsJSpan, 10) >=
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
						parseInt(collectionTdsJSpan, 10) >=
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
	 * @param table
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
	 * @param e
	 */
	this.sortableTableVerticalStart = function (e) {
		sortableTable(e, table, 'vertical');
	};

	/**
	 * function for run sorting table horizontally
	 * @param e
	 */
	this.sortableTableHorizontalStart = function (e) {
		sortableTable(e, table, 'horizontal');
	};
};
