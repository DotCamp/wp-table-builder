(function ($) {
    window.selectedCells = [];
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
            var headerCell = createCell();
            row.appendChild(headerCell);
            row.classList.add('wptb-table-head', 'wptb-row');
            headerCell.dataset.yIndex = 0;
            headerCell.dataset.xIndex = i;
        }

        //Add the data rows.
        for (var i = 1; i < rowCount; i++) {
            row = table.insertRow(-1);
            for (var j = 0; j < columnCount; j++) {
                var headerCell = createCell();
                row.appendChild(headerCell);
                row.classList.add('wptb-row');
                headerCell.dataset.yIndex = i;
                headerCell.dataset.xIndex = j;
            }
        }

        //Appending the table to the container in UI
        var wptbTable = document.getElementsByClassName("wptb-table-setup")[0];
        wptbTable.innerHTML = '';
        wptbTable.appendChild(table);

        window.bindKeydownHandler();
        window.bindClickHandler();

    }

    window.createCell = function () {
        var cell = document.createElement("td"),
            allowDrop = function (event) {
                event.target.classList.add('wptb-allow-drop');
                event.currentTarget.classList.add('wptb-allow-drop');
                if (event.type == 'dragover') {
                    event.stopPropagation();
                    event.preventDefault();
                    return true;
                }
            };
        cell.classList.add('wptb-droppable', 'wptb-cell');
        cell.ondrop = function (event) {

            event.preventDefault();
            event.stopPropagation();
            event.target.classList.remove('wptb-allow-drop');

            if (wptbElement == 'text') {
                var textEl = window.newText();
                event.target.appendChild(textEl);
                textEl.click();
            } else if (wptbElement == 'image') {
                var img = window.newImage()
                event.target.appendChild(img);
            } else if (wptbElement == 'button') {
                var button = window.newButton();
                event.target.appendChild(button);
                button.click();
            } else if (wptbElement == 'list') {
                var listEl = window.newList();
                event.target.appendChild(listEl);
                listEl.click();
            }
        };
        cell.ondragenter = allowDrop;
        cell.ondragleave = function (event) {
            event.target.classList.remove('wptb-allow-drop');
        };
        cell.ondragover = allowDrop;
        cell.onclick = selectIndividualCell;
        cell.onmousedown = startCellSelection;
        cell.onmouseover = goOnWithCellSelection;
        cell.onmouseup = endCellSelection;
        return cell;
    }

    window.selectIndividualCell = function () {

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
        var buttons = document.getElementsByClassName('wptb-relative-action');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].dataset.xIndex = this.dataset.xIndex;
            buttons[i].dataset.yIndex = this.dataset.yIndex;
        }
    }

    window.undoAllPreviousHighlights = function () {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            rowCount = parseInt(document.getElementById('wptb-rows-number').value);
        for (var i = 0; i < rowCount; i++) {
            var row = table.getElementsByTagName('tr')[i];
            for (var j = 0; j < columnCount; j++) {
                row.getElementsByTagName('td')[j].classList.remove(
                    'highlighted',
                    'highlighted-row-first',
                    'highlighted-row-inner',
                    'highlighted-row-last',
                    'highlighted-column-first',
                    'highlighted-column-inner',
                    'highlighted-column-last'
                );
                //window.activeRow = window.activeColumn = undefined;
                window.selectedCells = [];
            }
        }
    };

    window.activateNoneActions = function () {

        var inputs = document.getElementsByClassName('none');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = false;
        }
    };

    window.deactivateNoneActions = function () {

        var inputs = document.getElementsByClassName('none');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }
    };

    window.activateIndividualActions = function () {

        var inputs = document.getElementsByClassName('individual');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = false;
        }

    };

    window.deactivateGroupActions = function () {

        var inputs = document.getElementsByClassName('group');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }
    };

    window.activateGroupActions = function () {

        var inputs = document.getElementsByClassName('group');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = false;
        }
    };

    window.deactivateIndividualActions = function () {

        var inputs = document.getElementsByClassName('individual');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }
    };

    window.highlightRow = function (td) {
        var parentRow = td.parentNode,
            columnCount = parseInt(document.getElementById('wptb-columns-number').value);
        for (var i = 0; i < columnCount; i++) {
            var classToAdd = (i == 0 ? 'highlighted-row-first' :
                (i == columnCount - 1 ? 'highlighted-row-last'
                    : 'highlighted-row-inner'));
            var ttd = parentRow.getElementsByTagName('td')[i];
            if (ttd !== td) {
                ttd.classList.add(classToAdd);
            }
        }
    };

    window.highlightColumn = function (td) {

        var index,
            parentRow = td.parentNode;
        columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            rowCount = parseInt(document.getElementById('wptb-rows-number').value),
            table = document.getElementsByClassName('wptb-preview-table')[0];
        for (var i = 0; i < columnCount; i++) {
            if (parentRow.getElementsByTagName('td')[i] === td) {
                index = i;
                break;
            }
        }

        console.log('Actual value of index', index);

        for (var i = 0; i < rowCount; i++) {
            var classToAdd = (i == 0 ? 'highlighted-column-first' :
                (i == rowCount - 1 ? 'highlighted-column-last'
                    : 'highlighted-column-inner'));
            var tr = table.getElementsByTagName('tr')[i];
            if (tr.getElementsByTagName('td')[index] !== td) {
                tr.getElementsByTagName('td')[index].classList.add(classToAdd);
            }
        }
    };

    window.startCellSelection = function () {
        this.classList.add('highlighted');
        window.selectMode = true;
        window.selectedCells.push(this);
    };

    window.goOnWithCellSelection = function () {
        if (window.selectMode) {
            this.classList.add('highlighted');
            window.selectedCells.push(this);
        }
    };

    window.endCellSelection = function () {
        window.selectMode = false;
    };



    window.bindKeydownHandler = function () {
        document.onkeydown = function (e) {
            if (e.target.className === 'mce-textbox') {
                window.dontAddItems = true;
                if (event.which === 13 || event.which === 27) {
                    setTimeout(function () {
                        window.dontAddItems = false;
                        document.querySelector('.wptb-list-item-content.mce-edit-focus').click();
                    }, 250);
                }
            }
        };
    };

    window.bindClickHandler = function () {

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

            if (e.target.classList.contains('wptb-admin-container')) {
                console.log('Click out of the table');
                undoAllPreviousHighlights();
                activateNoneActions();
                deactivateIndividualActions();
                deactivateGroupActions();
            }

            if (e.target.className.match(/delete-action/)) {
                return;
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
                        this.parentNode.parentNode.childNodes[1].childNodes[1].value = this.value;
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

        document.getElementById('wptb-add-end-row').onclick = addRow('end');
        document.getElementById('wptb-add-start-row').onclick = addRow('start');
        document.getElementById('wptb-add-end-column').onclick = addColumn('end');
        document.getElementById('wptb-add-start-column').onclick = addColumn('start');
        document.getElementById('wptb-delete-row').onclick = deleteRow;
        document.getElementById('wptb-delete-column').onclick = deleteColumn;

    };

    window.addRow = function (pos) {

        if (typeof pos == 'string' && pos == 'end')
            return function (evt) {
                var columnCount = parseInt(document.getElementById('wptb-columns-number').value),
                    rowCount = parseInt(document.getElementById('wptb-rows-number').value),
                    table = document.getElementsByClassName('wptb-preview-table')[0];
                row = table.insertRow(-1);
                for (var j = 0; j < columnCount; j++) {
                    var headerCell = createCell();
                    row.appendChild(headerCell);
                    headerCell.dataset.yIndex = rowCount;
                    headerCell.dataset.xIndex = j;
                }
                row.classList.add('wptb-row');
                document.getElementById('wptb-rows-number').value = rowCount + 1;
            }
        if (typeof pos == 'string' && pos == 'start')
            return function (evt) {
                var columnCount = parseInt(document.getElementById('wptb-columns-number').value),
                    rowCount = parseInt(document.getElementById('wptb-rows-number').value),
                    table = document.getElementsByClassName('wptb-preview-table')[0];
                row = table.insertRow(0);
                for (var j = 0; j < columnCount; j++) {
                    var headerCell = createCell();
                    row.appendChild(headerCell);
                    headerCell.dataset.yIndex = rowCount;
                    headerCell.dataset.xIndex = j;
                }
                row.classList.add('wptb-row');
                document.getElementById('wptb-rows-number').value = rowCount + 1;
            }
    };

    window.addColumn = function (pos) {

        if (typeof pos == 'string' && pos == 'end')
            return function (evt) {
                var columnCount = parseInt(document.getElementById('wptb-columns-number').value),
                    rowCount = parseInt(document.getElementById('wptb-rows-number').value),
                    table = document.getElementsByClassName('wptb-preview-table')[0];
                for (var i = 0; i < rowCount; i++) {
                    var headerCell = createCell();
                    table.getElementsByTagName('tr')[i].appendChild(headerCell);
                    headerCell.dataset.yIndex = i;
                    headerCell.dataset.xIndex = columnCount;
                }
                document.getElementById('wptb-columns-number').value = columnCount + 1;
            }
        if (typeof pos == 'string' && pos == 'start')
            return function (evt) {
                var columnCount = parseInt(document.getElementById('wptb-columns-number').value),
                    rowCount = parseInt(document.getElementById('wptb-rows-number').value),
                    table = document.getElementsByClassName('wptb-preview-table')[0];
                for (var i = 0; i < rowCount; i++) {
                    var headerCell = createCell();
                    table.getElementsByTagName('tr')[i].innerHTML = '<td class="wptb-droppable wptb-cell"></td>' + table.getElementsByTagName('tr')[i].innerHTML;
                    headerCell.dataset.yIndex = i;
                    headerCell.dataset.xIndex = 0;
                }
                document.getElementById('wptb-columns-number').value = columnCount + 1;
            }
    };

    window.recalculateIndexes = function () {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            trs = table.getElementsByTagName('tr');
        for (var i = 0; i < trs.length; i++) {
            var tds = trs[i].getElementsByTagName('td');
            for (var j = 0; j < tds.length; j++) {

                if (i == 0) {
                    tds[j].parentNode.class = '';
                    tds[j].parentNode.classList.add('wptb-row', 'wptb-table-head');
                }
                else {
                    tds[j].parentNode.class = '';
                    tds[j].parentNode.classList.add('wptb-row');
                }

                tds[j].dataset.xIndex = j;
                tds[j].dataset.yIndex = i;
            }
        }
    };


    window.addRowBefore = function () {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            referenceRow = table.getElementsByTagName('tr')[this.dataset.yIndex],
            columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            newrow = document.createElement('tr');
        for (var j = 0; j < columnCount; j++) {
            var headerCell = createCell();
            newrow.appendChild(headerCell);
        }
        table.childNodes[0].insertBefore(newrow, referenceRow);
        recalculateIndexes();
        document.getElementById('wptb-rows-number').value = rowCount + 1;
        var buttons = document.getElementsByClassName('wptb-relative-action');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].dataset.yIndex++;
        }
    };

    window.addRowAfter = function () {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            referenceRow = table.getElementsByTagName('tr')[this.dataset.yIndex];
        newrow = document.createElement('tr');
        for (var j = 0; j < columnCount; j++) {
            var headerCell = createCell();
            newrow.appendChild(headerCell);
        }
        table.childNodes[0].insertBefore(newrow, referenceRow.nextSibling);
        recalculateIndexes();
        document.getElementById('wptb-rows-number').value = rowCount + 1;
    };

    window.addColumnBefore = function () {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            rowCount = parseInt(document.getElementById('wptb-rows-number').value),
            columnCount = parseInt(document.getElementById('wptb-columns-number').value);
        for (var i = 0; i < rowCount; i++) {
            var referenceTd = table
                .getElementsByTagName('tr')[i]
                .getElementsByTagName('td')[this.dataset.xIndex],
                newTd = createCell();
            table.getElementsByTagName('tr')[i].insertBefore(newTd, referenceTd);
        }
        recalculateIndexes();
        var buttons = document.getElementsByClassName('wptb-relative-action');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].dataset.xIndex++;
        }
        document.getElementById('wptb-columns-number').value = columnCount + 1;
    };

    window.addColumnAfter = function () {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            rowCount = parseInt(document.getElementById('wptb-rows-number').value),
            columnCount = parseInt(document.getElementById('wptb-columns-number').value);
        for (var i = 0; i < rowCount; i++) {
            var referenceTd = table
                .getElementsByTagName('tr')[i]
                .getElementsByTagName('td')[this.dataset.xIndex],
                newTd = createCell();
            table.getElementsByTagName('tr')[i].insertBefore(newTd, referenceTd.nextSibling);
        }
        recalculateIndexes();
        document.getElementById('wptb-columns-number').value = columnCount + 1;
    };

    window.deleteRow = function () {
        var num = window.activeRow,
            table = document.getElementsByClassName('wptb-preview-table')[0],
            row = table.getElementsByTagName('tr')[num],
            rowCount = parseInt(document.getElementById('wptb-rows-number').value),
            tbody = row.parentNode;
        if ((rowCount == 1 && columnCount == 1) || tbody == undefined) {
            return;
        }
        tbody.removeChild(row);
        document.getElementById('wptb-rows-number').value = rowCount - 1;
        undoAllPreviousHighlights();
    };

    window.deleteColumn = function () {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            num = window.activeColumn,
            rowCount = parseInt(document.getElementById('wptb-rows-number').value),
            columnCount = parseInt(document.getElementById('wptb-columns-number').value);
        if ((rowCount == 1 && columnCount == 1)) {
            return;
        }
        for (var i = 0; i < rowCount; i++) {
            var td = table.getElementsByTagName('tr')[i].getElementsByTagName('td')[num],
                tr = td.parentNode;
            tr.removeChild(td);
        }
        document.getElementById('wptb-columns-number').value = columnCount - 1;
        undoAllPreviousHighlights();
    }

    window.mergeCells = function () {

    }

    window.splitCells = function () {

    }

})(jQuery);