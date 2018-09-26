var WPTB_LeftPanel = function () {

    var table = document.getElementsByClassName('wptb-preview-table')[0],
        wptbElementButtons = document.getElementsByClassName('wptb-element');

    jQuery('#wptb-even-row-bg').wpColorPicker({
        change: function (event, ui) {
            var tableRows = table.getElementsByTagName('tr');
            for (var i = 1; i < tableRows.length; i += 2) {
                tds = tableRows[i].getElementsByTagName('td');
                for (var j = 0; j < tds.length; j++) {
                    tds[j].style.backgroundColor = ui.color.toString();
                }
            }
        }
    });
    jQuery('#wptb-odd-row-bg').wpColorPicker({
        change: function (event, ui) {
            var tableRows = table.getElementsByTagName('tr');
            for (var i = 2; i < tableRows.length; i += 2) {
                tds = tableRows[i].getElementsByTagName('td');
                for (var j = 0; j < tds.length; j++) {
                    tds[j].style.backgroundColor = ui.color.toString();
                }
            }
        }
    });
    jQuery('#wptb-table-header-bg').wpColorPicker({
        change: function (event, ui) {
            var tableHeader = table.getElementsByTagName('tr')[0],
                tds = tableHeader.getElementsByTagName('td');
            for (var j = 0; j < tds.length; j++) {
                tds[j].style.backgroundColor = ui.color.toString();
            }
        }
    });



    function addInnerBorderSize(value) {
        var tableCells = table.getElementsByTagName('td');
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.border = value + 'px solid';
        }
    }

    function addCellPadding(value) {
        var tableCells = table.getElementsByTagName('td');
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.padding = value + 'px';
        }
    }


    function addInnerBorder(checked) {
        var styles;

        if (checked == 'checked') {
            document.getElementById('wptb-apply-inner-border').style.marginBottom = '0px';
            var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
            for (var i = 0; i < tableCells.length; i++) {
                tableCells[i].style.border = '1px solid';
            }

            document.getElementById('wptb-inner-border-settings').classList.add('visible');
        } else {
            document.getElementById('wptb-inner-border-settings').classList.remove('visible');
            var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
            for (var i = 0; i < tableCells.length; i++) {
                tableCells[i].style.border = '';
            }
        }
    }

    function addBorderSize(value) {
        table.style.border = value + 'px solid';
    }

    document.getElementById('wptb-table-cell-slider').oninput = function () {
        document.getElementById('wptb-table-cell-number').value = this.value;
        addCellPadding(this.value);
    };

    document.getElementById('wptb-table-cell-number').onchange = function () {
        document.getElementById('wptb-table-cell-slider').value = this.value;
        addCellPadding(this.value);
    };

    document.getElementById('wptb-table-border-slider').oninput = function () {
        document.getElementById('wptb-table-border-number').value = this.value;
        addBorderSize(this.value);
    };

    document.getElementById('wptb-table-border-number').onchange = function () {
        document.getElementById('wptb-table-border-slider').value = this.value;
        addBorderSize(this.value);
    };

    document.getElementById('wptb-table-inner-border-slider').oninput = function () {
        document.getElementById('wptb-table-inner-border-number').value = this.value;
        addInnerBorderSize(this.value);
    };

    document.getElementById('wptb-table-inner-border-number').onchange = function () {
        document.getElementById('wptb-table-inner-border-slider').value = this.value;
        addInnerBorderSize(this.value);
    };

    document.getElementById('wptb-inner-border-check').onchange = function () {
        var _val = this.checked ? 'checked' : 'unchecked';
        addInnerBorder(_val);
    };

    for (var i = 0; i < wptbElementButtons.length; i++) {
        wptbElementButtons[i].ondragstart = function (e) {
            e.dataTransfer.setData('wptbElement', this.dataset.wptbElement);
        }
    }

    document.getElementById('wptb-activate-cell-management-mode').onclick = table.toggleTableEditMode;
    document.getElementById('wptb-add-end-row').onclick = table.addRowToTheEnd;
    document.getElementById('wptb-add-start-row').onclick = table.addRowToTheStart;
    document.getElementById('wptb-add-row-before').onclick = table.addRowBefore;
    document.getElementById('wptb-add-row-after').onclick = table.addRowAfter;
    document.getElementById('wptb-add-end-column').onclick = table.addColumnEnd;
    document.getElementById('wptb-add-start-column').onclick = table.addColumnStart;
    //document.getElementById('wptb-add-column-before').onclick = table.addColumnBefore;
    //document.getElementById('wptb-add-column-after').onclick = table.addColumnAfter;
    //document.getElementById('wptb-delete-column').onclick = table.deleteColumn;
    //document.getElementById('wptb-delete-row').onclick = table.deleteRow;
    document.getElementById('wptb-merge-cells').onclick = table.mergeCells;
    document.getElementById('wptb-split-cell').onclick = table.splitCell;
    document.getElementById('add-elements').onclick = function () {
        document.getElementById('element-options').getElementsByTagName('a')[0].classList.remove('active');
        document.getElementById('add-elements').getElementsByTagName('a')[0].classList.add('active');
        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'table';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'block';
        document.getElementById("element-options-group").style.display = 'none';
    };

};