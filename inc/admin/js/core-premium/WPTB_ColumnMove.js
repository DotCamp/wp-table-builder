var WPTB_ColumnMove = function () {
    this.rowMovingField;
    
    this.withdrawTable;
    
    this.tablePreview;
    
    this.tBody;
    
    this.body;
    
    this.setTimeoutWhenStopMove;
    
    this.wptbHeaderCoordinates;
    
    this.wptbContainer;
    
    this.setTimeoutScrollTop;
    
    this.autoScroll = false;
    
    this.eventMove;
    
    // function creates a field for move a column to left or right 
    // and after creating puts it on the right place
    this.columnMovingFieldPutActive = () => {
        let columnMovingField = document.getElementsByClassName( 'wptb-column-moving-field' );
        let body = document.getElementsByTagName( 'body' )[0];
        this.body = body;
        if( columnMovingField.length > 0 ) {
            this.columnMovingField = columnMovingField[0];
        } else {
            columnMovingField = document.createElement( 'div' );
            columnMovingField.classList.add( 'wptb-column-moving-field' );
            let visualButtonBox = document.createElement( 'div' );
            visualButtonBox.classList.add( 'column-visual-button-box' );
            visualButtonBox.innerHTML = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n\
                    x="0px" y="0px" width="30" height="30" viewBox="0 0 511.626 511.627" \n\
                    style="enable-background:new 0 0 511.626 511.627;" xml:space="preserve">\n\
                    <path d="M506.203,242.966l-73.087-73.089c-3.621-3.617-7.902-5.424-12.847-5.424c-4.949,0-9.233,1.807-12.854,5.424\n\
                       c-3.613,3.616-5.42,7.898-5.42,12.847v36.547H109.636v-36.547c0-4.949-1.809-9.231-5.426-12.847   \n\
                    c-3.619-3.617-7.902-5.424-12.85-5.424c-4.947,0-9.23,1.807-12.847,5.424L5.424,242.966C1.809,246.58,0,250.865,0,255.813   \n\
                    c0,4.947,1.809,9.232,5.424,12.845l73.089,73.091c3.617,3.613,7.897,5.424,12.847,5.424c4.952,0,9.234-1.811,12.85-5.424   \n\
                    c3.617-3.614,5.426-7.898,5.426-12.847v-36.549h292.359v36.549c0,4.948,1.807,9.232,5.42,12.847   \n\
                    c3.621,3.613,7.905,5.424,12.854,5.424c4.944,0,9.226-1.811,12.847-5.424l73.087-73.091c3.617-3.613,5.424-7.898,5.424-12.845   \n\
                    C511.626,250.865,509.82,246.58,506.203,242.966z" style="fill:#FFFFFF"></path></svg>';
            
            let visualButtonBoxBottom = visualButtonBox.cloneNode( true );
            
            visualButtonBoxBottom.classList.add( 'column-visual-button-box-top' );
            
            columnMovingField.appendChild( visualButtonBox );
            columnMovingField.appendChild( visualButtonBoxBottom );
            
            body.appendChild( columnMovingField );
            
            this.columnMovingField = columnMovingField;
        }
        columnMovingField.deleteEventHandlers = () => {
            let wptbContainer = document.getElementsByClassName( 'wptb-container' )[0];
            wptbContainer.removeEventListener( 'scroll', this.columnMovingFieldParametrsTwo, false );
            window.removeEventListener( 'resize', this.columnMovingFieldParametrsTwo, false );
            document.querySelector( '.wptb-left-panel-extend' ).removeEventListener( 'click', this.columnMovingFieldParametrsTwo, false );
        }
        
        if( ! this.wptbContainer ) {
            this.wptbContainer = document.getElementsByClassName( 'wptb-container' )[0];
        }
        let wptbContainer = this.wptbContainer;
        
        let wptbHighlighted = document.getElementsByClassName( 'wptb-highlighted' );
        if( wptbHighlighted.length > 0 ) {
            wptbHighlighted = wptbHighlighted[0];
            
            this.columnMovingFieldParametrsOne();
            this.columnMovingFieldParametrsTwo();
        }
        
        wptbContainer.addEventListener( 'scroll', this.columnMovingFieldParametrsTwo, false );
        window.addEventListener( 'resize', this.columnMovingFieldParametrsTwo, false );
        body.addEventListener( 'click', this.checkHighlighted, false );
        document.querySelector( '.wptb-left-panel-extend' ).addEventListener( 'click', this.columnMovingFieldParametrsTwo, false );
        
        let insertColumnMoving = ( eventMove ) => {
            if( ! this.withdrawColumnTableContainer ) {
                this.withdrawTableContainer = document.querySelector( '.wptb-withdraw-column-table-container' );
            }
            let withdrawTableContainer = this.withdrawTableContainer;

            withdrawTableContainer.style.display = 'block';
            
            if( ! this.columnMovingField ) {
                this.columnMovingField = document.querySelector( '.wptb-column-moving-field' );
            }
            let columnMovingField = this.columnMovingField;

            let downXcoordinates = columnMovingField.downXcoordinates;
            let differenceX = downXcoordinates - eventMove.clientX;

            let columnMovingFieldLeftCoordinates = ( parseFloat( columnMovingField.positionLeft ) - parseFloat( differenceX ) );

            let ColumnMovingFieldRightCoordinates = columnMovingFieldLeftCoordinates + parseFloat( columnMovingField.width );

            if( ! this.tablePreview ) {
                this.tablePreview = document.querySelector( '.wptb-preview-table' );
            }
            let tablePreview = this.tablePreview;

            let tableCoordinatesLeft = parseFloat( tablePreview.getBoundingClientRect().left );

            let tableCoordinatesRight = parseFloat( tablePreview.getBoundingClientRect().right );

            columnMovingField.style.left = columnMovingFieldLeftCoordinates + 'px';

            if( tableCoordinatesLeft - parseFloat( columnMovingField.style.left ) >= 20 ) {
                columnMovingField.style.left = ( tableCoordinatesLeft - 20 ) + 'px';
            } else if( parseFloat( columnMovingField.style.left ) + parseFloat( columnMovingField.width ) - tableCoordinatesRight >= 20 )  {
                columnMovingField.style.left = ( tableCoordinatesRight - parseFloat( columnMovingField.width ) + 20 ) + 'px';
            }
            
            let tBody = tablePreview.querySelector( 'tbody' );

            let columnsMoving = tBody.getElementsByClassName( 'wptb-column-moving' );
            let columnsMovingDeleted = [];
            if( columnsMoving.length > 0 ) {
                if( columnMovingField.columnsLeftRightCoordinatesArr['left'] && 
                        parseInt( columnMovingField.columnsLeftRightCoordinatesArr['left'][1], 10 ) >= columnMovingFieldLeftCoordinates ) {
                    for( let i = 0; i < tBody.children.length; i++ ) {
                        columnsMovingDeleted[i] = [];
                        
                        let row = tBody.children[i];
                        let columnsMovingThisRow = row.getElementsByClassName( 'wptb-column-moving' );
                        for( let j = 0; j < columnsMovingThisRow.length; j++ ) {
                            columnsMovingDeleted[i].push( columnsMovingThisRow[j] );
                        }
                    }

                    this.cutTableVertically( columnMovingField.columnsLeftRightCoordinatesArr['left'][0] );

                    for( let i = 0; i < columnsMovingDeleted.length; i++ ) {
                        for ( j = 0; j < columnsMovingDeleted[i].length; j++ ) {
                            tBody.children[i].removeChild( columnsMovingDeleted[i][j] );
                        }
                    }

                    for( let i = 0; i < columnsMovingDeleted.length; i++ ) {
                        for( let j = 0; j < columnsMovingDeleted[i].length; j++ ) {
                            let columnNumBefore = columnMovingField.columnsLeftRightCoordinatesArr['left'][0];
                            let afterTd;
                            for( let k = columnNumBefore; k < tablePreview.maxCols; k++ ) {
                                afterTd = tBody.children[i].querySelector( '[data-x-index="' + k + '"]' );
                                if( afterTd ) break;
                            }
                            
                            tBody.children[i].insertBefore( columnsMovingDeleted[i][j], 
                            afterTd );
                        }
                    }

                    tablePreview.recalculateIndexes();
                    
                    this.glueTableVertically();

                    columnMovingField.columnsLeftRightCoordinatesArr = setColumnsLeftRightCoordinates();
                } else if( columnMovingField.columnsLeftRightCoordinatesArr['right'] && 
                        parseInt( columnMovingField.columnsLeftRightCoordinatesArr['right'][1], 10 ) <= ColumnMovingFieldRightCoordinates ) {
                    for( let i = 0; i < tBody.children.length; i++ ) {
                        columnsMovingDeleted[i] = [];
                        
                        let row = tBody.children[i];
                        let columnsMovingThisRow = row.getElementsByClassName( 'wptb-column-moving' );
                        for( let j = 0; j < columnsMovingThisRow.length; j++ ) {
                            columnsMovingDeleted[i].push( columnsMovingThisRow[j] );
                        }
                    }

                    this.cutTableVertically( columnMovingField.columnsLeftRightCoordinatesArr['right'][0] + 1 );

                    for( let i = 0; i < columnsMovingDeleted.length; i++ ) {
                        for ( j = 0; j < columnsMovingDeleted[i].length; j++ ) {
                            tBody.children[i].removeChild( columnsMovingDeleted[i][j] );
                        }
                    }

                    for( let i = 0; i < columnsMovingDeleted.length; i++ ) {
                        for( let j = 0; j < columnsMovingDeleted[i].length; j++ ) {
                            let columnNumAfter = columnMovingField.columnsLeftRightCoordinatesArr['right'][0];
                            let afterTd;
                            for( let k = columnNumAfter + 1; k < tablePreview.maxCols; k++ ) {
                                afterTd = tBody.children[i].querySelector( '[data-x-index="' + k + '"]' );
                                if( afterTd ) break;
                            }
                            
                            tBody.children[i].insertBefore( columnsMovingDeleted[i][j], 
                            afterTd );
                        }
                    }

                    tablePreview.recalculateIndexes();
                    
                    this.glueTableVertically();
                    
                    columnMovingField.columnsLeftRightCoordinatesArr = setColumnsLeftRightCoordinates();
                }
            }
        }
        // sets handler for the event when the moving field was moved
        this.columnMovingField.onmousedown = ( eventDown ) => {
            // delete row moving field and delete all its handlers
            let body = document.getElementsByTagName( 'body' )[0];
            let wptbRowMovingField = document.querySelector( '.wptb-row-moving-field' );
            if( wptbRowMovingField ) {
                wptbRowMovingField.deleteEventHandlers();
                body.removeChild( wptbRowMovingField );
            }
            
            this.columnMovingField.downXcoordinates = eventDown.clientX;
            
            if( ! this.withdrawTable ) {
                this.withdrawTable = this.withdrawSelectedColumnsFromTable();
            }
            
            let tablePreview = document.querySelector( '.wptb-preview-table' );

            if( ! this.columnMovingField ) {
                this.columnMovingField = document.querySelector( '.wptb-column-moving-field' );
            }
            let columnMovingField = this.columnMovingField;
            if( columnMovingField ) {
                let withdrawColumnTableContainer = document.createElement( 'div' );
                withdrawColumnTableContainer.classList.add( 'wptb-withdraw-column-table-container' );

                withdrawColumnTableContainer.appendChild( this.withdrawTable );

                columnMovingField.appendChild( withdrawColumnTableContainer );

                withdrawColumnTableContainer.style.position = 'absolute';
                withdrawColumnTableContainer.style.top = '30px';
                withdrawColumnTableContainer.style.width = '100%';

                if( tablePreview ) {
                    withdrawColumnTableContainer.style.height = tablePreview.getBoundingClientRect().height + 'px';
                }
            }
            
            columnMovingField.columnsLeftRightCoordinatesArr = setColumnsLeftRightCoordinates();
            
            body.onmousemove = ( eventMove ) => {
                let columnMovingField = document.querySelector( '.wptb-column-moving-field' );

                if( ! this.wptbTableSetup ) {
                    this.wptbTableSetup = document.getElementsByClassName( 'wptb-table-setup' )[0];
                }
                let wptbTableSetup = this.wptbTableSetup;
                
                
                if( ! this.wptbTableSetupCoordinates ) {
                    this.wptbTableSetupCoordinates = wptbTableSetup.getBoundingClientRect();
                }
                let wptbTableSetupCoordinates = this.wptbTableSetupCoordinates;

                clearInterval( columnMovingField.setIntervalScrollLeft );
                let difference = wptbTableSetupCoordinates.left - columnMovingField.getBoundingClientRect().left;
                if( difference > 10 && eventMove.movementX <= 0 ) {
                    let setIntervalPeriod = 2;
                    if( ! columnMovingField.startScrollPositionY ) {
                        columnMovingField.startScrollPositionX = eventMove.clientX;
                    } else {
                        let cursorDifference = columnMovingField.startScrollPositionX - eventMove.clientX;
                        
                        if( cursorDifference <= 0 ) {
                            setIntervalPeriod = 0;
                        }
                    }
                    if( setIntervalPeriod ) {
                        let tablePreview = document.querySelector( '.wptb-preview-table' );
                        
                        this.eventMove = eventMove;
                        columnMovingField.setIntervalScrollLeft = setInterval( function() {
                            wptbTableSetup.scrollLeft = parseFloat( wptbTableSetup.scrollLeft ) - 5;
                            
                            columnMovingField.columnsLeftRightCoordinatesArr = setColumnsLeftRightCoordinates();
                            insertColumnMoving( eventMove );
                        }, setIntervalPeriod );
                        
                        columnMovingField.autoScroll = true;
                    } else {
                        clearInterval( columnMovingField.setIntervalScrollLeft );
                    }
                } else if( columnMovingField.getBoundingClientRect().right - wptbTableSetupCoordinates.right > 10 && eventMove.movementX > 0 ) {
                    let setIntervalPeriod = 2;
                    if( ! columnMovingField.startScrollPositionY ) {
                        columnMovingField.startScrollPositionX = eventMove.clientX;
                    } else {
                        let cursorDifference = eventMove.clientX - columnMovingField.startScrollPositionX;
                        
                        if( cursorDifference <= 0 ) {
                            setIntervalPeriod = 0;
                        }
                    }
                    if( setIntervalPeriod ) {
                        columnMovingField.setIntervalScrollLeft = setInterval( function() {
                            wptbTableSetup.scrollLeft = parseFloat( wptbTableSetup.scrollLeft ) + 5;
                            
                            columnMovingField.columnsLeftRightCoordinatesArr = setColumnsLeftRightCoordinates();
                            insertColumnMoving( eventMove );
                        }, setIntervalPeriod );
                        
                        columnMovingField.autoScroll = true;
                    } else {
                        clearInterval( columnMovingField.setIntervalScrollLeft );
                    }
                    
                } else {
                    clearInterval( columnMovingField.setIntervalScrollLeft );
                }
                
                if( columnMovingField ) {
                    body.onmouseup = () => {
                        let columnMovingField = document.querySelector( '.wptb-column-moving-field' );
                        if( columnMovingField ) {
                            body.removeChild( columnMovingField );
                            
                            this.withdrewColumnsPut();
                            
                            this.withdrawTable = null;
                        }
                        
                        clearInterval( columnMovingField.setIntervalScrollLeft );
                        
                        body.onmouseup = null;
                        body.onmousemove = null;
                        
                        let tablePreview = document.querySelector( '.wptb-preview-table' );
                        tablePreview.undoSelect();
                        
                        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();
                    }
                    
                    insertColumnMoving( eventMove );
                }
            }
        }
        
        function setColumnsLeftRightCoordinates( col ) {
            let table = document.querySelector( '.wptb-preview-table' );
            let cell = table.querySelector('.wptb-highlighted'), 
                colspan = cell.colSpan;
    
            let columnsLeftRightCoordinatesArr = [];
            if( ! col ) {
                col = parseInt( cell.dataset.xIndex, 10 );
            }
            
            function getNecessaryCell ( col, step ) {
                if( col + step >= 0 && col + step <= table.maxCols ) {
                    let tdsNecessary = table.querySelectorAll( '[data-x-index="' + ( col + step ) + '"]' );
                    
                    let tdNecessary;
                    for( let i = 0; i < tdsNecessary.length; i++ ) {
                        if( tdsNecessary[i].colSpan == 1 ) {
                            tdNecessary = tdsNecessary[i];
                            break;
                        }
                        
                        if( ! tdNecessary || tdsNecessary[i].colSpan < tdNecessary.colSpan ) tdNecessary = tdsNecessary;
                    }
                    
                    if( ! tdNecessary ) {
                        return getNecessaryCell( col + step, step );
                    }
                    let tdNecessaryBorderCoordinate;
                    let thisCol;
                    if( step < 0 ) {
                        tdNecessaryBorderCoordinate = ( 7 * tdNecessary.getBoundingClientRect().left + 3 * tdNecessary.getBoundingClientRect().right ) / 10;
                        thisCol = col - 1;
                    } else if ( step > 0 ) {
                        tdNecessaryBorderCoordinate = ( 3 * tdNecessary.getBoundingClientRect().left + 7 * tdNecessary.getBoundingClientRect().right ) / 10;
                        thisCol = col + 1;
                    }
                    return [thisCol, tdNecessaryBorderCoordinate];
                } else {
                    return false;
                }
            }
            
            columnsLeftRightCoordinatesArr['left'] = getNecessaryCell( col, -1 );

            columnsLeftRightCoordinatesArr['right'] = getNecessaryCell( col + colspan - 1, 1 );
            
            return columnsLeftRightCoordinatesArr;
        }
        
        // returns difference of positions of moving field before and after moving when this field was moved
        function cursorPositionDifference( eventMove, body, rowMovingField ) {
            
        }
    }
    
    // function set coordinates top and write property positionTop for moving field
    this.columnMovingFieldParametrsOne = () => {
        let columnMovingField = document.querySelector( '.wptb-column-moving-field' );
        let wptbHighlighted = document.querySelector( '.wptb-highlighted' );
        if( columnMovingField && ! columnMovingField.autoScroll && wptbHighlighted ) {
            let coordinatesHighlighted = wptbHighlighted.getBoundingClientRect();
            this.columnMovingField.style.left = parseFloat( coordinatesHighlighted.left ) + 'px';
            this.columnMovingField.positionLeft = parseFloat( coordinatesHighlighted.left );
            this.columnMovingField.width = parseFloat( coordinatesHighlighted.width );
        }
    }
    
    // function set position left and heigth for moving field
    this.columnMovingFieldParametrsTwo = () => {
        this.columnMovingFieldParametrsOne();
        let wptbHighlighted = document.getElementsByClassName( 'wptb-highlighted' );
        if( wptbHighlighted.length > 0 ) {
            wptbHighlighted = wptbHighlighted[0];

            let coordinatesHighlighted = wptbHighlighted.getBoundingClientRect(),
            coordinatesHighlightedWidth = parseFloat( coordinatesHighlighted.width );

            this.columnMovingField.style.display = 'table';
            this.columnMovingField.style.width = coordinatesHighlightedWidth + 'px';

            let wptbTableSetup = document.getElementsByClassName( 'wptb-table-setup' );
            if( wptbTableSetup.length > 0 ) {
                wptbTableSetup = wptbTableSetup[0];

                let coordinatesPreviewTable = wptbTableSetup.getBoundingClientRect();
                this.columnMovingField.style.top = parseFloat( coordinatesPreviewTable.top ) - 30 + 'px';
                this.columnMovingField.querySelector( '.column-visual-button-box-top' ).style.top = ( parseFloat( coordinatesPreviewTable.height ) + 30 ) + 'px';

                let tableWithdrewColumn = this.columnMovingField.getElementsByClassName( 'wptb-table-setup' );
                if( tableWithdrewColumn.length > 0 ) {
                    tableWithdrewColumn = tableWithdrewColumn[0];

                    tableWithdrewColumn.style.maxHeight = wptbTableSetup.getBoundingClientRect().height + 'px';
                }
            }
        }
    }
    
//    this.columnMovingFieldParametrsTwoTransition = () => {
//        this.leftPanel = document.querySelector( '.wptb-left-panel' );
//        this.startLeft = this.leftPanel.getBoundingClientRect().left;
//        this.endLeft;
//
//        if( this.startLeft == 0 ) {
//            this.endLeft == 310;
//        } else {
//            this.endLeft == 0;
//        }
//        
//        let checkLeftPanelSizeDifference = () => {
//            let left = this.leftPanel.getBoundingClientRect().left;
//            if( left == this.endLeft ) {
//                this.columnMovingFieldParametrsTwo();
//                clearInterval( leftMovementButtonChangePosition );
//            }
//            this.columnMovingFieldParametrsTwo();
//        }
//        
//        let leftMovementButtonChangePosition = setInterval( checkLeftPanelSizeDifference, 1 );
//    }
    
    this.checkHighlighted = () => {
        let highlighted = document.getElementsByClassName( 'wptb-highlighted' );
        let body = document.getElementsByTagName( 'body' )[0];
        if( highlighted.length != 1 ) {
            rowMovingField = document.querySelector( '.wptb-row-moving-field' );
            if( rowMovingField ) {
                let parent = rowMovingField.parentNode;
                parent.removeChild( rowMovingField );
            }
        }
        body.removeEventListener( 'click', this.checkHighlighted, false );
    }
    
    // function hide the moving field 
    this.rowMovingFieldHide = () => {
        let rowMovingField = document.getElementsByClassName( 'wptb-row-moving-field' );
        if( rowMovingField.length > 0 ) {
            rowMovingField = rowMovingField[0];
            rowMovingField.style.display = 'none';
        }
    }
    
    this.withdrawSelectedColumnsFromTable = function() {
        if( ! this.tablePreview ) {
            this.tablePreview = document.querySelector( '.wptb-preview-table' );
        }
        let table = this.tablePreview,
            cell = document.querySelector('.wptb-highlighted'),
            colspan = cell.colSpan,
            col = parseInt( cell.dataset.xIndex, 10 ),
            tableWithdrewColumns = document.createElement( 'table' ),
            tableWithdrewColumnsTbody = document.createElement( 'tbody' );
            tableWithdrewColumns.appendChild( tableWithdrewColumnsTbody );
            tableWithdrewColumns.classList.add( 'wptb-preview-table' );
            
            if( table ) {
                let tdsWidthWhichNeedAdd = [...table.getElementsByClassName( 'wptb-width-which-need-add' )];
                for( let i = 0; i < tdsWidthWhichNeedAdd.length; i++ ) {
                    tdsWidthWhichNeedAdd[i].classList.remove( 'wptb-width-which-need-add' );
                    tdsWidthWhichNeedAdd[i].removeAttribute( 'data-width-which-need-add' );
                }
                
                let tableAttributes = table.attributes;
                
                for( let i = 0; i < tableAttributes.length; i++ ) {
                    tableWithdrewColumns.setAttribute( tableAttributes[i].nodeName, tableAttributes[i].nodeValue );
                }
                
                tableWithdrewColumns.style.minWidth = '';
                tableWithdrewColumns.style.width = '100%';
            }
    
        if ( ! colspan ) colspan = 1;
        
        this.cutTableVertically( col );
        
        this.cutTableVertically( col + colspan );
        
        let arrWithTdsWhichNeedAddWidth = [];
        for( let i = 0; i < table.rows.length; i++ ) {
            let rowChildren = table.rows[i].children;
            let rowWithdrewColumnsHeight = table.rows[i].getBoundingClientRect().height;
            let rowWithdrewColumns = tableWithdrewColumns.insertRow( -1 );
            rowWithdrewColumns.classList.add( 'wptb-row' );
            rowWithdrewColumns.style.height = rowWithdrewColumnsHeight + 'px';
            arrWithTdsWhichNeedAddWidth[i] = [];
            for( let j = 0; j < rowChildren.length; j++ ) {
                if ( rowChildren[j].dataset.xIndex < col ) continue;
                if ( rowChildren[j].dataset.xIndex >= col + colspan ) break;
                
                if( rowChildren[j].style.width ) {
                    rowChildren[j].dataset.widthBeforeMove = rowChildren[j].style.width;
                }

                rowChildren[j].classList.add( 'wptb-width-which-need-add' );
                
                arrWithTdsWhichNeedAddWidth[i].push( rowChildren[j] );
                    
                let newTd = rowChildren[j].cloneNode( true );
                rowWithdrewColumns.appendChild( newTd );
                
                rowChildren[j].style.backgroundColor = '#d8d8d8';
                rowChildren[j].classList.add( 'wptb-column-moving' );
                
                if( parseInt( rowChildren[j].dataset.yIndex ) != 0 ) {
                    rowChildren[j].classList.add( 'wptb-td-border-top-moving' );
                }
                if( parseInt( rowChildren[j].dataset.yIndex ) + rowChildren[j].rowSpan != table.rows.length ) {
                    rowChildren[j].classList.add( 'wptb-td-border-bottom-moving' );
                }
                if( parseInt( rowChildren[j].dataset.xIndex ) != col ) {
                    rowChildren[j].classList.add( 'wptb-td-border-left-moving' );
                }
                if( parseInt( rowChildren[j].dataset.xIndex ) + rowChildren[j].colSpan != col + colspan ) {
                    rowChildren[j].classList.add( 'wptb-td-border-right-moving' );
                }
            }
        }
        
        let cellFullStyleObj = window.getComputedStyle( cell, null );
        let paddingLeft = cellFullStyleObj.getPropertyValue( 'padding-left' );
        let paddingRight = cellFullStyleObj.getPropertyValue( 'padding-right' );
        for( let i = 0; i < arrWithTdsWhichNeedAddWidth.length; i++ ) {
            for( let j = 0; j < arrWithTdsWhichNeedAddWidth[i].length; j++ ) {
                arrWithTdsWhichNeedAddWidth[i][j].dataset.widthWhichNeedAdd = parseInt( arrWithTdsWhichNeedAddWidth[i][j].getBoundingClientRect().width ) - 
                parseInt( parseInt( paddingLeft ) ) - parseInt( parseInt( paddingRight ) ) -
                parseInt( cell.style.borderWidth )/2 + 30/arrWithTdsWhichNeedAddWidth[i].length;
            }
        }
        
        let tdsWhichNeedAddWidth = table.querySelectorAll('[data-width-which-need-add]');
        for( let i = 0; i < tdsWhichNeedAddWidth.length; i++ ) {
            tdsWhichNeedAddWidth[i].style.width = tdsWhichNeedAddWidth[i].dataset.widthWhichNeedAdd + 'px';
        }
        
        return tableWithdrewColumns;
    }
    
    this.cutTableVertically = function( col ) {
        if( ! this.tablePreview ) {
            this.tablePreview = document.querySelector( '.wptb-preview-table' );
        }
        let table = this.tablePreview;
        col = parseInt( col, 10 );
        
        for ( let i = 0; i < table.rows.length; i++ ) {
            if( col < table.maxCols ) {
                if( col != 0 && ( ! table.rows[i].querySelector( '[data-x-index="' + col + '"]' ) ) ) {
                    let rowChildren = table.rows[i].children;
                    
                    let td,
                    rowChildrenLength = rowChildren.length,
                    afterTd,
                    rowSpanNewTd,
                    colSpanOld,
                    colSpanNewTd;
                    for( let j = 0; j < rowChildrenLength; j++ ) {
                        if( rowChildren[j].colSpan > 1 && parseInt( rowChildren[j].dataset.xIndex ) < col && 
                                parseInt( rowChildren[j].dataset.xIndex ) + parseInt( rowChildren[j].colSpan ) > col ) {
                            td = new WPTB_Cell( table.mark );
                            rowSpanNewTd = rowChildren[j].rowSpan;
                            colSpanOld = rowChildren[j].colSpan;
                            rowChildren[j].colSpan = col - rowChildren[j].dataset.xIndex;
                            colSpanNewTd = colSpanOld - rowChildren[j].colSpan;
                            
                            if( ! rowChildren[j].dataset.sameCellBeforeDivision ) {
                                rowChildren[j].dataset.sameCellBeforeDivision = 'r' + i + 'c' + j;
                            }
                            
                            let tdLeftStyle = rowChildren[j].getAttribute( 'style' );
                            td.getDOMElement().setAttribute( 'style', tdLeftStyle );

                            let tdAnalogThisX = table.querySelector( '[data-x-index="' + col + '"]' );
                            if( tdAnalogThisX ) {
                                td.getDOMElement().style.width = tdAnalogThisX.style.width;
                            }

                            let tdAnalogThisY = table.querySelector( '[data-y-index="' + i + '"]' );
                            if( tdAnalogThisY ) {
                                td.getDOMElement().style.height = tdAnalogThisY.style.height;
                            }
                            if( rowChildren[j + 1] ) {
                                afterTd = rowChildren[j + 1];
                            } else {
                                afterTd = null;
                            }
                            
                            table.rows[i].insertBefore( td.getDOMElement(), afterTd );
                            td.getDOMElement().colSpan = colSpanNewTd;
                            td.getDOMElement().rowSpan = rowSpanNewTd;
                            td.getDOMElement().dataset.sameCellBeforeDivision = rowChildren[j].dataset.sameCellBeforeDivision;
                            i += rowSpanNewTd - 1;
                            break
                        } 
                    }
                }
            }
            table.recalculateIndexes();
        }
    }
    
    this.glueTableVertically = function() {
        if( ! this.tablePreview ) {
            this.tablePreview = document.querySelector( '.wptb-preview-table' );
        }
        let table = this.tablePreview;
        if( table ) {
            let tds = [...table.getElementsByTagName( 'td' )];
            for( let i = 0; i < tds.length; i++ ) {
                if( tds[i].hasAttribute( 'data-same-cell-before-division' ) ) {
                    let dataSameCellBeforeDivision = tds[i].dataset.sameCellBeforeDivision;
                    let tdsSameBeforeDivision = [...table.querySelectorAll( '[data-same-cell-before-division="' + dataSameCellBeforeDivision + '"]' )];
                    
                    let jFirstTdGlue = null;
                    for( let j = 0; j < tdsSameBeforeDivision.length; j++ ) {
                        if( tdsSameBeforeDivision[j] && tdsSameBeforeDivision[j + 1] && 
                                ! tdsSameBeforeDivision[j].classList.contains( 'wptb-column-moving' ) &&
                                ! tdsSameBeforeDivision[j + 1].classList.contains( 'wptb-column-moving' ) ) {
                            if( ( tdsSameBeforeDivision[j + 1].dataset.xIndex == parseInt( tdsSameBeforeDivision[j].dataset.xIndex ) + 
                                    parseInt( tdsSameBeforeDivision[j].colSpan ) ) ) {
                                if( jFirstTdGlue == null ) {
                                    jFirstTdGlue = j;
                                }
                                tdsSameBeforeDivision[jFirstTdGlue].colSpan += tdsSameBeforeDivision[j + 1].colSpan;

                                let tdsSameBeforeDivisionJPlusChildren = [...tdsSameBeforeDivision[j + 1].children];

                                for( let k = 0; k < tdsSameBeforeDivisionJPlusChildren.length; k++ ) {
                                    tdsSameBeforeDivision[jFirstTdGlue].appendChild( tdsSameBeforeDivisionJPlusChildren[k] );
                                }

                                let thisRow = tdsSameBeforeDivision[j + 1].parentNode;
                                thisRow.removeChild( tdsSameBeforeDivision[j + 1] );
                            }
                        }
                    }
                }
            }
            
            table.recalculateIndexes();
        }
    }
    
    this.withdrewColumnsPut = function( temporaryShow ) {
        if( ! this.tablePreview ) {
            this.tablePreview = document.querySelector( '.wptb-preview-table' );
        }
        let table = this.tablePreview;
        if( table ) {
            let wptbColumnMoving = [...table.getElementsByClassName( 'wptb-column-moving' )];
            for( let i = 0; i < wptbColumnMoving.length; i++ ) {
                wptbColumnMoving[i].classList.remove( 'wptb-column-moving' );
                wptbColumnMoving[i].style.backgroundColor = '';
                if( wptbColumnMoving[i].hasAttribute( 'data-width-before-move' ) ) {
                    wptbColumnMoving[i].style.width = wptbColumnMoving[i].dataset.widthBeforeMove;
                    wptbColumnMoving[i].removeAttribute( 'data-width-before-move' )
                } else {
                    wptbColumnMoving[i].style.width = '';
                }
                wptbColumnMoving[i].removeAttribute( 'data-width-which-need-add' );
                wptbColumnMoving[i].classList.remove( 'wptb-width-which-need-add' );
                
                wptbColumnMoving[i].classList.remove( 'wptb-td-border-top-moving' );
                wptbColumnMoving[i].classList.remove( 'wptb-td-border-bottom-moving' );
                wptbColumnMoving[i].classList.remove( 'wptb-td-border-left-moving' );
                wptbColumnMoving[i].classList.remove( 'wptb-td-border-right-moving' );
            }

            this.glueTableVertically();
            
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