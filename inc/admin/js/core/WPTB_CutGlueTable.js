let WPTB_CutGlueTable = {
    cutTableHorizontally: function (rowBefore, table) {
        if( table && table.rows[rowBefore] ) {
            for( let i = 0; i < rowBefore; i++ ) {
                let tableRowsIChildren = table.rows[i].children;

                for( let j = 0; j < tableRowsIChildren.length; j++ ) {
                    if ( tableRowsIChildren[j].rowSpan > 1 && tableRowsIChildren[j].rowSpan > rowBefore - i ) {
                        let newTdRowspan = tableRowsIChildren[j].rowSpan - rowBefore + i;
                        tableRowsIChildren[j].rowSpan = rowBefore - i;
                        if( ! tableRowsIChildren[j].dataset.sameCellBeforeDivision ) {
                            tableRowsIChildren[j].dataset.sameCellBeforeDivision = 'r' + i + 'c' + j;
                        }

                        let td;
                        if(table.hasOwnProperty('wptbCell')) {
                            td = new table.wptbCell( table.mark );
                            td = td.getDOMElement();
                        } else {
                            td = document.createElement('td');
                        }

                        let tdTopStyle = tableRowsIChildren[j].getAttribute( 'style' );
                        td.setAttribute( 'style', tdTopStyle );
                        td.colSpan = tableRowsIChildren[j].colSpan;
                        td.rowSpan = newTdRowspan;
                        td.dataset.sameCellBeforeDivision = tableRowsIChildren[j].dataset.sameCellBeforeDivision;

                        let dataXIndex = tableRowsIChildren[j].dataset.xIndex;
                        let dataXIndexNext = parseInt( dataXIndex ) + parseInt( tableRowsIChildren[j].colSpan );
                        let beforeTd;
                        while( ! beforeTd && dataXIndexNext < table.maxCols ) {
                            beforeTd = table.rows[rowBefore].querySelector( '[data-x-index="' + dataXIndexNext + '"]' );
                            dataXIndexNext++;
                        }
                        table.rows[rowBefore].insertBefore( td, beforeTd );

                        WPTB_RecalculateIndexes(table);
                    }
                }
            }
        }
    },
    glueTableHorizontally: function (table) {
        if(table) {
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
                                if( ( tdsSameBeforeDivision[j + 1].dataset.yIndex == parseInt( tdsSameBeforeDivision[j].dataset.yIndex ) +
                                    parseInt( tdsSameBeforeDivision[j].rowSpan ) ) ) {
                                    tdsSameBeforeDivision[j].rowSpan += tdsSameBeforeDivision[j + 1].rowSpan;

                                    let tdsSameBeforeDivisionJPlusChildren = [...tdsSameBeforeDivision[j + 1].children];

                                    for( let k = 0; k < tdsSameBeforeDivisionJPlusChildren.length; k++ ) {
                                        tdsSameBeforeDivision[j].appendChild( tdsSameBeforeDivisionJPlusChildren[k] );
                                    }

                                    let nextRow = tdsSameBeforeDivision[j + 1].parentNode;
                                    nextRow.removeChild( tdsSameBeforeDivision[j + 1] );
                                }
                            }
                        }
                    }
                }
            }

            WPTB_RecalculateIndexes(table);
        }
    },
    cutTableVertically: function (col, table) {
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
                            if(table.hasOwnProperty('wptbCell')) {
                                td = new table.wptbCell( table.mark );
                                td = td.getDOMElement();
                            } else {
                                td = document.createElement('td');
                            }

                            rowSpanNewTd = rowChildren[j].rowSpan;
                            colSpanOld = rowChildren[j].colSpan;
                            rowChildren[j].colSpan = col - rowChildren[j].dataset.xIndex;
                            colSpanNewTd = colSpanOld - rowChildren[j].colSpan;

                            if( ! rowChildren[j].dataset.sameCellBeforeDivision ) {
                                rowChildren[j].dataset.sameCellBeforeDivision = 'r' + i + 'c' + j;
                            }

                            let tdLeftStyle = rowChildren[j].getAttribute( 'style' );
                            td.setAttribute( 'style', tdLeftStyle );

                            let tdAnalogThisX = table.querySelector( '[data-x-index="' + col + '"]' );
                            if( tdAnalogThisX ) {
                                td.style.width = tdAnalogThisX.style.width;
                            }

                            let tdAnalogThisY = table.querySelector( '[data-y-index="' + i + '"]' );
                            if( tdAnalogThisY ) {
                                td.style.height = tdAnalogThisY.style.height;
                            }
                            if( rowChildren[j + 1] ) {
                                afterTd = rowChildren[j + 1];
                            } else {
                                afterTd = null;
                            }

                            table.rows[i].insertBefore( td, afterTd );
                            td.colSpan = colSpanNewTd;
                            td.rowSpan = rowSpanNewTd;
                            td.dataset.sameCellBeforeDivision = rowChildren[j].dataset.sameCellBeforeDivision;
                            i += rowSpanNewTd - 1;
                            break
                        }
                    }
                }
            }
            WPTB_RecalculateIndexes(table);
        }
    },
    glueTableVertically: function (table) {
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

            WPTB_RecalculateIndexes(table);
        }
    }
}
