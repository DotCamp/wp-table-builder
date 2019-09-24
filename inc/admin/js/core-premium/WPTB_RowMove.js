var WPTB_RowMove = function () {
    this.rowMovingField;
    
    this.withdrawTable;
    
    this.tablePreview;
    
    this.tBody;
    
    this.body;
    
    this.rowsTopBottomCoordinatesArr;
    
    this.setTimeoutWhenStopMove;
    
    // function creates a field with which will move a row to left or right 
    // if this field isn't existence and put it on the right place
    this.rowMovingFieldPutActive = () => {
        let rowMovingField = document.getElementsByClassName( 'wptb-row-moving-field' );
        let body = document.getElementsByTagName( 'body' )[0];
        this.body = body;
        if( rowMovingField.length > 0 ) {
            this.rowMovingField = rowMovingField[0];
        } else {
            rowMovingField = document.createElement( 'div' );
            rowMovingField.classList.add( 'wptb-row-moving-field' );
            let visualButtonBox = document.createElement( 'div' );
            visualButtonBox.classList.add( 'visual-button-box' );
            visualButtonBox.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n\
                    x="0px" y="0px" width="30" height="30" viewBox="0 0 511.626 511.627" \n\
                    style="enable-background:new 0 0 511.626 511.627;" xml:space="preserve">\n\
                    <path d="M328.906,401.994h-36.553V109.636h36.553c4.948,0,9.236-1.809,12.847-5.426c3.613-3.615,5.421-7.898,5.421-12.845 \n\
                        c0-4.949-1.801-9.231-5.428-12.851l-73.087-73.09C265.044,1.809,260.76,0,255.813,0c-4.948,0-9.229,1.809-12.847,5.424 \n\
                        l-73.088,73.09c-3.618,3.619-5.424,7.902-5.424,12.851c0,4.946,1.807,9.229,5.424,12.845c3.619,3.617,7.901,5.426,12.85,5.426 \n\
                        h36.545v292.358h-36.542c-4.952,0-9.235,1.808-12.85,5.421c-3.617,3.621-5.424,7.905-5.424,12.854 \n\
                        c0,4.945,1.807,9.227,5.424,12.847l73.089,73.088c3.617,3.617,7.898,5.424,12.847,5.424c4.95,0,9.234-1.807,12.849-5.424 \n\
                        l73.087-73.088c3.613-3.62,5.421-7.901,5.421-12.847c0-4.948-1.808-9.232-5.421-12.854 \n\
                        C338.142,403.802,333.857,401.994,328.906,401.994z" style="fill:#FFFFFF"></path>\n\
                </svg>';
            
            let visualButtonBoxLeft = visualButtonBox.cloneNode( true );
            
            visualButtonBoxLeft.classList.add( 'visual-button-box-left' );
            
            rowMovingField.appendChild( visualButtonBox );
            rowMovingField.appendChild( visualButtonBoxLeft );
            
            body.appendChild( rowMovingField );
            
            this.rowMovingField = rowMovingField;
        }
        
        let wptbContainer = document.getElementsByClassName( 'wptb-container' )[0];
        
        // function set coordinates top and write property positionTop for moving field
        this.rowMovingFieldParametrsOne = () => {
            let coordinatesHighlighted = wptbHighlighted.getBoundingClientRect();
            this.rowMovingField.style.top = parseFloat( coordinatesHighlighted.top ) + 'px';
            this.rowMovingField.positionTop = parseFloat( coordinatesHighlighted.top );
            this.rowMovingField.height = parseFloat( coordinatesHighlighted.height );
        }
        wptbContainer.removeEventListener( 'scroll', this.rowMovingFieldParametrsOne, false );
        
        // function set position left and heigth for moving field
        let rowMovingFieldParametrsTwo = () => {
            this.rowMovingFieldParametrsOne();
            let wptbHighlighted = document.getElementsByClassName( 'wptb-highlighted' );
            if( wptbHighlighted.length > 0 ) {
                wptbHighlighted = wptbHighlighted[0];
                
                let coordinatesHighlighted = wptbHighlighted.getBoundingClientRect(),
                coordinatesHighlightedHeight = parseFloat( coordinatesHighlighted.height );

                this.rowMovingField.style.display = 'table';
                this.rowMovingField.style.height = coordinatesHighlightedHeight + 'px';

                let wptbTableSetup = document.getElementsByClassName( 'wptb-table-setup' );
                if( wptbTableSetup.length > 0 ) {
                    wptbTableSetup = wptbTableSetup[0];

                    let coordinatesPreviewTable = wptbTableSetup.getBoundingClientRect()
                    this.rowMovingField.style.left = parseFloat( coordinatesPreviewTable.right ) + 'px';
                    this.rowMovingField.querySelector( '.visual-button-box-left' ).style.left = '-' + ( parseFloat( coordinatesPreviewTable.width ) + 30 ) + 'px';
                    
                    let tableWithdrewRows = this.rowMovingField.getElementsByClassName( 'wptb-table-setup' );
                    if( tableWithdrewRows.length > 0 ) {
                        tableWithdrewRows = tableWithdrewRows[0];

                        tableWithdrewRows.style.maxWidth = wptbTableSetup.getBoundingClientRect().width + 'px';
                    }
                }
            }
        }
        window.removeEventListener( 'resize', rowMovingFieldParametrsTwo, false );
        
        let wptbHighlighted = document.getElementsByClassName( 'wptb-highlighted' );
        if( wptbHighlighted.length > 0 ) {
            wptbHighlighted = wptbHighlighted[0];
            
            this.rowMovingFieldParametrsOne();
            rowMovingFieldParametrsTwo();
        }
            
        let checkHighlighted = () => {
            let highlighted = document.getElementsByClassName( 'wptb-highlighted' );
            if( highlighted.length != 1 ) {
                if( ! this.rowMovingField ) {
                    this.rowMovingField = document.querySelector( '.wptb-row-moving-field' );
                }
                let rowMovingField = this.rowMovingField;
                if( rowMovingField ) {
                    let parent = rowMovingField.parentNode;
                    parent.removeChild( rowMovingField );
                }
            }
            body.removeEventListener( 'click', checkHighlighted, false );
        }
        
        wptbContainer.addEventListener( 'scroll', this.rowMovingFieldParametrsOne, false );
        window.addEventListener( 'resize', rowMovingFieldParametrsTwo, false );
        body.addEventListener( 'click', checkHighlighted, false );
        
        // sets handler for the event when the moving field was moved
        this.rowMovingField.onmousedown = ( eventDown ) => {
            this.rowMovingField.downYcoordinates = eventDown.clientY;
            let body = this.body;
            
            if( ! this.withdrawTable ) {
                this.withdrawTable = this.withdrawSelectedRowsFromTable();
            }
            
            if( ! this.tablePreview ) {
                this.tablePreview = document.querySelector( '.wptb-preview-table' );
            }
            let tablePreview = document.querySelector( '.wptb-preview-table' );

            if( ! this.rowMovingField ) {
                this.rowMovingField = document.querySelector( '.wptb-row-moving-field' );
            }
            let rowMovingField = this.rowMovingField;
            if( rowMovingField ) {
                let withdrawTableContainer = document.createElement( 'div' );
                withdrawTableContainer.classList.add( 'wptb-withdraw-table-container' );

                withdrawTableContainer.appendChild( this.withdrawTable );

                rowMovingField.appendChild( withdrawTableContainer );

                withdrawTableContainer.style.position = 'absolute';
                withdrawTableContainer.style.right = '30px';

                if( tablePreview ) {
                    withdrawTableContainer.style.width = tablePreview.getBoundingClientRect().width + 'px';
                }
            }
            
            this.rowsTopBottomCoordinatesArr = setRowsTopBottomCoordinates();
            
            body.onmousemove = ( eventMove ) => {
                if( ! this.rowMovingField ) {
                    this.rowMovingField = document.querySelector( '.wptb-row-moving-field' );
                }
                let rowMovingField = this.rowMovingField;
                if( rowMovingField ) {
                    body.onmouseup = () => {
                        if( ! this.rowMovingField ) {
                            this.rowMovingField = document.querySelector( '.wptb-row-moving-field' );
                        }
                        let rowMovingField = this.rowMovingField;
                        if( rowMovingField ) {
                            body.removeChild( rowMovingField );
                            
                            this.withdrewRowsPut();
                            
                            this.withdrawTable = null;
                        }
                        
                        body.onmouseup = null;
                        body.onmousemove = null;
                        
                        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();
                    }
                    
                    if( ! this.withdrawTableContainer ) {
                        this.withdrawTableContainer = document.querySelector( '.wptb-withdraw-table-container' );
                    }
                    let withdrawTableContainer = this.withdrawTableContainer;
                    
                    withdrawTableContainer.style.display = 'block';
                    
                    if( ! this.withdrawTable ) {
                        this.withdrawTable = this.withdrawSelectedRowsFromTable();
                    }
                    
//                    clearTimeout( this.setTimeoutWhenStopMove );
//                    
//                    this.setTimeoutWhenStopMove = setTimeout( () => {
//                        let withdrawTableContainer = document.querySelector( '.wptb-withdraw-table-container' );
//                        if( withdrawTableContainer ) {
//                            withdrawTableContainer.style.display = 'none';
//                            this.withdrewRowsPut( true );
//                            this.withdrawTable = null;
//                            this.rowMovingFieldParametrsOne();
//                        }
//                    }, 800 );
                    
                    let downYcoordinates = rowMovingField.downYcoordinates;
                    let differenceY = downYcoordinates - eventMove.clientY;
                    
                    let rowMovingFieldTopCoordinates = ( parseFloat( rowMovingField.positionTop ) - parseFloat( differenceY ) );
                    
                    let rowMovingFieldBottomCoordinates = rowMovingFieldTopCoordinates + parseFloat( rowMovingField.height );
                    
                    if( ! this.tablePreview ) {
                        this.tablePreview = document.querySelector( '.wptb-preview-table' );
                    }
                    let tablePreview = this.tablePreview;
                    
                    let tableCoordinatesTop = parseFloat( tablePreview.getBoundingClientRect().top );
                    
                    let tableCoordinatesBottom = parseFloat( tablePreview.getBoundingClientRect().bottom );
                    
                    rowMovingField.style.top = rowMovingFieldTopCoordinates + 'px';
                    
                    if( tableCoordinatesTop - parseFloat( rowMovingField.style.top ) >= 20 ) {
                        rowMovingField.style.top = ( tableCoordinatesTop - 20 ) + 'px';
                    } else if( parseFloat( rowMovingField.style.top ) + parseFloat( rowMovingField.height ) - tableCoordinatesBottom >= 20 )  {
                        rowMovingField.style.top = ( tableCoordinatesBottom - parseFloat( rowMovingField.height ) + 20 ) + 'px';
                    }
                    
                    if( ! this.tBody ) {
                        this.tBody = tablePreview.querySelector( 'tbody' );
                    }
                    let tBody = this.tBody;
                    
                    let rowsMoving = tBody.getElementsByClassName( 'wptb-row-moving' );
                    let rowsMovingDeleted = [];
                    if( rowsMoving.length > 0 ) {
                        if( this.rowsTopBottomCoordinatesArr['top'] && 
                                parseInt( this.rowsTopBottomCoordinatesArr['top'][1], 10 ) + 10 >= rowMovingFieldTopCoordinates ) {
                            for( let i = 0; i < rowsMoving.length; i++ ) {
                                rowsMovingDeleted.push( rowsMoving[i] );
                            }
                            
                            for( let i = 0; i < rowsMovingDeleted.length; i++ ) {
                                tBody.removeChild( rowsMovingDeleted[i] );
                            }
                            
                            this.cutTableHorizontally( this.rowsTopBottomCoordinatesArr['top'][0] );
                            
                            for( let i = 0; i < rowsMovingDeleted.length; i++ ) {
                                tBody.insertBefore( rowsMovingDeleted[i], tablePreview.rows[this.rowsTopBottomCoordinatesArr['top'][0] + i] );
                            }

                            tablePreview.recalculateIndexes();
                            
                            if( tablePreview.rows[this.rowsTopBottomCoordinatesArr['top'][0] + 1] && tablePreview.rows[this.rowsTopBottomCoordinatesArr['top'][0] + 2] ) {
                                this.glueTableHorizontally( tablePreview.rows[this.rowsTopBottomCoordinatesArr['top'][0] + 1], 
                                    tablePreview.rows[this.rowsTopBottomCoordinatesArr['top'][0] + 2] );
                            }
                            
                            this.rowsTopBottomCoordinatesArr = setRowsTopBottomCoordinates();
                        } else if( this.rowsTopBottomCoordinatesArr['bottom'] && 
                                parseInt( this.rowsTopBottomCoordinatesArr['bottom'][1], 10 ) - 10 <= rowMovingFieldBottomCoordinates ) {
                            for( let i = 0; i < rowsMoving.length; i++ ) {
                                rowsMovingDeleted.push( rowsMoving[i] );
                            }
                            
                            for( let i = 0; i < rowsMovingDeleted.length; i++ ) {
                                tBody.removeChild( rowsMovingDeleted[i] );
                            }
                            
                            this.cutTableHorizontally( this.rowsTopBottomCoordinatesArr['bottom'][0] - rowsMovingDeleted.length );
                            
                            for( let i = 0; i < rowsMovingDeleted.length; i++ ) {
                                tBody.insertBefore( rowsMovingDeleted[i], tablePreview.rows[this.rowsTopBottomCoordinatesArr['bottom'][0] - rowsMovingDeleted.length + i] );
                            }
                            
                            tablePreview.recalculateIndexes();
                            
                            if( tablePreview.rows[this.rowsTopBottomCoordinatesArr['bottom'][0] - 3] && tablePreview.rows[this.rowsTopBottomCoordinatesArr['bottom'][0] - 2] ) {
                                this.glueTableHorizontally( tablePreview.rows[this.rowsTopBottomCoordinatesArr['bottom'][0] - 3], 
                                    tablePreview.rows[this.rowsTopBottomCoordinatesArr['bottom'][0] - 2] );
                            }

                            this.rowsTopBottomCoordinatesArr = setRowsTopBottomCoordinates();
                        }
                    }
                }
            }
        }
        
        function setRowsTopBottomCoordinates() {
            if( ! this.tablePreview ) {
                this.tablePreview = document.querySelector( '.wptb-preview-table' );
            }
            let table = this.tablePreview,
            cell = table.querySelector('.wptb-highlighted'),
            rowspan = cell.rowSpan,
            row = parseInt( cell.dataset.yIndex, 10 );
    
            let rowsTopBottomCoordinatesArr = [];

            if( table.rows[row - 1] ) {
                rowsTopBottomCoordinatesArr['top'] = [row - 1, table.rows[row - 1].getBoundingClientRect().top];
            }
            
            if( table.rows[row + rowspan] ) {
                rowsTopBottomCoordinatesArr['bottom'] = [row + rowspan + 1, table.rows[row + rowspan].getBoundingClientRect().bottom];
            }
            
            return rowsTopBottomCoordinatesArr;
        }
        
        // returns difference of positions of moving field before and after moving when this field was moved
        function cursorPositionDifference( eventMove, body, rowMovingField ) {
            
        }
    }
    
    // function hide the moving field 
    this.rowMovingFieldHide = () => {
        let rowMovingField = document.getElementsByClassName( 'wptb-row-moving-field' );
        if( rowMovingField.length > 0 ) {
            rowMovingField = rowMovingField[0];
            rowMovingField.style.display = 'none';
        }
    }
    
    this.withdrawSelectedRowsFromTable = function() {
        if( ! this.tablePreview ) {
            this.tablePreview = document.querySelector( '.wptb-preview-table' );
        }
        let table = this.tablePreview,
            cell = document.querySelector('.wptb-highlighted'),
            rowspan = cell.rowSpan,
            row = parseInt( cell.dataset.yIndex, 10 ),
            tableWithdrewRows = document.createElement( 'table' ),
            tableWithdrewRowsTbody = document.createElement( 'tbody' );
            tableWithdrewRows.appendChild( tableWithdrewRowsTbody );
            tableWithdrewRows.classList.add( 'wptb-preview-table' );
            
            if( table ) {
                let tableAttributes = table.attributes;
                
                for( let i = 0; i < tableAttributes.length; i++ ) {
                    tableWithdrewRows.setAttribute( tableAttributes[i].nodeName, tableAttributes[i].nodeValue );
                }
            }
    
        if ( rowspan == undefined ) rowspan = 1;
        
        this.cutTableHorizontally( row );
        
        this.cutTableHorizontally( row + rowspan );
        
        //undoSelect();
        
        let tableRowsWithDrewArr = [];
        for( let i = row; i < row + rowspan; i++ ) {
            tableRowsWithDrewArr.push( table.rows[i] );
            tableWithdrewRowsTbody.appendChild( table.rows[i].cloneNode( true ) );
            
            if( i == row ) {
                table.rows[i].style.height = parseInt( table.rows[i].getBoundingClientRect().height ) + 15 + 'px';
            }
            
            if( i == row + rowspan - 1 ) {
                table.rows[i].style.height = parseInt( table.rows[i].getBoundingClientRect().height ) + 15 + 'px';
            }
            
            let rowsIChildren = table.rows[i].children;
            for( let j = 0; j < rowsIChildren.length; j++ ) {
                if( rowsIChildren[j].dataset.xIndex == 0 ) {
                    rowsIChildren[j].classList.add( 'wptb-td-border-top-bottom-right-none' );
                } else if( rowsIChildren[j].dataset.xIndex == table.maxCols - 1 ) {
                    rowsIChildren[j].classList.add( 'wptb-td-border-top-bottom-left-none' );
                } else {
                    rowsIChildren[j].classList.add( 'wptb-td-border-none' );
                }
            }
            
            table.rows[i].classList.add( 'wptb-row-moving' );
        }
        
        let rowNew = tableWithdrewRows.insertRow(-1);
        rowNew.classList.add( 'wptb-row' );
        rowNew.style.display = 'none';
        for( let i = 0; i < table.maxCols; i++ ) {
            let td = new WPTB_Cell( table.mark );
            td.getDOMElement().dataset.wptbCssTdAutoWidth = 'true';
            tableWithdrewRows.rows[tableWithdrewRows.rows.length - 1].appendChild( td.getDOMElement() );
        }
                
        return tableWithdrewRows;
    }
    
    this.cutTableHorizontally = function( rowsBefore ) {
        if( ! this.tablePreview ) {
            this.tablePreview = document.querySelector( '.wptb-preview-table' );
        }
        let table = this.tablePreview;
        rowsBefore = parseInt( rowsBefore, 10 );
        if( table.rows[rowsBefore] ) {
            for( let i = 0; i < rowsBefore; i++ ) {
                let tableRowsIChildren = table.rows[i].children;

                for( let j = 0; j < tableRowsIChildren.length; j++ ) {
                    if ( tableRowsIChildren[j].rowSpan > 1 && tableRowsIChildren[j].rowSpan > rowsBefore - i ) {
                        let newTdRowspan = tableRowsIChildren[j].rowSpan - rowsBefore + i;
                        tableRowsIChildren[j].rowSpan = rowsBefore - i;
                        if( ! tableRowsIChildren[j].dataset.sameCellBeforeDivision ) {
                            tableRowsIChildren[j].dataset.sameCellBeforeDivision = 'r' + i + 'c' + j;
                        }

                        let td = new WPTB_Cell( table.mark ),
                        tdTopStyle = tableRowsIChildren[j].getAttribute( 'style' );
                        td.getDOMElement().setAttribute( 'style', tdTopStyle );
                        td.getDOMElement().colSpan = tableRowsIChildren[j].colSpan;
                        td.getDOMElement().rowSpan = newTdRowspan;
                        td.getDOMElement().dataset.sameCellBeforeDivision = tableRowsIChildren[j].dataset.sameCellBeforeDivision;

                        let dataXIndex = tableRowsIChildren[j].dataset.xIndex;
                        let dataXIndexNext = parseInt( dataXIndex ) + parseInt( tableRowsIChildren[j].colSpan );
                        let beforeTd;
                        while( ! beforeTd && dataXIndexNext < table.maxCols ) {
                            beforeTd = table.rows[rowsBefore].querySelector( '[data-x-index="' + dataXIndexNext + '"]' );
                            dataXIndexNext++;
                        }
                        table.rows[rowsBefore].insertBefore( td.getDOMElement(), beforeTd );

                        table.recalculateIndexes();
                    }
                }
            }
        }
    }
    
    this.glueTableHorizontally = function() {
        if( ! this.tablePreview ) {
            this.tablePreview = document.querySelector( '.wptb-preview-table' );
        }
        let table = this.tablePreview;
        if( table ) {
            let tds = [...table.getElementsByTagName( 'td' )];
            for( let i = 0; i < tds.length; i++ ) {
                if( tds[i].hasAttribute( 'data-same-cell-before-division' ) ) {
                    let dataSameCellBeforeDivision = tds[i].dataset.sameCellBeforeDivision;
                    let tdsSameBeforeDivision = table.querySelectorAll( '[data-same-cell-before-division="' + dataSameCellBeforeDivision + '"]' );
                    for( let j = 0; j < tdsSameBeforeDivision.length; j++ ) {
                        if( tdsSameBeforeDivision[j] && tdsSameBeforeDivision[j + 1] ) {
                            if( tdsSameBeforeDivision[j].parentNode && tdsSameBeforeDivision[j + 1].parentNode && 
                                ! tdsSameBeforeDivision[j].parentNode.classList.contains( 'wptb-row-moving' ) &&
                            ! tdsSameBeforeDivision[j + 1].parentNode.classList.contains( 'wptb-row-moving' ) ) {
                                if( ( tdsSameBeforeDivision[j + 1].dataset.yIndex == parseInt( tdsSameBeforeDivision[j].dataset.yIndex ) + parseInt( tdsSameBeforeDivision[j].rowSpan ) ) ) {
                                    tdsSameBeforeDivision[j].rowSpan += tdsSameBeforeDivision[j + 1].rowSpan;
                            
                                    let nextRow = tdsSameBeforeDivision[j + 1].parentNode;
                                    nextRow.removeChild( tdsSameBeforeDivision[j + 1] );
                                }
                            }
                        }
                    }
                }
            }
            
            table.recalculateIndexes();
        }
    }
    
    this.withdrewRowsPut = function( temporaryShow ) {
        if( ! this.tablePreview ) {
            this.tablePreview = document.querySelector( '.wptb-preview-table' );
        }
        let table = this.tablePreview;
        if( table ) {
            let rows = table.rows;
            for( let i = 0; i < rows.length; i++ ) {
                if( rows[i].classList.contains( 'wptb-row-moving' ) ) {
                    let children = rows[i].children;

                    for( let j = 0; j < children.length; j++ ) {
                        children[j].classList.remove( 'wptb-td-border-top-bottom-right-none' );
                        children[j].classList.remove( 'wptb-td-border-top-bottom-left-none' );
                        children[j].classList.remove( 'wptb-td-border-none' );
                    }

                    rows[i].style.height = '';
                    rows[i].classList.remove( 'wptb-row-moving' );
                }
            }

            this.glueTableHorizontally();
            
            if( ! temporaryShow ) {
                let highlighted = [...table.getElementsByClassName( 'wptb-highlighted' )];
                for ( let i = 0; i < highlighted.length; i++ ) {
                    highlighted[i].classList.remove( 'wptb-highlighted' );
                }
                
                let tds = [...table.getElementsByTagName( 'td' )];
                for( let i = 0; i < tds.length; i++ ) {
                    if( tds[i].hasAttribute( 'data-same-cell-before-division' ) ) {
                        tds[i].removeAttribute( 'data-same-cell-before-division' );
                    }
                }
            }
        }
    }
}