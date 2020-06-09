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

    jQuery( document ).ready( function ( $ ) {
        /**
         * Adds hover color change support for supported button elements.
         */
        function addHoverSupport(querySelector) {
            const buttons = Array.from(document.querySelectorAll(querySelector));

            buttons.map((b) => {
                b.addEventListener('mouseenter', (e) => {
                    const el = e.target;
                    // hover background-color
                    if (el.dataset.wptbElementHoverBgColor) {
                        el.style.backgroundColor = el.dataset.wptbElementHoverBgColor;
                    }
                    // hover color
                    if (el.dataset.wptbElementHoverTextColor) {
                        el.style.color = el.dataset.wptbElementHoverTextColor;
                    }
                    // hover scale
                    if (el.dataset.wptbElementHoverScale) {
                        el.style.transform = `scale(${b.dataset.wptbElementHoverScale})`;
                    }
                });

                b.addEventListener('mouseleave', (e) => {
                    // reset all supported hover properties to their default value
                    const el = e.target;
                    if (el.dataset.wptbElementHoverBgColor) {
                        el.style.backgroundColor = el.dataset.wptbElementBgColor;
                    }
                    if (el.dataset.wptbElementHoverTextColor) {
                        el.style.color = el.dataset.wptbElementColor;
                    }
                    if (el.dataset.wptbElementHoverScale) {
                        el.style.transform = 'scale(1)';
                    }
                });
            });
        }

        // add all kind of functions that have event listeners before responsive table reconstruction to make sure those event listeners are carried over to their clones
        addHoverSupport('.wptb-preview-table .wptb-button');

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


        wptb_tdDefaultWidth();
        wptb_tableReconstraction();

        //when window resize call wpcd_archiveSectionSmall and wptb_tableGenerateMobile
        $( window ).resize( function () {
            wptb_tdDefaultWidth();
            wptb_tableReconstraction();
        });

        function wptb_tableReconstraction() {
            // get necessary elements on page
            let tableContainers = document.getElementsByClassName( 'wptb-table-container' );
            for( let i = 0; i < tableContainers.length; i++ ) {
                let tableContainer = tableContainers[i];

                // Set default indicator of creating a new table in true
                let createNewTableIndic = true;

                let previewTable = tableContainer.getElementsByClassName( 'wptb-preview-table' );
                let tableContainerMatrix = tableContainer.getElementsByClassName( 'wptb-table-container-matrix' );

                if( previewTable.length > 0 && tableContainerMatrix.length > 0 ) {
                    previewTable = previewTable[0];
                    tableContainerMatrix = tableContainerMatrix[0];
                    previewTable.style.display = 'table';


                    if( previewTable.dataset.wptbTableAlignment ) {
                        let wptbTableAlignment = previewTable.dataset.wptbTableAlignment;

                        let wptbTableContainerWidth = tableContainer.offsetWidth;
                        if( wptbTableContainerWidth < previewTable.offsetWidth ) {
                            previewTable.style.float = null;
                        } else {
                            if( wptbTableAlignment == 'center' ) {
                                previewTable.style.float = null;
                            } else {
                                previewTable.style.float = wptbTableAlignment;
                            }
                        }

                        if( wptbTableAlignment == 'center' ) {
                            tableContainer.style.float = null;
                        } else {
                            tableContainer.style.float = wptbTableAlignment;
                        }
                    }

                    // check data parametrs reconstraction and wptbAdaptiveTable if they are both equal 1 then continue
                    if( previewTable.dataset.reconstraction == 1 && previewTable.dataset.wptbAdaptiveTable == 1 ) {

                        // get widths for wptb-table-container and wptb-preview-table
                        let tableContainerWidth = tableContainer.offsetWidth;
                        let previewTableWidth = previewTable.offsetWidth;

                        // get count of table columns
                        let tableColumns;
                        let previewTableRows = previewTable.rows;
                        if( previewTableRows.length > 0 ) {
                            let firstRow = previewTableRows[0];
                            let tdsRow = firstRow.querySelectorAll( 'td' );

                            tableColumns = tdsRow.length;
                        }

                        // check the top line if it is presented as a title
                        let tablePreviewHeadIndic = previewTable.classList.contains( 'wptb-table-preview-head' )

                        // check conditions: if table top row is as "header" - table must have more that two columns,
                        // otherwise table must have more taht one columns
                        if( ( ( ! tablePreviewHeadIndic || tableColumns > 2 ) && tableColumns > 1 ) ) {
                            // if width of wptb-table-container less then width of wptb-preview-table -
                            // continue the way creation new mobile table
                            if( tableContainerWidth < previewTableWidth ) {

                                tableContainer.style.overflow = 'unset';

                                // hide wptb-table-container-matrix
                                if( tableContainerMatrix ) tableContainerMatrix.classList.add( 'wptb-matrix-hide' );

                                if( previewTable.rows && tableColumns ) {

                                    // we get the estimated cell width
                                    let tdWidth = previewTableWidth / tableColumns;

                                    // get the quantity of whole Columns that are can placed in the container
                                    let wholeColumnsInContainer = Math.floor( tableContainerWidth/tdWidth );
                                    if( wholeColumnsInContainer < 1 ) wholeColumnsInContainer = 1;

                                    // check for the existence of a mobile table
                                    // if it available, check this table for compliance
                                    // with our conditions. If it compliance, remain this table
                                    // and cancel creating a new table ( createNewTableIndic = false ).
                                    if( tableContainer.getElementsByClassName( 'wptb-preview-table-mobile' ).length > 0 ) {
                                        let wptbPreviewTableMobile = tableContainer.getElementsByClassName( 'wptb-preview-table-mobile' )[0];
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
                                    //
                                    // if indicator of creating of table "true" - continue
                                    if( createNewTableIndic ) {
                                        // create new table for mobile devices
                                        let newTable = document.createElement( 'table' );

                                        // add css class for new mobile table
                                        newTable.classList.add( 'wptb-preview-table-mobile' );
                                        let infArr = previewTable.className.match( /wptb-element-main(.+)-(\d+)/i );
                                        if( infArr && Array.isArray( infArr ) ) {
                                            newTable.classList.add( infArr[0] );
                                        }

                                        // get number of rows for wptb-preview-table
                                        let tableRows = previewTable.rows.length;

                                        // In this variable must have quantity columns of the last section of the new table
                                        let newTableLastSectionFilledColumns;

                                        // set valuesIsSaved in 'false'
                                        // if the parameters newTableLastSectionFilledColumns get
                                        // optimal values, valuesIsSaved must have value 'true'
                                        let valuesIsSaved = false;

                                        // check if top row is as "header"
                                        if ( previewTable.classList.contains( 'wptb-table-preview-head' ) ) {
                                            // quantity rows without top row
                                            let tableRowsWithoutHeader = tableRows - 1;

                                            // this variable will have quantity columns in new mobile table
                                            let newTableColumnsWithoutLeftHeader;

                                            // if quantity of rows in desktop table more than
                                            // quantity whole columns which are can placed in the container,
                                            // execute "loop for"
                                            if( tableRows > wholeColumnsInContainer ) {
                                                // this code, сyclical reduces the number of columns in the new table,
                                                // until the optimal view is obtained so that the last block of the new table
                                                // has more than half the columns compared to the previous blocks
                                                for( let i = 0; i < tableRowsWithoutHeader; i++ ) {
                                                    newTableColumnsWithoutLeftHeader = ( wholeColumnsInContainer - 1 ) - i;
                                                    if( newTableColumnsWithoutLeftHeader <= 0 ) newTableColumnsWithoutLeftHeader = 1;

                                                    newTableLastSectionFilledColumns = tableRowsWithoutHeader % newTableColumnsWithoutLeftHeader;

                                                    if( newTableLastSectionFilledColumns == 0 ) {
                                                        valuesIsSaved = true;
                                                        break;
                                                    } else if( 0 < newTableColumnsWithoutLeftHeader && newTableColumnsWithoutLeftHeader <= 6 &&
                                                        ( newTableColumnsWithoutLeftHeader - ( 2 * newTableLastSectionFilledColumns ) < 0 ) &&
                                                        newTableLastSectionFilledColumns < newTableColumnsWithoutLeftHeader ) {
                                                        valuesIsSaved = true;
                                                        break;
                                                    } else if( 6 < newTableColumnsWithoutLeftHeader && newTableColumnsWithoutLeftHeader <= 12 &&
                                                        ( newTableColumnsWithoutLeftHeader - ( 1.8 * newTableLastSectionFilledColumns ) < 0 ) &&
                                                        newTableLastSectionFilledColumns < newTableColumnsWithoutLeftHeader ) {
                                                        valuesIsSaved = true;
                                                        break;
                                                    } else if( 12 < newTableColumnsWithoutLeftHeader && newTableColumnsWithoutLeftHeader <= 18 &&
                                                        ( newTableColumnsWithoutLeftHeader - ( 1.6 * newTableLastSectionFilledColumns ) < 0 ) &&
                                                        newTableLastSectionFilledColumns < newTableColumnsWithoutLeftHeader ) {
                                                        valuesIsSaved = true;
                                                        break;
                                                    } else {
                                                        continue;
                                                    }
                                                }
                                            } else {
                                                newTableColumnsWithoutLeftHeader = tableRowsWithoutHeader;
                                                newTableLastSectionFilledColumns = 0;
                                                valuesIsSaved = true;
                                            }

                                            // if all necessary values ​​are available (  ), execute
                                            if( valuesIsSaved ) {
                                                let countRows;
                                                if( newTableColumnsWithoutLeftHeader > 0 ) {
                                                    countRows = tableColumns * Math.ceil( tableRowsWithoutHeader / newTableColumnsWithoutLeftHeader );
                                                } else {
                                                    countRows = tableColumns;
                                                }

                                                let sectionNumberLast = Math.floor( ( countRows - 1 ) / tableColumns );
                                                let tdStyles;
                                                for( let j = 0; j < countRows; j++ ) {
                                                    let sectionNumber = Math.floor( j / tableColumns ),
                                                        tr = document.createElement( 'tr' ),
                                                        tdLeftHeader = previewTable.rows[0].children[j - sectionNumber*tableColumns].cloneNode( true ),
                                                        td;
                                                    let rowFirstStyles = window.getComputedStyle( previewTable.rows[0] );
                                                    if(!tdLeftHeader.style.backgroundColor) {
                                                        tdLeftHeader.style.backgroundColor = rowFirstStyles.backgroundColor;
                                                    }
                                                    tdLeftHeader.style.width = null;
                                                    tdLeftHeader.style.height = null;
                                                    tdLeftHeader.removeAttribute( 'data-x-index' );
                                                    tdLeftHeader.removeAttribute( 'data-wptb-css-td-auto-width' );
                                                    tdStyles = window.getComputedStyle( previewTable.querySelector( 'td' ) );
                                                    if( tdStyles.borderTopColor ) {
                                                        tdLeftHeader.style.borderColor = tdStyles.borderTopColor;
                                                    } else {
                                                        tdLeftHeader.style.borderColor = tdStyles.borderBottomColor;
                                                    }
                                                    if( sectionNumber > 0 && j % tableColumns == 0 ) {
                                                        tdLeftHeader.style.borderTopWidth = '5px';
                                                    }
                                                    tr.appendChild( tdLeftHeader );

                                                    for( let k = newTableColumnsWithoutLeftHeader*( sectionNumber ) + 1; k < newTableColumnsWithoutLeftHeader*( sectionNumber + 1) + 1; k++ ) {

                                                        if( k < previewTable.rows.length ) {
                                                            td = previewTable.rows[k].children[j - sectionNumber*tableColumns].cloneNode( true );
                                                            let rowKStyles = window.getComputedStyle( previewTable.rows[k] );
                                                            if(!td.style.backgroundColor) {
                                                                td.style.backgroundColor = rowKStyles.backgroundColor;
                                                            }

                                                            td.style.width = null;
                                                            td.style.height = null;
                                                            td.removeAttribute( 'data-x-index' );
                                                            td.removeAttribute( 'data-wptb-css-td-auto-width' );
                                                        } else {
                                                            td = document.createElement( 'td' );
                                                            td.style.borderWidth = '0px';

                                                            td.style.background = '#fff';
                                                        }

                                                        tdStyles = window.getComputedStyle( previewTable.querySelector( 'td' ) );
                                                        if( tdStyles.borderTopColor ) {
                                                            td.style.borderColor = tdStyles.borderTopColor;
                                                        } else {
                                                            td.style.borderColor = tdStyles.borderBottomColor;
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
                                                    newTableLastSectionFilledColumns = tableColumns % newTableColumns;

                                                    if( newTableLastSectionFilledColumns == 0 ) {
                                                        valuesIsSaved = true;
                                                        break;
                                                    } else if( 0 < newTableColumns && newTableColumns <= 6 &&
                                                        ( newTableColumns - ( 2 * newTableLastSectionFilledColumns ) <= 0 ) &&
                                                        newTableLastSectionFilledColumns < newTableColumns ) {
                                                        valuesIsSaved = true;
                                                        break;
                                                    } else if( 6 < newTableColumns && newTableColumns <= 12 &&
                                                        ( newTableColumns - ( 1.8 * newTableLastSectionFilledColumns ) <= 0 ) &&
                                                        newTableLastSectionFilledColumns < newTableColumns ) {
                                                        valuesIsSaved = true;
                                                        break;
                                                    } else if( 12 < newTableColumns && newTableColumns <= 18 &&
                                                        ( newTableColumns - ( 1.6 * newTableLastSectionFilledColumns ) <= 0 ) &&
                                                        newTableLastSectionFilledColumns < newTableColumns ) {
                                                        valuesIsSaved = true;
                                                        break;
                                                    } else {
                                                        continue;
                                                    }
                                                }
                                            } else {
                                                newTableColumns = 1;
                                                newTableLastSectionFilledColumns = 0;
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
                                                    if( sectionNumber != increaseRatioRows - 1 || newTableLastSectionFilledColumns == 0 ) {
                                                        jStart = sectionNumber * newTableColumns;
                                                        jMax = newTableColumns * ( 1 + sectionNumber );
                                                    } else {
                                                        jStart = tableColumns - newTableLastSectionFilledColumns;
                                                        jMax = tableColumns;
                                                    }
                                                    let row = previewTable.rows[i - sectionNumber * tableRows];
                                                    tr.classList = row.classList;
                                                    tr.style.backgroundColor = row.style.backgroundColor;

                                                    for ( let j = jStart; j < jMax; j++ ) {
                                                        let newTd = row.children[j].cloneNode( true );
                                                        if(!newTd.style.backgroundColor) {
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
                                        let images = newTable.querySelectorAll( '[srcset]' );
                                        if( images.length > 0 ) {
                                            for ( let i = 0; i < images.length; i++ ) {
                                                images[i].removeAttribute( 'srcset' );
                                            }
                                        }

                                        tableContainer.appendChild( newTable );

                                        // restore events to element clones
                                        // TODO [erdembircan] working on possible bug related to this class
                                        // WptbEventCatcher.getInstance().restoreEvents('.wptb-preview-table-mobile');
                                    }
                                }
                            } else {
                                if( tableContainerMatrix ) tableContainerMatrix.classList.remove( 'wptb-matrix-hide' );
                                if( tableContainer.getElementsByClassName( 'wptb-preview-table-mobile' ).length > 0 ) {
                                    tableContainer.getElementsByClassName( 'wptb-preview-table-mobile' )[0].classList.add( 'wptb-mobile-hide' );
                                }
                                tableContainer.style.overflow = 'auto';
                            }
                        } else {
                            previewTable.style.minWidth = 'auto';
                        }
                    }
                }
            }
        }

        function wptb_tdDefaultWidth() {
            let wptbTableContainers = document.getElementsByClassName( 'wptb-table-container' );
            //let frontendEditLink = document.querySelectorAll( '.wptb-frontend-table-edit-link' );
            for( let i = 0; i < wptbTableContainers.length; i++ ) {
                let wptbTableContainer = wptbTableContainers[i];

                wptbTableContainer.classList.add( 'wptb-table-container-' + i );

                let table = wptbTableContainer.getElementsByClassName( 'wptb-preview-table' );
                if( table.length > 0 ) {
                    table = table[0];

                    if( table.dataset.wptbTableContainerMaxWidth ) {
                        wptbTableContainer.style.maxWidth = table.dataset.wptbTableContainerMaxWidth + "px";
                    }
                    table.classList.remove( "wptb-table-preview-static-indic" );

                    table.mergingСellsHorizontally = false;
                    let tds = table.querySelectorAll( 'td' );
                    for( let j = 0; j < tds.length; j++ ) {
                        if( tds[j].colSpan > 1 ) {
                            table.mergingСellsHorizontally = true;
                        }
                    }
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

//                        if( frontendEditLink && frontendEditLink[i] ) {
//                            frontendEditLink[i].style.minWidth = wptbTableTdsSumMaxWidth + 'px';
//                        }

                            if( table.mergingСellsHorizontally ) {
                                table.style.width = 'auto';
                                let tableTdsWidthAutoCommon = wptbTableContainerWidth - wptbFixedWidthSize;
                                tableTdWidthAuto = tableTdsWidthAutoCommon / wptbCellsWidthAutoCount;
                                tableTdWidthAuto = tableTdWidthAuto - tdPaddingCommon - tableTdBorderCommonWidth;
                                styleElementCreate = true;
                            } else {
                                table.style.width = '100%';

//                            if( frontendEditLink && frontendEditLink[i] ) {
//                                frontendEditLink[i].style.width = '100%';
//                                frontendEditLink[i].style.maxWidth = '100%';
//                            }
                            }
                        } else {
                            table.style.width = 'auto';
                            table.style.minWidth = null;
                            table.style.maxWidth = wptbTableTdsSumMaxWidth + 'px';

//                        if( frontendEditLink && frontendEditLink[i] ) {
//                            frontendEditLink[i].style.width = null;
//                            frontendEditLink[i].style.minWidth = null;
//                            frontendEditLink[i].style.maxWidth = wptbTableTdsSumMaxWidth + 'px';
//                        }
                        }
                    } else {
                        table.style.maxWidth = null;
                        table.style.minWidth = table.dataset.wptbTableTdsSumMaxWidth + 'px';
                        table.style.width = 'auto';
                        tableTdWidthAuto = table.dataset.wptbTdWidthAuto ? table.dataset.wptbTdWidthAuto : '100';
                        styleElementCreate = true;

//                    if( frontendEditLink && frontendEditLink[i] ) {
//                        frontendEditLink[i].style.maxWidth = '100%';
//                        frontendEditLink[i].style.minWidth = table.dataset.wptbTableTdsSumMaxWidth + 'px';
//                        frontendEditLink[i].style.width = null;
//                    }
                    }

                    let head = document.head;
                    if( head ) {
                        let cssForTdsWidthAutoOld = head.querySelector( 'style[data-wptb-td-auto-width-' + i + '="true"]' );

                        if( cssForTdsWidthAutoOld ) {
                            head.removeChild( cssForTdsWidthAutoOld );
                        }
                    }

                    if( styleElementCreate ) {
                        let cssForTdsWidthAuto = document.createElement( 'style' );
                        cssForTdsWidthAuto.setAttribute( 'data-wptb-td-auto-width-' + i, true );
                        cssForTdsWidthAuto.innerHTML = '.wptb-table-container-' + i + ' table td[data-wptb-css-td-auto-width=true]{width:' + tableTdWidthAuto + 'px}';
                        if( head ) {
                            head.appendChild( cssForTdsWidthAuto );
                        }
                    }
                }
            }
        }

        // code for adding of old css styles for correct view
        let elements = document.getElementsByClassName( 'wptb-ph-element' );
        for( let i = 0; i < elements.length; i++ ) {
            let element = elements[i];
            if( element.classList.contains( 'wptb-list-item-container' ) ) {
                element.classList.remove( 'wptb-list-item-container' );
                element.classList.add( 'wptb-list-container' );
            }

            if( element.classList.contains( 'wptb-button-container' ) ) {
                let infArr = element.className.match( /wptb-size-([A-Z]+)/i );
                if( infArr && Array.isArray( infArr ) ) {
                    let wptbSize = infArr[0],
                        wptbSizeNew = wptbSize.toLowerCase();

                    element.classList.remove( wptbSize );

                    let wptbButtonWrapper = element.querySelector( '.wptb-button-wrapper' );
                    if( wptbButtonWrapper ) {
                        wptbButtonWrapper.classList.add( wptbSizeNew );
                    }
                }
            }
        }

    });

})( jQuery );


