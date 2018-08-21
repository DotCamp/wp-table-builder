var wptbElement;

//numbers of elements that have been added
window.wptb_num = new Array();
window.wptb_num["text"] = 0;
window.wptb_num["image"] = 0;
window.wptb_num["list"] = 0;
window.wptb_num["button"] = 0;

ElementCounters = function ElementCounters() {
        var priv = [];
        priv['text'] = 0;
        priv['image'] = 0;
        priv['list'] = 0;
        priv['button'] = 0;

        this.increment = function (key) {

                if (!(key in priv)) {
                        return;
                }

                priv[key]++;
        };
        this.nextIndex = function (key) {

                if (!(key in priv)) {
                        return undefined;
                }

                return priv[key] + 1;
        };
        return this;
};

applyGenericItemSettings = function applyGenericItemSettings(element) {
        var node = element.getDOMElement(),
            index = document.counter.nextIndex(element.kind);

        node.onmouseenter = function (event) {
                this.classList.add('wptb-directlyhovered');
                var btnDelete = document.createElement('span'),
                    btnCopy = document.createElement('span'),
                    btnMove = document.createElement('span'),
                    actions = document.createElement('span'),
                    previous,
                    i;
                actions.classList.add('wptb-actions');
                btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
                btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
                btnMove.classList.add("dashicons", "dashicons-move", 'move-action');
                btnDelete.onclick = function (event) {
                        var act = this.parentNode.parentNode,
                            el = act.parentNode;
                        el.removeChild(act);
                };
                //btnCopy.onclick = window.copyButton;
                //btnMove.onmousedown = window.putItemDragStart;
                actions.appendChild(btnMove);
                actions.appendChild(btnCopy);
                actions.appendChild(btnDelete);
                this.appendChild(actions);
        };

        node.onmouseleave = function (event) {
                var formerActions = this.getElementsByClassName('wptb-actions');
                if (formerActions && formerActions[0]) {
                        var par = formerActions[0].parentNode;
                        par.removeChild(formerActions[0]);
                }
                this.classList.remove('wptb-directlyhovered');
        };

        node.classList.add('wptb-ph-element', 'wptb-element-' + element.kind + '-' + index);

        prop = document.querySelector(".wptb-" + element.kind + "-options-prototype").cloneNode(true);
        prop.classList.remove("wptb-" + element.kind + "-options-prototype"); // remove prototype from the class
        prop.classList.add('wptb-options-' + element.kind + "-" + index);
        document.getElementById("element-options-group").appendChild(prop);
        switch (wptbElement) {
                case 'text':
                        //listener_to_element(prop.find('.wptb-color-picker'));
                        //prop.getElementsByClassName('wptb-color-picker')[0].wpColorPicker();
                        break;
        }

        node.onclick = function () {
                var infArr = this.className.match(/wptb-element-((.+-)\d+)/i),
                    optionsClass = '.wptb-' + infArr[2] + 'options' + '.wptb-options-' + infArr[1];

                document.getElementById('add-elements').getElementsByTagName('a')[0].classList.remove('active');
                document.getElementById('element-options').getElementsByTagName('a')[0].classList.add('active');

                document.getElementsByClassName('wptb-elements-container')[0].style.display = 'none';
                document.getElementsByClassName('wptb-settings-section')[0].style.display = 'none';
                document.getElementById("element-options-group").style.display = 'block';

                var children = document.getElementById("element-options-group").childNodes;
                for (var i = 0; i < children.length; i++) {
                        if (children[i].style) children[i].style.display = 'none';
                }

                document.querySelector(optionsClass).style.display = 'block';
        };

        document.counter.increment(element.kind);
};

WPTB_Button = function WPTB_Button(text) {
        var DOMElement = document.createElement('div'),
            elButton2 = document.createElement('div'),
            el_B = document.createElement('p');

        this.kind = 'button';

        DOMElement.classList.add('wptb-button-container');
        elButton2.classList.add('wptb-button-wrapper');
        el_B.classList.add('wptb-button');
        el_B.classList.add('editable');
        el_B.innerHTML = text != undefined ? text : 'Button Text';
        elButton2.appendChild(el_B);
        DOMElement.appendChild(elButton2);
        /*window.addElementOptions('button', elButton);
        tinyMCE.init({
            target: el_B,
            inline: true,
            plugins: "link",
            dialog_type: "modal",
            theme: 'modern',
            menubar: false,
            fixed_toolbar_container: '#wpcd_fixed_toolbar',
            toolbar: 'bold italic strikethrough',
            setup: function (ed) {
                ed.on("init",
                    function (ed) {
                        tinyMCE.execCommand('mceRepaint');
                    }
                );
            },
            init_instance_callback: function (editor) {
                editor.on('change', function (e) {
                    // check if it becomes empty because if there's no value it's hard to edit the editor in button element
                    if (editor.getContent() == "") {
                        editor.setContent("<p class='wptb-button'>Button Text</p>");
                    }
                });
                editor.on('KeyDown', function (e) {
                    var range = editor.selection.getRng();
                    var KeyID = e.keyCode;
                    if (range.startOffset == 0 && (KeyID == 8 || KeyID == 46)) {
                        e.preventDefault();
                        editor.setContent("<p class='wptb-button'></p>");
                    }
                });
            }
        });*/

        this.getDOMElement = function () {
                return DOMElement;
        };

        applyGenericItemSettings(this);

        return this;
};

WPTB_Text = function WPTB_Text(text) {
        var DOMElement = document.createElement('div'),
            elText2 = document.createElement('div'),
            elP = document.createElement('p');

        this.kind = 'text';

        elText2.classList.add('editable');
        elP.innerHTML = text != undefined ? text : 'Text';
        elText2.appendChild(elP);
        DOMElement.appendChild(elText2);
        //window.addElementOptions('text', elText);
        //window.tinyFastCall(elText.childNodes[0]);
        //$(elText).click();

        this.getDOMElement = function () {
                return DOMElement;
        };
        applyGenericItemSettings(this);

        return this;
};

WPTB_ListItem = function WPTB_ListItem(text) {

        if (text == undefined) text = 'New List Item';
        var DOMElement = document.createElement('article'),
            divdot = document.createElement('div'),
            divcontent = document.createElement('div'),
            libullet = document.createElement('li');
        divdot.classList.add('wptb-list-item-style-dot');
        divcontent.classList.add('wptb-list-item-content');
        libullet.classList.add('wptb-bullet');
        DOMElement.appendChild(divdot);
        DOMElement.appendChild(divcontent);
        divdot.appendChild(libullet);
        divcontent.innerHTML = text;
        //tinyFastCall(divcontent);
        divcontent.onkeyup = window.listItemKeyListener;
        divcontent.parentNode.onmouseenter = window.showListItemSettings;
        divcontent.parentNode.onmouseleave = window.hideListItemSettings;

        this.getDOMElement = function () {
                return DOMElement;
        };

        return this;
};

WPTB_List = function WPTB_List(innerElements) {
        var el_L = document.createElement('ul'),
            item,
            DOMElement = document.createElement('div');

        this.kind = 'list';

        if (!innerElements) for (var i = 0; i < 3; i++) {
                item = new WPTB_ListItem('List Item ' + (i + 1));
                el_L.appendChild(item.getDOMElement());
        } else {
                for (var i = 0; i < innerElements.length; i++) {
                        item = new WPTB_ListItem(innerElements[i]);
                        el_L.appendChild(item.getDOMElement());
                }
        }
        DOMElement.appendChild(el_L);
        //window.addElementOptions('list', elList);

        this.getDOMElement = function () {
                return DOMElement;
        };
        applyGenericItemSettings(this);

        return this;
};

WPTB_Cell = function WPTB_Cell(DOMElement) {

        function newElementProxy(el) {
                if (el == 'list') {
                        return new WPTB_List();
                } else if (el == 'image') {
                        return window.newImage();
                } else if (el == 'text') {
                        return new WPTB_Text();
                } else if (el == 'button') {
                        return new WPTB_Button();
                }
        }

        DOMElement = document.createElement("td");

        DOMElement.classList.add('wptb-droppable', 'wptb-cell');

        DOMElement.onclick = function () {

                var relativeActions, cells;

                if (window._wptbManagementModeActive) {
                        return;
                }
                if (this.classList.contains('wptb-highlighted')) {
                        this.classList.remove('wptb-highlighted');
                } else {
                        relativeActions = document.getElementsByClassName('wptb-relative-action');
                        cells = document.getElementsByTagName('td');

                        for (var i = 0; i < relativeActions.length; i++) {
                                console.log(relativeActions[i]);
                                relativeActions[i].dataset.activeCell = this;
                        }

                        for (var i = 0; i < cells.length; i++) {
                                cells[i].classList.remove('wptb-highlighted');
                        }

                        this.classList.add('wptb-highlighted');
                }
        };

        DOMElement.ondragenter = function () {
                var div;

                console.log('dragenter');

                this.classList.add('wptb-drop-here-empty');
        };

        DOMElement.ondragover = function (e) {
                e.preventDefault();
        };

        DOMElement.ondragleave = function () {

                console.log('dragleave');

                this.classList.remove('wptb-drop-here-empty');
        };

        DOMElement.ondrop = function (e) {
                var element;
                e.preventDefault();
                element = newElementProxy(e.dataTransfer.getData('wptbElement'));
                this.appendChild(element.getDOMElement());
                this.classList.remove('wptb-drop-here-empty');
                return true;
        };

        DOMElement.onmousedown = function () {};

        DOMElement.onmouseover = function () {};

        DOMElement.onmouseup = function () {};

        this.getDOMElement = function () {
                return DOMElement;
        };

        this.setCoords = function (y, x) {
                var el = this.getDOMElement();
                el.dataset.yIndex = y;
                el.dataset.xIndex = x;
        };

        this.getCoords = function () {
                var coords,
                    el = this.getDOMElement();
                coords.x = el.dataset.xIndex;
                coords.y = el.dataset.yIndex;
                return coords;
        };

        this.appendElement = function (node) {
                getDOMElement().appendChild(node);
        };

        return this;
};

WPTB_LeftPanel = function WPTB_LeftPanel() {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            wptbElementButtons = document.getElementsByClassName('wptb-element');

        for (var i = 0; i < wptbElementButtons.length; i++) {
                wptbElementButtons[i].ondragstart = function (e) {
                        e.dataTransfer.setData('wptbElement', this.dataset.wptbElement);
                };
        }

        document.getElementById('wptb-add-end-row').onclick = table.addRowToTheEnd;
        document.getElementById('wptb-add-start-row').onclick = table.addRowToTheStart;
        document.getElementById('wptb-add-row-before').onclick = table.addRowBefore;
        document.getElementById('wptb-add-row-after').onclick = table.addRowAfter;
        document.getElementById('wptb-add-end-column').onclick = table.addColumnToTheEnd;
        document.getElementById('wptb-add-start-column').onclick = table.addColumnToTheStart;
        document.getElementById('wptb-add-column-before').onclick = table.addColumnBefore;
        document.getElementById('wptb-add-column-after').onclick = table.addColumnAfter;
};

WPTB_Table = function WPTB_Table(columns, rows) {

        var settings = document.getElementsByClassName('wptb-settings-items'),
            wptbTableSetup = document.getElementsByClassName("wptb-table-setup")[0],
            table,
            row,
            cell;

        for (var i = 0; i < settings.length; i++) {
                settings[i].classList.add('visible');
        }

        document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';

        //Create a HTML Table element.
        table = document.createElement('table');
        table.classList.add('wptb-preview-table');

        //Add the header row.
        row = table.insertRow(-1);
        row.classList.add('wptb-table-head', 'wptb-row');

        for (var i = 0; i < columns; i++) {
                cell = new WPTB_Cell();
                cell.setCoords(0, i);
                row.appendChild(cell.getDOMElement());
        }

        //Add the data rows.
        for (var i = 1; i < rows; i++) {

                row = table.insertRow(-1);
                row.classList.add('wptb-row');

                for (var j = 0; j < columns; j++) {
                        cell = new WPTB_Cell();
                        cell.setCoords(i, j);
                        row.appendChild(cell.getDOMElement());
                }
        }

        table.recalculateIndexes = function () {
                var trs = this.getElementsByTagName('tr'),
                    tds;

                for (var i = 0; i < trs.length; i++) {
                        tds = trs[i].getElementsByTagName('td');
                        for (var j = 0; j < tds.length; j++) {

                                if (i == 0) {
                                        tds[j].parentNode.className = '';
                                        tds[j].parentNode.classList.add('wptb-row', 'wptb-table-head');
                                } else {
                                        tds[j].parentNode.className = '';
                                        tds[j].parentNode.classList.add('wptb-row');
                                }

                                tds[j].dataset.xIndex = j;
                                tds[j].dataset.yIndex = i;
                        }
                }
        };

        table.addColumn = function (pos) {
                var referenceTd, newTd, _this;
                for (var i = 0; i < this.rows.length; i++) {

                        var newTd = new WPTB_Cell();

                        if (pos == 'before' || pos == 'after') {
                                referenceTd = this.rows.getElementsByTagName('td')[_this.dataset.xIndex];
                                if (pos == 'before') {
                                        this.rows[i].insertBefore(newTd.getDOMElement(), referenceTd);
                                        var buttons = document.getElementsByClassName('wptb-relative-action');
                                        for (var i = 0; i < buttons.length; i++) {
                                                buttons[i].dataset.xIndex++;
                                        }
                                } else {
                                        this.rows[i].insertBefore(newTd.getDOMElement(), referenceTd.nextSibling);
                                }
                        } else if (pos == 'end') {
                                this.rows[i].appendChild(newTd.getDOMElement());
                        } else {
                                this.rows[i].innerHTML = '<td class="wptb-droppable wptb-cell"></td>' + this.rows[i].innerHTML;
                        }
                }

                this.recalculateIndexes();
        };

        table.addColumnToTheEnd = function (evt) {
                table.addColumn('end', this.dataset.activeCell);
        };

        table.addColumnToTheStart = function (evt) {
                table.addColumn('start', this.dataset.activeCell);
        };

        table.addColumnBefore = function () {
                table.addColumn('before', this.dataset.activeCell);
        };

        table.addColumnAfter = function () {
                table.addColumn('after', this.dataset.activeCell);
        };

        table.addRow = function (pos) {
                var _this,
                    row,
                    referenceRow = undefined;

                if (pos == 'end' || pos == 'start') {
                        row = this.insertRow(pos == 'end' ? -1 : 0);
                } else {
                        row = document.createElement('tr');
                }

                for (var j = 0; j < this.columns; j++) {
                        var cell = new WPTB_Cell();
                        row.appendChild(cell.getDOMElement());
                }

                row.classList.add('wptb-row');

                if (pos == 'before' || pos == 'after') {
                        _this = this.getElementsByClassName('wptb-highlighted')[0];
                        referenceRow = this.getElementsByTagName('tr')[_this.dataset.yIndex];
                        if (pos == "before") {
                                params.tbody.insertBefore(row, referenceRow);
                                var buttons = document.getElementsByClassName('wptb-relative-action');
                                for (var i = 0; i < buttons.length; i++) {
                                        buttons[i].dataset.yIndex++;
                                }
                        } else {
                                this.getElementsByTagName('tbody')[0].insertBefore(row, referenceRow.nextSibling);
                        }
                }

                if (pos == 'before' || pos == 'start') {
                        var active = document.querySelector('wptb-highlighted');
                        if (active) {
                                active.onclick();
                        }
                }

                this.recalculateIndexes();
        };

        table.addRowToTheEnd = function (evt) {
                table.addRow('end');
        };

        table.addRowToTheStart = function (evt) {
                table.addRow('start');
        };

        table.addRowBefore = function () {
                table.addRow('before');
        };

        table.addRowAfter = function () {
                table.addRow('after');
        };

        table.columns = columns;

        wptbTableSetup.appendChild(table);

        WPTB_LeftPanel();
};

WPTB_Initializer = function WPTB_Initializer() {
        var MIN_COLUMNS = 1,
            MIN_ROWS = 1,
            MAX_COLUMNS = 10,
            MAX_ROWS = 10;

        var tableGenerator = document.body;
        columnsDecrementButton = tableGenerator.getElementsByClassName('wptb-input-number-decrement')[0], columnsIncrementButton = tableGenerator.getElementsByClassName('wptb-input-number-increment')[0], rowsDecrementButton = tableGenerator.getElementsByClassName('wptb-input-number-decrement')[1], rowsIncrementButton = tableGenerator.getElementsByClassName('wptb-input-number-increment')[1], columnsInput = document.getElementById('wptb-columns-number'), rowsInput = document.getElementById('wptb-rows-number');

        columnsDecrementButton.onclick = function () {
                if (columnsInput.value > MIN_COLUMNS) {
                        columnsInput.value--;
                }
        };

        columnsIncrementButton.onclick = function () {
                if (columnsInput.value < MAX_COLUMNS) {
                        columnsInput.value++;
                }
        };

        rowsDecrementButton.onclick = function () {
                if (rowsInput.value > MIN_ROWS) {
                        rowsInput.value--;
                }
        };

        rowsIncrementButton.onclick = function () {
                if (rowsInput.value < MAX_ROWS) {
                        rowsInput.value++;
                }
        };

        document.getElementById('wptb-generate-table').onclick = function () {

                var columns = document.getElementById('wptb-columns-number').value,
                    rows = document.getElementById('wptb-rows-number').value;

                WPTB_Table(columns, rows);
        };
};

WPTB_Settings = function WPTB_Settings() {

        var elems = document.getElementsByClassName('wptb-element');

        for (var i = 0; i < elems.length; i++) {
                elems[i].ondragstart = function (event) {
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
                };
        };
};

WPTB_Builder = function WPTB_Builder() {

        document.counter = new ElementCounters();

        var initializer = WPTB_Initializer();
        settings = WPTB_Settings();
};

(function () {
        document.addEventListener('DOMContentLoaded', WPTB_Builder);
})();
//# sourceMappingURL=admin.js.map
