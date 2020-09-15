const WPTB_RecalculateIndexes = function (table) {
    let trs = table.getElementsByTagName( 'tr' ),
        tds, maxCols = 0, maxColsFull = 0, tdsArr = [];

    for ( let i = 0; i < trs.length; i++ ) {
        tds = trs[i].getElementsByTagName( 'td' );

        if ( tdsArr[i] == undefined ) {
            tdsArr[i] = [];
        }

        let jMainIter = 0;
        for ( let j = 0; j < tds.length; j++ ) {
            if ( tdsArr[i][j] != undefined ) {
                for ( let y = 0; y < 100; y++ ) {
                    if ( tdsArr[i][jMainIter] != undefined ) {
                        jMainIter++;
                        continue;
                    }
                    tdsArr[i][jMainIter] = tds[j];
                    tds[j].dataset.xIndex = jMainIter;
                    break;
                }
            } else {
                tdsArr[i][j] = tds[j];
                tds[j].dataset.xIndex = jMainIter;
            }
            tds[j].dataset.yIndex = i;

            if ( tds[j].colSpan > 1 ) {
                for ( let k = 1; k < tds[j].colSpan; k++ ) {
                    jMainIter++;
                    tdsArr[i][jMainIter] = 'tdDummy';
                }
            }

            if ( tds[j].rowSpan > 1 ) {
                for ( let x = 1; x < tds[j].rowSpan; x++ ) {
                    if ( tdsArr[i + x] == undefined ) {
                        tdsArr[i + x] = [];
                    }
                    for ( let z = 0; z < tds[j].colSpan; z++ ) {
                        tdsArr[i + x][jMainIter - tds[j].colSpan + 1 + z ] = 'tdDummy';
                    }
                }
            }
            jMainIter++;
        }

        if ( tds.length > maxCols ) {
            maxCols = tds.length;
        }

        if( i == 0 ) {
            maxColsFull = jMainIter;
        }
    }
    table.columns = maxCols;
    table.maxCols = maxColsFull;
}
