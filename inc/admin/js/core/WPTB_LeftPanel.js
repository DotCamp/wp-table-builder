var WPTB_LeftPanel = function () {

    var table = document.getElementsByClassName('wptb-preview-table')[0],
        wptbElementButtons = document.getElementsByClassName('wptb-element');
    
    function wptbTdBgColorSavedSet( inputId, trNumber ) {
        if ( trNumber > 3 ) return;
        if( table ) {
            let tableRows = table.getElementsByTagName('tr');
            if ( tableRows.length > trNumber ) {
                let trBackgroundColor = tableRows[trNumber].style.backgroundColor;
                var wptbEvenRowBg = document.getElementById(inputId);
                if ( wptbEvenRowBg && trBackgroundColor ) {
                    wptbEvenRowBg.value = WPTB_Helper.rgbToHex( trBackgroundColor );
                }
            }
        }
        
    }
    
    wptbTdBgColorSavedSet( 'wptb-even-row-bg', 1 );
    jQuery('#wptb-even-row-bg').wpColorPicker({
        change: function ( event, ui ) {
            var tableRows = table.getElementsByTagName('tr');
            for ( let i = 1; i < tableRows.length; i += 2 ) {
                tableRows[i].style.backgroundColor = ui.color.toString();
            }
            console.log(event);
            console.log(this);
            WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving( event );
        },
        clear: function(){
            var tableRows = table.getElementsByTagName('tr');
            for ( let i = 1; i < tableRows.length; i += 2 ) {
                tableRows[i].style.backgroundColor = '';
                let tds = tableRows[i].getElementsByTagName('td');
                for ( let j = 0; j < tds.length; j++ ) {
                    tds[j].style.backgroundColor = '';
                }
            }
            
            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        },

    });
    
    wptbTdBgColorSavedSet( 'wptb-odd-row-bg', 2 );
    jQuery('#wptb-odd-row-bg').wpColorPicker({
        change: function ( event, ui ) {
            var tableRows = table.getElementsByTagName('tr');
            for ( let i = 2; i < tableRows.length; i += 2 ) {
                tableRows[i].style.backgroundColor = ui.color.toString();
            }
            
            WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving( event );
        },
        clear: function(){
            var tableRows = table.getElementsByTagName('tr');
            for ( let i = 2; i < tableRows.length; i += 2 ) {
                tableRows[i].style.backgroundColor = '';
                let tds = tableRows[i].getElementsByTagName( 'td' );
                for ( var j = 0; j < tds.length; j++ ) {
                    tds[j].style.backgroundColor = '';
                }
            }
            
            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        },
    });
    
    wptbTdBgColorSavedSet( 'wptb-table-header-bg', 0 );
    jQuery('#wptb-table-header-bg').wpColorPicker({
        change: function (event, ui) {
            var tableHeader = table.getElementsByTagName('tr')[0];
            tableHeader.style.backgroundColor = ui.color.toString();
            
            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        },
        clear: function(){
            var tableHeader = table.getElementsByTagName('tr')[0];
            tableHeader.style.backgroundColor = '';
            let tds = tableHeader.getElementsByTagName('td');
            for (var j = 0; j < tds.length; j++) {
                tds[j].style.backgroundColor = '';
            }
            
            WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving( event );
        },
    });
    
    function tableAdaptiveForMobile( table ) {
        let wptbAdaptiveTableCheckbox = document.getElementById( 'wptb-adaptive-table-checkbox' );
        if( table && table.dataset.wptbAdaptiveTable && table.dataset.wptbAdaptiveTable == "1" ) {
            wptbAdaptiveTableCheckbox.checked = true;
        } else {
            wptbAdaptiveTableCheckbox.checked = false;
        }
    }
    tableAdaptiveForMobile( table );
    
    function tableTopRowAsHeadSavedSet( table ) {
        let wptbTopRowAsHeader = document.getElementById( 'wptb-top-row-as-header' );
        
        if( table && table.classList.contains( 'wptb-table-preview-head' ) ) {
            wptbTopRowAsHeader.checked = true;
        } else {
            wptbTopRowAsHeader.checked = false;
        }
    }
    tableTopRowAsHeadSavedSet( table );
    
    function tableBorderColorWidthSavedSet() {
        let table = document.getElementsByClassName('wptb-preview-table');
        if ( table.length > 0 ) {
            let tableBorderColor = table[0].style.borderColor;
            if ( tableBorderColor ) {
                let tableBorderColorInput = document.getElementById( 'wptb-table-border-color' );
                if ( tableBorderColorInput ) {
                    tableBorderColorInput.value = WPTB_Helper.rgbToHex( tableBorderColor );
                }
            }
            
            let tableBorderWidth = table[0].style.borderWidth;
            if ( tableBorderWidth ) {
                let wptbTableBorderWidthSlider = document.getElementById('wptb-table-border-slider'),
                    wptbTableBorderWidthNumber = document.getElementById('wptb-table-border-number');
                
                if ( wptbTableBorderWidthSlider ) {
                    wptbTableBorderWidthSlider.value = parseInt( tableBorderWidth );
                }
                if ( wptbTableBorderWidthNumber ) {
                    wptbTableBorderWidthNumber.value = parseInt( tableBorderWidth );
                }
            }
            
            
            let tableTd = table[0].querySelector( 'td' );
            let applyInnerBorder = tableTd.style.borderWidth;
            if ( applyInnerBorder ) {
                let innerBorderCheckInput = document.getElementById( 'wptb-inner-border-check' );
                let wptbApplyInnerBorder = document.getElementById( 'wptb-apply-inner-border' );
                if ( applyInnerBorder && parseInt( applyInnerBorder ) > 0 ) {
                    if ( innerBorderCheckInput ) {
                        innerBorderCheckInput.checked = true;
                        
                        if ( wptbApplyInnerBorder ) {
                            wptbApplyInnerBorder.classList.add( 'visible' );
                            let wptbTableInnerBorderSlider = document.getElementById( 'wptb-table-inner-border-slider' );
                            let wptbTableInnerBorderNumber = document.getElementById( 'wptb-table-inner-border-number' );
                            wptbTableInnerBorderSlider.value = parseInt( applyInnerBorder );
                            wptbTableInnerBorderNumber.value = parseInt( applyInnerBorder );
                        }
                    }
                } else {
                    innerBorderCheckInput.checked = false;
                }
            }
            
            if ( ( tableBorderWidth && parseInt( tableBorderWidth ) > 0 ) || ( applyInnerBorder && parseInt( applyInnerBorder ) > 0 ) ) {
                document.getElementById( 'wptb-table-border-color-set-area' ).style.display = '';
            }
        }
    }
    
    tableBorderColorWidthSavedSet();

    jQuery('#wptb-table-border-color').wpColorPicker({
        change: function (event, ui) {
            var tableCells = table.getElementsByTagName('td');
            table.style.border = document.querySelector('#wptb-table-border-number').value + 'px solid ' + ui.color.toString();

            for (var i = 0; i < tableCells.length; i++) {
                let tableInnerborderNumber = document.querySelector('#wptb-table-inner-border-number').value;
                if ( document.getElementById('wptb-inner-border-check').checked ) {
                    tableCells[i].style.border = ( tableInnerborderNumber != 0 ? tableInnerborderNumber : 1 ) + 'px solid ' + ui.color.toString();
                }
            }
            WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving( event );
        },
        clear: function() {
            var tableCells = table.getElementsByTagName('td');
            table.style.borderColor = '';

            for (var i = 0; i < tableCells.length; i++) {
                tableCells[i].style.borderColor = '';
            }
            
            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    });

    function addInnerBorderSize(value) {
        var tableCells = table.getElementsByTagName('td');
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.borderWidth = document.querySelector('#wptb-table-inner-border-number').value + 'px';
            tableCells[i].style.borderStyle = 'solid';
        }
    }

    function addCellPadding(value) {
        var tableCells = table.getElementsByTagName('td');
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.padding = value + 'px';
        }
    }

    function addInnerBorder( checked ) {
        var styles, color = document.querySelector('#wptb-table-border-color').value != undefined ?
            document.querySelector('#wptb-table-border-color').value : 'rgb(0,0,0)';
            if ( document.querySelector( '#wptb-table-inner-border-slider' ).value == 0 || document.querySelector( '#wptb-table-inner-border-number' ).value == 0 ) {
                document.querySelector( '#wptb-table-inner-border-slider' ).value = 1;
                document.querySelector( '#wptb-table-inner-border-number' ).value = 1;
            }
            let width = document.querySelector( '#wptb-table-inner-border-slider' ).value + 'px';
        let wptbPreviewTable = document.getElementsByClassName('wptb-preview-table');
        if( wptbPreviewTable.length > 0 ) {
            if (checked == 'checked') {
                document.getElementById('wptb-apply-inner-border').style.marginBottom = '0px';
                var tableCells = wptbPreviewTable[0].getElementsByTagName( 'td' );
                for (var i = 0; i < tableCells.length; i++) {
                    tableCells[i].style.border = width + ' solid ' + color;
                }
                document.getElementById( 'wptb-apply-inner-border' ).classList.add( 'visible' );
            } else {
                document.getElementById( 'wptb-apply-inner-border' ).classList.remove( 'visible' );
                var tableCells = wptbPreviewTable[0].getElementsByTagName( 'td' );
                for (var i = 0; i < tableCells.length; i++) {
                    tableCells[i].style.border = '0px solid ' + color;
                    tableCells[i].style.border = null;
                }
            }
        }
        
    }

    function addBorderSize( value ) {
        table.style.borderWidth = value + 'px';
        table.style.borderStyle = 'solid';
    }
    
    function cellPaddingSavedSet() {
        let table = document.getElementsByClassName('wptb-preview-table');
        
        if ( table.length > 0 ) {
            let td = table[0].querySelector( 'td' );
            
            if ( td ) {
                let padding = td.style.padding;
                
                if ( padding ) {
                    let wptbTableCellSlider = document.getElementById('wptb-table-cell-slider'),
                        wptbTableCellNumber = document.getElementById('wptb-table-cell-number');
                
                    if ( wptbTableCellSlider ) {
                        wptbTableCellSlider.value = parseInt( padding );
                    }
                    if ( wptbTableCellNumber ) {
                        wptbTableCellNumber.value = parseInt( padding );
                    }
                }
            }
        }
    }
    
    cellPaddingSavedSet();
    
    function numberImputSize( wptbNumberInputs, maxCount, maxValue ) {
        wptbNumberInputs.onkeydown = function() {
            let thisValue = this.value;
            thisValue = String( thisValue );
            if ( thisValue[0] == 0 ) {
                this.value = "";
            } else {
                thisValue = thisValue.substring( 0, maxCount );
                this.value = thisValue;
            }
        }
        wptbNumberInputs.onkeyup = function() {
            let thisValue = this.value;
            thisValue = String( thisValue );
            if ( thisValue > maxValue ) {
                this.value = maxValue;
            }
        }
    }
    
    let wptbTableBorderNumber = document.getElementById( 'wptb-table-border-number' );
    numberImputSize( wptbTableBorderNumber, 1, 50 );
    
    let wptbTableInnerBorderNumber = document.getElementById( 'wptb-table-inner-border-number' );
    numberImputSize( wptbTableInnerBorderNumber, 1, 50 );
    
    let wptbTableCellNumber = document.getElementById( 'wptb-table-cell-number' );
    numberImputSize( wptbTableCellNumber, 1, 50 );
    
    let wptbTextfontSizeNumber = document.getElementById( 'wptb-text-font-size-number' );
    numberImputSize( wptbTextfontSizeNumber, 1, 50 );
    
    let wptbImageWidthNumber = document.getElementById( 'wptb-image-width-number' );
    numberImputSize( wptbImageWidthNumber, 2, 100 );
    
    let wptbTableColumnWidthNumber = document.getElementById( 'wptb-table-column-width-number' );
    numberImputSize( wptbTableColumnWidthNumber, 2, 500 );
    
    let wptbTableRowHeightNumber = document.getElementById( 'wptb-table-row-height-number' );
    numberImputSize( wptbTableRowHeightNumber, 2, 200 );
    
    
    
    document.getElementById('wptb-table-cell-slider').oninput = function () {
        document.getElementById('wptb-table-cell-number').value = this.value;
        addCellPadding(this.value);
        table.tdDefaultWidth();
    };
    
    document.getElementById('wptb-table-cell-slider').onchange = function() {
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    }

    document.getElementById('wptb-table-cell-number').onchange = function () {
        document.getElementById('wptb-table-cell-slider').value = this.value;
        addCellPadding(this.value);
        table.tdDefaultWidth();
        
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-border-slider').oninput = function () {
        document.getElementById('wptb-table-border-number').value = this.value;
        addBorderSize(this.value);
        table.tdDefaultWidth();
        
        let wptbInnerBorderCheck = document.getElementById('wptb-inner-border-check').checked,
            tableBorderColorSetArea = document.getElementById( 'wptb-table-border-color-set-area' );
        if ( this.value == 0 && wptbInnerBorderCheck == false ) {
            tableBorderColorSetArea.style.display = 'none';
        } else {
            tableBorderColorSetArea.style.display = '';
        }
    };
    
    document.getElementById('wptb-table-border-slider').onchange = function() {
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    }

    document.getElementById('wptb-table-border-number').onchange = function () {
        document.getElementById('wptb-table-border-slider').value = this.value;
        addBorderSize(this.value);
        table.tdDefaultWidth();
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-inner-border-slider').oninput = function () {
        document.getElementById('wptb-table-inner-border-number').value = this.value;
        addInnerBorderSize(this.value);
        table.tdDefaultWidth();
    };
    
    document.getElementById('wptb-table-inner-border-slider').onchange = function () {
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    }

    document.getElementById('wptb-table-inner-border-number').onchange = function () {
        document.getElementById('wptb-table-inner-border-slider').value = this.value;
        addInnerBorderSize(this.value);
        table.tdDefaultWidth();
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-inner-border-check').onchange = function () {
        if( table ) {
            let val = this.checked ? 'checked' : 'unchecked';
            addInnerBorder( val );
            let borderWidth = document.getElementById('wptb-table-border-slider').value,
                tableBorderColorSetArea = document.getElementById( 'wptb-table-border-color-set-area' );
            if( val == 'unchecked' && borderWidth == 0 ) {
                tableBorderColorSetArea.style.display = 'none';
            } else {
                tableBorderColorSetArea.style.display = '';
            }
            
            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    };
    
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
    
    document.getElementById( 'wptb-adaptive-table-checkbox' ).onchange = function() {
        if( this.checked ) {
            table.dataset.wptbAdaptiveTable = 1;
        } else {
            table.dataset.wptbAdaptiveTable = 0;
        }
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };
    
    function createMobileHeadForTable( table, thisEvent ) {
        
        if( thisEvent.checked ) {
            WPTB_Helper.dataTitleColumnSet( table );
            
            table.classList.add( 'wptb-table-preview-head' );
            table.rows[0].classList.add( 'wptb-table-head' );
        } else {
            let rows = table.rows;
            table.classList.remove( 'wptb-table-preview-head' );
            rows[0].classList.remove( 'wptb-table-head' );
            
            for ( let i = 1; i < rows.length; i++ ) {
                let thisRow = rows[i],
                    thisRowChildren = thisRow.children;
                for( let j = 0; j < thisRowChildren.length; j++ ) {
                    thisRowChildren[j].removeAttribute( 'data-wptb-title-column' );
                    thisRowChildren[j].removeAttribute( 'data-wptb-title-column-font-size' );
                    thisRowChildren[j].removeAttribute( 'data-wptb-title-column-color' );
                    thisRowChildren[j].removeAttribute( 'data-wptb-title-background-color' );
                    thisRowChildren[j].removeAttribute( 'data-wptb-title-align' );
                }
            }
        }
    }
    
    document.getElementById( 'wptb-top-row-as-header' ).onchange = function () {
        createMobileHeadForTable( table, this );
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    }

    for (var i = 0; i < wptbElementButtons.length; i++) {
        wptbElementButtons[i].ondragstart = function (e) {
            e.dataTransfer.setData('wptbElement', this.dataset.wptbElement);
            e.dataTransfer.setData( 'wptbElIndic-' + this.dataset.wptbElement, 'wptbElIndic-' + this.dataset.wptbElement );
        }
    }
    
    if( table ) {
        document.getElementById('wptb-activate-cell-management-mode').onclick = table.toggleTableEditMode;
        document.getElementById( 'wptb-table-edit-mode-close' ).onclick = table.toggleTableEditMode;
        document.getElementById( 'wptb-left-scroll-panel-curtain-close' ).onclick = table.toggleTableEditMode;
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
    }
    
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
            clickOnFreeSpace();
        } 
   };
   
   let wptbHeader = document.getElementsByClassName( 'wptb-header' );
   if( wptbHeader.length > 0 ) wptbHeader = wptbHeader[0];
   wptbHeader.onclick = function() {
       clickOnFreeSpace();
   }
   
   function clickOnFreeSpace() {
       document.getElementsByClassName( 'wptb-elements-container' )[0].style.display = 'table';
        document.getElementsByClassName( 'wptb-settings-section' )[0].style.display = 'block';
        document.getElementById( 'element-options-group' ).style.display = 'none';
        let wpcdFixedToolbar = document.getElementById( 'wpcd_fixed_toolbar' );
        if( wpcdFixedToolbar.hasAttribute( 'data-toolbar-active-id' ) ) {
            document.getElementById( wpcdFixedToolbar.getAttribute( 'data-toolbar-active-id' ) ).classList.remove( 'toolbar-active' );
        }
   }
   
};