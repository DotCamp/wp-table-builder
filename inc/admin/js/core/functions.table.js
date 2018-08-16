(function ($) {

    window.selectedCells = [];

    // Before this turns out to be a hell of code, we better comment it.

    /**
    * First function running after the user clicks on Generate button.
    * 
    * @returns {void}
    */

    window.initTable = function () {

            document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
            var settings = document.getElementsByClassName('wptb-settings-items');
            for (var i = 0; i < settings.length; i++) {
                settings[i].classList.add('visible');
            }

            //Add Color Picker for Row and Header Background Colors
            $('#wptb-even-row-bg').wpColorPicker();
            $('#wptb-odd-row-bg').wpColorPicker();
            $('#wptb-table-header-bg').wpColorPicker();

            //Create a HTML Table element.
            var table = document.createElement('table');
            table.classList.add('wptb-preview-table');

            //Get the count of columns and rows.
            var columnCount = parseInt(document.getElementById('wptb-columns-number').value);
            var rowCount = parseInt(document.getElementById('wptb-rows-number').value);

            //Add the header row.
            var row = table.insertRow(-1);
            for (var i = 0; i < columnCount; i++) {
                window.headerCell = createCell();
                row.appendChild(headerCell); 
                row.classList.add('wptb-table-head', 'wptb-row');
                headerCell.dataset.yIndex = 0;
                headerCell.dataset.xIndex = i; 
            }

            //Add the data rows.
            for (var i = 1; i < rowCount; i++) {
                row = table.insertRow(-1);
                for (var j = 0; j < columnCount; j++) {
                    var cell = createCell();
                    row.appendChild(cell);
                    row.classList.add('wptb-row');
                    cell.dataset.yIndex = i;
                    cell.dataset.xIndex = j; 
                }
            }

            //Appending the table to the container in UI
            var wptbTable = document.getElementsByClassName("wptb-table-setup")[0];
            wptbTable.innerHTML = '';
            wptbTable.appendChild(table);

            window.bindKeydownHandler();
            window.bindClickHandler();
            //On drag elements.
            document.getElementById('wptb-text').onmousedown = window.itemDragStart;
            document.getElementById('wptb-image').onmousedown = window.itemDragStart;
            document.getElementById('wptb-button').onmousedown = window.itemDragStart;
            document.getElementById('wptb-list').onmousedown = window.itemDragStart;
            
    }



    /**
    * A handler for click event in the page.
    * 
    * @returns {void}
    */

    window.bindClickHandler = function(){

         /*
             * event click to the whole document and then check if it's to one
             * the created element to show it's option
             */
            document.onclick = function (e) {
                setTimeout(
                    function () {
                        //window.tryToChangeMCEWidth();
                    }, 500);
                var $this = $(e.target);

                if(e.target.classList.contains('wptb-admin-container')
                    || e.target.id == 'wpcd_fixed_toolbar'
                    || e.target.classList.contains('wrapper')){
                    window.selectionWidth = window.selectionHeight = 0;
                    undoAllPreviousHighlights();
                    activateNoneActions();
                    deactivateIndividualActions();
                    deactivateGroupActions();
                }

                if (e.target.className!==undefined 
                    && e.target.className.match(/delete-action/)) {
                    return true;
                }
                if (e.target.id.match(/mceu_([0-9])*-button/)) {
                    window.dontAddItems = false;
                }

                var el_options = false; // this var will carry the element that will be shown its options

                // check if this element or one of it's parent should display its options
                if ($this.hasClass('wptb-ph-element')) {
                    el_options = $this;
                } else if ($this.parents().hasClass('wptb-ph-element')) {
                    el_options = $this.parents('.wptb-ph-element');
                }

                // check to show element's options
                if (el_options && el_options.length != 0) {
                    window.Element_options_tab();

                    /**
                     * will carry the extracted infotrmation from the class
                     * @example class => wptb-ph-element wptb-element-text-0
                     *          result => [
                     *              0 => wptb-element-text-0
                     *              1 => text-0
                     *              2 => text-
                     *          ]
                     * @type array
                     */
                    var infArr = el_options.attr('class').match(/wptb-element-((.+-)\d+)/i);

                    /*
                     * will carry the class name of the element's options
                     * @example wptb-text-options wptb-options-text-0
                     * @type String
                     */
                    var optionsClass = '.wptb-' + infArr[2] + 'options' +
                        '.wptb-options-' + infArr[1];
                    $(optionsClass).show();

                    //Binds the range slider and input for text font size.
                    var sliders = document.getElementsByClassName('wptb-text-font-size-slider');
                    for (var i = 0; i < sliders.length; i++) {
                        sliders[i].onchange = function () {
                            this.parentNode.parentNode.childNodes[3].childNodes[1].value = this.value;
                        }
                    }

                    //Binds the range slider and input for text font size.
                    var numbers = document.getElementsByClassName('wptb-text-font-size-number');
                    for (var i = 0; i < numbers.length; i++) {
                        numbers[i].onchange = function () {
                            var rail =this.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1],
                             it =this.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[3];
                            console.log('Element we should change width is:',rail);
                            it.style.left = ((this.value - 10) * rail.getBoundingClientRect().width / 40)+'px';
                        }
                    }
                } else {
                    //show the add elements option
                    if ($this.is('#add-elements') ||
                        $this.parents('#add-elements').length !== 0 ||
                        $this.hasClass('wptb-builder-panel') ||
                        $this.parents('.wptb-builder-panel').length !== 0) {
                        window.add_Elements_tab();
                    }
                }
            };

            document.getElementById('wptb-add-end-row').onclick = addRowToTheEnd;
            document.getElementById('wptb-add-start-row').onclick = addRowToTheStart;
            document.getElementById('wptb-add-end-column').onclick = addColumnToTheEnd;
            document.getElementById('wptb-add-start-column').onclick = addColumnToTheStart;
            document.getElementById('wptb-delete-row').onclick = deleteRow;
            document.getElementById('wptb-delete-column').onclick = deleteColumn;
            document.getElementById('wptb-merge-cells').onclick = mergeCells;

    };

    /**
    * This functions calculates table dimensions by counting its elements
    * rather than trusting in current value of rows and columns number input elements.
    * 
    * @returns object with rows and columns number
    */

    window.getActualTableDimensions = function(){
            var table = document.getElementsByClassName('wptb-preview-table')[0],
                rows = table.getElementsByTagName('tr'),
                tds, cols = 0, dimensions;
            for (var i = 0; i < rows.length; i++) {
                tds = rows[i].getElementsByTagName('td');
                if(tds.length > cols){
                    cols = tds.length;
                }
            }
            dimensions = {
                    rows : rows.length,
                    columns : cols 
                };
            return dimensions;
    };

    /**
    * This part of code is used often in add rows and columns functions,
    * so I decided to put it apart.
    * 
    * @returns object with table DOM object, all TRs DOM objects, table dimensions and tobdy DOM object
    * @see getActualTableDimensions
    */

    window.getParameters = function(){
        var t = document.getElementsByClassName('wptb-preview-table')[0];
        return {
            table : t,
            dimensions : getActualTableDimensions(),
            trs : t.getElementsByTagName('tr'),
            tbody : t.childNodes[0]
        };
    };

    /**
    * A lot of functionality of the tables relies on current cell position,
    + so each time we alter the dimensions by adding or deleting rows/columns,
    * we must reassign to each cell its coordinates.
    *
    * @returns void
    */

    window.recalculateIndexes = function(){
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            trs = table.getElementsByTagName('tr');
        for (var i = 0; i < trs.length; i++) {
            var tds = trs[i].getElementsByTagName('td');
            for (var j = 0; j < tds.length; j++) {

                if(i==0){ 
                    tds[j].parentNode.className=''; 
                    tds[j].parentNode.classList.add('wptb-row','wptb-table-head');
                }
                else{
                    tds[j].parentNode.className=''; 
                    tds[j].parentNode.classList.add('wptb-row'); 
                }

                tds[j].dataset.xIndex = j;
                tds[j].dataset.yIndex = i;
            }
        }
    };

    /**
    * this function is able to add a row at the start,
    * at the end of the table, or in a relative position
    * respect to the current cell.
    * @param string it defines the behavior of the function.
    * @param object since it was ambigous the use of this,
    *       it was the best option to pass it as a parameter.
    *
    * @returns void
    */


    addRow = function(pos, _this){
        var params = getParameters(),
            row, referenceRow = undefined;
            
        if(pos == 'end' || pos == 'start'){
            row = params.table.insertRow( pos == 'end' ? -1 : 0);
        }else{
            row = document.createElement('tr');
        }
            
        for (var j = 0; j < params.dimensions.columns; j++) {
            var headerCell = createCell();
            row.appendChild(headerCell);
        }

        row.classList.add('wptb-row');
        document.getElementById('wptb-rows-number').value = params.dimensions.rows +1;

        if(pos == 'before' || pos == 'after' ){
            referenceRow = params.trs[_this.dataset.yIndex];
            if(pos == "before"){
                params.tbody.insertBefore(row,referenceRow);
                var buttons = document.getElementsByClassName('wptb-relative-action');
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].dataset.yIndex++;
                } 
            }else{
                params.tbody.insertBefore(row,referenceRow.nextSibling);
            }
        }

        recalculateIndexes();
        
    };

    window.addRowToTheEnd = function(evt){
        addRow('end',this);
    };

    window.addRowToTheStart = function(evt){
        addRow('start',this);
    };

    window.addRowBefore = function(){
        addRow('before',this);
    };

    window.addRowAfter = function(){
        addRow('after',this);
    };

    /**
    * this function is able to add a colum at the start,
    * at the end of the table, or in a relative position
    * respect to the current cell.
    * @param string it defines the behavior of the function.
    * @param object since it was ambigous the use of this,
    *       it was the best option to pass it as a parameter.
    *
    * @returns void
    */

    addColumn = function(pos,_this){
        var params = getParameters(),
            referenceTd, newTd;
        for (var i = 0; i < params.dimensions.rows; i++) {
            
            var newTd = createCell();
            params.trs[i].appendChild(newTd);  
            if(pos == 'before' || pos == 'after')
            {
                referenceTd = params.trs[i]
                        .getElementsByTagName('td')[_this.dataset.xIndex];
                if(pos=='before'){
                    params.trs[i].insertBefore(newTd,referenceTd);
                    var buttons = document.getElementsByClassName('wptb-relative-action');
                    for (var i = 0; i < buttons.length; i++) {
                        buttons[i].dataset.xIndex++;
                    } 
                }
                else{
                    params.trs[i].insertBefore(newTd,referenceTd.nextSibling);
                }
            }
            else if(pos=='end'){
                params.trs[i].appendChild(newTd);  
            }
            else{
                params.trs[i].innerHTML = '<td class="wptb-droppable wptb-cell"></td>' + params.trs[i].innerHTML; 
            }
        }
        document.getElementById('wptb-columns-number').value = params.dimensions.columns +1;
        recalculateIndexes();
    };

    window.addColumnToTheEnd = function(evt){
        addColumn('end',this);
    }

    window.addColumnToTheStart = function(evt){
        addColumn('start',this);
        };

    window.addColumnBefore = function(){
        addColumn('before',this);
    };

    window.addColumnAfter = function(){
        addColumn('after',this)
    };

    window.deleteRow = function () { 
        var num = window.activeRow,
            table = document.getElementsByClassName('wptb-preview-table')[0],
            row = table.getElementsByTagName('tr')[num],
            rowCount = parseInt(document.getElementById('wptb-rows-number').value),
            tbody = row.parentNode;
        if((rowCount==1 && columnCount==1) || tbody == undefined){
             return;
         }
        tbody.removeChild(row);
        document.getElementById('wptb-rows-number').value = rowCount -1;
        undoAllPreviousHighlights();
    };

    window.deleteColumn = function () {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            num = window.activeColumn,
            rowCount = parseInt(document.getElementById('wptb-rows-number').value),
            columnCount = parseInt(document.getElementById('wptb-columns-number').value);
            if((rowCount==1 && columnCount==1)){
             return;
         }
        for (var i = 0; i < rowCount; i++) {
             var td = table.getElementsByTagName('tr')[i].getElementsByTagName('td')[num],
                tr = td.parentNode;
             tr.removeChild(td);
        }
        document.getElementById('wptb-columns-number').value = columnCount -1;
        undoAllPreviousHighlights();
    };

})(jQuery);