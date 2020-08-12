let table = element;
console.log("Hello15");
function controlsChange( inputs, table ) {
    if( inputs && typeof inputs === 'object' ) {
        if( inputs.hasOwnProperty( 'tableTopRowsAsHeader' ) ) {
//                if( inputs.tableTopRowsAsHeader == 'checked' ) {
//                    let rows = table.rows;
//                    table.classList.add( 'wptb-table-preview-head' );
//                } else if( inputs.tableTopRowsAsHeader == 'unchecked' ) {
//                    let rows = table.rows;
//                    table.classList.remove( 'wptb-table-preview-head' );
//
//                    for ( let i = 1; i < rows.length; i++ ) {
//                        let thisRow = rows[i],
//                            thisRowChildren = thisRow.children;
//                        for( let j = 0; j < thisRowChildren.length; j++ ) {
//                            thisRowChildren[j].removeAttribute( 'data-wptb-title-column' );
//                            thisRowChildren[j].removeAttribute( 'data-wptb-title-column-font-size' );
//                            thisRowChildren[j].removeAttribute( 'data-wptb-title-column-color' );
//                            thisRowChildren[j].removeAttribute( 'data-wptb-title-background-color' );
//                            thisRowChildren[j].removeAttribute( 'data-wptb-title-align' );
//                        }
//                    }
//                }
        } else if( inputs.hasOwnProperty( 'makeTableResponsive' ) ) {
            let infArr = table.className.match(/wptb-element-main(.+)-(\d+)/i);
            if( infArr && Array.isArray( infArr ) && typeof infArr[2] != 'undefined' ) {
                let inputSelector;
                if( infArr[2] == '0' ) {
                    inputSelector = 'wptb-el-main-table_setting-startedid-0-tableTopRowsAsHeader';
                } else {
                    inputSelector = 'wptb-el-main-table_setting-' + infArr[2] + '-tableTopRowsAsHeader';
                }

                let inputTopAsHeader = document.querySelector( '.' + inputSelector );
                if( inputTopAsHeader ) {
                    if( inputs.makeTableResponsive == 'checked' ) {
                        table.classList.add( 'wptb-table-preview-head' );
                        inputTopAsHeader.checked = true;
                    } else if( inputs.makeTableResponsive == 'unchecked' ) {
                        table.classList.remove( 'wptb-table-preview-head' );
                        inputTopAsHeader.checked = false;
                    }
                }

                if(table.hasOwnProperty( 'reconstraction' )) {
                    table.reconstraction();
                }
            }
        } else if( inputs.hasOwnProperty( 'applyTableContainerMaxWidth' ) ) {
            let wptbTableSetup = document.querySelector( '.wptb-table-setup' );
            if( inputs.applyTableContainerMaxWidth == 'checked' ) {
                let table_id = WPTB_Helper.detectMode();

                if( ! table_id ) {
                    table_id = 'startedid-0';
                }

                let tableContainerMaxWidthInput = document.getElementsByClassName( 'wptb-el-main-table_setting-' + table_id + '-tableContainerMaxWidth' );
                let tableContainerMaxWidthInputValue = 850;
                if( tableContainerMaxWidthInput.length > 0 ) {
                    tableContainerMaxWidthInput = tableContainerMaxWidthInput[0];
                    if( tableContainerMaxWidthInput.value ) tableContainerMaxWidthInputValue = tableContainerMaxWidthInput.value;
                }

                table.dataset.wptbTableContainerMaxWidth = tableContainerMaxWidthInputValue;
                if( wptbTableSetup ) wptbTableSetup.style.maxWidth = tableContainerMaxWidthInputValue + 'px';
            } else if( inputs.applyTableContainerMaxWidth == 'unchecked' ) {
                table.removeAttribute( 'data-wptb-table-container-max-width' );
                if( wptbTableSetup ) wptbTableSetup.style.maxWidth = null;
            }

            table.tdDefaultWidth();
        } else if( inputs.hasOwnProperty( 'tableContainerMaxWidth' ) ) {
            if( inputs.tableContainerMaxWidth ) {
                table.dataset.wptbTableContainerMaxWidth = inputs.tableContainerMaxWidth;

                let wptbTableSetup = document.querySelector( '.wptb-table-setup' );
                if( wptbTableSetup ) wptbTableSetup.style.maxWidth = inputs.tableContainerMaxWidth + 'px';

                table.tdDefaultWidth();
            }
        } else if( inputs.hasOwnProperty( 'tableManageCells' ) ) {
            WPTB_Helper.toggleTableEditMode();
        } else if( inputs.hasOwnProperty( 'tableAlignmentCheckbox' ) ) {
            table.tdDefaultWidth();
        } else if( inputs.hasOwnProperty( 'tableCellMinAutoWidth' ) ) {
            table.tdDefaultWidth();
        } else if( inputs.hasOwnProperty( 'tableBorder' ) ) {
            table.tdDefaultWidth();
        } else if(inputs.hasOwnProperty('tableBorderColor')) {
            WPTB_TableSettingsData.setTableSetting('borderColor', inputs.tableBorderColor);
        } else if( inputs.hasOwnProperty( 'tableInnerBorderSize' ) ) {
            table.tdDefaultWidth();
        } else if( inputs.hasOwnProperty( 'tableCellPadding' ) ) {
            table.tdDefaultWidth();
        } else if(inputs.hasOwnProperty('addLeftColumn')) {
            table.addColumnStart();
        } else if(inputs.hasOwnProperty('addRightColumn')) {
            table.addColumnEnd();
        } else if(inputs.hasOwnProperty('addTopRow')) {
            table.addRowToTheStart();
        } else if(inputs.hasOwnProperty('addBottomRow')) {
            table.addRowToTheEnd();
        } else if(inputs.hasOwnProperty('mergeSelectedCells')) {
            table.mergeCells();
        } else if(inputs.hasOwnProperty('splitSelectedSell')) {
            table.splitCell();
        } else if(inputs.hasOwnProperty('deleteHighlightedColumn')) {
            table.deleteColumn();
        } else if(inputs.hasOwnProperty('deleteHighlightedRow')) {
            table.deleteRow();
        } else if(inputs.hasOwnProperty('closeManageCellsModeTop') || inputs.hasOwnProperty('closeManageCellsModeBottom')) {
            WPTB_Helper.toggleTableEditMode();
        } else if(inputs.hasOwnProperty('insertColumnAfter')) {
            table.addColumnAfter();
        } else if(inputs.hasOwnProperty('insertColumnBefore')) {
            table.addColumnBefore();
        } else if(inputs.hasOwnProperty('insertRowAfter')) {
            table.addRowAfter();
        } else if(inputs.hasOwnProperty('insertRowBefore')) {
            table.addRowBefore();
        }
    }
}
WPTB_Helper.controlsInclude( table, controlsChange );

let tableBorderColor = WPTB_Helper.getElementColorStylesHex(table, 'borderColor');
WPTB_TableSettingsData.setTableSetting('borderColor', tableBorderColor);
// table.addEventListener('wp-table-builder/table-changed/after', function () {
//     WPTB_Helper.elementOptionsSet( 'table_setting', table );
// }, true);


