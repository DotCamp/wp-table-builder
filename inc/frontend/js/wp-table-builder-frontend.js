( function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
         * 
         * The file is enqueued from inc/frontend/class-frontend.php.
	 */
        
    

})( jQuery );

jQuery( document ).ready( function ( $ ) {
    /**
     * function wptb_tableContainerSectionSmall
     * add class ( wptb-section-small ) in small width
     * remove this class in large width
     * @returns {void}
     */
    function wptb_tableContainerSectionSmall() {
        let wptbTableContainer = jQuery(".wptb-table-container");
        let sw = wptbTableContainer.width();
        if( wptbTableContainer.length > 0 ) {
            if (sw < 480) {
                wptbTableContainer.addClass("wptb-section-small");
            } else {
                wptbTableContainer.removeClass("wptb-section-small");
            }
        }
    } 
    
    /**
     * function wptb_tableGenerateMobile
     * generates a mobile view of the table 
     * when the top row of the table is not a heading
     * @returns {void}
     */
    function wptb_tableGenerateMobile() {
        let wptbTableContainer = document.getElementsByClassName( 'wptb-table-container' );
        let wptbPreviewTable = document.getElementsByClassName( 'wptb-preview-table' );
        let wptbPreviewTableMobile = document.getElementsByClassName( 'wptb-preview-table-mobile' );
        if( wptbTableContainer.length > 0 && wptbPreviewTable.length > 0 ) {
            let sw = wptbTableContainer[0].offsetWidth;
            if (sw < 480) {
                wptbPreviewTable[0].style.display = 'none';
                
                if( wptbPreviewTableMobile.length == 0 ) {
                    let tableRows = wptbPreviewTable[0].rows;
                    let tableRowTop = tableRows[0];
                    let tableRowTopChildren = tableRowTop.children;
                    let columnCount = 0;

                    for( let i = 0; i < tableRowTopChildren.length; i++ ) {
                        columnCount += tableRowTopChildren[i].colSpan;
                    }

                    let newTableArray = [];

                    for( let i = 0; i < columnCount; i++ ) {
                        newTableArray[i] = [];
                    }
                    
                    for( let i = 0; i < tableRows.length; i++ ) {
                        let rowChildren = tableRows[i].children;

                        for( let j = 0; j < columnCount; j++ ) {
                            if( rowChildren[j].dataset.xIndex == j ) {
                                let tdNew = rowChildren[j].cloneNode( true );
                                if ( tableRows[i].style.backgroundColor ) {
                                    tdNew.style.backgroundColor = tableRows[i].style.backgroundColor;
                                }
                                newTableArray[j].push( tdNew );
                            } else {
                                newTableArray[j].push( '' );
                            }
                        }
                    }
                    
                    let table = document.createElement( 'table' );
                    table.classList.add( 'wptb-preview-table-mobile' );
                    let tableStyle = wptbPreviewTable[0].getAttribute( 'style' );
                    table.setAttribute( 'style', tableStyle );
                    table.style.display = 'table';
                    for ( let i = 0; i < columnCount; i++ ) {
                        let row = table.insertRow(-1);
                        row.classList.add( 'wptb-row' );
                        
                        for ( let j = 0; j < tableRows.length; j++ ) {
                            if( newTableArray[i][j] ) {
                                row.appendChild( newTableArray[i][j] );
                            }
                        }
                    }
                    
                    wptbTableContainer[0].appendChild( table );
                } else {
                    wptbPreviewTableMobile[0].style.display = 'table';
                }
                
            } else {
                wptbPreviewTable[0].style.display = 'table';
                if( wptbPreviewTableMobile.length > 0 ) {
                    wptbPreviewTableMobile[0].style.display = 'none';
                }
                
            }
        }
    }
    
    let wptbPreviewTable = document.getElementsByClassName( 'wptb-preview-table' );
    if ( wptbPreviewTable.length > 0 ) {
        wptbPreviewTable[0].style.display = 'table';
            wptb_tdDefaultWidth();
            wptb_tableReconstraction();
        if( wptbPreviewTable[0].classList.contains( 'wptb-table-preview-head' ) ) {
        } else {
//            wptb_tableGenerateMobile();
//            wptb_tableContainerSectionSmall();
        }

        //when window resize call wpcd_archiveSectionSmall and wptb_tableGenerateMobile
        $( window ).resize( function () {
                wptb_tdDefaultWidth();
                wptb_tableReconstraction();
            if( wptbPreviewTable[0].classList.contains( 'wptb-table-preview-head' ) ) {
            } else {
//                wptb_tableGenerateMobile();
//                wptb_tableContainerSectionSmall();
            }
        });
    }
    
    function wptb_tableReconstraction() {
        let tableContainer = document.getElementsByClassName( 'wptb-table-container' );
        let previewTable = document.getElementsByClassName( 'wptb-preview-table' );
        let tableContainerMatrix = document.getElementsByClassName( 'wptb-table-container-matrix' );
        if( tableContainerMatrix.length > 0 ) {
            tableContainerMatrix = tableContainerMatrix[0];
        }
        let createNewTableIndic = true;
        if( previewTable.length > 0 && tableContainer.length > 0 ) {
            tableContainer = tableContainer[0];
            previewTable = previewTable[0];
            if( previewTable.dataset.reconstraction == 1 && previewTable.dataset.wptbAdaptiveTable == 1 ) {
                let tableContainerWidth = tableContainer.offsetWidth;
                let previewTableWidth = previewTable.offsetWidth;
                if( tableContainerWidth < previewTableWidth ) {
                    tableContainer.style.overflow = 'unset';
                    if( tableContainerMatrix ) tableContainerMatrix.classList.add( 'wptb-matrix-hide' );
                    
                    
                    let tableColumns = previewTable.dataset.tableColumns;
                    if( tableColumns ) {
                        let tdWidth = previewTableWidth / tableColumns;
                        let wholeColumnsInContainer = Math.floor( tableContainerWidth/tdWidth );
                        
                        
                        if( document.getElementsByClassName( 'wptb-preview-table-mobile' ).length > 0 ) {
                            let wptbPreviewTableMobile = document.getElementsByClassName( 'wptb-preview-table-mobile' )[0];
                            wptbPreviewTableMobile.classList.remove( 'wptb-mobile-hide' );
                            let dataWholeColumnInContainer = wptbPreviewTableMobile.dataset.wholeColumnsInContainer;
                            
                            if( dataWholeColumnInContainer == wholeColumnsInContainer && previewTable.classList.contains( 'wptb-table-preview-head' ) ) {
                                createNewTableIndic = false;
                            } else if( dataWholeColumnInContainer == wholeColumnsInContainer && 
                                    ! previewTable.classList.contains( 'wptb-table-preview-head' ) && 
                                    ( tableContainerWidth > 480 || wptbPreviewTableMobile.column == 1 ) ) {
                                createNewTableIndic = false;
                            } else {
                                wptbPreviewTableMobile.parentNode.removeChild( wptbPreviewTableMobile );
                            }
                        }
                        
                        if( createNewTableIndic ) {
                            let newTable = document.createElement( 'table' );
                            newTable.classList.add( 'wptb-preview-table-mobile' );
                            let tableRows = previewTable.rows.length;
                            let valuesIsSaved = false;
                            let newTalbeLastSectionFilledColumns;
                            
                            if ( previewTable.classList.contains( 'wptb-table-preview-head' ) ) {
                                let tableRowsWithoutHeader = tableRows - 1;
                                let newTableColumnsWithoutLeftHeader;

                                for( let i = 0; i < tableRowsWithoutHeader; i++ ) {
                                    newTableColumnsWithoutLeftHeader = wholeColumnsInContainer - 1 - i;
                                    if( newTableColumnsWithoutLeftHeader == 0 ) newTableColumnsWithoutLeftHeader = 1;
                                    newTalbeLastSectionFilledColumns = tableRowsWithoutHeader % newTableColumnsWithoutLeftHeader;
                                    
                                    if( Math.floor( wholeColumnsInContainer / ( newTableColumnsWithoutLeftHeader + 1 ) ) >= 2 && valuesIsSaved ) {
                                        newTableColumnsWithoutLeftHeader = newTableColumnsWithoutLeftHeader + 1;
                                        newTalbeLastSectionFilledColumns = tableRowsWithoutHeader % newTableColumnsWithoutLeftHeader;
                                        break;
                                    }

                                    if( newTalbeLastSectionFilledColumns == 0 ) {
                                        valuesIsSaved = true;
                                        break;
                                    } else if( newTableColumnsWithoutLeftHeader - 2 * newTalbeLastSectionFilledColumns <= 0 ) {
                                        valuesIsSaved = true;
                                        continue;
                                    } else {
                                        if( valuesIsSaved ) {
                                            newTableColumnsWithoutLeftHeader = newTableColumnsWithoutLeftHeader + 1;
                                            newTalbeLastSectionFilledColumns = tableRowsWithoutHeader % newTableColumnsWithoutLeftHeader;
                                            break;
                                        } else {
                                            continue;
                                        }
                                    }
                                }

                                if( valuesIsSaved && newTableColumnsWithoutLeftHeader ) {
                                    let countRows = tableColumns * Math.ceil( tableRowsWithoutHeader / newTableColumnsWithoutLeftHeader );
                                    for( let j = 0; j < countRows; j++ ) {
                                        let sectionNumber = Math.floor( j / tableColumns ),
                                            tr = document.createElement( 'tr' ),
                                            tdLeftHeader = previewTable.rows[0].children[j - sectionNumber*tableColumns].cloneNode( true ),
                                            td;
                                        tdLeftHeader.style.backgroundColor = previewTable.rows[0].style.backgroundColor;
                                        tdLeftHeader.style.width = null;
                                        tdLeftHeader.style.height = null;
                                        tdLeftHeader.removeAttribute( 'data-x-index' );
                                        tdLeftHeader.removeAttribute( 'data-wptb-css-td-auto-width' );
                                        if( sectionNumber > 0 && j % tableColumns == 0 ) {
                                            tdLeftHeader.style.borderTopWidth = '5px';
                                        }
                                        tr.appendChild( tdLeftHeader );

                                        for( let k = newTableColumnsWithoutLeftHeader*( sectionNumber ) + 1; k < newTableColumnsWithoutLeftHeader*( sectionNumber + 1) + 1; k++ ) {
                                            if( k < previewTable.rows.length ) {
                                                td = previewTable.rows[k].children[j - sectionNumber*tableColumns].cloneNode( true );
                                                td.style.backgroundColor = previewTable.rows[k].style.backgroundColor;
                                                td.style.width = null;
                                                td.style.height = null;
                                                td.removeAttribute( 'data-x-index' );
                                                td.removeAttribute( 'data-wptb-css-td-auto-width' );
                                            } else {
                                                td = document.createElement( 'td' );
                                                td.style.borderWidth = '0px';
                                                td.style.borderColor = previewTable.querySelector( 'td' );
                                                if( sectionNumber > 0 && j % tableColumns == 0 ) {
                                                    td.style.borderColor = previewTable.querySelector( 'td' ).style.borderColor;
                                                }
                                                td.style.background = '#fff';
                                            }

                                            if( sectionNumber > 0 && j % tableColumns == 0 ) {
                                                td.style.borderTopWidth = '5px';
                                            }

                                            tr.appendChild( td );
                                        }

                                        newTable.appendChild( tr );
                                    }
                                }
                            } else {
                                
                                let newTableColumns;
                                if( tableContainerWidth > 480 ) {
                                    for( let i = 0; i < tableColumns; i++ ) {
                                        newTableColumns = wholeColumnsInContainer - i;
                                        if( newTableColumns == 0 ) newTableColumns = 1;
                                        newTalbeLastSectionFilledColumns = tableColumns % newTableColumns;

                                        if( Math.floor( wholeColumnsInContainer / newTableColumns ) >= 2 && valuesIsSaved ) {
                                            newTableColumns = newTableColumns + 1;
                                            newTalbeLastSectionFilledColumns = tableColumns % newTableColumns;
                                            break;
                                        }

                                        if( newTalbeLastSectionFilledColumns == 0 ) {
                                            valuesIsSaved = true;
                                            break;
                                        } else if( newTableColumns - 2 * newTalbeLastSectionFilledColumns <= 0 ) {
                                            valuesIsSaved = true;
                                            continue;
                                        } else {
                                            if( valuesIsSaved ) {
                                                newTableColumns = newTableColumns + 1;
                                                newTalbeLastSectionFilledColumns = tableColumns % newTableColumns;
                                                break;
                                            } else {
                                                continue;
                                            }
                                        }
                                    }
                                } else {
                                    newTableColumns = 1;
                                    newTalbeLastSectionFilledColumns = 0;
                                    valuesIsSaved = true;
                                    newTable.column = 1;
                                }
                                
                                let increaseRatioRows = Math.ceil( tableColumns / newTableColumns );
                                
                                let newTableRows = increaseRatioRows * tableRows;
                                
                                if( valuesIsSaved ) {
                                    for( let i = 0; i < newTableRows; i++ ) {
                                        let sectionNumber = Math.floor( i / tableRows );
                                        let tr = document.createElement( 'tr' );
                                        let jMax;
                                        let jStart;
                                        if( sectionNumber != increaseRatioRows - 1 || newTalbeLastSectionFilledColumns == 0 ) {
                                            jStart = sectionNumber * newTableColumns;
                                            jMax = newTableColumns * ( 1 + sectionNumber );
                                        } else {
                                            jStart = tableColumns - newTalbeLastSectionFilledColumns;
                                            jMax = tableColumns;
                                        }
                                        let row = previewTable.rows[i - sectionNumber * tableRows];
                                        tr.classList = row.classList;
                                        tr.style.backgroundColor = row.style.backgroundColor;
                                        
                                        for ( let j = jStart; j < jMax; j++ ) {
                                            let newTd = row.children[j].cloneNode( true );
                                            if( ! newTd.style.background ) {
                                                let rowStyles = window.getComputedStyle( row );
                                                newTd.style.backgroundColor = rowStyles.backgroundColor;
                                            }
                                            newTd.style.width = null;
                                            newTd.style.height = null;
                                            newTd.removeAttribute( 'data-x-index' );
                                            newTd.removeAttribute( 'data-wptb-css-td-auto-width' );
                                            tr.appendChild( newTd );
                                        }
                                        
                                        newTable.appendChild( tr );
                                        
                                    }
                                }
                            }
                            
                            newTable.dataset.wholeColumnsInContainer = wholeColumnsInContainer;
                            tableContainer.appendChild( newTable );
                        }
                    }
                } else {
                    if( tableContainerMatrix ) tableContainerMatrix.classList.remove( 'wptb-matrix-hide' );
                    if( document.getElementsByClassName( 'wptb-preview-table-mobile' ).length > 0 ) {
                        document.getElementsByClassName( 'wptb-preview-table-mobile' )[0].classList.add( 'wptb-mobile-hide' );
                    }
                    tableContainer.style.overflow = 'auto';
                }
            }
        }
    }
    
    function wptb_tdDefaultWidth() {
        let table = document.getElementsByClassName( 'wptb-preview-table' )[0];
        table.mergingСellsHorizontally = false;
        let tds = table.querySelectorAll( 'td' );
        for( let i = 0; i < tds.length; i++ ) {
            if( tds[i].colspan > 1 ) {
                table.mergingСellsHorizontally = true;
            }
        }
        
        let wptbTableContainer = document.getElementsByClassName( 'wptb-table-container' )[0];
        let wptbTableContainerWidth = wptbTableContainer.offsetWidth;
        
        let td = table.querySelector( 'td' );
        let tdStyleObj = window.getComputedStyle( td, null );
        let tdBorderLeftWidth = tdStyleObj.getPropertyValue( 'border-left-width' );
        let tdBorderRightWidth = tdStyleObj.getPropertyValue( 'border-right-width' );
        let tdPaddingLeftWidth = tdStyleObj.getPropertyValue( 'padding-left' );
        let tdPaddingRightWidth = tdStyleObj.getPropertyValue( 'padding-left' );
        let tdPaddingCommon = parseFloat( tdPaddingLeftWidth, 10 ) + parseFloat( tdPaddingRightWidth, 10 );
        let tableTdBorderCommonWidth = parseFloat( tdBorderLeftWidth, 10 ) + parseFloat( tdBorderRightWidth, 10 );
        let wptbTableTdsSumMaxWidth = table.dataset.wptbTableTdsSumMaxWidth;
        let wptbFixedWidthSize = table.dataset.wptbFixedWidthSize;
        let wptbCellsWidthAutoCount = table.dataset.wptbCellsWidthAutoCount;
        let styleElementCreate = false;
        let tableTdWidthAuto;
        if( wptbTableTdsSumMaxWidth < wptbTableContainerWidth ) {
            if( wptbCellsWidthAutoCount ) {
                table.style.minWidth = '100%';
                if( table.mergingСellsHorizontally ) {
                    table.style.width = null;
                    let tableTdsWidthAutoCommon = wptbTableContainerWidth - wptbFixedWidthSize;
                    tableTdWidthAuto = tableTdsWidthAutoCommon / wptbCellsWidthAutoCount;
                    tableTdWidthAuto = tableTdWidthAuto - tdPaddingCommon - tableTdBorderCommonWidth;
                    styleElementCreate = true;
                } else {
                    table.style.width = '100%';
                }
            } else {
                table.style.width = null;
                table.style.minWidth = null;
                table.style.maxWidth = wptbTableTdsSumMaxWidth + 'px';
            }
        } else {
            table.style.maxWidth = null;
            table.style.minWidth = table.dataset.wptbTableTdsSumMaxWidth + 'px';
            table.style.width = null;
            tableTdWidthAuto = '100'
            styleElementCreate = true;
        }
        
        let head = document.head;
        if( head ) {
            let cssForTdsWidthAutoOld = head.querySelector( 'style[data-wptb-td-auto-width="true"]' );
            if( cssForTdsWidthAutoOld ) {
                head.removeChild( cssForTdsWidthAutoOld );
            }
        }
        
        if( styleElementCreate ) {
            let cssForTdsWidthAuto = document.createElement( 'style' );
            cssForTdsWidthAuto.setAttribute( 'data-wptb-td-auto-width', true );
            cssForTdsWidthAuto.innerHTML = '.wptb-table-container table td[data-wptb-css-td-auto-width=true]{width:' + tableTdWidthAuto + 'px}';
            if( head ) {
                head.appendChild( cssForTdsWidthAuto );
            }
        }
    }
});
