(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", () => {
        let importFromFile = document.querySelector( '#wptb-importSubmit' );

        importFromFile.onclick = function (e) {
            e.preventDefault();

            let regex = /^([a-zA-Z0-9()\s_\\.\-:])+(.csv)$/;
            let regex2 = /^([a-zA-Z0-9()\s_\\.\-:])+(.xml)$/;
            let regex3 = /^([a-zA-Z0-9()\s_\\.\-:])+(.html)$/;

            let wptbImportFileInput = document.querySelector( '#wptb-importFile' );
            if( wptbImportFileInput ) {
                let is_csv = regex.test( wptbImportFileInput.value.toLowerCase());
                let is_xml = regex2.test( wptbImportFileInput.value.toLowerCase());
                let is_html = regex3.test( wptbImportFileInput.value.toLowerCase());
                let csvDelimiterSelect = document.querySelector( '#wptb-csvDelimiter' );
                let csvDelimiter;
                if( csvDelimiterSelect ) {
                    csvDelimiter = csvDelimiterSelect.value;
                }

                if (is_csv || is_xml || is_html ) {
                    if ( typeof ( FileReader ) != "undefined" ) {
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            let rows;
                            let data = e.target.result;
                            if( is_csv ) {
                                rows = wptb_parseString( data, "\n" );

                                let arr = CSVToArray( data, csvDelimiter );
                                console.log(arr);
                            } else if ( is_xml ) {
                                rows = wptb_xmlImportFileParse( data );
                            } else if( is_html ) {
                                rows = '';
                            } else if( is_zip ) {

                            }

                            if( rows && Array.isArray( rows ) && rows.length > 0 ) {
                                // preparing the select ID array
                                for ( let i = 0; i < rows.length; i++) {
                                    if( ! rows[i] ) continue;
                                    // Filter header
                                    // Cells variable is where the column data can be found.
                                    let cells;
                                    if ( is_csv ) {
                                        cells = wptb_parseString(rows[i]);
                                    } else if ( is_xml ) {
                                        cells = rows[i];
                                    }

                                    if ( cells.length > 0 ) {

                                        // Import Loader
                                        var status = 'no';
                                        jQuery(".wpcd_import_field_select").each(function () {
                                            var import_key = jQuery(this).val();
                                            if (import_key == 'coupon_title') {
                                                status = 'yes';
                                            }
                                        });
                                        if (status == 'yes') {
                                            jQuery(".wpcd_import_form_final_loader").fadeIn();
                                            wpcd_ajax_import( 'wpcd_process_import', JSON.stringify( wpcp_coupons_data ) );
                                            jQuery("#wpcd_import_field_error").hide();
                                        } else {
                                            jQuery("#wpcd_import_field_error").show();
                                        }
                                        // End of Import Loader

                                    }
                                }
                            }
                        }

                        reader.readAsText( wptbImportFileInput.files[0]);
                        // jQuery(".wpcd-import-wrapper").show(); // Second form shows only if file is valid
                        // jQuery("#wpcd_import_form").hide(); // Hides the first Import Form
                    } else {
                        alert("This browser does not support HTML5.");
                    }
                } else {
                    alert("Please upload a valid file.");
                    // jQuery('.wpcd-import-wrapper').hide();
                    jQuery("#wpcd_import_form_wr").show();
                }
            }
        }


        // function for parse string (analog of split js)
        function wptb_parseString( str, separator ) {
            var arr = [];
            var quote = false;

            // getting of separator
            if ( ! separator ) {
                if ( str != str.split('|')[0] ) {
                    separator = '|';
                } else if ( str != str.split( ';' )[0] ) {
                    separator = ';';
                } else {
                    separator = ',';
                }
            }

            // iterate over each character, keep track of current column (of the returned array)
            for (var col = 0, c = 0; c < str.length; c++) {
                var cc = str[c], nc = str[c+1];        // current character, next character
                arr[col] = arr[col] || '';   // create a new column (start with empty string) if necessary

                if ( cc == '"' && quote && nc == '"' ) { arr[col] += cc; ++c; continue; }
                if ( cc == '"' ) {
                    quote = !quote;
                    if ( separator == '\n' ) {
                        arr[col] += cc;
                    }
                    continue;
                }
                if ( cc == separator && !quote ) {
                    ++col;
                    continue;
                }

                arr[col] += cc;
            }
            return arr;
        }

        // function for parse CSV to array
        function CSVToArray ( strData, strDelimiter ){

            strDelimiter = ( strDelimiter || "," );

            if( strDelimiter == 'tab' ) strDelimiter = '\t';

            let objPattern = new RegExp(
                (
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
                ),
                "gi"
            );

            let arrData = [[]];
            let arrMatches = null;

            while ( arrMatches = objPattern.exec( strData ) ){
                let strMatchedDelimiter = arrMatches[ 1 ];
                if (
                    strMatchedDelimiter.length &&
                    strMatchedDelimiter !== strDelimiter
                ){
                    arrData.push( [] );
                }
                let strMatchedValue;
                if (arrMatches[ 2 ]){
                    strMatchedValue = arrMatches[ 2 ].replace(
                        new RegExp( "\"\"", "g" ),
                        "\""
                    );
                } else {
                    strMatchedValue = arrMatches[ 3 ];
                }
                arrData[ arrData.length - 1 ].push( strMatchedValue );
            }

            return( arrData );
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

        // function for parse Xml file
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
                    let imageElemIndex = 1,
                        textElemIndex = 1,
                        customHtmlElemIndex = 1;

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
                                            element.classList.add( 'wptb-image-container', 'wptb-ph-element', 'wptb-element-image-' + imageElemIndex );
                                            element.innerHTML = '<div class="wptb-image-wrapper">' +
                                                '<a style="display: block;" target="_blank" rel="nofollow">' +
                                                tdChildNodes[k].outerHTML +
                                                '</a>' +
                                                '</div>';
                                            let img = element.querySelector( 'img' );
                                            if( img ) img.style.width = '100%';

                                            imageElemIndex++;
                                        } else if( tdChildNodes[k].nodeName.toLowerCase() === 'wptb_shortcode_container_element' ) {
                                            element.classList.add( 'wptb-shortcode-container', 'wptb-ph-element', 'wptb-element-shortcode-' + customHtmlElemIndex );
                                            element.innerHTML = '<wptb_shortcode_container_element><div>' + tdChildNodes[k].innerHTML + '</div></wptb_shortcode_container_element>';

                                            customHtmlElemIndex++;
                                        } else {
                                            element.classList.add( 'wptb-html-container', 'wptb-ph-element', 'wptb-element-custom_html-' + customHtmlElemIndex );
                                            element.innerHTML = '<div class="wptb-custom-html-wrapper" data-wptb-new-element="1">' +
                                                tdChildNodes[k].outerHTML +
                                                '</div>';

                                            customHtmlElemIndex++;
                                        }
                                    } else if ( tdChildNodes[k].nodeType == 3 ) {
                                        element.classList.add( 'wptb-text-container', 'wptb-ph-element', 'wptb-element-text-' + textElemIndex );
                                        element.innerHTML = '<div><p>' + tdChildNodes[k].nodeValue + '</p></div>';
                                        tds[j].insertBefore( element, tdChildNodes[k] );
                                        tds[j].removeChild( tdChildNodes[k] );

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

                                        textElemIndex++;
                                    }

                                    wptbElements.push( element );
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

                /*
                 * add adaptive table data attribute to set table responsive or not
                 */
                let importTableResponsiveCheckbox = document.querySelector( '#wptb-importTableResponsive' );
                if( importTableResponsiveCheckbox && importTableResponsiveCheckbox.checked ) {
                    tableDomElem.dataset.wptbAdaptiveTable = '1';
                } else {
                    tableDomElem.dataset.wptbAdaptiveTable = '0'
                }

                /*
                 * add wptb-table-preview-head class to set top row as header if it chosen
                 */
                let importTableTopRowAsHeaderCheckbox = document.querySelector( '#wptb-topRowAsHeader' );
                if( importTableTopRowAsHeaderCheckbox && importTableTopRowAsHeaderCheckbox.checked ) {
                    tableDomElem.classList.add( 'wptb-table-preview-head' );
                }

                tablePressImportStageFour( tableDomElem, iframe, dataTables );
            }
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