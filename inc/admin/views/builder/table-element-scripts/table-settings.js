const table = element;
const wptbTableSetup = table.parentNode;
wptbTableSetup.removeEventListener('click', sortableTableStart, false);
if (wptbTableSetup.dataset.wptbSortableTable && wptbTableSetup.dataset.wptbSortableTable === '1') {
	wptbTableSetup.addEventListener('click', sortableTableStart, false);
}
console.log('Hello 5');
function controlsChange(inputs, table) {
	if (inputs && typeof inputs === 'object') {
		if (inputs.hasOwnProperty('makeTableResponsive')) {
			const infArr = table.className.match(/wptb-element-main(.+)-(\d+)/i);
			if (infArr && Array.isArray(infArr) && typeof infArr[2] !== 'undefined') {
				let inputSelector;
				if (infArr[2] == '0') {
					inputSelector = 'wptb-el-main-table_setting-startedid-0-tableTopRowsAsHeader';
				} else {
					inputSelector = `wptb-el-main-table_setting-${infArr[2]}-tableTopRowsAsHeader`;
				}

				const inputTopAsHeader = document.querySelector(`.${inputSelector}`);
				if (inputTopAsHeader) {
					if (inputs.makeTableResponsive == 'checked') {
						table.classList.add('wptb-table-preview-head');
						inputTopAsHeader.checked = true;
					} else if (inputs.makeTableResponsive == 'unchecked') {
						table.classList.remove('wptb-table-preview-head');
						inputTopAsHeader.checked = false;
					}
				}

				if (table.hasOwnProperty('reconstraction')) {
					table.reconstraction();
				}
			}
		} else if (inputs.hasOwnProperty('applyTableContainerMaxWidth')) {
			const wptbTableSetup = document.querySelector('.wptb-table-setup');
			if (inputs.applyTableContainerMaxWidth == 'checked') {
				let table_id = WPTB_Helper.detectMode();

				if (!table_id) {
					table_id = 'startedid-0';
				}

				let tableContainerMaxWidthInput = document.getElementsByClassName(
					`wptb-el-main-table_setting-${table_id}-tableContainerMaxWidth`
				);
				let tableContainerMaxWidthInputValue = 850;
				if (tableContainerMaxWidthInput.length > 0) {
					tableContainerMaxWidthInput = tableContainerMaxWidthInput[0];
					if (tableContainerMaxWidthInput.value)
						tableContainerMaxWidthInputValue = tableContainerMaxWidthInput.value;
				}

				table.dataset.wptbTableContainerMaxWidth = tableContainerMaxWidthInputValue;
				if (wptbTableSetup) wptbTableSetup.style.maxWidth = `${tableContainerMaxWidthInputValue}px`;
			} else if (inputs.applyTableContainerMaxWidth == 'unchecked') {
				table.removeAttribute('data-wptb-table-container-max-width');
				if (wptbTableSetup) wptbTableSetup.style.maxWidth = null;
			}

			table.tdDefaultWidth();
		} else if (inputs.hasOwnProperty('tableContainerMaxWidth')) {
			if (inputs.tableContainerMaxWidth) {
				table.dataset.wptbTableContainerMaxWidth = inputs.tableContainerMaxWidth;

				const wptbTableSetup = document.querySelector('.wptb-table-setup');
				if (wptbTableSetup) wptbTableSetup.style.maxWidth = `${inputs.tableContainerMaxWidth}px`;

				table.tdDefaultWidth();
			}
		} else if (inputs.hasOwnProperty('tableManageCells')) {
			WPTB_Helper.toggleTableEditMode();
			wptbTableSetup.removeEventListener('click', sortableTableStart, false);
			wptbTableSetup.removeAttribute('data-wptb-sortable-table');
			WPTB_Helper.elementOptionsSet('table_setting', table);
		} else if (inputs.hasOwnProperty('tableAlignmentCheckbox')) {
			table.tdDefaultWidth();
		} else if (inputs.hasOwnProperty('tableCellMinAutoWidth')) {
			table.tdDefaultWidth();
		} else if (inputs.hasOwnProperty('tableBorder')) {
			table.tdDefaultWidth();
		} else if (inputs.hasOwnProperty('tableBorderColor')) {
			WPTB_TableSettingsData.setTableSetting('borderColor', inputs.tableBorderColor);
		} else if (inputs.hasOwnProperty('tableInnerBorderSize')) {
			table.tdDefaultWidth();
		} else if (inputs.hasOwnProperty('tableCellPadding')) {
			table.tdDefaultWidth();
		} else if (inputs.hasOwnProperty('addLeftColumn')) {
			table.addColumnStart();
		} else if (inputs.hasOwnProperty('addRightColumn')) {
			table.addColumnEnd();
		} else if (inputs.hasOwnProperty('addTopRow')) {
			table.addRowToTheStart();
		} else if (inputs.hasOwnProperty('addBottomRow')) {
			table.addRowToTheEnd();
		} else if (inputs.hasOwnProperty('mergeSelectedCells')) {
			table.mergeCells();
		} else if (inputs.hasOwnProperty('splitSelectedSell')) {
			table.splitCell();
		} else if (inputs.hasOwnProperty('deleteHighlightedColumn')) {
			table.deleteColumn();
		} else if (inputs.hasOwnProperty('deleteHighlightedRow')) {
			table.deleteRow();
		} else if (
			inputs.hasOwnProperty('closeManageCellsModeTop') ||
			inputs.hasOwnProperty('closeManageCellsModeBottom')
		) {
			WPTB_Helper.toggleTableEditMode();
		} else if (inputs.hasOwnProperty('insertColumnAfter')) {
			table.addColumnAfter();
		} else if (inputs.hasOwnProperty('insertColumnBefore')) {
			table.addColumnBefore();
		} else if (inputs.hasOwnProperty('insertRowAfter')) {
			table.addRowAfter();
		} else if (inputs.hasOwnProperty('insertRowBefore')) {
			table.addRowBefore();
		} else if (inputs.hasOwnProperty('tableSortable')) {
			if (inputs.tableSortable === 'checked') {
				wptbTableSetup.addEventListener('click', sortableTableStart, false);
			} else if (inputs.tableSortable === 'unchecked') {
				wptbTableSetup.removeEventListener('click', sortableTableStart, false);
			}
		}
	}
}
WPTB_Helper.controlsInclude(table, controlsChange);

const tableBorderColor = WPTB_Helper.getElementColorStylesHex(table, 'borderColor');
WPTB_TableSettingsData.setTableSetting('borderColor', tableBorderColor);
// table.addEventListener('wp-table-builder/table-changed/after', function () {
//     WPTB_Helper.elementOptionsSet( 'table_setting', table );
// }, true);

/**
 * function for sorting the table vertically by the numeric content of cells
 * @param e
 * @param table
 */
function sortableTable(e, table) {
	if (e.target && e.target.tagName === 'TD' && e.target.dataset.yIndex === '0') {
		let tds = table.querySelectorAll(`[data-x-index="${e.target.dataset.xIndex}"]`);
		tds = [...tds];
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
		const rowsNumberValuesArr = [];
		let rowsTdFirst;

		let tdYCoordsRowSpanPrevious = 0;
		for (let i = 0; i < tds.length; i++) {
			let td = tds[i];

			const difference = td.dataset.yIndex - tdYCoordsRowSpanPrevious;
			if (difference > 0) {
				const row = table.rows[tdYCoordsRowSpanPrevious];

				const rowTds = row.children;
				for (let j = 0; j < rowTds.length; j++) {
					let colspan = rowTds[j].colSpan;
					if (!colspan) colspan = 1;

					if (
						rowTds[j].dataset.xIndex < e.target.dataset.xIndex &&
						parseInt(rowTds[j].dataset.xIndex, 10) + parseInt(colspan, 10) >= e.target.dataset.xIndex
					) {
						td = rowTds[j];
						i--;
						break;
					}
				}
			}

			let tdRowspan = parseInt(td.rowSpan, 10);
			if (!tdRowspan) tdRowspan = 1;

			if (i == tds.length - 1 && parseInt(td.dataset.yIndex, 10) + tdRowspan < table.rows.length) {
				const row = table.rows[parseInt(td.dataset.yIndex, 10) + 1];

				const rowTds = row.children;
				for (let j = 0; j < rowTds.length; j++) {
					let colspan = rowTds[j].colSpan;
					if (!colspan) colspan = 1;

					if (
						rowTds[j].dataset.xIndex < e.target.dataset.xIndex &&
						parseInt(rowTds[j].dataset.xIndex, 10) + parseInt(colspan, 10) >= e.target.dataset.xIndex
					) {
						tds.push(rowTds[j]);
						break;
					}
				}
			}

			tdYCoordsRowSpanPrevious = parseInt(td.dataset.yIndex, 10) + tdRowspan;

			let textElements = td.querySelectorAll('.wptb-text-container');
			textElements = [...textElements];
			let numberValue = '';
			for (let j = 0; j < textElements.length; j++) {
				const p = textElements[j].querySelector('p');
				numberValue = parseInt(p.innerText, 10);
				if (numberValue) {
					break;
				}
			}

			const rowsTd = [];
			for (let j = 0; j < tdRowspan; j++) {
				rowsTd.push(table.rows[parseInt(td.dataset.yIndex, 10) + j]);
			}
			if (td.dataset.yIndex > 0) {
				rowsNumberValuesArr.push({
					rowsTd,
					value: numberValue,
				});
			} else {
				rowsTdFirst = rowsTd;
			}
		}

		let sortedAsc;
		if (e.currentTarget && e.currentTarget.classList.contains('wptb-table-setup')) {
			if (e.currentTarget.dataset.sortedAsc && e.currentTarget.dataset.sortedAsc === e.target.dataset.xIndex) {
				e.currentTarget.removeAttribute('data-sorted-asc');
				sortedAsc = false;
			} else {
				e.currentTarget.dataset.sortedAsc = e.target.dataset.xIndex;
				sortedAsc = true;
			}
		}

		if (rowsNumberValuesArr.length)
			rowsNumberValuesArr.sort((prev, next) => (sortedAsc ? prev.value - next.value : next.value - prev.value));

		rowsNumberValuesArr.unshift({ rowsTd: rowsTdFirst });

		const tBody = table.querySelector('tbody');
		tBody.innerHTML = '';

		rowsNumberValuesArr.map((rowsValObj) => {
			rowsValObj.rowsTd.map((row) => {
				tBody.appendChild(row);
			});
		});

		table.recalculateIndexes();

		WPTB_CutGlueTable.glueTableHorizontally(table);

		const tdsAll = [...table.getElementsByTagName('td')];
		for (let i = 0; i < tdsAll.length; i++) {
			if (tdsAll[i].hasAttribute('data-same-cell-before-division')) {
				tdsAll[i].removeAttribute('data-same-cell-before-division');
			}
		}

		const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
		wptbTableStateSaveManager.tableStateSet();
	}
}

/**
 * function for run sorting table
 * @param e
 */
function sortableTableStart(e) {
	console.log('Hello3');
	sortableTable(e, table);
}
