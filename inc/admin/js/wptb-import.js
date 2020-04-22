(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", () => {
        let importFromFile = document.querySelector( '#wptb-importSubmit' );

        importFromFile.onclick = function (e) {
            e.preventDefault();

            let wptbImportFileInput = document.querySelector( '#wptb-importFile' );
            if( wptbImportFileInput ) {

                let regex = /^([a-zA-Z0-9()\s_\\.\-:])+(.csv)$/;
                let regex2 = /^([a-zA-Z0-9()\s_\\.\-:])+(.xml)$/;
                let regex3 = /^([a-zA-Z0-9()\s_\\.\-:])+(.html)$/;
                let regex4 = /^([a-zA-Z0-9()\s_\\.\-:])+(.zip)$/;

                let is_csv = regex.test( wptbImportFileInput.value.toLowerCase());
                let is_xml = regex2.test( wptbImportFileInput.value.toLowerCase());
                let is_html = regex3.test( wptbImportFileInput.value.toLowerCase());
                let is_zip = regex4.test( wptbImportFileInput.value.toLowerCase());

                let file = wptbImportFileInput.files[0];
                if( is_zip ) {
                    let http = new XMLHttpRequest(),
                        url = ( wptb_admin_import_js_object ? wptb_admin_import_js_object.ajaxurl : ajaxurl ) +
                            '?action=zip_unpacker';

                    let data = new FormData();
                    data.append( 'file', file, 'csv_zip.zip' );
                    data.append( 'security_code', wptb_admin_import_js_object.security_code );

                    http.open('POST', url, true );

                    http.onreadystatechange = function ( action ) {
                        if ( this.readyState == 4 && this.status == 200 ) {
                            let data = http.responseText;
                            if( data ) data = JSON.parse( data );

                            if( data && Array.isArray( data ) ) {
                                if( data[0] == 'success' ) {
                                    if( data[1] && Array.isArray( data[1] ) ) {
                                        let dataTable = [];

                                        // check file extension, if it "csv" add get this tableData
                                        for( let i = 0; i < data[1].length; i++ ) {
                                            if( data[1][i][0] === 'csv' ) {
                                                dataTable.push( data[1][i][1] );
                                            }
                                        }

                                        if( dataTable.length > 0 ) {
                                            tablesFromCsvSaveRun( dataTable, 0 );
                                        }
                                    }
                                }
                            }

                        }
                    }
                    http.send( data );
                } else if( is_csv || is_xml || is_html ) {
                    if ( typeof ( FileReader ) != "undefined" ) {
                        let reader = new FileReader();
                        let data;
                        reader.onload = function (e) {
                            data = e.target.result;

                            if( is_csv ) {
                                tablesFromCsvSaveRun( [data], 0 );
                            }
                        }

                        reader.readAsText( file );
                    } else {
                        alert("This browser does not support HTML5.");
                    }
                } else {
                    alert("Please upload a valid file.");
                }

                /**
                 * run all process for importing tables
                 */
                function tablesFromCsvSaveRun( tableDataCsv, index ) {
                    if( tableDataCsv && Array.isArray( tableDataCsv ) ) {
                        let csvDelimiterSelect = document.querySelector( '#wptb-csvDelimiter' );
                        let csvDelimiter;
                        if( csvDelimiterSelect ) {
                            csvDelimiter = csvDelimiterSelect.value;
                            if( csvDelimiter == 'tab' ) csvDelimiter = '\t';
                        }
                        if( ! csvDelimiter ) {
                            csvDelimiter = searchDelimiter(tableDataCsv[index]);
                            if (!csvDelimiter) {
                                alert('The delimiter could not be determined');

                                return;
                            }
                        }

                        document.addEventListener( 'table:imported:saved', function tabImSave(){
                            tableImportingProgressBar( index + 1, tableDataCsv.length, 'import' );
                            if( tableDataCsv.length - index > 1 ) {
                                tablesFromCsvSaveRun( tableDataCsv, index + 1 );
                            }

                            document.removeEventListener( 'table:imported:saved', tabImSave );
                        } );

                        let tableDataArr = parseCsv( tableDataCsv[index], csvDelimiter );
                        let importedTable = createTableFromDataArray( tableDataArr );
                        tableImportedSave( importedTable );

                        if( index === 0 ) {
                            tableImportingProgressBar( 0, 1, 'import' );
                        }
                    }

                }
            }
        }

        /**
         * save html table
         */
        function tableImportedSave( table, id ) {
            let http = new XMLHttpRequest(),
                url = ( wptb_admin_import_js_object ? wptb_admin_import_js_object.ajaxurl : ajaxurl ) + "?action=save_table",
                code;

            if( id ) {
                if( table.classList.contains( 'wptb-element-main-table_setting-startedid-0' ) ) {
                    table.classList.remove( 'wptb-element-main-table_setting-startedid-0' );
                    table.classList.add( 'wptb-element-main-table_setting-' + id );
                }
            }
            code = WPTB_Stringifier( table );
            code = code.outerHTML;

            let params = {
                content: code,
                security_code: wptb_admin_import_js_object.security_code
            };

            if ( id ) {
                params.id = id;
            }
            params = JSON.stringify( params );

            http.open('POST', url, true );
            http.setRequestHeader( 'Content-type', 'application/json; charset=utf-8' );

            http.onreadystatechange = function ( action ) {
                if ( this.readyState == 4 && this.status == 200 ) {
                    let data = JSON.parse( http.responseText );

                    if ( data[0] == 'saved' ) {
                        tableImportedSave( table, data[1] );
                    } else if( data[0] == 'edited' ) {
                        WPTB_Helper.wptbDocumentEventGenerate( 'table:imported:saved', document );
                    }
                }
            }

            http.send( params );
        }

        /**
         * create new table from array data
         */
        function createTableFromDataArray( tableDataArr ) {

            if( tableDataArr && Array.isArray( tableDataArr ) && tableDataArr.length > 0 ) {
                let countRows = tableDataArr.length;
                let countColumns = ( countRows > 0 && tableDataArr[0] && Array.isArray( tableDataArr[0] ) ) ? tableDataArr[0].length : 0;

                // check if table is empty
                if( 0 === countRows && 0 === countColumns ) {
                    return false;
                }
                /**
                 * array for saving unique elements indexes
                 */
                let elementsIndexes = {
                    imageElemIndex: 1,
                    textElemIndex: 1,
                    customHtmlElemIndex: 1
                };

                let rowSpan = new Array( countRows );
                rowSpan.fill( 1 );
                let colSpan = new Array( countColumns );
                colSpan.fill( 1 );

                let tBody = document.createElement( 'tbody' );

                let lastRowIdx = countRows - 1;
                let lastColumnIdx = countColumns - 1;

                for ( let rowIdx = lastRowIdx; rowIdx >= 0; rowIdx-- ) {
                    let tr = document.createElement( 'tr' );
                    tr.classList.add( 'wptb-row' );
                    for ( let colIdx = lastColumnIdx; colIdx >= 0; colIdx-- ) {
                        let cellContent = tableDataArr[ rowIdx ][ colIdx ];

                        if ( cellContent === '#rowspan#' ) {
                            if ( ( rowIdx > 0 ) ) {
                                if( ! rowSpan[ colIdx ] ) rowSpan[ colIdx ] = 1;
                                rowSpan[ colIdx ]++;
                                colSpan[ rowIdx ] = 1;
                                continue;
                            }

                            cellContent = '';
                        } else if ( cellContent === '#colspan#' ) {
                            if ( colIdx > 0 ) {
                                if( ! colSpan[ rowIdx ] ) colSpan[ rowIdx ] = 1;
                                colSpan[ rowIdx ]++;
                                rowSpan[ colIdx ] = 1;
                                continue;
                            }

                            cellContent = '';
                        }

                        let td = document.createElement( 'td' );
                        td.classList.add( 'wptb-droppable', 'wptb-cell' );
                        td.dataset.wptbCssTdAutoWidth="true";

                        td.style.padding = '15px';
                        td.style.width = null;
                        td.style.height = null;
                        td.style.borderStyle = 'solid';
                        td.style.borderWidth = '1px';

                        td.innerHTML = cellContent;

                        if ( colSpan[ rowIdx ] > 1 ) {
                            td.colSpan = colSpan[ rowIdx ];
                        }
                        if ( rowSpan[ colIdx ] > 1 ) {
                            td.rowSpan = rowSpan[ colIdx ];
                        }

                        tr.insertBefore( td, tr.firstChild );

                        colSpan[ rowIdx ] = 1;
                        rowSpan[ colIdx ] = 1;
                    }

                    tBody.insertBefore( tr, tBody.firstChild );
                }

                let table = document.createElement( 'table' );
                table.classList.add( 'wptb-preview-table', 'wptb-element-main-table_setting-startedid-0' );
                /*
                 * set including border style for table
                 */
                table.style.borderStyle = 'solid';
                table.style.borderWidth = '1px';
                table.appendChild( tBody );

                let tds = table.querySelectorAll( 'td' );
                for( let i = 0; i < tds.length; i++ ) {
                    let tdChildNodes = [...tds[i].childNodes];
                    let childNodesHandleredIndexesArr = tdChildNodesHandler( tdChildNodes, elementsIndexes );
                    let wptbElements;
                    if( childNodesHandleredIndexesArr && Array.isArray( childNodesHandleredIndexesArr ) ) {
                        wptbElements = childNodesHandleredIndexesArr[0];
                        elementsIndexes = childNodesHandleredIndexesArr[1];
                    }

                    tds[i].innerHTML = '';
                    if( wptbElements && Array.isArray( wptbElements ) ) {
                        for( let j = 0; j < wptbElements.length; j++ ) {
                            tds[i].appendChild( wptbElements[j] );
                        }
                    }
                }

                WPTB_Helper.recalculateIndexes( table );

                addAttributesForTable( table );

                return table;
            }

            return false;
        }

        /**
         * add adaptive table data attribute to set table responsive or not
         * add wptb-table-preview-head class to set top row as header if it chosen
         * and also other data attributes
         */
        function addAttributesForTable( table ) {
            let importTableResponsiveCheckbox = document.querySelector( '#wptb-importTableResponsive' );
            if( importTableResponsiveCheckbox && importTableResponsiveCheckbox.checked ) {
                table.dataset.wptbAdaptiveTable = '1';
            } else {
                table.dataset.wptbAdaptiveTable = '0'
            }

            let importTableTopRowAsHeaderCheckbox = document.querySelector( '#wptb-topRowAsHeader' );
            if( importTableTopRowAsHeaderCheckbox && importTableTopRowAsHeaderCheckbox.checked ) {
                table.classList.add( 'wptb-table-preview-head' );
            }

            table.dataset.wptbFixedWidthSize = '0';
            table.dataset.wptbCellsWidthAutoCount = table.maxCols;
            let td = table.querySelector( 'td' );
            let tdPadding = td && td.style.paddingTop ? td.style.paddingTop : 15;
            table.dataset.wptbTableTdsSumMaxWidth = String( parseInt( table.maxCols ) * ( 100 + 1 + parseInt( tdPadding ) * 2 ) + 1 );
        }

        /**
         * function for parse CSV to array
         */
        function parseCsv( str, separator ) {
            let arr = [];
            let quote = false;
            for (let row = 0, col = 0, c = 0; c < str.length; c++) {
                let cc = str[c], nc = str[c+1];
                arr[row] = arr[row] || [];
                arr[row][col] = arr[row][col] || '';

                if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
                if (cc == '"') { quote = !quote; continue; }
                if (cc == separator && !quote) { ++col; continue; }
                if (cc == '\n' && !quote) { ++row; col = 0; continue; }

                arr[row][col] += cc;
            }
            return arr;
        }

        /**
         * Detect the CSV delimiter, by analyzing some rows to determine the most probable delimiter character.
         * return string Most probable delimiter character.
         */
        function searchDelimiter( data ) {

            let delimiterCollection = {};
            let quote = false;
            let currentLine = 0;
            let nonDelimiterChars = "a-zA-Z0-9\n\r";

            // Walk through each character in the CSV string (up to $this->delimiter_search_max_lines) and search potential delimiter characters.
            let dataLength = data.length;
            for ( let i = 0; i < dataLength; i++ ) {
                let previousChar = ( i - 1 >= 0 ) ? data[ i - 1 ] : '';
                let currentChar = data[ i ];
                let nextChar = ( i + 1 < dataLength ) ? data[ i + 1 ] : '';

                if ( currentChar === '"' ) {
                    // Open and closing quotes.
                    if ( ! quote || nextChar !== '"' ) {
                        quote = ! quote; // Flip bool.
                    } else if ( quote ) {
                        i++; // Skip next character.
                    }
                } else if ( ( "\n" === currentChar && "\r" !== previousChar || "\r" === currentChar ) && ! quote ) {
                    // Reached end of a line.
                    currentLine++;
                    if ( currentLine >= 15 ) {
                        break;
                    }
                } else if ( ! quote ) {
                    // At this point, currentChar seems to be used as a delimiter, as it is not quote.
                    // Count currentChar if it is not in the $this->nonDelimiterChars list
                    if ( ";,\t".indexOf( currentChar ) !== -1 ) {
                        if ( typeof delimiterCollection[ currentChar ] == "undefined" ) {
                            delimiterCollection[ currentChar ] = {};
                        }

                        if( typeof delimiterCollection[ currentChar ][ currentLine ] == "undefined" ) {
                            delimiterCollection[ currentChar ][ currentLine ] = 0; // Initialize empty
                        }
                        delimiterCollection[ currentChar ][ currentLine ]++;
                    }
                }
            }
            let potentialDelimiters = '';
            for ( let delimiter in delimiterCollection ) {
                let lineDelimiterCollection = delimiterCollection[delimiter];
                let lineDelimiterCollectionLength = 0;
                for ( let lineDelimiter in lineDelimiterCollection ) {
                    lineDelimiterCollectionLength++;
                }
                if ( lineDelimiterCollectionLength !== currentLine ) {
                    continue;
                }

                let startCount = false;
                let delimiterIndic = undefined;
                for ( let lineDelimiter in lineDelimiterCollection ) {
                    if ( ! startCount ) {
                        startCount = lineDelimiterCollection[lineDelimiter];
                    } else if ( lineDelimiterCollection[lineDelimiter] === startCount &&
                        ( delimiterIndic || typeof delimiterIndic == 'undefined' ) ) {
                        delimiterIndic = true;
                    } else {
                        delimiterIndic = false;
                    }
                }

                if ( currentLine > 1 && ! delimiterIndic ) {
                    continue;
                }

                if( ! potentialDelimiters ) {
                    potentialDelimiters = delimiter;
                } else {
                    potentialDelimiters = false;
                    break;
                }
            }

            return potentialDelimiters;
        }

        function wptb_xmlElementChildrenEach( Parent, startIter ) {
            if ( startIter ) {
                this.mainString = [];
            }

            if( Parent.nodeType == 1 ) {
                if( Parent.children.length > 0 ) {
                    for ( var i = 0; i < Parent.children.length; i++ ) {
                        let child = Parent.children[i];
                        wptb_xmlElementChildrenEach( child );
                    }
                } else if ( Parent.childNodes.length > 0 ) {
                    for ( let i = 0; i < Parent.childNodes.length; i++ ) {
                        let child = Parent.childNodes[i];
                        wptb_xmlElementChildrenEach( child );
                    }
                } else {
                    this.mainString.push("");
                }
            } else if ( ( Parent.nodeType == 3 || Parent.nodeType == 4 ) && Parent.data.trim() != '\n' &&
                Parent.data.trim() != "\n" && Parent.data.trim() != '\r' && Parent.data.trim !='\n\r' &&
                Parent.previousSibling === null && Parent.nextSibling === null ) {
                this.mainString.push( Parent.data );
            }
            return this.mainString;
        }

        /**
         * function for parse Xml file
         */
        function wptb_xmlImportFileParse( data ) {
            var xmlDoc = $.parseXML( data );
            var xml = $( xmlDoc );
            var rows = [],
                rows_header = [];
            if( xml.length  > 0 ) {
                var documentElement = xml[0].children;
                if(documentElement.length > 0) {
                    var couponElements = documentElement[0].children;
                    for( var i = 0; i < couponElements.length; i++ ) {
                        if ( i == 0 ) {
                            rows_header[i] = wptb_xmlElementChildrenEach( couponElements[i], true );
                        } else {
                            rows[i] = wptb_xmlElementChildrenEach( couponElements[i], true );
                        }
                    }
                }
            }
            rows = rows_header.concat(rows);
            return rows;
        }


        /**
         * import table from other plugins
         */
        function importFromPlugin( event ) {
            if( event && typeof event === 'object' ) {
                let importedTablesSetting = document.querySelector( '.wptb-importedTablesSetting' );
                if( importedTablesSetting ) importedTablesSetting.style.display = 'none';

                let importedTablesShortcodesReplace = document.querySelector( '.wptb-importedTablesShortcodesReplaced' );
                if( importedTablesShortcodesReplace ) importedTablesShortcodesReplace.style.display = 'none';

                let button = event.target;

                let dataPlugin = button.dataset.wptbImportPlugin;
                if( dataPlugin ) {
                    if ( dataPlugin === 'table-press' ) {

                        tablePressImportStageOne();

                    }
                }
            }
        }

        /**
         * gets array with shortcodes and run
         * function
         */
        function tablePressImportStageOne() {
            let http = new XMLHttpRequest(),
                url = ( wptb_admin_import_js_object ? wptb_admin_import_js_object.ajaxurl : ajaxurl ) + "?action=import_tables";

            let params = {
                import_plugin_name: 'table-press',
                security_code: wptb_admin_import_js_object.security_code
            };

            params = JSON.stringify( params );

            http.open('POST', url, true);
            http.setRequestHeader( 'Content-type', 'application/json; charset=utf-8' );

            http.onreadystatechange = function ( action ) {
                if ( this.readyState == 4 && this.status == 200 ) {
                    let data = JSON.parse( http.responseText );

                    if( data && Array.isArray( data ) ) {
                        if( data[0] == 'success' ) {
                            if( data[1] && Array.isArray( data[1] ) ) {
                                let importIframeSection = document.getElementById( 'wptb-importIframeSection' );
                                if( importIframeSection ) {
                                    let iframe = document.createElement( 'iframe' );
                                    iframe.width = '1000';
                                    iframe.height = '1000';
                                    importIframeSection.innerHTML = '';
                                    importIframeSection.appendChild( iframe );
                                    window.wptbImportCommonCountTables = data[1].length;
                                    if( window.wptbImportConvertationShortcodes ) {
                                        delete window.wptbImportConvertationShortcodes;
                                    }
                                    tableImportingProgressBar( 0, window.wptbImportCommonCountTables, 'import' );
                                    tablePressImportStageTwo( iframe, data[1] );
                                }
                            }
                        } else if( data[1] ) {
                            alert( data[1] );
                        }
                    }
                }
            }
            http.send( params );
        }

        function tablePressImportStageTwo( iframe, dataTables ) {
            if( dataTables && Array.isArray( dataTables ) && dataTables.length > 0 ) {
                let dataTable = dataTables.shift();
                if( dataTable && Array.isArray( dataTable ) && dataTable.length > 0 ) {
                    let shortcode = dataTable[0];
                    if( ! window.wptbImportConvertationShortcodes ) {
                        window.wptbImportConvertationShortcodes = [];
                    }
                    let thisIterConvertShortcodes = [];
                    thisIterConvertShortcodes.push( shortcode );
                    window.wptbImportConvertationShortcodes.push( thisIterConvertShortcodes );

                    let tableContent = dataTable[1];

                    let url = wptb_admin_import_js_object ? wptb_admin_import_js_object.import_iframe_url +
                        '&_wpnonce=' + wptb_admin_import_js_object.security_code + '&shortcode=' + shortcode : '';
                    iframe.src = url;
                    iframe.onload = tablePressImportStageThree.bind( this, iframe, tableContent, dataTables );
                }
            }
        }

        function tablePressImportStageThree( iframe, tableContent, dataTables ) {
            let iframeContent = iframe.contentDocument || iframe.contentWindow.document;
            let selectTableLength = iframeContent.querySelector( '.dataTables_length select' );
            if( selectTableLength ) {
                let selectTableLengthOptions = [...selectTableLength.options];
                if( Array.isArray( selectTableLengthOptions ) ) {
                    let optionMaxValue = selectTableLengthOptions.reduce( function( previousValue, currentValue ) {
                        let prevVal = previousValue ? Number( previousValue.value ) : '';
                        let curVal = currentValue ? Number( currentValue.value ) : '';
                        if( prevVal < curVal ) {
                            previousValue = currentValue;
                        }

                        return previousValue;
                    } );

                    if( optionMaxValue ) {
                        selectTableLength.value = optionMaxValue.value;

                        WPTB_Helper.wptbDocumentEventGenerate( 'change', selectTableLength );
                    }
                }
            }
            let tableDOMElem = iframeContent.querySelector( 'table.tablepress' );
            tableDomImportingHandler( tableDOMElem, tableContent, iframe, dataTables );
        }

        function tablePressImportStageFour( tableDOMElem, iframe, dataTables, id ) {
            let http = new XMLHttpRequest(),
                url = ( wptb_admin_import_js_object ? wptb_admin_import_js_object.ajaxurl : ajaxurl ) + "?action=save_table",
                title,
                code;
            let iframeContent = iframe.contentDocument || iframe.contentWindow.document;
            let titleElem = iframeContent.querySelector( '.tablepress-table-name' );
            if( titleElem ) {
                title = titleElem.innerText;
            } else {
                title = '';
            }

            if( id ) {
                if( tableDOMElem.classList.contains( 'wptb-element-main-table_setting-startedid-0' ) ) {
                    tableDOMElem.classList.remove( 'wptb-element-main-table_setting-startedid-0' );
                    tableDOMElem.classList.add( 'wptb-element-main-table_setting-' + id );
                }
            }
            code = WPTB_Stringifier( tableDOMElem );
            code = code.outerHTML;

            let params = {
                title: title,
                content: code,
                security_code: wptb_admin_import_js_object.security_code
            };

            if ( id ) {
                params.id = id;
            }
            params = JSON.stringify( params );

            http.open('POST', url, true );
            http.setRequestHeader( 'Content-type', 'application/json; charset=utf-8' );

            http.onreadystatechange = function ( action ) {
                if ( this.readyState == 4 && this.status == 200 ) {
                    let data = JSON.parse( http.responseText );

                    if ( data[0] == 'saved' ) {
                        tablePressImportStageFour( tableDOMElem, iframe, dataTables, data[1] );
                    } else if( data[0] == 'edited' ) {
                        if( data[1] && window.wptbImportConvertationShortcodes &&
                            Array.isArray( window.wptbImportConvertationShortcodes ) &&
                            window.wptbImportConvertationShortcodes.length > 0 ) {

                            window.wptbImportConvertationShortcodes[window.wptbImportConvertationShortcodes.length - 1].push( '[wptb id=' + data[1] + ']' );
                        }
                        if( window.wptbImportCommonCountTables ) {
                            let commonCount = window.wptbImportCommonCountTables;
                            let importingCount = window.wptbImportCommonCountTables - dataTables.length;
                            let percent = tableImportingProgressBar( importingCount, commonCount, 'import' );

                            if( percent == 100 ) {
                                let importProgressBarContainer = document.querySelector( '.wptb-importPBarContainer' );
                                if( importProgressBarContainer ) {
                                    importProgressBarContainer.addEventListener( 'wptb-import:progressBar:full:import', function () {
                                        importedTablesInfoSettingBox();
                                    }, false );
                                }
                            }
                        } else {
                            tableImportingProgressBar( 100, 100, 'import' );
                        }

                        tablePressImportStageTwo( iframe, dataTables );
                    }
                }
            }

            http.send( params );
        }

        /**
         * function for working progress bar
         *
         * return percent
         */
        function tableImportingProgressBar( count, commonCount, eventPostfix ) {
            let importProgressBarContainer = document.querySelector( '.wptb-importPBarContainer' );
            let percentElement = document.querySelector( '#wptb-pBarPercent' );
            let percentElementSpan = document.querySelector( '#wptb-pBarPercent span' );
            if( importProgressBarContainer && percentElement && percentElementSpan ) {
                if( ( count || count === 0 ) && commonCount ) {
                    count = Number( count );
                    commonCount = Number( commonCount );
                    if( commonCount > 0 ) {
                        importProgressBarContainer.classList.add( 'wptb-importPBarContainerActive' );

                        let nameProcessingElem = importProgressBarContainer.querySelector( '.wptb-nameProcessInBarProgress' );
                        if( nameProcessingElem ) {
                            let nameProcessing = '';
                            let button;
                            if( eventPostfix == 'import' ) {
                                button = document.querySelector( '.wptb-importFromPlugin' );
                            } else if( eventPostfix == 'replace' ) {
                                button = document.querySelector( '.wptb-importTableReplaceShortcodes' );
                            }

                            if( button ) {
                                nameProcessing = button.dataset.name;
                                if( nameProcessing ) nameProcessingElem.innerHTML = nameProcessing;
                            }
                            if( ! nameProcessing ) nameProcessingElem.innerHTML = '';
                        }

                        // Calculate percent
                        let percent = ( ( count / commonCount ) * 100 ).toFixed( 2 );
                        if( percent > 100 ) percent = 100;

                        percentElementSpan.innerHTML = percent + '%';
                        if( percent < 3 ) {
                            percentElement.style.width = '3%';
                        } else {
                            percentElement.style.width = percent + '%';
                        }

                        if( percent == 100 ) {
                            setTimeout( function () {
                                importProgressBarContainer.classList.remove( 'wptb-importPBarContainerActive' );
                                eventPostfix = eventPostfix ? ':' + eventPostfix : '';
                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-import:progressBar:full' + eventPostfix, importProgressBarContainer );
                            }, 2000 );

                        }

                        return percent;
                    }
                }
            }
        }

        /**
         * function out table with imported shortcodes
         * and out button for replace shortcodes in posts
         */
        function importedTablesInfoSettingBox() {
            let importedTablesSetting = document.querySelector( '.wptb-importedTablesSetting' );
            if( importedTablesSetting ) {
                importedTablesSetting.style.display = 'block';
                let importedTablesCount = '';
                if( window.wptbImportConvertationShortcodes && Array.isArray( window.wptbImportConvertationShortcodes ) ) {
                    importedTablesCount = window.wptbImportConvertationShortcodes.length;
                }
                let importedTablesCountElem = document.querySelector( '.wptb-importedTablesCount span' );
                if( importedTablesCountElem && importedTablesCount ) importedTablesCountElem.innerHTML = importedTablesCount;

                let importedTablesShortcodesList = document.querySelector( '.wptb-importedTablesShortcodesList' );
                if( importedTablesShortcodesList && importedTablesCount > 0 ) {
                    let table = importedTablesShortcodesList.querySelector( 'table' );
                    let tbody = table.querySelector( 'tbody' );
                    tbody.innerHTML = '';
                    for( let i = 0; i < importedTablesCount; i++ ) {
                        let thisIterConvertShortcodes = window.wptbImportConvertationShortcodes[i];
                        if( thisIterConvertShortcodes && Array.isArray( thisIterConvertShortcodes ) ) {
                            let tr = document.createElement( 'tr' );
                            tr.innerHTML = '<td><input type="checkbox" name="shortcodesReplace[' + i + ']"></td>' +
                                '<td>' + thisIterConvertShortcodes[0] + '</td>' +
                                '<td>' + thisIterConvertShortcodes[1] + '</td>';

                            tbody.appendChild( tr );
                        }
                    }

                    let thead = table.querySelector( 'thead' );
                    let th = thead.querySelector( 'th' );
                    if( th ) {
                        let thInput = th.firstChild;
                        thInput.checked = false;
                        let trs = tbody.children;
                        if( trs.length > 0 ) {
                            thInput.onchange = function() {
                                for( let i = 0; i < trs.length; i++ ) {
                                    let tdFirst = trs[i].firstChild;
                                    if( tdFirst ) {
                                        let tdInput = tdFirst.firstChild;
                                        if( tdInput ) {
                                            if( this.checked ) {
                                                tdInput.checked = true;
                                            } else {
                                                tdInput.checked = false;
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            thInput.onchange = '';
                        }
                    }

                    importedTablesShortcodesList.style.display = 'block';

                    let importTableReplaceShortcodesButton = document.querySelectorAll( '.wptb-importTableReplaceShortcodes' );
                    if( importTableReplaceShortcodesButton.length > 0 ) {
                        for ( let i = 0; i < importTableReplaceShortcodesButton.length; i++ ) {
                            importTableReplaceShortcodesButton[i].style.display = 'block';

                            importTableReplaceShortcodesButton[i].onclick = importedTablesReplaceShortcodes.bind( this, tbody );
                        }
                    }
                }
            }
        }

        /**
         * function for replace imported shortcodes in posts
         * considering choosing imported shortcodes
         */
        function importedTablesReplaceShortcodes( tbody ) {
            if( tbody && tbody.children && tbody.children.length > 0 ) {
                let rows = tbody.children;
                let replacingShortcodes = [];
                for ( let i = 0; i < rows.length; i++ ) {
                    let tr = rows[i];
                    let tds = tr.children;
                    if( tds.length > 0 && tds[0] && tds[1] && tds[2] ) {
                        let inputCheckbox = tds[0].querySelector( 'input' );

                        if( inputCheckbox && inputCheckbox.checked && tds[1].innerHTML && tds[2].innerHTML ) {

                            replacingShortcodes.push( {
                                search: tds[1].innerHTML,
                                replace: tds[2].innerHTML
                            } );

                        }
                    }
                }

                if( replacingShortcodes.length > 0 ) {
                    replaceShortcodesAjax( replacingShortcodes, true );
                }
            }
        }

        function replaceShortcodesAjax( replacingShortcodes, firstRun ) {
            if( replacingShortcodes && Array.isArray( replacingShortcodes ) && replacingShortcodes.length > 0 ) {
                if( firstRun ) {
                    window.wptbImportShortcodesNecessaryReplace = replacingShortcodes.length;
                    window.wptbImportShortcodesReplacedCount = 0;
                    tableImportingProgressBar( 0, window.wptbImportShortcodesNecessaryReplace, 'replace' );
                }

                let http = new XMLHttpRequest(),
                    url = ( wptb_admin_import_js_object ? wptb_admin_import_js_object.ajaxurl : ajaxurl ) + "?action=shortcodes_replace";

                let replacingShortcodesOne = replacingShortcodes.shift();

                let params = {
                    replacing_shortcodes: replacingShortcodesOne,
                    security_code: wptb_admin_import_js_object.security_code
                };

                params = JSON.stringify( params );

                http.open('POST', url, true);
                http.setRequestHeader( 'Content-type', 'application/json; charset=utf-8' );

                http.onreadystatechange = function ( action ) {
                    if ( this.readyState == 4 && this.status == 200 ) {
                        let data = JSON.parse( http.responseText );

                        let commonCount = window.wptbImportShortcodesNecessaryReplace;
                        let replacedCount = window.wptbImportShortcodesNecessaryReplace - replacingShortcodes.length;
                        let percent = 0;
                        if( data && Array.isArray( data ) && data[0] == 'success' ) {
                            percent = tableImportingProgressBar( replacedCount, commonCount, 'replace' );
                            if( window.wptbImportShortcodesReplacedCount ) {
                                window.wptbImportShortcodesReplacedCount += data[1];
                            } else {
                                window.wptbImportShortcodesReplacedCount = data[1];
                            }
                        } else {
                            percent = tableImportingProgressBar( commonCount, commonCount, 'replace' );
                        }

                        if( percent == 100 ) {
                            let importProgressBarContainer = document.querySelector( '.wptb-importPBarContainer' );
                            if( importProgressBarContainer ) {
                                importProgressBarContainer.addEventListener( 'wptb-import:progressBar:full:replace', function () {
                                    let importedTablesShortcodesReplaced = document.querySelector( '.wptb-importedTablesShortcodesReplaced' );
                                    if( importedTablesShortcodesReplaced ) {
                                        importedTablesShortcodesReplaced.style.display = 'block';

                                        let importedShortcodesReplaceCount = document.querySelector('.wptb-importedShortcodesReplaceCount span');
                                        if ( importedShortcodesReplaceCount ) {
                                            if( window.wptbImportShortcodesReplacedCount ) {
                                                importedShortcodesReplaceCount.innerHTML = window.wptbImportShortcodesReplacedCount;
                                            } else {
                                                importedShortcodesReplaceCount.innerHTML = '0';
                                            }
                                        }
                                    }
                                }, false );
                            }
                        } else {
                            replaceShortcodesAjax( replacingShortcodes );
                        }
                    }
                }
                http.send( params );
            }
        }


        /**
         * function for change "TablePress" table
         * for importing it to WPTB
         */
        function tableDomImportingHandler( tableDomElem, tableContent, iframe, dataTables ) {
            if( tableDomElem ) {
                /*
                 * set including border style for table
                 */
                tableDomElem.style.borderStyle = 'solid';
                tableDomElem.style.borderWidth = '1px';
                //WPTB_Helper.checkSetGetStyleSizeValue( tableDomElem, 'border-width', 'border-top-width', 'px' );
                WPTB_Helper.checkSetGetStyleColorValue( tableDomElem, 'border-color', 'border-top-color', true );

                /*
                 * checking float table and set necessary attributes if it is
                 */
                let tableFloat = WPTB_Helper.checkSetGetStyleValue( tableDomElem, 'float', 'float' );
                if( tableFloat && tableFloat != 'none' ) {
                    tableDomElem.dataset.wptbTableAlignment = tableFloat;
                }

                /*
                 * remove 'caption' tag from table
                 */
                let caption = tableDomElem.querySelector( 'caption' );
                if( caption ) {
                    tableDomElem.removeChild( caption );
                }

                /*
                 * remove class attribute from 'tbody' tag
                 */
                let tBody = tableDomElem.querySelector( 'tbody' );
                if( tBody ) {
                    tBody.removeAttribute( 'class' );
                }

                let tHead = tableDomElem.querySelector( 'thead' );
                if( tHead ) {
                    let tHeadInnerHtml = tHead.innerHTML;
                    if( tHeadInnerHtml ) {
                        tHeadInnerHtml = WPTB_Helper.replaceAll( tHeadInnerHtml, '<th', '<td' );
                        tHeadInnerHtml = WPTB_Helper.replaceAll( tHeadInnerHtml, 'th>', 'td>' );
                        if( tBody ) {
                            let tBodyInnerHtml = tBody.innerHTML;
                            tBodyInnerHtml = tHeadInnerHtml + tBodyInnerHtml;

                            tBody.innerHTML = tBodyInnerHtml;
                        }
                    }

                    tableDomElem.removeChild( tHead );
                }

                let tFoot = tableDomElem.querySelector( 'tfoot' );
                if( tFoot ) {
                    let tFootInnerHtml = tFoot.innerHTML;
                    if( tFootInnerHtml ) {
                        if( tBody ) {
                            let tBodyInnerHtml = tBody.innerHTML;
                            tBodyInnerHtml =  tBodyInnerHtml + tFootInnerHtml;

                            tBody.innerHTML = tBodyInnerHtml;
                        }
                    }

                    tableDomElem.removeChild( tFoot );
                }

                /**
                 * Using recalculateIndexes function to
                 * add X and Y indexes for each cell and
                 * add table columns and maxColumns properties
                 * for tableDomElem object that it'll be necessary
                 */
                WPTB_Helper.recalculateIndexes( tableDomElem );

                let trs = tableDomElem.querySelectorAll( 'tr' );
                if( trs.length > 0 ) {
                    let elementsIndexes = {
                        imageElemIndex: 1,
                        textElemIndex: 1,
                        customHtmlElemIndex: 1
                    };

                    for( let i = 0; i < trs.length; i++ ) {
                        /**
                         * necessary removes and addings of attributes for td
                         */
                        trs[i].removeAttribute( 'class' );
                        trs[i].removeAttribute( 'role' );
                        trs[i].classList.add( 'wptb-row' );

                        /**
                         * checking value of tr backgroundColor
                         * if it is empty trsBackgroundColorIndic is true
                         */
                        let trsBackgroundColorIndic = true;
                        let tdsBackgroundColor = WPTB_Helper.checkSetGetStyleColorValue( trs[i], 'background-color', 'background-color' );
                        if( tdsBackgroundColor ) {
                            if( ! WPTB_Helper.isHex( tdsBackgroundColor ) ) {
                                tdsBackgroundColor = WPTB_Helper.rgbToHex( tdsBackgroundColor );
                            }

                            trs[i].style.tdsBackgroundColor = tdsBackgroundColor;
                            trsBackgroundColorIndic = false;
                        }

                        // let tablecontentForRow;
                        // if( tableContent && Array.isArray( tableContent ) ) {
                        //     tablecontentForRow = tableContent[i];
                        // }
                        let tds = [...trs[i].children];
                        let tdsBackgrounds;
                        let trInnerHtml = '';
                        for( let j = 0; j < tds.length; j++ ) {

                            /**
                             * checking all backgroundColors styles of cells and saving its in tdsBackgrounds variable
                             * if backgroundColors of cells are different setting tdsBackgrounds is empty
                             */
                            if( trsBackgroundColorIndic ) {
                                if( j > 0 && tdsBackgrounds != WPTB_Helper.checkSetGetStyleColorValue( trChildNodes[i], 'background-color', 'background-color' ) ) {
                                    tdsBackgrounds = '';
                                    trsBackgroundColorIndic = false;
                                } else {
                                    tdsBackgrounds = WPTB_Helper.checkSetGetStyleColorValue( trChildNodes[i], 'background-color', 'background-color' )
                                }
                            }

                            /**
                             * checkin of border width and border color of cell
                             * and also checking of dimension, if dimension isn't "px"
                             * setting these values null
                             */
                            // WPTB_Helper.checkSetGetStyleSizeValue( tds[j], 'width', 'width', 'px' );
                            // WPTB_Helper.checkSetGetStyleSizeValue( tds[j], 'height', 'height', 'px' );
                            tds[j].style.width = null;
                            tds[j].style.height = null;
                            tds[j].style.borderStyle = 'solid';
                            tds[j].style.borderWidth = '1px';

                            // let borderWidth1 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-width', 'border-top-width' );
                            // let borderWidth2 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-width', 'border-left-width' );
                            // let borderWidth3 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-width', 'border-right-width' );
                            // let borderWidth4 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-width', 'border-bottom-width' );
                            //
                            // let borderWidth = WPTB_Helper.getValueMaxCountSameElementsInArray( [borderWidth1, borderWidth2, borderWidth3, borderWidth4] );
                            //
                            // if( borderWidth && WPTB_Helper.checkingDimensionValue( borderWidth, 'px' ) ) {
                            //     tds[j].style.borderWidth = borderWidth;
                            // } else {
                            //     tds[j].style.borderWidth = '';
                            // }

                            let borderColor1 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-color', 'border-top-color' );
                            let borderColor2 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-color', 'border-left-color' );
                            let borderColor3 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-color', 'border-right-color' );
                            let borderColor4 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-color', 'border-bottom-color' );

                            let borderColor = WPTB_Helper.getValueMaxCountSameElementsInArray( [borderColor1, borderColor2, borderColor3, borderColor4] );
                            if( borderColor ) {
                                if( ! WPTB_Helper.isHex( borderColor ) ) {
                                    borderColor = WPTB_Helper.rgbToHex( borderColor );
                                }

                                tds[j].style.borderColor = borderColor;
                            }

                            WPTB_Helper.checkSetGetStyleSizeValue( tds[j], 'padding', 'padding-top', 'px' );

                            tds[j].dataset.wptbCssTdAutoWidth="true";

                            /**
                             * necessary removes and addings of attributes for td
                             */
                            tds[j].removeAttribute( 'class' );
                            tds[j].removeAttribute( 'role' );
                            tds[j].classList.add( 'wptb-droppable', 'wptb-cell' );

                            let tdXIndex = tds[j].dataset.xIndex;
                            let tdYIndex = tds[j].dataset.yIndex;
                            if( tdXIndex && tdYIndex && Array.isArray( tableContent ) &&
                                tableContent[tdYIndex] && Array.isArray( tableContent[tdYIndex] ) &&
                                tableContent[tdYIndex][tdXIndex] ) {
                                tds[j].innerHTML = tableContent[tdYIndex][tdXIndex];

                                let tdChildNodes = [...tds[j].childNodes];

                                let childNodesHandleredIndexesArr = tdChildNodesHandler( tdChildNodes, elementsIndexes );
                                let wptbElements;
                                if( childNodesHandleredIndexesArr && Array.isArray( childNodesHandleredIndexesArr ) ) {
                                    wptbElements = childNodesHandleredIndexesArr[0];
                                    elementsIndexes = childNodesHandleredIndexesArr[1];
                                }

                                tds[j].innerHTML = '';

                                for ( let k = 0; k < wptbElements.length; k++ ) {
                                    tds[j].appendChild( wptbElements[k] );
                                }
                            }

                            trInnerHtml += tds[j].outerHTML;
                        }

                        trs[i].innerHTML = trInnerHtml;

                        trs[i].style.backgroundColor = WPTB_Helper.rgbToHex( tdsBackgrounds );
                    }
                }

                tableDomElem.removeAttribute( 'class' );
                tableDomElem.removeAttribute( 'role' );
                tableDomElem.removeAttribute( 'id' );
                tableDomElem.removeAttribute( 'aria-describedby' );
                tableDomElem.classList.add( 'wptb-preview-table', 'wptb-element-main-table_setting-startedid-0' );

                addAttributesForTable( tableDomElem );

                tablePressImportStageFour( tableDomElem, iframe, dataTables );
            }
        }

        function tdChildNodesHandler( tdChildNodes, elementsIndexes ) {
            let wptbElements = [];
            for( let k = 0; k < tdChildNodes.length; k++ ) {

                if( tdChildNodes[k].nodeType != 1 && tdChildNodes[k].nodeType != 3 ) {
                    continue;
                }

                let element = document.createElement('div' );

                if( tdChildNodes[k].nodeType == 1 ) {
                    if( tdChildNodes[k].nodeName.toLowerCase() === 'img' ) {
                        tdChildNodes[k].style.width = '100%';
                        tdChildNodes[k].removeAttribute( 'class' );
                        element.classList.add( 'wptb-image-container', 'wptb-ph-element', 'wptb-element-image-' + elementsIndexes.imageElemIndex );
                        element.innerHTML = '<div class="wptb-image-wrapper">' +
                            '<a style="display: block;" target="_blank" rel="nofollow">' +
                            tdChildNodes[k].outerHTML +
                            '</a>' +
                            '</div>';
                        let img = element.querySelector( 'img' );
                        if( img ) img.style.width = '100%';

                        elementsIndexes.imageElemIndex++;
                    } else if( tdChildNodes[k].nodeName.toLowerCase() === 'wptb_shortcode_container_element' ) {
                        element.classList.add( 'wptb-shortcode-container', 'wptb-ph-element', 'wptb-element-shortcode-' + elementsIndexes.customHtmlElemIndex );
                        element.innerHTML = '<wptb_shortcode_container_element><div>' + tdChildNodes[k].innerHTML + '</div></wptb_shortcode_container_element>';

                        elementsIndexes.customHtmlElemIndex++;
                    } else {
                        element.classList.add( 'wptb-html-container', 'wptb-ph-element', 'wptb-element-custom_html-' + elementsIndexes.customHtmlElemIndex );
                        element.innerHTML = '<div class="wptb-custom-html-wrapper" data-wptb-new-element="1">' +
                            tdChildNodes[k].outerHTML +
                            '</div>';

                        elementsIndexes.customHtmlElemIndex++;
                    }
                } else if ( tdChildNodes[k].nodeType == 3 ) {
                    element.classList.add( 'wptb-text-container', 'wptb-ph-element', 'wptb-element-text-' + elementsIndexes.textElemIndex );
                    element.innerHTML = '<div><p>' + tdChildNodes[k].nodeValue + '</p></div>';
                    // tds[j].insertBefore( element, tdChildNodes[k] );
                    // tds[j].removeChild( tdChildNodes[k] );

                    let textP = element.querySelector( 'p' );
                    if( textP ) {
                        let textPFontSize = WPTB_Helper.checkSetGetStyleSizeValue( textP, 'font-size', 'font-size' );
                        if( textPFontSize ) {
                            if( WPTB_Helper.checkingDimensionValue( textPFontSize, 'px' ) ) {
                                textP.style.fontSize = null;
                                element.style.fontSize = textPFontSize;
                            }
                        }

                        let textPColor = WPTB_Helper.checkSetGetStyleColorValue( textP, 'color', 'color' );
                        if( textPColor ) {
                            if( WPTB_Helper.isHex( textPColor ) ) {
                                textP.style.color = null;
                                element.style.color = textPColor;
                            } else if( WPTB_Helper.rgbToHex( textPColor ) ) {
                                textP.style.color = null;
                                textPColor = WPTB_Helper.rgbToHex( textPColor );
                                element.style.color = textPColor;
                            }
                        }
                    }

                    elementsIndexes.textElemIndex++;
                }

                wptbElements.push( element );
            }

            return [wptbElements, elementsIndexes];
        }

        // creates hidden iframe
        // uploading there content by shortcode
        // and return DOM Html of this content
        function getContentShortcodes( shortcode ) {
            if( shortcode ) {
                let importIframeSection = document.getElementById( 'wptb-importIframeSection' );
                if( importIframeSection ) {
                    let iframe = importIframeSection.querySelector( 'iframe' );
                    iframe.style.width = '100%';
                    iframe.style.height = "800px";
                    let url = wptb_admin_import_js_object ? wptb_admin_import_js_object.import_iframe_url +
                        '&_wpnonce=' + wptb_admin_import_js_object.security_code + '&shortcode=' + shortcode : '';
                    iframe.src = url;
                    importIframeSection.appendChild( iframe );

                    return iframe.querySelector( 'table .tablepress' );
                }
            }
        }

        let wptbImportFromPlugin = document.getElementsByClassName( 'wptb-importFromPlugin' );
        for( let i = 0; i < wptbImportFromPlugin.length; i++ ) {
            wptbImportFromPlugin[i].onclick = importFromPlugin;
        }
    });

})();