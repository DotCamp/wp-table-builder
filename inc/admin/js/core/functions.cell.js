(function ($) {
    
    window.selectionWidth = 0; 
    window.selectionHeight=0;

    window.createCell = function(){
        var space = window.makeSpace();
        var cell = document.createElement("td"),
            allowDrop = function (event) {
                    event.target.classList.add('wptb-allow-drop');
                    event.currentTarget.classList.add('wptb-allow-drop');
                    if (event.type == 'dragover') {
                        //event.stopPropagation();
                        event.preventDefault();
                        return true;
                    }
                };
        cell.classList.add('wptb-droppable', 'wptb-cell');  

        cell.onclick = selectIndividualCell;
        cell.onmousedown = startCellSelection;
        cell.onmouseover = goOnWithCellSelection;
        cell.onmouseup = endCellSelection;
        cell.appendChild(space);
        return cell;
    }

    window.selectIndividualCell = function(){
        
        for (var i = 0; i < selectedCells.length; i++) {
            selectedCells[i].classList.remove('highlighted');
        }

        window.selectedCells = [this];
        window.activeColumn = this.dataset.xIndex;
        window.activeRow = this.dataset.yIndex;
        undoAllPreviousHighlights();
        activateIndividualActions();
        deactivateNoneActions();
        deactivateGroupActions();
        highlightRow(this);
        highlightColumn(this);
        this.classList.add('highlighted');
        console.log('Coords',parseInt(this.dataset.xIndex) , parseInt(this.dataset.yIndex) );
        console.log(this);
        var buttons = document.getElementsByClassName('wptb-relative-action');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].dataset.xIndex = this.dataset.xIndex;
            buttons[i].dataset.yIndex = this.dataset.yIndex;
        }
    }

    window.undoAllPreviousHighlights = function(){
        var params = window.getParameters(),tds;
        for (var i = 0; i < params.trs.length; i++) {
            tds = params.trs[i].getElementsByTagName('td');
            for (var j = 0; j < tds.length; j++) {
                tds[j].classList.remove('highlighted');
                tds[j].classList.remove('highlighted-row-first');
                tds[j].classList.remove('highlighted-row-inner');
                tds[j].classList.remove('highlighted-row-last');
                tds[j].classList.remove('highlighted-column-first');
                tds[j].classList.remove('highlighted-column-inner');
                tds[j].classList.remove('highlighted-column-last');  
            }
        } 
        window.selectedCells = [];
    };

    window.activateNoneActions = function(){

        var inputs = document.getElementsByClassName('none');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled=false;
        }
    };

    window.deactivateNoneActions = function(){

        var inputs = document.getElementsByClassName('none');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled=true;
        }
    };

    window.activateIndividualActions = function(){

        var inputs = document.getElementsByClassName('individual');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled=false;
        }

    };

    window.deactivateGroupActions = function(){

        var inputs = document.getElementsByClassName('group');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled=true;
        }
    };

    window.activateGroupActions = function(){

        var inputs = document.getElementsByClassName('group');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled=false;
        }
    };

    window.deactivateIndividualActions = function(){

        var inputs = document.getElementsByClassName('individual');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled=true;
        }
    };

    window.highlightRow = function(td){
        var parentRow = td.parentNode,
            columnCount = parseInt(document.getElementById('wptb-columns-number').value);
            for (var i = 0; i < columnCount; i++) {
                var classToAdd = (i == 0 ? 'highlighted-row-first' : 
                                (i == columnCount-1 ? 'highlighted-row-last' 
                                    : 'highlighted-row-inner'));
                var ttd = parentRow.getElementsByTagName('td')[i];
                if(ttd!==td){
                ttd.classList.add(classToAdd);
                }
            }
    };

    window.highlightColumn = function(td){
       
        var index,
            parentRow = td.parentNode;
            columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            rowCount = parseInt(document.getElementById('wptb-rows-number').value),
            table = document.getElementsByClassName('wptb-preview-table')[0];
            for (var i = 0; i < columnCount; i++) {
                if(parentRow.getElementsByTagName('td')[i] === td ){
                    index = i;
                    break;
                }
            }

            for (var i = 0; i < rowCount; i++) {
                var classToAdd = (i == 0 ? 'highlighted-column-first' : 
                                (i == rowCount-1 ? 'highlighted-column-last' 
                                    : 'highlighted-column-inner'));
                var tr = table.getElementsByTagName('tr')[i];
                if(tr.getElementsByTagName('td')[index]!==td){
                    tr.getElementsByTagName('td')[index].classList.add(classToAdd);
                }
            }
    };

    window.startCellSelection = function(){
        this.classList.add('highlighted');
        window.selectMode = true;
        window.selectedCells.push(this);
    };

    window.goOnWithCellSelection = function(){
        if(window.selectMode){
        this.classList.add('highlighted');
        window.selectedCells.push(this);
        }
    };

    window.endCellSelection = function(){
        window.selectMode = false;
        activateGroupActions();
        deactivateIndividualActions();
        deactivateNoneActions();
    };

    window.mergeCells = function () {
        var firstCell = window.selectedCells[0],
            lastCell = window.selectedCells[window.selectedCells.length-1],
            colspan = Math.abs(lastCell.dataset.xIndex - firstCell.dataset.xIndex) + 1,
            rowspan = Math.abs(lastCell.dataset.yIndex - firstCell.dataset.yIndex) + 1;
        
        for (var i = 1; i < window.selectedCells.length; i++) {
            var p = window.selectedCells[i].parentNode;
            p.removeChild(window.selectedCells[i]);
            delete window.selectedCells[i];
        }
        
        if( colspan > 1 ){
            firstCell.colSpan = colspan;
        }

        if( rowspan > 1 ){
            firstCell.rowSpan = rowspan;
        }
    }

    window.splitCells = function(){

    }

    /*
     * This function finds the table cell DOM element for its coordinates
     *
     * @param int the number of row
     * @param int the number of column
     * @returns object
     */

    window.getCellByCoords = function(x,y){
        return document
        .getElementsByClassName('wptb-preview-table')[0]
        .getElementsByTagName('tr')[y]
        .getElementsByTagName('td')[x];
    };

    /*
     * This function checks wether we should make the selection squared 
     *
     * @returns boolean
     * @see makeSquareSelection
     */

    window.makeSelection = function(startPoint){
        var cell;

        undoAllPreviousHighlights();

        selectedCells = [];

        selectedCells.push(cell);

        for (var i = 0; i < selectionHeight; i++) {
            for (var j = 0; j < selectionWidth; j++) {
                cell = getCellByCoords(parseInt(startPoint.dataset.xIndex) + j, parseInt(startPoint.dataset.yIndex) + i);
                if(cell.colSpan  && cell.colSpan > 1){ 
                    j += cel.colSpan - 1 //Let's remember j is incremented by 1 at each iteration anyways. 
                }
                cell.classList.add('highlighted');
                selectedCells.push(cell);
            }
        }
    };

})(jQuery);