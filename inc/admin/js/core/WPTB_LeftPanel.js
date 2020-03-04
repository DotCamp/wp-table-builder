var WPTB_LeftPanel = function () {

    let table = document.getElementsByClassName('wptb-preview-table')[0],
        wptbElementButtons = document.getElementsByClassName('wptb-element');
    
    let wptbTableColumnWidthNumber = document.getElementById( 'wptb-table-column-width-number' );
    WPTB_Helper.numberImputSize( wptbTableColumnWidthNumber, 2, 500 );
    
    let wptbTableRowHeightNumber = document.getElementById( 'wptb-table-row-height-number' );
    WPTB_Helper.numberImputSize( wptbTableRowHeightNumber, 2, 200 );
    
    document.getElementById( 'wptb-table-column-width-slider' ).oninput = function () {
        document.getElementById( 'wptb-table-column-width-number' ).value = this.value;
        table.addColumnWidth( this.value );
    };
    
    document.getElementById( 'wptb-table-column-width-slider' ).onchange = function () {
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };
    
    document.getElementById( 'wptb-table-column-width-number' ).onchange = function () {
        document.getElementById( 'wptb-table-column-width-slider' ).value = this.value;
        table.addColumnWidth( this.value );
        
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };
    
    document.getElementById( 'wptb-table-column-width-auto-fixed' ).onchange = function () {
        if( this.checked ) {
            let highlighted = table.querySelector( '.wptb-highlighted' );
            let width = WPTB_Helper.getColumnWidth( table, highlighted );
            table.addColumnWidth( width );
        } else {
            table.addColumnWidth( false, true );
            let highlighted = table.querySelector( '.wptb-highlighted' );
            let width = WPTB_Helper.getColumnWidth( table, highlighted );
            document.getElementById( 'wptb-table-column-width-number' ).value = width;
            document.getElementById( 'wptb-table-column-width-slider' ).value = width;
        }
        
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById( 'wptb-table-row-height-slider' ).oninput = function () {
        document.getElementById( 'wptb-table-row-height-number' ).value = this.value;
        table.addRowHeight( this.value );
    };
    
    document.getElementById( 'wptb-table-row-height-slider' ).onchange = function () {
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById( 'wptb-table-row-height-number' ).onchange = function () {
        document.getElementById( 'wptb-table-row-height-slider' ).value = this.value;
        table.addRowHeight( this.value );
        
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };
    
    document.getElementById( 'wptb-table-row-height-auto-fixed' ).onchange = function () {
        if( this.checked ) {
            let highlighted = table.querySelector( '.wptb-highlighted' );
            let height = WPTB_Helper.getRowHeight( table, highlighted );
            table.addRowHeight( height );
        } else {
            table.addRowHeight( false, true );
            let highlighted = table.querySelector( '.wptb-highlighted' );
            let height = WPTB_Helper.getRowHeight( table, highlighted );
            document.getElementById( 'wptb-table-row-height-number' ).value = height;
            document.getElementById( 'wptb-table-row-height-slider' ).value = height;
        }
        
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };
    
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
//                if( inputs.makeTableResponsive == 'checked' ) {
//                    table.dataset.wptbAdaptiveTable = 1;
//                } else if( inputs.makeTableResponsive == 'unchecked' ) {
//                    table.dataset.wptbAdaptiveTable = 0;
//                }
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
            }
        } 
    }

    WPTB_Helper.controlsInclude( table, controlsChange );

    for (var i = 0; i < wptbElementButtons.length; i++) {
        wptbElementButtons[i].ondragstart = function (e) {
            e.dataTransfer.setData('wptbElement', this.dataset.wptbElement);
            e.dataTransfer.setData( 'wptbElIndic-' + this.dataset.wptbElement, 'wptbElIndic-' + this.dataset.wptbElement );
        }
    };
    
    if( table ) {
        document.getElementById( 'wptb-table-edit-mode-close' ).onclick = WPTB_Helper.toggleTableEditMode;
        document.getElementById( 'wptb-left-scroll-panel-curtain-close' ).onclick = WPTB_Helper.toggleTableEditMode;
        document.getElementById('wptb-add-end-row').onclick = table.addRowToTheEnd;
        document.getElementById('wptb-add-start-row').onclick = table.addRowToTheStart;
        document.getElementById('wptb-add-row-before').onclick = table.addRowBefore;
        document.getElementById('wptb-add-row-after').onclick = table.addRowAfter;
        document.getElementById('wptb-add-end-column').onclick = table.addColumnEnd;
        document.getElementById('wptb-add-start-column').onclick = table.addColumnStart;
        document.getElementById('wptb-add-column-before').onclick = table.addColumnBefore;
        document.getElementById('wptb-add-column-after').onclick = table.addColumnAfter;
        document.getElementById('wptb-delete-column').onclick = table.deleteColumn;
        document.getElementById('wptb-delete-row').onclick = table.deleteRow;
        document.getElementById('wptb-merge-cells').onclick = table.mergeCells;
        document.getElementById('wptb-split-cell').onclick = table.splitCell;
    };
    
    document.querySelector( '.wptb-left-panel-extend' ).onclick = function() {
        let wptbContainer = document.querySelector( '.wptb-container' );
        if( wptbContainer ) {
            if ( wptbContainer.classList.contains( 'collapsed' ) ) {
                wptbContainer.classList.remove( 'collapsed' );
            } else {
                wptbContainer.classList.add( 'collapsed' );
            }
        }
    };
    
    // this code hides the "element parameters" area 
    // when clicked outside this element and its "tinymce" toolbar 
    let wptbBuilderPanel = document.getElementsByClassName( 'wptb-builder-panel' )[0];
    wptbBuilderPanel.onclick = function( e ) {
        if( ! e.target.classList.contains( 'wptb-ph-element' ) && ! WPTB_Helper.findAncestor( e.target, 'wptb-ph-element' ) && 
               ! e.target.classList.contains( 'wptb-fixed-toolbar' ) && ! WPTB_Helper.findAncestor( e.target, 'wptb-fixed-toolbar' ) ) {
            WPTB_Helper.clickOnFreeSpace();
        } 
    };
   
    let wptbHeader = document.getElementsByClassName( 'wptb-header' );
    if( wptbHeader.length > 0 ) wptbHeader = wptbHeader[0];
    wptbHeader.onclick = function() {
        WPTB_Helper.clickOnFreeSpace();
    };
};