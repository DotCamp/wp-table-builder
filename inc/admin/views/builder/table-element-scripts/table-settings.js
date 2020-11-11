const table = element;
const tableId = WPTB_Helper.getTableId();
const wptbTableSetup = table.parentNode;
let responsiveFront;

const sortableTable = new WPTB_SortableTable({table});
if(typeof WPTB_ResponsiveFrontend === 'function') {
	responsiveFront = new WPTB_ResponsiveFrontend({ query: '.wptb-builder-responsive table' });
} else {
	responsiveFront = '';
}
sortableTable.sortableTableInitialization(responsiveFront);

/**
 * makes sort checkbox not inactive
 * @param type
 */
let controlTableSortableDisable = (type) => {
	let controlName = '';
	if (type === 'vertical') {
		controlName = 'tableSortableVertical';
	} else if (type === 'horizontal') {
		controlName = 'tableSortableHorizontal';
	}
	const control = document.querySelector(`.wptb-el-main-table_setting-${tableId}-${controlName}`);
	if (control) control.checked = false;
};

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
				let tableContainerMaxWidthInput = document.getElementsByClassName(
					`wptb-el-main-table_setting-${tableId}-tableContainerMaxWidth`
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
			// @deprecated
			// WPTB_Helper.toggleTableEditMode();
			// sortableTable.sortModeSwitcher('vertical', false);
			// sortableTable.sortModeSwitcher('horizontal', false);
			// controlTableSortableDisable('vertical');
			// controlTableSortableDisable('horizontal');
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
		} else if (inputs.hasOwnProperty('tableSortableVertical')) {
			if (inputs.tableSortableVertical === 'checked') {
				controlTableSortableDisable('horizontal');

				sortableTable.sortModeSwitcher('vertical', true);
			} else if (inputs.tableSortableVertical === 'unchecked') {
				sortableTable.sortModeSwitcher('vertical', false);
			}
		} else if (inputs.hasOwnProperty('tableSortableHorizontal')) {
			if (inputs.tableSortableHorizontal === 'checked') {
				controlTableSortableDisable('vertical');

				sortableTable.sortModeSwitcher('horizontal', true);
			} else if (inputs.tableSortableHorizontal === 'unchecked') {
				sortableTable.sortModeSwitcher('horizontal', false);
			}
		}
	}
}
WPTB_Helper.controlsInclude(table, controlsChange);

const tableBorderColor = WPTB_Helper.getElementColorStylesHex(table, 'borderColor');
WPTB_TableSettingsData.setTableSetting('borderColor', tableBorderColor);

// handle changing into manage cells menu
document.addEventListener('wptbSectionChanged', ({ detail }) => {
	if (detail === 'manage_cells') {
		WPTB_Helper.toggleTableEditMode();
	}
});
