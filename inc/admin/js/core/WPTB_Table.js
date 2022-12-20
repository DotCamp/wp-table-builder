var array = [], WPTB_Table = function ( columns, rows, wptb_preview_table ) {

    /* The members of the class */
    var settings = document.getElementsByClassName('wptb-settings-items'),
            wptbTableSetup = document.getElementsByClassName("wptb-table-setup")[0],
            table, row, cell,
            maxAmountOfCells,
            maxAmountOfRows;

    //HERE ARE THE PRIVATE FUNCTIONS
    /*
     * This function toggles buttons visibility in cell edit mode
     * (according to the amount of currently selected cells), and
     * highlights visually the clicked cell if it is not highlighted, or
     * removes highlight if clicked cell is already highlighted.
     * It too toggles the bits of our abstract representation.
     * @param Event this is the event instance of the click performed over a cell.
     */
    var mark = function ( event ) {
        let thisElem = event.currentTarget;
        let rs = thisElem.rowSpan,
            cs = thisElem.colSpan,
            noCells = document.getElementsByClassName('wptb-no-cell-action'),
            singleCells = document.getElementsByClassName('wptb-single-action'),
            multipleCells = document.getElementsByClassName('wptb-multiple-select-action'),
            cellSettings = document.getElementById( 'wptb-left-scroll-panel-cell-settings' ),
            position = getCoords(thisElem),
            row = position[0],
            column = position[1];

        /**
         * Cell select/deselect operation
         *
         * @param {HTMLElement} cellElement cell element
         * @param {Boolean} select select/deselect cell
         *
         */
        function cellSelectOperation(cellElement, select = false){
           const classListOperation = select? 'add'  : 'remove';
           cellElement.classList[classListOperation]('wptb-highlighted');

            const [row, column] = getCoords(cellElement);
            const {rowSpan, colSpan} = cellElement;

            for (var i = 0; i < rowSpan; i++) {
                for (var j = 0; j < colSpan; j++) {
                    array[row + i][column + j] = select? 1 : 0;
                }
            }
        }
        if ( ! document.select.isActivated() ) {
            return;
        }

        const isShiftActive = event.shiftKey;
        if (thisElem.className.match(/wptb-highlighted/)) {
            const selectedCells = Array.from(document.querySelectorAll('.wptb-highlighted'));

            if(selectedCells.length > 1){
                if(isShiftActive){
                    cellSelectOperation(thisElem, false);
                }else {
                    cellSelectOperation(thisElem, true);
                    // eslint-disable-next-line array-callback-return
                    selectedCells.map(el => {
                        if(el !== thisElem){
                            cellSelectOperation(el, false);
                        }
                    })
                }
            }else{
                cellSelectOperation(thisElem, false);
            }
        } else {
            if(!isShiftActive){
                Array.from(document.querySelectorAll('.wptb-highlighted')).map(ele => {
                    if(ele !== thisElem){
                        cellSelectOperation(ele, false);
                    }
                });
            }
            cellSelectOperation(thisElem,true );
        }

        let cellHighlighted = document.getElementsByClassName('wptb-highlighted'),
            markedCells = cellHighlighted.length;
        if (markedCells === 0) {
            for (var i = 0; i < multipleCells.length; i++) {
                multipleCells[i].classList.remove('visible');
                multipleCells[i].setAttribute('disabled', 'disabled');
            }
            for (var i = 0; i < noCells.length; i++) {
                noCells[i].classList.add('visible');
                noCells[i].removeAttribute('disabled');
            }
            for (var i = 0; i < singleCells.length; i++) {
                singleCells[i].classList.remove('visible');
                singleCells[i].setAttribute('disabled', 'disabled');
            }
            cellSettings.classList.remove( 'visible' );
        } else if (markedCells === 1) {
            for (var i = 0; i < multipleCells.length; i++) {
                multipleCells[i].classList.remove('visible');
                multipleCells[i].setAttribute('disabled', 'disabled');
            }
            for (var i = 0; i < noCells.length; i++) {
                noCells[i].classList.remove('visible');
                noCells[i].setAttribute('disabled', 'disabled');
            }
            for (var i = 0; i < singleCells.length; i++) {
                singleCells[i].classList.add('visible');
                singleCells[i].removeAttribute('disabled');
            }

            cellHighlighted = cellHighlighted[0];
            WPTB_Helper.elementOptionsSet( 'table_cell_setting', cellHighlighted );

            let infArr = cellHighlighted.className.match( /wptb-element-((.+-)\d+)/i );

            const controlElemIds = ['cellWidth', 'cellHeight'];

            controlElemIds.map(s => {
                let elementControlSizeUnicClass = `wptb-el-${infArr[1]}-${s}`,
                    elementControlSizeFixedUnicClass = `wptb-el-${infArr[1]}-${s}Fixed`;
                if(s === 'cellWidth' || s === 'cellHeight') {
                    let sizeName = '',
                        getSizeFunctionName = '';
                    if(s === 'cellWidth') {
                        sizeName = 'width';
                        getSizeFunctionName = 'getColumnWidth';
                    } else if(s === 'cellHeight') {
                        sizeName = 'height';
                        getSizeFunctionName = 'getRowHeight';
                    }
                    let size = cellHighlighted.style[sizeName],
                        cellSizeInputs = document.querySelectorAll( '.' + elementControlSizeUnicClass ),
                        cellSizeFixedInput = document.querySelector( '.' + elementControlSizeFixedUnicClass  );
                    cellSizeInputs = [...cellSizeInputs];

                    if(!size && !cellHighlighted.dataset[`wptbFixed${sizeName.toUpperCase()}`]) {
                        size = WPTB_Helper[getSizeFunctionName](table, cellHighlighted);
                        cellSizeInputs.map(s => {
                            s.value = size;
                        });

                        cellSizeFixedInput.checked = false;
                    } else {
                        cellSizeInputs.map(s => {
                            if( size ) {
                                s.value = parseFloat( size, 10 );
                            } else if( cellHighlighted.dataset[`wptbFixed${sizeName.toUpperCase()}`] ) {
                                s.value = cellHighlighted.dataset[`wptbFixed${sizeName.toUpperCase()}`];
                            }
                        });

                        cellSizeFixedInput.checked = true;
                    }
                }
            });

            cellSettings.classList.add( 'visible' );
        } else {
            for (var i = 0; i < multipleCells.length; i++) {
                if (table.isSquare(array)) {
                    multipleCells[i].classList.add('visible');
                    multipleCells[i].removeAttribute('disabled');
                } else {
                    multipleCells[i].classList.remove('visible');
                    multipleCells[i].setAttribute('disabled', 'disabled');
                }
            }
            for (var i = 0; i < noCells.length; i++) {
                noCells[i].classList.remove('visible');
                noCells[i].setAttribute('disabled', 'disabled');
            }
            for (var i = 0; i < singleCells.length; i++) {
                singleCells[i].classList.remove('visible');
                singleCells[i].setAttribute('disabled', 'disabled');
            }
            cellSettings.classList.remove( 'visible' );
        }

        /**
         * empty cell | highlight setting
         */

        const infArr = thisElem.className.match(/wptb-element-table_cell_setting-((.+-)\d+)/i);
        if (infArr && infArr.length > 1) {
            let controlKeys = [ 'emptyCell', 'highlightRow', 'highlightColumn'];
            for(let i in controlKeys) {   
                const settingId = `wptb-el-table_cell_setting-${infArr[1]}-${controlKeys[i]}`;
                const settingElem = document.getElementById(settingId);
                if (settingElem) {
                    if(controlKeys[i] == 'emptyCell') {
                        settingElem.querySelector('input[type="checkbox"]').checked = thisElem.classList.contains('wptb-empty');
                    } else if(controlKeys[i] == 'highlightRow') {

                        // Extract highlight class name in the class list
                        const className = thisElem.parentElement.classList[1] || "";

                        // Check whether the row is already highlighted
                        const isHighlighted = className.indexOf("wptb-row-highlighted-") > -1 
                            && thisElem.parentElement.getAttribute("class").indexOf("wptb-row-highlighted-none") == -1;
                        if(isHighlighted) {

                            // Extract the current highlight value
                            const highlightValue = className.substr(21);
                            const highlightRowInput = cellSettings.querySelectorAll(`.wptb-el-table_cell_setting-${infArr[1]}-rowTransformScale`);
                            settingElem.querySelector('input[type="checkbox"]').click();
                            highlightRowInput[0].value = highlightValue;
                            highlightRowInput[1].value = highlightValue;
                        }
                    } else if(controlKeys[i] == 'highlightColumn') {
                        const className = thisElem.getAttribute("class");

                        // Check whether the column is already highlighted
                        const isHighlighted = (className.indexOf("wptb-col-highlighted") > -1
                            && className.indexOf("wptb-col-highlighted-none") == -1);
                        if(isHighlighted) {
                            const className = [...thisElem.classList].pop();

                            // Extract the current highlight value
                            const highlightValue = thisElem.classList[0].substr(21);
                            const highlightColInput = document.querySelectorAll(`.wptb-el-table_cell_setting-${infArr[1]}-columnTransformScale`);
                            settingElem.querySelector('input[type="checkbox"]').click();
                            highlightColInput[0].value = highlightValue;
                            highlightColInput[1].value = highlightValue;
                        }
                    }
                }
            }
        }


        let details = {countMarkedCells:markedCells};
        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/cell/mark', thisElem, details);


        // split button disabled state calculation
        const splitButton = document.querySelector('#wptb-split-cell');
        if(splitButton){
            const splitAvailable = markedCells === 1 && (rs !== 1 || cs !== 1);
            if(splitAvailable){
                splitButton.classList.add('visible');
                splitButton.removeAttribute('disabled');
            }else {
                splitButton.classList.remove('visible');
                splitButton.setAttribute('disabled', 'disabled');
            }
        }
    };

    /*
     * This function fills an array with 1's according to the actual design
     * of HTML table.
     * @returns an array of arrays containing an abstract representation
     * of HTML table.
     * @deprecated
     * */

    var realTimeArray = function () {
        var carried = [], tds, cols, matriz = [];

        for (var i = 0; i < maxAmountOfCells; i++) {
            carried[i] = 0;
        }

        for (var i = 0; i < table.rows.length; i++) {
            cols = [];

            var tds = table.rows[i].getElementsByTagName('td');

            for (items = 0; items < tds.length; items++) {

                for (var k = 0; k < tds[items].colSpan; k++) {
                    cols.push(1);
                }

                if (tds[items].rowSpan > 1) {
                    for (var k = 0; k < tds[items].colSpan; k++) {
                        carried[items + k] = {
                            justAssigned: true,
                            amount: tds[items].rowSpan
                        };
                    }
                }
            }

            for (var k = 0; k < maxAmountOfCells; k++) {
                if (typeof carried[k] == 'object' && carried[k].amount > 0) {
                    carried[k].amount--;
                    if (carried[k].justAssigned) {
                        carried[k].justAssigned = false;
                    } else {
                        cols.push(1);
                    }
                }
            }

            matriz.push(cols);

        }
        return matriz;
    };

    /*
     * This function gets the number and position of cell spaces in current row that are occuped
     * by upper rowspanned cells.
     * @param number the number of row where we wish to calculate the carried rowspans up to.
     * @return an array with the remaining rowspans in each column.
     */
    var carriedRowspans = function (row) {
        var carried = [], tds, cols;

        for (var i = 0; i < maxAmountOfCells; i++) {
            carried[i] = 0;
        }

        if (row == -1) {
            return carried;
        }

        for (var i = 0; i <= row; i++) {
            cellsBuffer = table.rows[i].getElementsByTagName('td');
            cellPointer = 0;

            for (var xPosition = 0; xPosition < maxAmountOfCells; xPosition += stepsToMove) {
                stepsToMove = 1;

                if (carried[xPosition]) {
                    carried[xPosition]--;
                } else {
                    celda = cellsBuffer[cellPointer++];
                    if (celda.rowSpan > 1) {
                        for (k = 0; k < celda.colSpan; k++) {
                            carried[xPosition + k] = celda.rowSpan - 1;
                        }
                        stepsToMove = celda.colSpan;
                    } else if (celda.colSpan > 1) {
                        stepsToMove = celda.colSpan;
                    }
                }
            }

        }
        return carried;
    };

    /*
     * A helpful function for showing
     * the abstract table in console.
     * @param Array our abstract table.
     */
    var drawTable = function (a) {
        var string = 'DRAWING TABLE:\n';
        for (var i = 0; i < a.length; i++) {

            for (var j = 0; j < a[i].length; j++) {
                string += ' ' + a[i][j];
            }
            string += '\n';
        }
        table.isSquare(a);
    };

    /*
     * It resets all the bits of our abstract representation
     * to 0 and removes the highlighting class of all cells.
     */

    var undoSelect = function () {
        let noCells = document.getElementsByClassName('wptb-no-cell-action'),
            singleCells = document.getElementsByClassName('wptb-single-action'),
            multipleCells = document.getElementsByClassName('wptb-multiple-select-action'),
            cellSettings = document.getElementById( 'wptb-left-scroll-panel-cell-settings' ),
            tds = table.getElementsByClassName('wptb-highlighted');
        while (tds.length) {
            tds[0].classList.remove('wptb-highlighted');
        }
        cellSettings.classList.remove( 'visible' );
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                array[i][j] = 0;
            }
        }
        for (let i = 0; i < multipleCells.length; i++) {
            multipleCells[i].classList.remove('visible');
            multipleCells[i].setAttribute('disabled', 'disabled');
        }
        for (let i = 0; i < noCells.length; i++) {
            noCells[i].classList.add('visible');
            noCells[i].removeAttribute('disabled');
        }
        for (let i = 0; i < singleCells.length; i++) {
            singleCells[i].classList.remove('visible');
            singleCells[i].setAttribute('disabled', 'disabled');
        }

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/undo-select/active', table);
    };

    /*
     * This fills the abstract representation of our table with
     * zeros, at the start. the max amount of cells is the greatest sum
     * of all colspans for row.
     */

    var fillTableArray = function () {
        var colspansSums = [], a = [];

        //calculate max amount of cells inside a row
        for (var i = 0; i < table.rows.length; i++) {
            var cells = table.rows[i].getElementsByTagName('td'),
                    colspanSumInRow = 0;
            for (var j = 0; j < cells.length; j++) {
                colspanSumInRow += cells[j].colSpan;
            }
            colspansSums.push(colspanSumInRow);
        }

        maxAmountOfCells = Math.max.apply(null, colspansSums);
        //calculate max rows
        var maxAmountOfRows = table.rows.length;

        // fill with zeros from both values
        for (var i = 0; i < maxAmountOfRows; i++) {
            a[i] = [];
            for (var j = 0; j < maxAmountOfCells; j++) {
                a[i].push(0);
            }
        }
        drawTable(a);
        return a;
    };

    /*
     * This function gets the sum of all colspans in a row.
     * @param number the number of row to be used as reference.
     */
    var getActualPointsInRow = function (row) {
        var tds = table.rows[row].getElementsByTagName('td'),
                points = 0;
        for (var i = 0; i < tds.length; i++) {
            points += tds[i].colSpan;
        }
        return points;
    }

    /*
     * This function gets us the exact coordinates of
     * an exact cell, in a more reliable way than xIndex and yIndex,
     * these last ones were meant to be used for getting the cell trough them.
     * @param DOMElement the cell to get the coordinates.
     */
    var getCoords = function (search) {
        var skipInCols = [], cell;

        for (var i = 0; i < maxAmountOfCells; i++) {
            skipInCols[i] = 0;
        }

        for (var i = 0; i < table.rows.length; i++) {
            var cellsBuffer = table.rows[i].getElementsByTagName('td');
            cellPointer = 0;
            for (var xPosition = 0; xPosition < maxAmountOfCells; xPosition += stepsToMove) {
                stepsToMove = 1;

                if (skipInCols[xPosition]) {
                    skipInCols[xPosition]--;
                } else {
                    var td = cellsBuffer[cellPointer++];
                    if (td == search) {
                        return [i, xPosition];
                    }
                    if (td.rowSpan > 1) {
                        for ( let k = 0; k < td.colSpan; k++ ) {
                            skipInCols[xPosition + k] = td.rowSpan - 1;
                        }
                        stepsToMove = td.colSpan;
                    } else if (td.colSpan > 1) {
                        stepsToMove = td.colSpan;
                    }
                }
            }
        }
    };

    jQuery('#wptb-table-border-color').val('');
    jQuery('#wptb-table-padding-number,#wptb-table-padding-slider').val('15');

    // Todo your code here
    if ( columns || rows ) {
        //END OF PRIVATE FUNCTIONS
        for (var i = 0; i < settings.length; i++) {
            if (settings[i].id !== 'wptb-apply-inner-border') {
                settings[i].classList.add('visible');
            }
        }

        //Create a HTML Table element.
        table = document.createElement( 'table' );
        table.classList.add( 'wptb-preview-table', 'wptb-element-main-table_setting-startedid-0' );
        table.style.border = '1px solid #d1d1d1';
        table.dataset.reconstraction = 1;
        //table.dataset.wptbAdaptiveTable = 1;
        //Add the data rows.
        for (var i = 0; i < rows; i++) {

            row = table.insertRow(-1);
            row.classList.add( 'wptb-row' );

            for (var j = 0; j < columns; j++) {
                cell = new WPTB_Cell(mark);
                cell.setCoords(i, j);
                cell.getDOMElement().style.border = '1px solid #d1d1d1';
                row.appendChild(cell.getDOMElement());
            }
        }
    } else {
        if( ! wptb_preview_table ) wptb_preview_table = document.querySelector( '.wptb-preview-table' );

        if ( wptb_preview_table ) {
            table = wptb_preview_table;

            let cells = table.getElementsByTagName('td');

            if (cells.length > 0) {
                for (let i = 0; i < cells.length; i++) {
                    WPTB_Cell(mark, cells[i]);
                }
            }
        } else {
            return;
        }
    }

    /**
     * this method run "mark" method of WPTB_Table object
     * @param event
     */
    table.mark = (event) => {
        mark(event);
    }

    table.wptbCell = (callback, DOMElement) => {
        return WPTB_Cell(callback, DOMElement);
    }

    table.tableSM = () => {
        return WPTB_TableStateSaveManager;
    }

    /**
     * this method run "undoSelect" method of WPTB_Table object
     * @param event
     */
    table.undoSelect = () => {
        undoSelect();
    }

    /**
     * method for set value for maxAmountOfCells
     * @param value
     */
    table.setMaxAmountOfCells = (value) => {
        maxAmountOfCells = value;
    }

    /**
     * this method return maxAmountOfCells value
     * @returns {*}
     */
    table.getMaxAmountOfCells = () => {
        return maxAmountOfCells;
    }

    /**
     * this method run "fillTableArray" method of WPTB_Table object
     * @returns {[]}
     */
    table.fillTableArray = () => {
        return fillTableArray();
    }
    /*
     * For assigning to each cell xIndex and y Index attributes,
     * these are the column number and row number of cell in table.
     */

    table.recalculateIndexes = function () {
        WPTB_Helper.recalculateIndexes( this );
    }

    table.addColumnWidth = function( value, cleaner ) {
        let highlighted  = table.getElementsByClassName( 'wptb-highlighted' );
        if( highlighted.length > 0 ) {
            for( let k = 0; k < highlighted.length; k++ ) {
                let dataXIndex = highlighted[k].dataset.xIndex;
                if( dataXIndex ) {
                    function tableTdsFor( dataXIndex, colspan ) {
                        let tableRows = table.rows;
                        let widthIsSet = false;
                        let arrayTdsFromPreviousRow = [];
                        for( let i = 0; i < tableRows.length; i++ ) {
                            let row = tableRows[i];
                            let tds = row.children;
                            for( let j = 0; j < tds.length; j++ ) {
                                let td = tds[j];
                                if( td.dataset.xIndex == dataXIndex ) {
                                    if( value ) {
                                        if( td.colSpan == colspan ) {
                                            td.style.width = value + 'px';
                                            td.removeAttribute( 'data-wptb-fixed-width' );
                                            widthIsSet = true;
                                        } else {
                                            td.style.width = null;
                                            td.dataset.wptbFixedWidth = value;
                                            if( i == tableRows.length - 1 && ! widthIsSet ) {
                                                tableTdsFor( dataXIndex, colspan + 1 );
                                            }
                                        }
                                    } else if( cleaner ) {
                                        td.style.width = null;
                                        td.removeAttribute( 'data-wptb-fixed-width' );
                                    } else {
                                        if( td.dataset.wptbFixedWidth ) {
                                            if( td.colSpan == colspan ) {
                                                td.style.width = td.dataset.wptbFixedWidth + 'px';
                                                td.removeAttribute( 'data-wptb-fixed-width' );
                                            }
                                        } else if( td.style.width ) {
                                            for( let z = 0; z < arrayTdsFromPreviousRow.length; z++ ) {
                                                arrayTdsFromPreviousRow[z].style.width = td.style.width;
                                            }
                                            arrayTdsFromPreviousRow = [];
                                        } else {
                                            arrayTdsFromPreviousRow.push( td );
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    tableTdsFor( dataXIndex, 1 );
                }
            }

            table.tdDefaultWidth();

            WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);
        }
    }

    table.tdDefaultWidth = function() {
        let rows = table.rows;

        let tableTdsSumMaxWidth = 0;
        let tableTdsSumMaxWidthFixed = 0;
        let tableTdsSumMaxWidthAuto = 0;

        let wptbTableSetup = document.getElementsByClassName( 'wptb-table-setup' )[0];
        let wptbTableSetupWidth = wptbTableSetup.offsetWidth;

        let arrayCellsWidthFixedHelper = [];
        let arrayCellsWidthAutoHelper = [];
        let tdPaddingCommon = 0;
        let tableTdBorderCommonWidth = 0;
        let cssForTdsWidthAuto = '';


        let tableFullStyleObj = window.getComputedStyle( table, null );
        let borderLeftWidth = tableFullStyleObj.getPropertyValue( 'border-left-width' );
        let borderRightWidth = tableFullStyleObj.getPropertyValue( 'border-right-width' );
        let tableBorderCommon = parseFloat( borderLeftWidth, 10 ) + parseFloat( borderRightWidth, 10 );

        for( let i = 0; i < rows.length; i++ ) {
            let tds = rows[i].children;
            for( let j = 0; j < tds.length; j++ ) {
                let td = tds[j];

                if( ! arrayCellsWidthFixedHelper[parseFloat( td.dataset.xIndex )] && ! arrayCellsWidthAutoHelper[parseFloat( td.dataset.xIndex )] ) {
                    if( td.style.width ) {
                        arrayCellsWidthFixedHelper[parseFloat( td.dataset.xIndex )] = parseFloat( td.style.width );
                        td.removeAttribute( 'data-wptb-css-td-auto-width' );
                    } else {
                        if( ! td.dataset.wptbFixedWidth ) {
                            arrayCellsWidthAutoHelper[parseFloat( td.dataset.xIndex )] = table.dataset.wptbTdWidthAuto ? parseFloat( table.dataset.wptbTdWidthAuto, 10 ) : 100;
                            td.dataset.wptbCssTdAutoWidth = true;
                        }
                    }

                    if( window.getComputedStyle( td, null ) ) {
                        let tdStyleObj = window.getComputedStyle( td, null );
                        let tdPaddingLeft = tdStyleObj.getPropertyValue( 'padding-left' );
                        let tdPaddingRight = tdStyleObj.getPropertyValue( 'padding-right' );
                        tdPaddingCommon = parseFloat( tdPaddingLeft, 10 ) + parseFloat( tdPaddingRight, 10 );

                        let tableTdBorderLeftWidth = tdStyleObj.getPropertyValue( 'border-left-width' );
                        let tableTdBorderRightWidth = tdStyleObj.getPropertyValue( 'border-right-width' );
                        tableTdBorderCommonWidth = parseFloat( tableTdBorderLeftWidth, 10 ) + parseFloat( tableTdBorderRightWidth, 10 );
                        tableTdBorderCommonWidth = tableTdBorderCommonWidth / 2;

                        if( arrayCellsWidthFixedHelper[parseFloat( td.dataset.xIndex )] ) {
                            arrayCellsWidthFixedHelper[parseFloat( td.dataset.xIndex )] += tdPaddingCommon;
                            arrayCellsWidthFixedHelper[parseFloat( td.dataset.xIndex )] += tableTdBorderCommonWidth;

                            if( j == 0 && ( tableBorderCommon / 2 ) <= parseFloat( tableTdBorderLeftWidth, 10 ) ) {
                                arrayCellsWidthFixedHelper[parseFloat( td.dataset.xIndex )] += parseFloat( tableTdBorderLeftWidth, 10 ) / 2;
                            } else if( j == 0 && ( tableBorderCommon / 2 ) > parseFloat( tableTdBorderLeftWidth, 10 ) ) {
                                arrayCellsWidthFixedHelper[parseFloat( td.dataset.xIndex )] += ( ( tableBorderCommon / 2 ) - ( parseFloat( tableTdBorderRightWidth, 10 ) / 2 ) );
                            }

                            if( j == tds.length - 1 && ( tableBorderCommon / 2 ) <= parseFloat( tableTdBorderRightWidth, 10 ) ) {
                                arrayCellsWidthFixedHelper[parseFloat( td.dataset.xIndex )] += parseFloat( tableTdBorderRightWidth, 10 ) / 2;
                            } else if( j == tds.length - 1 && ( tableBorderCommon / 2 ) > parseFloat( tableTdBorderRightWidth, 10 ) ) {
                                arrayCellsWidthFixedHelper[parseFloat( td.dataset.xIndex )] += ( ( tableBorderCommon / 2 ) - ( parseFloat( tableTdBorderRightWidth, 10 ) / 2 ) );
                            }
                        } else if( arrayCellsWidthAutoHelper[parseFloat( td.dataset.xIndex )] ) {
                            arrayCellsWidthAutoHelper[parseFloat( td.dataset.xIndex )] += tdPaddingCommon;
                            arrayCellsWidthAutoHelper[parseFloat( td.dataset.xIndex )] += tableTdBorderCommonWidth;

                            if( j == 0 && ( tableBorderCommon / 2 ) <= parseFloat( tableTdBorderLeftWidth, 10 ) ) {
                                arrayCellsWidthAutoHelper[parseFloat( td.dataset.xIndex )] += parseFloat( tableTdBorderLeftWidth, 10 ) / 2;
                            } else if( j == 0 && ( tableBorderCommon / 2 ) > parseFloat( tableTdBorderLeftWidth, 10 ) ) {
                                arrayCellsWidthAutoHelper[parseFloat( td.dataset.xIndex )] += ( ( tableBorderCommon / 2 ) - ( parseFloat( tableTdBorderLeftWidth, 10 ) / 2 ) );
                            }

                            if( j == tds.length - 1 && ( tableBorderCommon / 2 ) <= parseFloat( tableTdBorderRightWidth, 10 ) ) {
                                arrayCellsWidthAutoHelper[parseFloat( td.dataset.xIndex )] += parseFloat( tableTdBorderRightWidth, 10 ) / 2;
                            } else if( j == tds.length - 1 && ( tableBorderCommon / 2 ) > parseFloat( tableTdBorderRightWidth, 10 ) ) {
                                arrayCellsWidthAutoHelper[parseFloat( td.dataset.xIndex )] += ( ( tableBorderCommon / 2 ) - ( parseFloat( tableTdBorderLeftWidth, 10 ) / 2 ) );
                            }
                        }
                    }
                } else if( arrayCellsWidthAutoHelper[parseFloat( td.dataset.xIndex )] ) {
                    if( ! td.dataset.wptbFixedWidth ) {
                        td.dataset.wptbCssTdAutoWidth = true;
                    }
                } else if( arrayCellsWidthFixedHelper[parseFloat( td.dataset.xIndex )] ) {
                    td.removeAttribute( 'data-wptb-css-td-auto-width' );
                }
            }
        }

        for( let i = 0; i < arrayCellsWidthFixedHelper.length; i++ ) {
            if( arrayCellsWidthFixedHelper[i] ) {
                tableTdsSumMaxWidthFixed += arrayCellsWidthFixedHelper[i];
            }
        }

        let CellsWidthAutoCount = 0;
        for( let i = 0; i < arrayCellsWidthAutoHelper.length; i++ ) {
            if( arrayCellsWidthAutoHelper[i] ) {
                tableTdsSumMaxWidthAuto += arrayCellsWidthAutoHelper[i];
                CellsWidthAutoCount++;
            }
        }

        tableTdsSumMaxWidth = tableTdsSumMaxWidthFixed + tableTdsSumMaxWidthAuto;

        table.dataset.wptbTableTdsSumMaxWidth = tableTdsSumMaxWidth;
        if( CellsWidthAutoCount ) {
            table.dataset.wptbCellsWidthAutoCount = CellsWidthAutoCount;
            if( table.mergingСellsHorizontally ) {
                table.dataset.wptbFixedWidthSize = tableTdsSumMaxWidthFixed;
            } else {
                table.removeAttribute( 'data-wptb-fixed-width-size' );
            }
        } else {
            table.removeAttribute( 'data-wptb-fixed-width-size' );
            table.removeAttribute( 'data-wptb-cells-width-auto-count' );
        }

        let styleElementCreate = false;
        let tableTdWidthAuto;
        if( tableTdsSumMaxWidth < wptbTableSetupWidth ) {
            if( CellsWidthAutoCount ) {
                table.style.minWidth = '100%';
                if( table.mergingСellsHorizontally ) {
                    table.style.width = 'auto';
                    let tableTdsWidthAutoCommon = wptbTableSetupWidth - tableTdsSumMaxWidthFixed;
                    tableTdWidthAuto = tableTdsWidthAutoCommon / CellsWidthAutoCount;
                    tableTdWidthAuto = tableTdWidthAuto - tdPaddingCommon - tableTdBorderCommonWidth;
                    styleElementCreate = true;
                } else {
                    table.style.width = '100%';
                }
            } else {
                table.style.width = 'auto';
                table.style.minWidth = null;
                table.style.maxWidth = null;
            }
        } else {
            table.style.maxWidth = null;
            table.style.minWidth = tableTdsSumMaxWidth + 'px';
            table.style.width = 'auto';
            tableTdWidthAuto = table.dataset.wptbTdWidthAuto ? table.dataset.wptbTdWidthAuto : '100';
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
            cssForTdsWidthAuto = document.createElement( 'style' );
            cssForTdsWidthAuto.setAttribute( 'data-wptb-td-auto-width', true );
            cssForTdsWidthAuto.innerHTML = '[data-wptb-css-td-auto-width=true]{width:' + tableTdWidthAuto + 'px}';
            if( head ) {
                head.appendChild( cssForTdsWidthAuto );
            }
        }

        if( table.dataset.wptbTableAlignment ) {
            let wptbTableAlignment = table.dataset.wptbTableAlignment;

            let wptbTableSetupWidth = wptbTableSetup.offsetWidth;
            if( wptbTableSetupWidth < table.offsetWidth ) {
                table.style.float = null;
            } else {
                if( wptbTableAlignment == 'center' ) {
                    table.style.float = null;
                } else {
                    table.style.float = wptbTableAlignment;
                }
            }

            if( wptbTableAlignment == 'center' ) {
                wptbTableSetup.style.float = null;
            } else {
                wptbTableSetup.style.float = wptbTableAlignment;
            }

            if( tableTdWidthAuto && table.dataset.wptbTableContainerMaxWidth && table.offsetWidth < table.dataset.wptbTableContainerMaxWidth ) {
                table.style.width = '100%';
            }
        } else {
            table.style.float = null;
        }
    }

    table.addRowHeight = function( value, cleaner ) {
        let highlighted  = table.getElementsByClassName( 'wptb-highlighted' );
        if( highlighted.length > 0 ) {
            for( let k = 0; k < highlighted.length; k++ ) {
                let dataYIndex = highlighted[k].dataset.yIndex;
                if( dataYIndex ) {
                    function tableTdsFor( dataYIndex, rowspan ) {
                        let tableRows = table.rows;
                        let heightIsSet = false;
                        let arrayTdsPrevious = [];
                        for( let i = 0; i < tableRows.length; i++ ) {
                            let row = tableRows[i];
                            let tds = row.children;
                            for( let j = 0; j < tds.length; j++ ) {
                                let td = tds[j];
                                if( td.dataset.yIndex == dataYIndex ) {
                                    if( value ) {
                                        if( td.rowSpan == rowspan ) {
                                            td.style.height = value + 'px';
                                            td.removeAttribute( 'data-wptb-fixed-heidht' );
                                            heightIsSet = true;
                                            continue;
                                        } else {
                                            td.style.height = null;
                                            td.dataset.wptbFixedHeight = value;
                                            if( j == tds.length - 1 && ! heightIsSet ) {
                                                tableTdsFor( dataYIndex , rowspan + 1 );
                                            }
                                        }
                                    } else if( cleaner ) {
                                        td.style.height = null;
                                        td.removeAttribute( 'data-wptb-fixed-heidht' );
                                    } else {
                                        if( td.dataset.wptbFixedHeight ) {
                                            if( td.rowSpan = rowspan ) {
                                                td.style.height = td.dataset.wptbFixedHeight + 'px';
                                                td.removeAttribute( 'data-wptb-fixed-width' );
                                            }
                                        } else if( td.style.height ) {
                                            for( let z = 0; z < arrayTdsPrevious.length; z++ ) {
                                                arrayTdsPrevious[z].style.height = td.style.height;
                                            }
                                            arrayTdsPrevious = [];
                                        } else {
                                            arrayTdsPrevious.push( td );
                                        }
                                    }
                                }
                            }
                        }
                    }

                    tableTdsFor( dataYIndex, 1 );
                }
            }

            WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);
        }
    }

    table.reconstraction = function() {
        let tds = table.getElementsByTagName( 'td' );
        table.mergingСellsHorizontally = false;
        table.mergingCellsVertically = false;
        table.dataset.reconstraction = 1;
        let forBreak = 0;
        for( let i = 0; i < tds.length; i++ ) {
            if( tds[i].colSpan > 1 ) {
                table.dataset.reconstraction = 0;
                table.mergingСellsHorizontally = true;
                forBreak++;
            }

            if( tds[i].rowSpan > 1 ) {
                table.dataset.reconstraction = 0;
                table.mergingCellsVertically = true;
                forBreak++;
            }

            if( forBreak == 2 ) {
                break;
            }
        }
    }

    /*
     * As simple as it is: adds a column to the end of table.
     */
    table.addColumnEnd = function () {
        let td,
            currentTable = document.getElementsByClassName('wptb-preview-table'),
            currentTableTd,
            currentTdStyle;
        if (currentTable.length > 0) {
            currentTableTd = currentTable[0].querySelector('td');
        }

        if (currentTableTd) {
            currentTdStyle = currentTableTd.getAttribute('style');
        }

        for (var i = 0; i < table.rows.length; i++) {
            td = new WPTB_Cell(mark);

            if (currentTdStyle) {
                td.getDOMElement().setAttribute('style', currentTdStyle);
                td.getDOMElement().style.width = null;
                td.getDOMElement().style.height = null;
                td.getDOMElement().style.borderColor = WPTB_TableSettingsData.getTableSetting('borderColor');
            }

            table.rows[i].appendChild(td.getDOMElement());
            array[i].push(0);
        }

        maxAmountOfCells++;
        table.recalculateIndexes();
        table.tdDefaultWidth();
        table.addRowHeight();
        WPTB_Helper.dataTitleColumnSet( table );
        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * As simple as it looks: adds a column to the start of table.
     */

    table.addColumnStart = function () {
        let td,
            firstCell,
            currentTable = document.getElementsByClassName('wptb-preview-table'),
            currentTableTd,
            currentTdStyle;
        if ( currentTable.length > 0 ) {
            currentTableTd = currentTable[0].querySelector('td');
        }

        if ( currentTableTd ) {
            currentTdStyle = currentTableTd.getAttribute('style');
        }

        for (var i = 0; i < table.rows.length; i++) {
            td = new WPTB_Cell(mark);
            if (currentTdStyle) {
                td.getDOMElement().setAttribute('style', currentTdStyle);
                td.getDOMElement().style.width = null;
                td.getDOMElement().style.height = null;
                td.getDOMElement().style.borderColor = WPTB_TableSettingsData.getTableSetting('borderColor');
            }
            firstCell = table.rows[i].getElementsByTagName('td')[0];
            if (firstCell) {
                table.rows[i].insertBefore(td.getDOMElement(), firstCell);
            } else {
                table.rows[i].appendChild(td.getDOMElement());
            }
            array[i].push(0);
        }

        maxAmountOfCells++;
        table.recalculateIndexes();
        table.tdDefaultWidth();
        table.addRowHeight();
        WPTB_Helper.dataTitleColumnSet( table );
        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * Well, not so simple as previous functions.
     * It adds a column after a certain column of reference.
     * @param integer the column number to be used as reference.
     *	If empty, then the first highlighted cell is used as reference.
     */

    table.addColumnAfter = function (c_pos) {
        let rows = table.rows,
            cell,
            cellStyle,
            pos;

        if(c_pos != undefined && typeof c_pos === 'number') {
            pos = c_pos;
            cell = document.querySelector('[data-x-index="' + pos + '"]');
        } else {
            cell = document.querySelector('.wptb-highlighted');
            pos = getCoords(cell)[1];
        }

        if(cell) {
            cellStyle = cell.getAttribute('style');

            if( maxAmountOfCells - pos - cell.colSpan + 1 == 1 ) {
                table.addColumnEnd();
            } else {
                for(let i = 0; i < rows.length; i++) {
                    let tds = rows[i].children;
                    for(let j = 0; j < tds.length; j++) {
                        if(parseInt(tds[j].dataset.xIndex) <= pos) {
                            if(parseInt(tds[j].dataset.xIndex) + tds[j].colSpan == pos + cell.colSpan) {
                                let td = newTd(cellStyle);
                                let nextSib = tds[j].nextSibling;
                                if (nextSib) {
                                    rows[i].insertBefore(td.getDOMElement(), nextSib);
                                } else {
                                    rows[i].appendChild(td.getDOMElement());
                                }

                                break;
                            } else if(parseInt(tds[j].dataset.xIndex) + tds[j].colSpan > pos + cell.colSpan) {
                                tds[j].colSpan++;
                                if(tds[j].rowSpan > 1) i += tds[j].rowSpan - 1;
                                break;
                            }
                        } else if(parseInt(tds[j].dataset.xIndex) > pos) {
                            let td = newTd(cellStyle);
                            rows[i].insertBefore(td.getDOMElement(), tds[j]);
                            break;
                        }
                    }
                }

                function newTd(cellStyle) {
                    let td = new WPTB_Cell(mark);
                    if (cellStyle) {
                        td.getDOMElement().setAttribute('style', cellStyle);
                        td.getDOMElement().style.width = null;
                        td.getDOMElement().style.height = null;
                    }
                    td.getDOMElement().style.borderColor = WPTB_TableSettingsData.getTableSetting('borderColor');
                    return td;
                }

                for (var i = 0; i < array.length; i++) {
                    array[i].push(0);
                }
                maxAmountOfCells++;
                drawTable(array);
                table.recalculateIndexes();
                table.addColumnWidth();
                table.addRowHeight();
                WPTB_Helper.dataTitleColumnSet( table );
                undoSelect();

                WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
            }
        }
    };

    /*
     * For preventing us to take a lot of time,
     * This is just calling the function addColumnAfter, but
     * using the previous column to current one as reference.
     * @see addColumnAfter
     */

    table.addColumnBefore = function () {
        var cell = document.querySelector('.wptb-highlighted'),
                pos = getCoords(cell)[1];

        if (pos === 0) {
            table.addColumnStart();
        } else {
            table.addColumnAfter(pos - 1);
        }
    };

    /*
     * Luckily, thisfunction is simple,
     * it just add a row to the end of table.
     */

    table.addRowToTheEnd = function () {
        let r = table.insertRow(-1),
        td,
        aux,
        currentTable = document.getElementsByClassName('wptb-preview-table');
        r.classList.add( 'wptb-row' );
        if (currentTable.length > 0) {
            currentTable = currentTable[0];

            for (var i = 0; i < maxAmountOfCells; i++) {
                td = new WPTB_Cell(mark);
                let currentTableTd = currentTable.querySelector('[data-x-index="' + i + '"]');
                if( currentTableTd ) {
                    let currentTdStyle = currentTableTd.getAttribute( 'style' );

                    td.getDOMElement().setAttribute( 'style', currentTdStyle );
                    td.getDOMElement().style.height = null;
                }
                r.appendChild(td.getDOMElement());
            }

            aux = Array.from(array[0]);
            array.push(aux);
            drawTable(array);
            table.recalculateIndexes();
            WPTB_Helper.tableRowsColorsReinstall(table);
            table.addColumnWidth();
            WPTB_Helper.dataTitleColumnSet( table );
            undoSelect();

            WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    };

    /*
     * Yet another simple function,
     * it just add a row to the start of table.
     */

    table.addRowToTheStart = function () {
        let r = table.insertRow(0),
        td,
        aux,
        currentTable = document.getElementsByClassName('wptb-preview-table'),
        currentTableTd,
        currentTdStyle;
        r.classList.add( 'wptb-row' );
        if (currentTable.length > 0) {
            currentTable = currentTable[0];

            for (var i = 0; i < maxAmountOfCells; i++) {
                td = new WPTB_Cell(mark);
                let currentTableTd = currentTable.querySelector('[data-x-index="' + i + '"]');
                if( currentTableTd ) {
                    let currentTdStyle = currentTableTd.getAttribute( 'style' );

                    td.getDOMElement().setAttribute( 'style', currentTdStyle );
                    td.getDOMElement().style.height = null;
                }
                r.appendChild(td.getDOMElement());
            }

            aux = Array.from(array[0]);
            array.push(aux);
            drawTable(array);
            table.recalculateIndexes();
            WPTB_Helper.tableRowsColorsReinstall( table );
            table.addColumnWidth();
            WPTB_Helper.dataTitleColumnSet( table );
            undoSelect();

            WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    };

    /*
     * This function adds a row before the current one.
     * Since the biggest factor of problem is a not-started but ongoing rowspan,
     * the most of the troubles is not here.
     */

    table.addRowBefore = function () {
        let cell = document.querySelector('.wptb-highlighted'),
            cellStyle = cell.getAttribute('style'),
            row = getCoords(cell)[0],
            cellNew;

        if(row === 0){
            row = -1;
        }

        for( let i = row - 1; i >= 0; i-- ) {
            let rowChildren = table.rows[i].children;
            let rowChildrenLength = rowChildren.length;
            if( rowChildrenLength > 0 ) {
                for( let j = 0; j < rowChildrenLength; j++ ) {
                    if( rowChildren[j].rowSpan == 1 ) {
                        row = i;
                        cellNew = true;
                        break;
                    }
                }
            }
            if ( cellNew ) {
                break;
            }
        }


        if (row === -1) {
            table.addRowToTheStart();
        } else {
            table.addRowAfter( row, cellStyle );
        }
    };

    /*
     * Well... by the name convention of the previous 3 functions,
     * it's pretty obvious that this functions attaches a new
     * row after highlighted cell row. The greatest obstacle it was
     * the possibility of a TR not having the exact amount of columns
     * occuped by actual node but rowspanned upper cells. For that purpose
     * it was created the function realTimeArray.
     * @see realTimeArray
     */

    table.addRowAfter = function ( row, cellStyle ) {
        let cellRowSpan,
            rowAfter,
            aux;

        if ( ( row == undefined || typeof row !== 'number' ) && cellStyle == undefined ) {
            let cell = document.querySelector('.wptb-highlighted');
            cellStyle = cell.getAttribute('style'),
            row = getCoords(cell)[0],
            cellRowSpan = cell.rowSpan,
            rowAfter = row + cellRowSpan - 1;
        } else {
            rowAfter = row;
        }


        let cellsColSpan = 0;
        if ( rowAfter < table.rows.length -1 ) {
            for( let i = 0; i <= rowAfter ; i++ ) {
                let tableRowsIChildren = table.rows[i].children,
                    tableRIChildrenLength = tableRowsIChildren.length;
                if( tableRIChildrenLength > 0 ) {
                    for( let j = 0; j < tableRIChildrenLength; j++ ) {
                        let rowIRowSpan = tableRowsIChildren[j].rowSpan;

                        if ( rowIRowSpan - 1  + i > rowAfter ) {
                            tableRowsIChildren[j].rowSpan++;
                        }
                    }
                }
            }

            let rNext = table.rows[rowAfter + 1],
                rNextChildren = rNext.children,
                rNextChildrenLength = rNextChildren.length;

            if( rNextChildrenLength > 0 ) {
                for ( let i = 0; i < rNextChildrenLength; i++ ) {
                    cellsColSpan += rNextChildren[i].colSpan;
                }
            }
        } else {
            cellsColSpan = array[0].length;
        }

        let r = table.insertRow( rowAfter + 1 );
        r.classList.add( 'wptb-row' );

        for ( j = 0; j < cellsColSpan; j++ ) {
            let td = new WPTB_Cell( mark );
            let currentTableTd = table.querySelector('[data-x-index="' + j + '"]');
            if( currentTableTd ) {
                let currentTdStyle = currentTableTd.getAttribute( 'style' );

                td.getDOMElement().setAttribute( 'style', currentTdStyle );
                td.getDOMElement().style.height = null;
            }
            r.appendChild( td.getDOMElement() );
        }

        aux = Array.from(array[0]);
        array.push(aux);
        drawTable(array);
        table.recalculateIndexes();
        WPTB_Helper.tableRowsColorsReinstall( table );
        table.addColumnWidth();
        WPTB_Helper.dataTitleColumnSet( table );
        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after');

        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * This function checks the current selected cells
     * make a rectangular shape.
     * @param Array the abstract table.
     * @return false, if not making a rectangle, or
     *	Array an array containing number of rows and columns, if selection makes a rectangle.
     */

    table.isSquare = function (a) {
        var rowStart = -1,
            columnStart = -1,
            rowEnd = -1,
            columnEnd = -1,
            height,
            width,
            itemsEstimate = 0,
            items = 0;

        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < a[i].length; j++) {
                if (a[i][j] == 1) {
                    if ( j < columnStart || columnStart == -1 ) {
                        columnStart = j;
                    }
                    if ( i < rowStart || rowStart == -1 ) {
                        rowStart = i;
                    }
                }
            }

        }

        for (var i = a.length - 1; i > -1; i--) {
            for (var j = a[i].length - 1; j > -1; j--) {
                if (a[i][j] == 1) {
                    if ( j > columnEnd ) {
                        columnEnd = j;
                    }
                    if ( i > rowEnd ) {
                        rowEnd = i;
                    }
                }
            }
        }

        for (var i = rowStart; i < rowEnd; i++) {
            for (var j = columnStart; j < columnEnd; j++) {
                if (a[i][j] == 0 || a[i][j] == undefined) {
                    return false;
                }
            }
        }

        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < a[i].length; j++) {
                if (a[i][j] == 1) {
                    items++;
                }
            }
        }

        height = rowEnd - rowStart + 1;
        width = columnEnd - columnStart + 1;
        itemsEstimate = height * width;

        if (itemsEstimate !== items) {
            return false;
        }
        return [height, width];
    };

    /*
     * This function merges all selected cells.
     * Well, actually sets the colspan and rowspan of first
     * upper left  cell in selection and deletes the another selected cells.
     */

    table.mergeCells = function () {
        var dimensions = table.isSquare(array),
            rowspan = dimensions[0],
            colspan = dimensions[1],
            first = document.querySelector('.wptb-highlighted'),
            tds = [].slice.call(document.getElementsByClassName('wptb-highlighted'), 1),
            tdsChildrenNew = [];

        for (let i = 0; i < tds.length; i++) {
            let tdsInternalElements = tds[i].getElementsByClassName('wptb-ph-element');
            if (tdsInternalElements.length > 0) {
                let tdsIntElemLength = tdsInternalElements.length;
                for (let j = 0; j < tdsIntElemLength; j++) {
                    tdsChildrenNew.push(tdsInternalElements[j]);
                }
            }
            let p = tds[i].parentNode;
            p.removeChild(tds[i]);
        }
        if (tdsChildrenNew.length > 0) {
            for (let i = 0; i < tdsChildrenNew.length; i++) {
                first.appendChild(tdsChildrenNew[i]);
            }
        }

        first.colSpan = colspan;
        first.rowSpan = rowspan;
        table.recalculateIndexes();
        table.reconstraction();
        let firstWidth = first.style.width;
        let firstDataFixedWidth = first.dataset.wptbFixedWidth;
        if( firstWidth ) {
            table.addColumnWidth( parseFloat( firstWidth, 10 ) );
        } else if( firstDataFixedWidth ) {
            table.addColumnWidth();
        } else {
            table.addColumnWidth( false, true );
        }

        let firstHeight = first.style.height;
        let firstDataFixedHeight = first.dataset.wptbFixedHeight;
        if( firstHeight ) {
            table.addRowHeight( parseFloat( firstHeight, 10 ) );
        } else if( firstDataFixedHeight ) {
            table.addRowHeight();
        } else {
            table.addRowHeight( false, true );
        }
        WPTB_Helper.dataTitleColumnSet( table );
        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * This functions makes the exact inverse as above.
     * It resets colspan and rowspan and appends
     * the same amount in cells to the table.
     * @bug
     */

    table.splitCell = function () {
        var cell = document.getElementsByClassName('wptb-highlighted')[0],
            rowspan = cell.rowSpan,
            colspan = cell.colSpan,
            cellStyles = cell.getAttribute('style'),
            row = getCoords(cell)[0],
            thisRow = table.rows[row],
            cellXIndex =cell.dataset.xIndex;

        cell.rowSpan = 1;
        cell.colSpan = 1;

        for (let i = 1; i < colspan; i++) {
            let td = new WPTB_Cell(mark);
            td.getDOMElement().setAttribute('style', cellStyles);
            td.getDOMElement().classList.add( 'wptb-highlighted' );
            if ( cell.nextSibling ) {
                thisRow.insertBefore( td.getDOMElement(), cell.nextSibling );
            } else {
                thisRow.appendChild( td.getDOMElement() );
            }

        }

        if (rowspan > 1) {
            for (let i = 1; i < rowspan; i++) {
                let rowChildInsertBefore = undefined,
                    rowNext = table.rows[row + i],
                    rowChildren = rowNext.children,
                    rowChildrenLength = rowChildren.length;

                if ( rowChildrenLength > 0 ) {
                    for ( let k = 0; k < rowChildrenLength; k++ ) {
                        if ( Number( rowChildren[k].dataset.xIndex ) > Number( cellXIndex ) ) {
                            rowChildInsertBefore = rowChildren[k];
                            break;
                        }
                    }
                }
                for ( let j = 0; j < colspan; j++ ) {
                    let td = new WPTB_Cell( mark );
                    td.getDOMElement().setAttribute( 'style', cellStyles );
                    if ( rowChildInsertBefore != undefined ) {
                        rowNext.insertBefore( td.getDOMElement(), rowChildInsertBefore );
                    } else {
                        rowNext.appendChild( td.getDOMElement() );
                    }
                }
            }
        }

        table.recalculateIndexes();
        table.reconstraction();
        table.addColumnWidth();
        table.addRowHeight();
        WPTB_Helper.dataTitleColumnSet( table );
        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * Searches for rowspanned cells up to row number meeting it.
     * @param number the number of row where the function
     * must search up to.
     */

    table.findRowspannedCells = function (row) {
        var array = [],
                difference;
        actualPoints = getActualPointsInRow(row);
        if (actualPoints === maxAmountOfCells) {
            return [];
        }
        difference = maxAmountOfCells - actualPoints;

        for (var i = row - 1; i >= 0 && difference; i--) {
            var tds = table.rows[i].getElementsByTagName('td');
            for (var i = 0; i < tds.length; i++) {
                if (tds[i].rowSpan > 1) {
                    array.push(tds[i]);
                    difference -= tds[i].colSpan;
                }
            }
        }
        return array;

    }

    /*
     * This function explores the table and adds
     * a cell for each lacking one for each row
     * to meet an even amount of cells.
     */

    table.addLackingCells = function () {
        var sumRows = [];
        for (var i = 0; i < table.rows.length; i++) {
            sumRows.push(0);
        }

        for (var i = 0; i < table.rows.length; i++) {
            var tds = table.rows[i].getElementsByTagName('td');
            for (var j = 0; j < tds.length; j++) {
                if (tds[j].rowSpan > 1) {
                    for (var k = 1; k < tds[j].rowSpan; k++) {
                        sumRows[i + k]++;
                    }
                }
            }
        }

        for (var i = 0; i < table.rows.length; i++) {
            var tds = table.rows[i].getElementsByTagName('td'),
                    totalColspan = 0;
            for (var j = 0; j < tds.length; j++) {
                totalColspan += tds[j].colSpan;
            }
            totalColspan += sumRows[i];
            difference = maxAmountOfCells - totalColspan;
            for (var j = 0; j < difference; j++) {
                var td = new WPTB_Cell(mark);
                table.rows[i].appendChild(td.getDOMElement());
                //table.rows[i].insertBefore( td.getDOMElement(), rows[i].nextSibling );
            }
        }
    };

    /*
     * This function deletes the row of currently
     * selected cell.
     */

    table.deleteRow = function () {
        let cell = document.querySelector('.wptb-highlighted'),
            cellStyles = cell.getAttribute('style'),
            rowspan = cell.rowSpan,
            row = getCoords(cell)[0],
            thisRow,
            aux;

        if ( rowspan == undefined ) rowspan = 1;

        for ( let i = 0; i < rowspan; i++ ) {
            thisRow = table.rows[row];
            let thisRowChildren = thisRow.children,
                nextRow = table.rows[row + 1],
                nextRowChildren,
                nextRowChildrenLength,
                tdArr = [];

            if( nextRow != undefined ) {
                nextRowChildren = nextRow.children;
                nextRowChildrenLength = nextRowChildren.length;
                for (let j = 0; j < thisRowChildren.length; j++) {
                    if ( thisRowChildren[j].rowSpan > 1 ) {
                        let td = new WPTB_Cell(mark);
                            td.getDOMElement().setAttribute('style', cellStyles);
                            td.getDOMElement().colSpan = thisRowChildren[j].colSpan;
                            td.getDOMElement().rowSpan = thisRowChildren[j].rowSpan - 1;

                        let nextRowChildrenK = undefined;
                        for ( let k = 0; k < nextRowChildrenLength; k++ ) {
                            if ( Number( nextRowChildren[k].dataset.xIndex ) > Number( thisRowChildren[j].dataset.xIndex ) ) {
                                nextRowChildrenK = nextRowChildren[k];
                                break;
                            }
                        }

                        if ( nextRowChildrenK ) {
                            tdArr.push( [td, nextRowChildrenK] );
                        } else {
                            tdArr.push( [td] );
                        }
                    }
                }

                if ( tdArr.length > 0 ) {
                    for ( let k = 0; k < tdArr.length; k++ ) {
                        if ( tdArr[k][1] != undefined ) {
                            nextRow.insertBefore( tdArr[k][0].getDOMElement(), tdArr[k][1] );
                        } else {
                            nextRow.appendChild( tdArr[k][0].getDOMElement() );
                        }
                    }
                }
            }

            let tableRows = table.rows;
            if ( tableRows.length > 0 ) {
                for ( let j = 0; j < row; j++ ) {
                    let jRowChildren = tableRows[j].children;
                    if ( jRowChildren.length > 0 ) {
                        for ( let x = 0; x < jRowChildren.length; x++ ) {
                            if ( jRowChildren[x].rowSpan - 1 >= row - j ) {
                                jRowChildren[x].rowSpan--;
                            }
                        }
                    }
                }
            }
            aux = Array.from(array[0]);
            array.pop(aux);
            drawTable(array);
            table.getElementsByTagName('tbody')[0].removeChild(table.rows[row]);

            if( table.rows.length == 0 ) {
                WPTB_Helper.toggleTableEditMode();
                wptbTableSetup.innerHTML = '';
                document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
                let wptbSaveBtn = document.getElementsByClassName( 'wptb-save-btn' );
                if( wptbSaveBtn.length > 0 ) {
                    wptbSaveBtn = wptbSaveBtn[0];

                    wptbSaveBtn.classList.add( 'wptb-save-disabled' );
                    wptbSaveBtn.classList.remove('active');
                }
            } else {
                table.recalculateIndexes();
                WPTB_Helper.tableRowsColorsReinstall( table );
                WPTB_Helper.dataTitleColumnSet( table );
                table.reconstraction();
            }
        }

        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    }

    /*
     * This function deletes the column of currently
     * selected cell. Again, this is way more complicated than
     * delete row case.
     */

    table.deleteColumn = function () {
        let cell = document.querySelector('.wptb-highlighted'),
            cellXIndex = cell.dataset.xIndex,
            colspan = cell.colSpan;

        for ( let i = 0; i < colspan; i++ ) {
            for ( let j = 0; j < table.rows.length; j++ ) {
                let rowChildren = table.rows[j].children;
                let rowChildrenLength = rowChildren.length;
                if( rowChildrenLength > 0 ) {
                    for ( let k = rowChildrenLength - 1; k >= 0; k-- ) {
                        if ( Number( rowChildren[k].dataset.xIndex ) == Number( cellXIndex ) ) {
                            if ( rowChildren[k].colSpan > 1 ) {
                                rowChildren[k].colSpan--;
                            } else {
                                table.rows[j].removeChild( rowChildren[k] );
                            }
                            break;
                        } else if( Number( rowChildren[k].dataset.xIndex ) < Number( cellXIndex ) &&
                                Number( rowChildren[k].dataset.xIndex ) +
                                Number( rowChildren[k].colSpan -1 ) >= cellXIndex ) {
                            if ( rowChildren[k].colSpan > 1 ) {
                                rowChildren[k].colSpan--;
                            }
                            break;
                        }
                    }
                }
            }

            for ( let j = 0; j < table.rows.length; j++ ) {
                if (array[j] != undefined)
                    array[j].pop();
            }

            maxAmountOfCells--;

            if( table.querySelectorAll( 'td' ).length == 0 ) {
                WPTB_Helper.toggleTableEditMode();
                wptbTableSetup.innerHTML = '';
                document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
                let wptbSaveBtn = document.getElementsByClassName( 'wptb-save-btn' );
                if( wptbSaveBtn.length > 0 ) {
                    wptbSaveBtn = wptbSaveBtn[0];

                    wptbSaveBtn.classList.add( 'wptb-save-disabled' );
                    wptbSaveBtn.classList.remove('active');
                }
            } else {
                table.recalculateIndexes();
                table.tdDefaultWidth();
                WPTB_Helper.dataTitleColumnSet( table );
                table.reconstraction();
            }
        }

        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    // @deprecated old generate logic
    // document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';

    array = fillTableArray();

    undoSelect();
    drawTable(array);

    wptbTableSetup.appendChild(table);
    //if (columns || rows) {
        table.recalculateIndexes( true );
    //}
    table.reconstraction();
    table.tdDefaultWidth();

    wptbTableSetup.onresize = function() {
        table.tdDefaultWidth();
    };

    WPTB_LeftPanel();

    // event hook to signal that table is generated and ready to be used
    WPTB_Helper.wptbDocumentEventGenerate('wptb:table:generated', document);

    WPTB_Helper.elementStartScript( table, 'table_setting' );
    WPTB_Helper.elementOptionsSet( 'table_setting', table );

    // this code gets the ID of the active element in the toolbar
    // and stores it in the data attribute of the common container element "wpcd_fixed_toolbar"
//    let wptbPhElement = document.getElementsByClassName( 'wptb-ph-element' );
//    let wpcdFixedToolbar = document.getElementById( 'wpcd_fixed_toolbar' );
//    for ( let i = 0; i < wptbPhElement.length; i++ ) {
//        wptbPhElement[i].addEventListener( 'click', function( e ) {
//            let wptbToolbar = document.getElementById( 'wpcd_fixed_toolbar' ).children;
//            for ( let j = 0; j < wptbToolbar.length; j++ ) {
//                let elementStyles = window.getComputedStyle( wptbToolbar[j], 'null' );
//                if( elementStyles.getPropertyValue( 'display' ) == 'block' ) {
//                    wpcdFixedToolbar.dataset.toolbarActiveId = wptbToolbar[j].getAttribute( 'id' );
//                }
//            }
//        }, false );
//    }

//    let wptbPanelLeft = document.getElementsByClassName( 'wptb-panel-left' );
//    if( wptbPanelLeft.length > 0 ) {
//        wptbPanelLeft[0].addEventListener( 'click', function( e ) {
//            let toolbarActiveElementId = wpcdFixedToolbar.dataset.toolbarActiveId;
//            document.getElementById( toolbarActiveElementId ).style.display = '';
//        }, false );
//    }

//    let body = document.getElementsByTagName( 'body' );
//    if( body.length > 0 ) {
//        body[0].addEventListener( 'click', function( e ) {
//            if ( e.target.classList.contains( 'wptb-panel-left' ) || WPTB_Helper.findAncestor( e.target, 'wptb-panel-left' ) ) {
//                let toolbarActiveElementId = wpcdFixedToolbar.dataset.toolbarActiveId;
//                document.getElementById( toolbarActiveElementId ).style.display = '';
//            }
//        }, false );
//    }
};
