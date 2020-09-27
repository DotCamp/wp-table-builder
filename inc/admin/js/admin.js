var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var applyGenericItemSettings = function applyGenericItemSettings(element, kindIndexProt) {
    var copy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var node = element.getDOMElement(),
        index,
        copy;
    if (node.classList.contains('wptb-ph-element')) {
        if (kindIndexProt == undefined || copy == true) {
            //index = document.counter.nextIndex( element.kind );
            var wptbElements = document.getElementsByClassName('wptb-ph-element');
            var elementIndexesArr = [];
            for (var i = 0; i < wptbElements.length; i++) {
                var regex = new RegExp('wptb-element-' + element.kind + '-(\\d+)', "i");
                var infArr = wptbElements[i].className.match(regex);
                if (infArr) {
                    elementIndexesArr.push(infArr[1]);
                }
            }
            if (elementIndexesArr.length > 0) {
                var elementIndexMax = Math.max.apply(Math, elementIndexesArr);
                index = elementIndexMax + 1;
            } else {
                index = 1;
            }

            if (copy) {
                // change all data-elements which save parameters for different controls
                var wptbNodeattributes = [].concat(_toConsumableArray(node.attributes));
                for (var _i = 0; _i < wptbNodeattributes.length; _i++) {
                    if (wptbNodeattributes[_i] && _typeof(wptbNodeattributes[_i]) === 'object' && wptbNodeattributes[_i].nodeName) {
                        var regularText = new RegExp('data-wptb-el-' + element.kind + '-(\\d+)-([a-zA-Z0-9_-]+)', "i");
                        var attr = wptbNodeattributes[_i].nodeName.match(regularText);
                        if (attr && Array.isArray(attr)) {
                            var newDataAttributeName = wptbNodeattributes[_i].nodeName.replace(element.kind + '-' + attr[1], element.kind + '-' + index);
                            var newDataAttributeValue = wptbNodeattributes[_i].nodeValue;
                            node.removeAttribute(wptbNodeattributes[_i].nodeName);
                            node.setAttribute(newDataAttributeName, newDataAttributeValue);
                        }
                    }
                }
            }
        } else if (kindIndexProt && !copy) {
            var kindIndexProtArr = kindIndexProt.split('-');
            index = kindIndexProtArr[kindIndexProtArr.length - 1];
            // start element javascript if element is new
        }

        var node_wptb_element_kind_num = node.className.match(/wptb-element-(.+)-(\d+)/i);
        if (node_wptb_element_kind_num) {
            node.classList.remove(node_wptb_element_kind_num[0]);
        }
        if (!node.classList.contains('wptb-ph-element')) {
            node.classList.add('wptb-ph-element');
            if (!node.classList.contains('wptb-element-' + element.kind + '-' + index)) {
                node.classList.add('wptb-element-' + element.kind + '-' + index);
            }
        } else {
            if (!node.classList.contains('wptb-element-' + element.kind + '-' + index)) {
                node.classList.add('wptb-element-' + element.kind + '-' + index);
            }
        }
        WPTB_Helper.elementStartScript(element.getDOMElement());
        new WPTB_ElementOptions(element, index, kindIndexProt);
        document.counter.increment(element.kind);
    }

    node.onmouseenter = function (event) {
        if (event.target.classList.contains('wptb-moving-mode')) {
            return;
        }

        var wptbActionsField = new WPTB_ActionsField();

        wptbActionsField.addActionField(1, node);

        wptbActionsField.setParameters(node);

        node.classList.remove('wptb-ondragenter');
    };

    node.onmouseleave = function (event) {
        var wptbActionsField = new WPTB_ActionsField();

        wptbActionsField.leaveFromField(event, node);
    };
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var WPTB_ActionsField = function WPTB_ActionsField() {
    var _this = this;

    //this.wptbBorderMarker;
    this.wptbActions;
    if (document.getElementsByClassName('wptb-actions').length != 0) {
        this.wptbActions = document.getElementsByClassName('wptb-actions')[0];
    }

    this.addActionField = function (actionType, thisNode) {
        var body = document.getElementsByTagName('body')[0];

        var actions = document.getElementsByClassName('wptb-actions');
        if (actions.length != 0) {
            var previousNode = actions[0].activeElem;
            if (previousNode) {
                previousNode.classList.remove('wptb-directlyhovered');
            }

            while (actions.length != 0) {
                actions[0].parentNode.removeChild(actions[0]);
            }
        }

        if (actionType == 1) {

            var btnDelete = void 0,
                btnCopy = void 0;

            btnDelete = document.createElement('span'), btnCopy = document.createElement('span'), actions = document.createElement('div');

            actions.classList.add('wptb-actions');
            btnDelete.classList.add('dashicons', 'dashicons-trash', 'wptb-delete-action');
            btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'wptb-duplicate-action');

            actions.appendChild(btnCopy);
            actions.appendChild(btnDelete);

            body.appendChild(actions);

            actions.activeElem = thisNode;

            actions.type = 1;

            btnDelete.onclick = function (event) {
                var act = event.target.parentNode.activeElem,
                    el = act.parentNode;
                var infArr = act.className.match(/wptb-element-(.+)-(\d+)/i);
                //                if( act && infArr && Array.isArray( infArr ) ) {
                //                    WPTB_Helper.elementControlsStateDelete( act );
                //                    WPTB_Helper.externalCssStylesDelete( infArr[0] );
                //                }

                if (act) {
                    el.removeChild(act);
                }

                if (act && (typeof act === 'undefined' ? 'undefined' : _typeof(act)) === 'object' && act.hasOwnProperty('kind') && act.kind == 'text') {
                    var thisRow = el.parentNode;

                    if (WPTB_Helper.rowIsTop(thisRow)) {
                        var table = WPTB_Helper.findAncestor(thisRow, 'wptb-preview-table');

                        if (table.classList.contains('wptb-table-preview-head')) {
                            WPTB_Helper.dataTitleColumnSet(table);
                        }
                    }
                }

                var wptbActionsField = new WPTB_ActionsField();
                wptbActionsField.actionsRemove();

                var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();

                WPTB_Helper.wptbDocumentEventGenerate('element:removed:dom', document, act);
            };

            btnCopy.onclick = function (event) {
                var copy = void 0,
                    infArr = void 0,
                    type = void 0;
                var activeElement = event.target.parentNode.activeElem;
                var activeElemParent = activeElement.parentNode;
                infArr = activeElement.className.match(/wptb-element-(.+)-(\d+)/i);
                if (infArr && Array.isArray(infArr)) {
                    type = infArr[1];
                    var data = {};
                    data.kind = type;
                    data.elemProt = activeElement;
                    data.tinyMceClear = true;
                    copy = new WPTB_ElementObject(data);
                    //WPTB_Helper.elementControlsStateCopy( activeElement, copy.getDOMElement() );
                    //WPTB_Helper.externalCssStylesCopy( activeElement, copy.getDOMElement() );
                    //WPTB_Helper.elementStartScript( copy.getDOMElement() );

                    activeElemParent.insertBefore(copy.getDOMElement(), activeElement.nextSibling);
                } else {
                    copy = {};
                    var elementCopy = activeElement.cloneNode(true);
                    elementCopy.classList.remove('wptb-directlyhovered');

                    copy.getDOMElement = function () {
                        return elementCopy;
                    };

                    applyGenericItemSettings(copy);

                    activeElemParent.insertBefore(copy.getDOMElement(), activeElement.nextSibling);

                    WPTB_Helper.wptbDocumentEventGenerate('wptb-inner-element:copy', activeElement, copy.getDOMElement());
                }

                WPTB_innerElementSet(copy.getDOMElement());

                var wptbActionsField = new WPTB_ActionsField(1, activeElement);
                wptbActionsField.setParameters(activeElement);

                var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
            };

            if (thisNode.classList.contains('wptb-ph-element')) {
                var btnMove = void 0;
                btnMove = document.createElement('span');
                btnMove.classList.add("dashicons", "dashicons-move", 'wptb-move-action');
                btnMove.draggable = true;
                actions.appendChild(btnMove);

                btnMove.ondragstart = function (event) {
                    var wptbElementIconsDirectories = 'wptb-element-icons-directories';
                    var tmplIconsDirectories = wp.template(wptbElementIconsDirectories);
                    var data = {};
                    var jsonIconsDirectories = tmplIconsDirectories(data);
                    var IconsDirectories = JSON.parse(jsonIconsDirectories);

                    var dragImages = void 0,
                        actions = event.target.parentNode,
                        activeElem = actions.activeElem,
                        infArr = void 0,
                        type = void 0;
                    infArr = activeElem.className.match(/wptb-element-(.+)-(\d+)/i);
                    if (infArr && Array.isArray(infArr)) {
                        type = infArr[1];
                        activeElem.classList.add('wptb-moving-mode');

                        if (IconsDirectories && (typeof IconsDirectories === 'undefined' ? 'undefined' : _typeof(IconsDirectories)) === 'object' && IconsDirectories[type]) {
                            dragImages = WPTB_Helper.getElementIcon(IconsDirectories[type]);
                        }

                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setDragImage(dragImages, 0, 0);
                        event.dataTransfer.setData('node', 'wptb-element-' + infArr[1] + '-' + infArr[2]);
                        event.dataTransfer.setData('wptb-moving-mode', 'wptb-element-' + infArr[1] + '-' + infArr[2]);
                        event.dataTransfer.setData('wptbElIndic-' + infArr[1], 'wptbElIndic-' + infArr[1]);
                        var act = event.target.parentNode.activeElem;
                        if (act.kind == 'text') {
                            var thisRow = act.parentNode.parentNode;

                            if (WPTB_Helper.rowIsTop(thisRow)) {
                                var table = WPTB_Helper.findAncestor(thisRow, 'wptb-preview-table');

                                if (table.classList.contains('wptb-table-preview-head')) {
                                    WPTB_Helper.dataTitleColumnSet(table);
                                }
                            }
                        }
                    } else {
                        _this.style.display = 'none';
                    }

                    _this.actionsHide();
                };

                btnMove.ondragend = function (event) {
                    WPTB_Helper.elementDragEndClear();
                };
            }

            actions.style.display = 'flex';

            _this.wptbActions = actions;
        }

        WPTB_Helper.wptbDocumentEventGenerate('wptb:actionfield:generated', document);
    };

    this.setParameters = function (thisNode) {

        if (!_this.wptbActions) {
            var actions = document.getElementsByClassName('wptb-actions');
            if (actions.length > 0) {
                _this.wptbActions = actions[0];
            } else {
                _this.wptbActions = false;
            }
        }

        if (_this.wptbActions && _this.wptbActions.classList.contains('wptb-actions')) {
            _this.wptbActions.style.display = 'flex';
        } else {
            return;
        }

        var coordinatesElement = thisNode.getBoundingClientRect();

        var wptbContainer = document.getElementsByClassName('wptb-container')[0];
        var correctTop = function correctTop() {
            var coordinatesElement = thisNode.getBoundingClientRect();
            _this.wptbActions.style.top = parseFloat(coordinatesElement.top) - 15 + 'px';
        };
        wptbContainer.removeEventListener('scroll', correctTop, false);

        _this.wptbActions.style.top = parseFloat(coordinatesElement.top) - 15 + 'px';
        _this.wptbActions.style.left = parseFloat(coordinatesElement.right) - parseFloat(_this.wptbActions.clientWidth) + 1 + 'px';

        _this.wptbActions.style.display = 'flex';
        thisNode.classList.add('wptb-directlyhovered');

        wptbContainer.addEventListener('scroll', correctTop, false);
    };

    this.leaveFromField = function (event, node, actionType) {
        if (!_this.wptbActions) {
            var actions = document.getElementsByClassName('wptb-actions');
            if (actions.length > 0) {
                _this.wptbActions = actions[0];
            } else {
                _this.wptbActions = false;
            }
        }

        if (!_this.wptbActions) {
            return;
        }

        if (event.relatedTarget) {
            if (event.relatedTarget.classList.contains('wptb-actions') || event.relatedTarget.classList.contains('wptb-move-action') || event.relatedTarget.classList.contains('wptb-duplicate-action') || event.relatedTarget.classList.contains('wptb-delete-action') || event.relatedTarget.classList.contains('wptb-prebuilt-mark-action')) {
                if (!_this.wptbActions) {
                    _this.wptbActions = document.getElementsByClassName('wptb-actions')[0];
                }
                _this.wptbActions.onmouseleave = function (event) {
                    if (event.relatedTarget != null && (event.relatedTarget.classList.contains('wptb-ph-element') || WPTB_Helper.findAncestor(event.relatedTarget, 'wptb-ph-element')) && event.relatedTarget != _this.wptbActions.activeElem && WPTB_Helper.findAncestor(event.relatedTarget, 'wptb-directlyhovered') != _this.wptbActions.activeElem) {

                        //                        this.wptbActions.style.display = 'none';
                        //                        event.relatedTarget.parentNode.parentNode.classList.remove( 'wptb-directlyhovered' );
                        //
                        //                        let wptbActionsField = new WPTB_ActionsField();
                        //
                        //                        wptbActionsField.addActionField( 1, event.relatedTarget.parentNode.parentNode );
                        //
                        //                        wptbActionsField.setParameters( event.relatedTarget.parentNode.parentNode );
                    } else {}

                    var wptbActionsField = new WPTB_ActionsField();

                    wptbActionsField.leaveFromField(event, event.relatedTarget.parentNode.parentNode);

                    event.target.activeElem.classList.remove('wptb-directlyhovered');
                };

                return;
            }
        }

        node.classList.remove('wptb-directlyhovered');
        _this.wptbActions.style.display = 'none';

        if (event.relatedTarget) {
            if (event.relatedTarget.classList.contains('wptb-ph-element') || WPTB_Helper.findAncestor(event.relatedTarget, 'wptb-ph-element')) {
                _this.addActionField(1, event.relatedTarget.parentNode);

                _this.setParameters(event.relatedTarget.parentNode);
            }
        }
    };

    this.actionsRemove = function () {
        if (!_this.wptbActions) {
            var actions = document.getElementsByClassName('wptb-actions');
            if (actions.length > 0) {
                _this.wptbActions = actions[0];
            }
        }

        if (_this.wptbActions) {
            _this.wptbActions.parentNode.removeChild(_this.wptbActions);
        }
    };

    this.actionsHide = function () {
        if (!_this.wptbActions) {
            var actions = document.getElementsByClassName('wptb-actions');
            if (actions.length > 0) {
                _this.wptbActions = actions[0];
            }
        }

        if (_this.wptbActions) {
            _this.wptbActions.style.opacity = 0;
        }
    };
};
(function () {
    var WPTB_Builder = function WPTB_Builder() {
        var table_id = WPTB_Helper.detectMode();
        if (table_id) {
            var http = new XMLHttpRequest(),
                urlSet = ajaxurl + "?action=get_table" + '&id=' + table_id;
            http.open('GET', urlSet, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = function (d) {
                if (this.readyState == 4 && this.status == 200) {
                    var ans = JSON.parse(http.responseText);
                    document.getElementById('wptb-setup-name').value = ans[0];

                    if (ans[1]) {
                        // @deprecated old generate logic
                        // document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
                        var wptbTableSetupEl = document.getElementsByClassName('wptb-table-setup')[0];
                        wptbTableSetupEl.appendChild(WPTB_Parser(ans[1]));

                        var body = document.getElementsByTagName('body')[0];

                        WPTB_Table();
                        var element = document.querySelector('.wptb-preview-table');
                        if (element) {
                            var infArr = element.className.match(/wptb-element-((.+-)\d+)/i);
                            if (!infArr) {
                                element.classList.add('wptb-element-main-table_setting-' + table_id);
                            }

                            if (element.dataset.wptbTableContainerMaxWidth) {
                                wptbTableSetupEl.style.maxWidth = element.dataset.wptbTableContainerMaxWidth + 'px';

                                element.tdDefaultWidth();
                            }
                        }

                        //WPTB_LeftPanel();
                        WPTB_Settings();

                        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();
                    } else {
                        document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
                    }

                    return;
                }
            };
            http.send(null);
        } else {
            // @deprecated old generate logic
            // document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';

            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
        document.counter = new ElementCounters();
        document.select = new MultipleSelect();

        var initializer = WPTB_Initializer();
        settings = WPTB_Settings();
    };

    var url = window.location.href,
        regex = new RegExp('[?&]page=wptb-builder'),
        results = regex.exec(url);
    if (results) {
        document.addEventListener('DOMContentLoaded', WPTB_Builder);
    }
})();
var WPTB_Cell = function WPTB_Cell(callback, DOMElement) {

    function highlightRow(td) {
        var parentRow = td.parentNode,
            columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            tds = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
        for (var i = 0; i < tds.length; i++) {
            tds[i].classList.remove('wptb-highlighted-row-first', 'wptb-highlighted-row-last', 'wptb-highlighted-row-inner', 'wptb-highlighted-column-first', 'wptb-highlighted-column-last', 'wptb-highlighted-column-inner');
        }
        for (var i = 0; i < columnCount; i++) {

            var classToAdd = i == 0 ? 'wptb-highlighted-row-first' : i == columnCount - 1 ? 'wptb-highlighted-row-last' : 'wptb-highlighted-row-inner';
            var ttd = parentRow.getElementsByTagName('td')[i];
            if (ttd !== td) {
                ttd.classList.add(classToAdd);
            }
        }
    }

    function highlightColumn(td) {

        var index,
            parentRow = td.parentNode,
            columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            rowCount = parseInt(document.getElementById('wptb-rows-number').value),
            table = document.getElementsByClassName('wptb-preview-table')[0];
        for (var i = 0; i < columnCount; i++) {
            if (parentRow.getElementsByTagName('td')[i] === td) {
                index = i;
                break;
            }
        }

        for (var i = 0; i < rowCount; i++) {
            var classToAdd = i == 0 ? 'wptb-highlighted-column-first' : i == rowCount - 1 ? 'wptb-highlighted-column-last' : 'wptb-highlighted-column-inner';
            var tr = table.getElementsByTagName('tr')[i];
            if (tr.getElementsByTagName('td')[index] !== td) {
                tr.getElementsByTagName('td')[index].classList.add(classToAdd);
            }
        }
    }

    if (!DOMElement) {
        DOMElement = document.createElement("td");

        DOMElement.style.padding = jQuery('#wptb-table-padding-number').val() + 'px';

        var innerBorderWidth = jQuery('#wptb-table-inner-border-number').val();

        if (innerBorderWidth != '' && parseInt(innerBorderWidth) != 0) {
            DOMElement.style.border = innerBorderWidth + 'px solid ' + jQuery('#wptb-table-border-color').val();
        }

        DOMElement.classList.add('wptb-droppable', 'wptb-cell');
    }

    DOMElement.draggable = false;
    if (callback) {
        DOMElement.onclick = callback;
    }

    // Cell double click handler
    DOMElement.ondblclick = function (event) {
        event.stopPropagation();
        var wptbTableSetup = document.querySelector('.wptb-table-setup');
        if (wptbTableSetup && !wptbTableSetup.classList.contains('wptb-preview-table-manage-cells') && (event.target.dataset.yIndex !== '0' || wptbTableSetup.dataset.wptbSortableTable !== '1') && event.target == event.currentTarget) {
            WPTB_Helper.wptbDocumentEventGenerate('table:cell:dblclick', event.target);

            var element = WPTB_Helper.newElementProxy('text');
            element = element.getDOMElement();

            DOMElement.appendChild(element);

            WPTB_innerElementSet(element);
        }
    };

    WPTB_innerElementSet(DOMElement);

    WPTB_Helper.elementStartScript(DOMElement, 'table_cell_setting');

    var wptbPhElement = DOMElement.getElementsByClassName('wptb-ph-element');

    if (wptbPhElement.length > 0) {
        var _loop = function _loop(i) {
            wptbPhElement[i].getDOMElement = function () {
                return wptbPhElement[i];
            };

            WPTB_innerElementSet(wptbPhElement[i]);

            var wptbElementTypeClass = wptbPhElement[i].className.match(/wptb-element-((.+-)\d+)/i);
            if (wptbElementTypeClass && Array.isArray(wptbElementTypeClass)) {
                (function () {
                    var wptbTypeElementArr = wptbElementTypeClass[1].split('-');
                    wptbPhElement[i].kind = wptbTypeElementArr[0];
                    applyGenericItemSettings(wptbPhElement[i], wptbElementTypeClass[1]);
                    var wptbInternalActiveElement = wptbPhElement[i].getElementsByClassName('wptb-in-element');
                    if (wptbInternalActiveElement.length > 0) {
                        var _loop2 = function _loop2(j) {
                            var wptbInternalActiveElementObj = {};
                            wptbInternalActiveElementObj.getDOMElement = function () {
                                return wptbInternalActiveElement[j];
                            };

                            applyGenericItemSettings(wptbInternalActiveElementObj);
                        };

                        for (var j = 0; j < wptbInternalActiveElement.length; j++) {
                            _loop2(j);
                        }
                    }
                })();
            }
        };

        for (var i = 0; i < wptbPhElement.length; i++) {
            _loop(i);
        }
    }

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

    DOMElement.getCellDimensions = function () {

        var tdStyleObj = window.getComputedStyle(this, null);

        var tdPaddingLeft = tdStyleObj.getPropertyValue('padding-left');
        var tdPaddingRight = tdStyleObj.getPropertyValue('padding-right');

        var tdBorderLeftWidth = tdStyleObj.getPropertyValue('border-left-width');
        var tdBorderRightWidth = tdStyleObj.getPropertyValue('border-right-width');

        var tdPaddingTop = tdStyleObj.getPropertyValue('padding-top');
        var tdPaddingBottom = tdStyleObj.getPropertyValue('padding-bottom');

        var tdBorderTopWidth = tdStyleObj.getPropertyValue('border-top-width');
        var tdBorderBottomWidth = tdStyleObj.getPropertyValue('border-bottom-width');

        var width = parseInt(this.offsetWidth, 10) - parseInt(tdPaddingLeft, 10) - parseInt(tdPaddingRight, 10);

        var height = parseInt(this.offsetHeight, 10) - parseInt(tdPaddingTop, 10) - parseInt(tdPaddingBottom, 10);
        var table = WPTB_Helper.findAncestor(this, 'wptb-preview-table');
        if (table) {
            if (table.style.borderCollapse === 'collapse') {
                width = width - parseInt(tdBorderLeftWidth, 10) / 2 - parseInt(tdBorderRightWidth, 10) / 2;
                height = height - parseInt(tdBorderTopWidth, 10) / 2 - parseInt(tdBorderBottomWidth, 10) / 2;
                var tableFullStyleObj = window.getComputedStyle(table, null);
                var tableBorderLeft = tableFullStyleObj.getPropertyValue('border-left-width');
                var tableBorderRight = tableFullStyleObj.getPropertyValue('border-right-width');
                var tableBorderTop = tableFullStyleObj.getPropertyValue('border-top-width');
                var tableBorderBottom = tableFullStyleObj.getPropertyValue('border-bottom-width');

                var tr = this.parentNode;
                if (tr && tr.nodeName.toLowerCase() === 'tr') {
                    if (tr.firstChild && tr.firstChild.dataset.xIndex === this.dataset.xIndex) {
                        if (parseInt(tableBorderLeft, 10) > parseInt(tdBorderLeftWidth, 10)) {
                            width += -(parseInt(tableBorderLeft, 10) - parseInt(tdBorderLeftWidth, 10)) / 2;
                        }
                    }

                    if (tr.lastChild && tr.lastChild.dataset.xIndex === this.dataset.xIndex) {
                        if (parseInt(tableBorderRight, 10) > parseInt(tdBorderRightWidth, 10)) {
                            width += -(parseInt(tableBorderRight, 10) - parseInt(tdBorderRightWidth, 10)) / 2;
                        }
                    }

                    var body = tr.parentNode;
                    if (body && body.nodeName.toLowerCase() === 'body') {
                        if (body.firstChild && body.firstChild.firstChild.dataset.yIndex === this.dataset.yIndex) {
                            if (parseInt(tableBorderTop, 10) > parseInt(tdBorderTopWidth, 10)) {
                                height += (parseInt(tableBorderTop, 10) - parseInt(tdBorderTopWidth, 10)) / 2;
                            }
                        }

                        if (body.lastChild && body.lastChild.firstChild.dataset.yIndex === this.dataset.yIndex) {
                            if (parseInt(tableBorderBottom, 10) > parseInt(tdBorderBottomWidth, 10)) {
                                height += (parseInt(tableBorderBottom, 10) - parseInt(tdBorderBottomWidth, 10)) / 2;
                            }
                        }
                    }
                }
            } else if (table.style.borderCollapse === 'separate') {
                width = width - parseInt(tdBorderLeftWidth, 10) - parseInt(tdBorderRightWidth, 10);
                height = height - parseInt(tdBorderTopWidth, 10) - parseInt(tdBorderBottomWidth, 10);
            }
        }

        return {
            width: parseInt(width),
            height: parseInt(height)
        };
    };

    return this;
};
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_CutGlueTable = {
    cutTableHorizontally: function cutTableHorizontally(rowBefore, table) {
        if (table && table.rows[rowBefore]) {
            for (var i = 0; i < rowBefore; i++) {
                var tableRowsIChildren = table.rows[i].children;

                for (var j = 0; j < tableRowsIChildren.length; j++) {
                    if (tableRowsIChildren[j].rowSpan > 1 && tableRowsIChildren[j].rowSpan > rowBefore - i) {
                        var newTdRowspan = tableRowsIChildren[j].rowSpan - rowBefore + i;
                        tableRowsIChildren[j].rowSpan = rowBefore - i;
                        if (!tableRowsIChildren[j].dataset.sameCellBeforeDivision) {
                            tableRowsIChildren[j].dataset.sameCellBeforeDivision = 'r' + i + 'c' + j;
                        }

                        var td = void 0;
                        if (table.hasOwnProperty('wptbCell')) {
                            td = new table.wptbCell(table.mark);
                            td = td.getDOMElement();
                        } else {
                            td = document.createElement('td');
                        }

                        var tdTopStyle = tableRowsIChildren[j].getAttribute('style');
                        td.setAttribute('style', tdTopStyle);
                        td.colSpan = tableRowsIChildren[j].colSpan;
                        td.rowSpan = newTdRowspan;
                        td.dataset.sameCellBeforeDivision = tableRowsIChildren[j].dataset.sameCellBeforeDivision;

                        var dataXIndex = tableRowsIChildren[j].dataset.xIndex;
                        var dataXIndexNext = parseInt(dataXIndex) + parseInt(tableRowsIChildren[j].colSpan);
                        var beforeTd = void 0;
                        while (!beforeTd && dataXIndexNext < table.maxCols) {
                            beforeTd = table.rows[rowBefore].querySelector('[data-x-index="' + dataXIndexNext + '"]');
                            dataXIndexNext++;
                        }
                        table.rows[rowBefore].insertBefore(td, beforeTd);

                        WPTB_RecalculateIndexes(table);
                    }
                }
            }
        }
    },
    glueTableHorizontally: function glueTableHorizontally(table) {
        if (table) {
            var tds = [].concat(_toConsumableArray(table.getElementsByTagName('td')));
            for (var i = 0; i < tds.length; i++) {
                if (tds[i].hasAttribute('data-same-cell-before-division')) {
                    var dataSameCellBeforeDivision = tds[i].dataset.sameCellBeforeDivision;
                    var tdsSameBeforeDivision = table.querySelectorAll('[data-same-cell-before-division="' + dataSameCellBeforeDivision + '"]');
                    for (var j = 0; j < tdsSameBeforeDivision.length; j++) {
                        if (tdsSameBeforeDivision[j] && tdsSameBeforeDivision[j + 1]) {
                            if (tdsSameBeforeDivision[j].parentNode && tdsSameBeforeDivision[j + 1].parentNode && !tdsSameBeforeDivision[j].parentNode.classList.contains('wptb-row-moving') && !tdsSameBeforeDivision[j + 1].parentNode.classList.contains('wptb-row-moving')) {
                                if (tdsSameBeforeDivision[j + 1].dataset.yIndex == parseInt(tdsSameBeforeDivision[j].dataset.yIndex) + parseInt(tdsSameBeforeDivision[j].rowSpan)) {
                                    tdsSameBeforeDivision[j].rowSpan += tdsSameBeforeDivision[j + 1].rowSpan;

                                    var tdsSameBeforeDivisionJPlusChildren = [].concat(_toConsumableArray(tdsSameBeforeDivision[j + 1].children));

                                    for (var k = 0; k < tdsSameBeforeDivisionJPlusChildren.length; k++) {
                                        tdsSameBeforeDivision[j].appendChild(tdsSameBeforeDivisionJPlusChildren[k]);
                                    }

                                    var nextRow = tdsSameBeforeDivision[j + 1].parentNode;
                                    nextRow.removeChild(tdsSameBeforeDivision[j + 1]);
                                }
                            }
                        }
                    }
                }
            }

            WPTB_RecalculateIndexes(table);
        }
    },
    cutTableVertically: function cutTableVertically(col, table) {
        for (var i = 0; i < table.rows.length; i++) {
            if (col < table.maxCols) {
                if (col != 0 && !table.rows[i].querySelector('[data-x-index="' + col + '"]')) {
                    var rowChildren = table.rows[i].children;

                    var td = void 0,
                        rowChildrenLength = rowChildren.length,
                        afterTd = void 0,
                        rowSpanNewTd = void 0,
                        colSpanOld = void 0,
                        colSpanNewTd = void 0;
                    for (var j = 0; j < rowChildrenLength; j++) {
                        if (rowChildren[j].colSpan > 1 && parseInt(rowChildren[j].dataset.xIndex) < col && parseInt(rowChildren[j].dataset.xIndex) + parseInt(rowChildren[j].colSpan) > col) {
                            if (table.hasOwnProperty('wptbCell')) {
                                td = new table.wptbCell(table.mark);
                                td = td.getDOMElement();
                            } else {
                                td = document.createElement('td');
                            }

                            rowSpanNewTd = rowChildren[j].rowSpan;
                            colSpanOld = rowChildren[j].colSpan;
                            rowChildren[j].colSpan = col - rowChildren[j].dataset.xIndex;
                            colSpanNewTd = colSpanOld - rowChildren[j].colSpan;

                            if (!rowChildren[j].dataset.sameCellBeforeDivision) {
                                rowChildren[j].dataset.sameCellBeforeDivision = 'r' + i + 'c' + j;
                            }

                            var tdLeftStyle = rowChildren[j].getAttribute('style');
                            td.setAttribute('style', tdLeftStyle);

                            var tdAnalogThisX = table.querySelector('[data-x-index="' + col + '"]');
                            if (tdAnalogThisX) {
                                td.style.width = tdAnalogThisX.style.width;
                            }

                            var tdAnalogThisY = table.querySelector('[data-y-index="' + i + '"]');
                            if (tdAnalogThisY) {
                                td.style.height = tdAnalogThisY.style.height;
                            }
                            if (rowChildren[j + 1]) {
                                afterTd = rowChildren[j + 1];
                            } else {
                                afterTd = null;
                            }

                            table.rows[i].insertBefore(td, afterTd);
                            td.colSpan = colSpanNewTd;
                            td.rowSpan = rowSpanNewTd;
                            td.dataset.sameCellBeforeDivision = rowChildren[j].dataset.sameCellBeforeDivision;
                            i += rowSpanNewTd - 1;
                            break;
                        }
                    }
                }
            }
            WPTB_RecalculateIndexes(table);
        }
    },
    glueTableVertically: function glueTableVertically(table) {
        if (table) {
            var tds = [].concat(_toConsumableArray(table.getElementsByTagName('td')));
            for (var i = 0; i < tds.length; i++) {
                if (tds[i].hasAttribute('data-same-cell-before-division')) {
                    var dataSameCellBeforeDivision = tds[i].dataset.sameCellBeforeDivision;
                    var tdsSameBeforeDivision = [].concat(_toConsumableArray(table.querySelectorAll('[data-same-cell-before-division="' + dataSameCellBeforeDivision + '"]')));

                    var jFirstTdGlue = null;
                    for (var j = 0; j < tdsSameBeforeDivision.length; j++) {
                        if (tdsSameBeforeDivision[j] && tdsSameBeforeDivision[j + 1] && !tdsSameBeforeDivision[j].classList.contains('wptb-column-moving') && !tdsSameBeforeDivision[j + 1].classList.contains('wptb-column-moving')) {
                            if (tdsSameBeforeDivision[j + 1].dataset.xIndex == parseInt(tdsSameBeforeDivision[j].dataset.xIndex) + parseInt(tdsSameBeforeDivision[j].colSpan)) {
                                if (jFirstTdGlue == null) {
                                    jFirstTdGlue = j;
                                }
                                tdsSameBeforeDivision[jFirstTdGlue].colSpan += tdsSameBeforeDivision[j + 1].colSpan;

                                var tdsSameBeforeDivisionJPlusChildren = [].concat(_toConsumableArray(tdsSameBeforeDivision[j + 1].children));

                                for (var k = 0; k < tdsSameBeforeDivisionJPlusChildren.length; k++) {
                                    tdsSameBeforeDivision[jFirstTdGlue].appendChild(tdsSameBeforeDivisionJPlusChildren[k]);
                                }

                                var thisRow = tdsSameBeforeDivision[j + 1].parentNode;
                                thisRow.removeChild(tdsSameBeforeDivision[j + 1]);
                            }
                        }
                    }
                }
            }

            WPTB_RecalculateIndexes(table);
        }
    }
};
var WPTB_DropHandle = function WPTB_DropHandle(thisElem, e) {
    var hide = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


    var wptbDropHandle = void 0,
        wptbDropBorderMarker = void 0,
        wptbDropBorderMarkerTop = void 0,
        wptbDropBorderMarkerRight = void 0,
        wptbDropBorderMarkerBottom = void 0,
        wptbDropBorderMarkerLeft = void 0;

    /**
     * Add px suffix to a value
     *
     * @param {any} val value
     * @returns {string} string value suffixed with px
     */
    function toPx(val) {
        return val + 'px';
    }

    if (WPTB_Helper.getDragRelativeType() === 'td_relative') {
        var cellRelatedDropHandle = document.querySelector('.wptb-cell-related-drop-handle');
        if (hide && cellRelatedDropHandle) {
            cellRelatedDropHandle.style.display = 'none';
            return;
        }
        if (cellRelatedDropHandle === null) {
            var range = document.createRange();
            range.setStart(document.body, 0);

            var shadowRoot = range.createContextualFragment('<div class="wptb-cell-related-drop-handle">Add to cell</div>').children[0];

            document.body.appendChild(shadowRoot);
            cellRelatedDropHandle = shadowRoot.children[0];
        }

        var parentTd = WPTB_Helper.getParentOfType('td', thisElem);

        var _parentTd$getBounding = parentTd.getBoundingClientRect(),
            _top = _parentTd$getBounding.top,
            _left = _parentTd$getBounding.left,
            width = _parentTd$getBounding.width,
            _height = _parentTd$getBounding.height;

        if (!cellRelatedDropHandle) {
            return;
        }

        cellRelatedDropHandle.style.display = 'flex';
        cellRelatedDropHandle.style.top = toPx(_top);
        cellRelatedDropHandle.style.width = toPx(width);
        cellRelatedDropHandle.style.height = toPx(_height);
        cellRelatedDropHandle.style.left = toPx(_left);

        return;
    }

    if (document.getElementsByClassName('wptb-drop-handle').length == 0) {
        wptbDropHandle = document.createElement('div');
        wptbDropHandle.classList.add('wptb-drop-handle');

        wptbDropBorderMarker = document.createElement('div');
        wptbDropBorderMarker.classList.add('wptb-drop-border-marker');

        wptbDropBorderMarkerTop = document.createElement('div'), wptbDropBorderMarkerRight = document.createElement('div'), wptbDropBorderMarkerBottom = document.createElement('div'), wptbDropBorderMarkerLeft = document.createElement('div');

        wptbDropBorderMarkerTop.classList.add('wptb-drop-border-marker-top');
        wptbDropBorderMarkerRight.classList.add('wptb-drop-border-marker-right');
        wptbDropBorderMarkerBottom.classList.add('wptb-drop-border-marker-bottom');
        wptbDropBorderMarkerLeft.classList.add('wptb-drop-border-marker-left');

        wptbDropBorderMarker.appendChild(wptbDropBorderMarkerTop);
        wptbDropBorderMarker.appendChild(wptbDropBorderMarkerRight);
        wptbDropBorderMarker.appendChild(wptbDropBorderMarkerBottom);
        wptbDropBorderMarker.appendChild(wptbDropBorderMarkerLeft);

        var body = document.getElementsByTagName('body');
        if (body.length > 0) {
            body[0].appendChild(wptbDropHandle);
            body[0].appendChild(wptbDropBorderMarker);
        }

        wptbDropHandle.ondragenter = function () {
            if (e.target.classList.contains('wptb-empty')) {
                e.preventDefault();
                return false;
            }
        };

        wptbDropHandle.ondragover = function (e) {
            e.preventDefault();
        };

        wptbDropHandle.ondragleave = function () {};
        wptbDropHandle.ondrop = function (e) {
            e.preventDefault();
            var element = void 0;

            if (e.dataTransfer.getData('wptbElement')) {
                element = WPTB_Helper.newElementProxy(e.dataTransfer.getData('wptbElement'));
                element = element.getDOMElement();
            } else {
                element = document.getElementsByClassName(e.dataTransfer.getData('node'))[0];
                element.classList.remove('wptb-moving-mode');
                element.classList.remove('wptb-moving-into-same-elem');
                element.wptbMovingMode = 1;
            }

            var td = void 0;
            if (wptbDropHandle.dataset.text == 'Drop Here') {
                thisElem = wptbDropHandle.getDOMParentElement();
                if (thisElem.nodeName.toLowerCase() == 'td') {
                    td = wptbDropHandle.getDOMParentElement();
                    td.appendChild(element);
                    WPTB_Helper.wptbDocumentEventGenerate('element:mounted:dom', element);
                }
            } else {
                var innerElement = wptbDropHandle.getDOMParentElement();
                td = innerElement.parentNode;

                if (wptbDropHandle.dataset.text == 'Above Element') {
                    td.insertBefore(element, innerElement);
                    WPTB_Helper.wptbDocumentEventGenerate('element:mounted:dom', element);
                } else if (wptbDropHandle.dataset.text == 'Below Element') {
                    var innerElementNext = innerElement.nextSibling;
                    td.insertBefore(element, innerElementNext);
                    WPTB_Helper.wptbDocumentEventGenerate('element:mounted:dom', element);
                }
            }

            var thisRow = td.parentNode;
            if (WPTB_Helper.rowIsTop(thisRow)) {
                var table = WPTB_Helper.findAncestor(thisRow, 'wptb-preview-table');

                if (table.classList.contains('wptb-table-preview-head')) {
                    WPTB_Helper.dataTitleColumnSet(table);
                }
            }

            wptbDropHandle.style.display = 'none';
            wptbDropBorderMarker.style.display = 'none';

            WPTB_innerElementSet(element);
            if (!element.classList.contains('wptb-image-container') || element.wptbMovingMode == 1) {
                var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
                element.wptbMovingMode == undefined;
            }
        };
        var wptbContainer = document.querySelector('.wptb-container');
        wptbContainer.onscroll = function () {
            wptbDropHandle.style.display = 'none';
            wptbDropBorderMarker.style.display = 'none';
        };
    } else {
        wptbDropHandle = document.getElementsByClassName('wptb-drop-handle')[0];
        wptbDropBorderMarker = document.getElementsByClassName('wptb-drop-border-marker')[0];
    }
    if (thisElem && thisElem.nodeName.toLowerCase() == 'td' && thisElem.getElementsByClassName('wptb-ph-element').length != 0) {
        return;
    }

    if (thisElem && thisElem.nodeName.toLowerCase() == 'td' && thisElem.classList.contains('wptb-empty')) {
        return;
    }

    var thisRow = void 0;
    if (thisElem.localName == 'td') {
        thisRow = thisElem.parentNode;
    } else if (thisElem.localName == 'div' && thisElem.classList.contains('wptb-ph-element')) {
        thisRow = thisElem.parentNode.parentNode;
    }

    if (WPTB_Helper.rowIsTop(thisRow)) {
        var table = WPTB_Helper.findAncestor(thisRow, 'wptb-preview-table');

        if (table.classList.contains('wptb-table-preview-head')) {
            var indics = e.dataTransfer.types;
            var notDragEnter = false;
            for (var i = 0; i < indics.length; i++) {
                var infArr = indics[i].match(/wptbelindic-([a-z]+)/i);
                if (infArr && infArr[1] != 'text') {
                    notDragEnter = true;
                    break;
                }
            }
            if (notDragEnter) {
                return;
            }
        }
    }

    wptbDropHandle.style.width = thisElem.offsetWidth + 'px';
    var height = thisElem.offsetHeight,
        coordinatesElement = thisElem.getBoundingClientRect(),
        left = parseFloat(coordinatesElement.left),
        top = void 0;
    wptbDropHandle.style.left = left + 'px';

    if (e.dataTransfer.types.indexOf('wptb-moving-mode') != -1) {
        var elementDrag = document.getElementsByClassName('wptb-moving-mode')[0];
        if (thisElem == elementDrag) {
            wptbDropHandle.classList.add('wptb-moving-into-same-elem');
            wptbDropBorderMarker.classList.add('wptb-moving-into-same-elem');
        } else {
            wptbDropHandle.classList.remove('wptb-moving-into-same-elem');
            wptbDropBorderMarker.classList.remove('wptb-moving-into-same-elem');
        }
    }

    wptbDropHandle.getDOMParentElement = function () {
        return thisElem;
    };

    wptbDropHandle.style.display = 'block';
    wptbDropBorderMarker.style.display = 'block';
    if (thisElem.nodeName.toLowerCase() != 'td') {
        var y = e.offsetY == undefined ? e.layerY : e.offsetY;
        top = parseFloat(coordinatesElement.top) - parseFloat(11);
        wptbDropHandle.dataset.text = 'Above Element';
        if (y > height / 2) {
            top = parseFloat(coordinatesElement.top) + height - 1;
            wptbDropHandle.dataset.text = 'Below Element';
        }
    } else {
        wptbDropHandle.dataset.text = 'Drop Here';
        top = parseFloat(coordinatesElement.top) + height / 2 - 5;
    }
    wptbDropHandle.style.top = top + 'px';

    wptbDropBorderMarker.style.top = coordinatesElement.top + 'px';
    wptbDropBorderMarker.style.left = coordinatesElement.left + 'px';

    wptbDropBorderMarkerTop = wptbDropBorderMarker.querySelector('.wptb-drop-border-marker-top');
    wptbDropBorderMarkerTop.style.width = parseFloat(thisElem.offsetWidth) - parseFloat(1) + 'px';

    wptbDropBorderMarkerRight = wptbDropBorderMarker.querySelector('.wptb-drop-border-marker-right');
    wptbDropBorderMarkerRight.style.height = parseFloat(coordinatesElement.bottom) - parseFloat(coordinatesElement.top) - 1 + 'px';
    wptbDropBorderMarkerRight.style.left = wptbDropBorderMarkerTop.style.width;

    wptbDropBorderMarkerBottom = wptbDropBorderMarker.querySelector('.wptb-drop-border-marker-bottom');
    wptbDropBorderMarkerBottom.style.width = wptbDropBorderMarkerTop.style.width;
    wptbDropBorderMarkerBottom.style.top = wptbDropBorderMarkerRight.style.height;

    wptbDropBorderMarkerLeft = wptbDropBorderMarker.querySelector('.wptb-drop-border-marker-left');
    wptbDropBorderMarkerLeft.style.height = wptbDropBorderMarkerRight.style.height;
};
var ElementCounters = function ElementCounters() {

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
var WPTB_ElementObject = function WPTB_ElementObject(data) {
    var DOMElement = void 0,
        kindIndexProt = void 0,
        copy = void 0;
    if (!data.elemProt) {
        DOMElement = document.createElement('div'), kindIndexProt = undefined, copy = false;
        DOMElement.classList.add('wptb-' + data.kind + '-container', 'wptb-ph-element');

        var wpTemplateId = 'wptb-' + data.kind + '-content';
        var template = wp.template(wpTemplateId);
        data.node = DOMElement;
        var itemHtml = template(data);

        itemHtml = itemHtml.replace(/\r|\n|\t/g, '').trim();
        DOMElement.innerHTML = itemHtml;
    } else {
        DOMElement = data.elemProt.cloneNode(true);
        DOMElement.classList.remove('wptb-directlyhovered');
        var wptbElementMutch = data.elemProt.className.match(/wptb-element-((.+-)\d+)/i);
        if (wptbElementMutch && Array.isArray(wptbElementMutch)) {
            kindIndexProt = wptbElementMutch[1];
        };
        copy = true;

        if (data.tinyMceClear) {
            DOMElement = WPTB_Helper.elementClearFromTinyMce(DOMElement);
        }
    }

    var inElems = DOMElement.querySelectorAll('.wptb-in-element');
    if (inElems.length > 0) {
        var _loop = function _loop(i) {
            var inElemObj = {};
            inElemObj.getDOMElement = function () {
                return inElems[i];
            };

            applyGenericItemSettings(inElemObj);
        };

        for (var i = 0; i < inElems.length; i++) {
            _loop(i);
        }
    }

    window.addEventListener('item:onmouseenter', function (event) {
        //console.log( event );
    }, false);

    this.kind = data.kind;
    this.getDOMElement = function () {
        return DOMElement;
    };

    applyGenericItemSettings(this, kindIndexProt, copy);
    return this;
};
var WPTB_ElementOptions = function WPTB_ElementOptions(element, index, kindIndexProt) {

    var node = element.getDOMElement();
    node.addEventListener('click', function () {
        WPTB_Helper.elementOptionsSet(element.kind, this);
    }, { capture: true });
};
/**
 * WPTB_HeaderToolbox
 *
 * @param {string} wrapperQuery wrapper query for toolbox items
 * @return {object} header toolbox object
 * @constructor
 */
// eslint-disable-next-line camelcase,no-unused-vars
var WPTB_HeaderToolbox = function WPTB_HeaderToolbox(wrapperQuery) {
	var _this = this;

	this.wrapperQuery = wrapperQuery;
	this.element = document.querySelector(wrapperQuery);
	this.topMargin = 2;

	/**
  * Assign events to toolbox buttons
  */
	var assignButtons = function assignButtons() {
		var manageCellsButton = _this.element.querySelector('[data-button-type="table_settings_menu"]');

		if (manageCellsButton) {
			manageCellsButton.addEventListener('click', function () {
				WPTB_Helper.activateSection('manage_cells');
			});
		}
	};

	/**
  * Toggle visibility of toolbox with the given argument.
  *
  * @param {boolean} show show toolbox
  */
	var toggleToolboxVisibility = function toggleToolboxVisibility() {
		var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		var _element$getBoundingC = _this.element.getBoundingClientRect(),
		    height = _element$getBoundingC.height;

		if (show) {
			height = 0;
		}

		_this.element.style.top = 'calc( 100% - ' + (height + _this.topMargin) + 'px)';
	};

	/**
  * Initialize header toolbox.
  */
	var init = function init() {
		assignButtons();
		// bind toolbox to table generated event
		document.addEventListener('wptb:table:generated', function () {
			_this.element.style.display = 'unset';

			var _element$getBoundingC2 = _this.element.getBoundingClientRect(),
			    width = _element$getBoundingC2.width;

			_this.element.style.left = 'calc( 50% - ' + width / 2 + 'px)';

			// hide toolbox at manage cells and responsive menus
			document.addEventListener('wptbSectionChanged', function (_ref) {
				var detail = _ref.detail;

				toggleToolboxVisibility(detail !== 'manage_cells' && detail !== 'table_responsive_menu' && detail !== 'cell_settings');
			});
		});
	};

	return { init: init };
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_Helper = {
    hexToRgb: function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 'rgb(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ')' : null;
    },
    rgbToHex: function rgbToHex(rgb) {
        if (rgb) {
            if (WPTB_Helper.isHex(rgb)) return rgb;

            var rgbm = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?((?:[0-9]*[.])?[0-9]+)[\s+]?\)/i);
            if (rgbm && rgbm.length === 5) {
                return "#" + ('0' + Math.round(parseFloat(rgbm[4], 10) * 255).toString(16).toUpperCase()).slice(-2) + ("0" + parseInt(rgbm[1], 10).toString(16).toUpperCase()).slice(-2) + ("0" + parseInt(rgbm[2], 10).toString(16).toUpperCase()).slice(-2) + ("0" + parseInt(rgbm[3], 10).toString(16).toUpperCase()).slice(-2);
            } else {
                rgbm = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                if (rgbm && rgbm.length === 4) {
                    return "#" + ("0" + parseInt(rgbm[1], 10).toString(16).toUpperCase()).slice(-2) + ("0" + parseInt(rgbm[2], 10).toString(16).toUpperCase()).slice(-2) + ("0" + parseInt(rgbm[3], 10).toString(16).toUpperCase()).slice(-2);
                } else {
                    return '';
                }
            }
        } else {
            return '';
        }
    },
    isHex: function isHex(hex) {
        var regex = new RegExp('^#(?:[A-Fa-f0-9]{3}){1,2}$');
        return regex.test(hex);
    },
    getElementIcon: function getElementIcon(icon_directory) {
        var hostName = location.protocol + '//' + location.hostname;
        var img = document.createElement('img');
        img.src = icon_directory;
        return img;
    },
    elementDragEndClear: function elementDragEndClear() {
        var wptbMovingMode = document.getElementsByClassName('wptb-moving-mode');
        if (wptbMovingMode.length > 0) {
            for (var i = 0; i < wptbMovingMode.length; i++) {
                wptbMovingMode[i].classList.remove('wptb-moving-mode');
            }
        }

        var wptbDropHandles = document.getElementsByClassName('wptb-drop-handle');
        if (wptbDropHandles.length > 0) {
            for (var _i = 0; _i < wptbDropHandles.length; _i++) {
                wptbDropHandles[_i].style.display = 'none';
            }
        }

        var wptbDropBorderMarkers = document.getElementsByClassName('wptb-drop-border-marker');
        if (wptbDropBorderMarkers.length > 0) {
            for (var _i2 = 0; _i2 < wptbDropBorderMarkers.length; _i2++) {
                wptbDropBorderMarkers[_i2].style.display = 'none';
            }
        }
    },
    linkHttpCheckChange: function linkHttpCheckChange(link) {
        var convertToAbs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (link) {
            // even though it is not a best practice and a huge security risk, sometimes our users use javascript tag at href attributes, this check will make sure those tags will not be modified and returned as they are
            if (link.match(/^(javascript:)(.+)$/)) {
                return link;
            }
            // relative link checking
            // if link starts with '/', assume it is a relative link to the origin of the current site
            else if (link.match(/^\/([\S]+)$/)) {
                    if (convertToAbs) {
                        var currentLocation = document.location;
                        var origin = currentLocation.origin;

                        // strip out the '/' at the end of the origin name if there is any

                        if (origin.match(/^(.+)\/$/)) {
                            origin = origin.slice(-1);
                        }

                        return '' + origin + link;
                    } else {
                        return link;
                    }
                } else if (link.indexOf('http://') == -1 && link.indexOf('https://') == -1) {
                    var linkArr = link.split('/'),
                        linkClean = void 0;
                    if (Array.isArray(linkArr) && linkArr.length > 0) {
                        linkClean = linkArr[linkArr.length - 1];
                    }
                    return document.location.protocol + '//' + linkClean;
                } else {
                    return link;
                }
        } else {
            return '';
        }
    },
    dataTitleColumnSet: function dataTitleColumnSet(table) {
        // TODO dataTitleColumnSet
        // let rows = table.rows,
        //     rowHead = rows[0];
        // let computedStyleRowHead = getComputedStyle( rowHead );
        //
        // let rowHeadChildren = rowHead.children;
        // let contentsForHeader = {};
        // for( let i = 0; i < rowHeadChildren.length; i++ ) {
        //     let tdElements = rowHeadChildren[i].children;
        //
        //     for( let j = 0; j < tdElements.length; j++ ) {
        //         let element = tdElements[j];
        //         if( element.classList.contains( 'wptb-ph-element' ) ) {
        //             let infArr = element.className.match( /wptb-element-(.+)-(\d+)/i );
        //             if( infArr[1] == 'text' ) {
        //                 let p = element.querySelector( 'p' ),
        //                     textContent = p.textContent,
        //                     textAlign = p.style.textAlign;
        //                     contentsForHeader[rowHeadChildren[i].dataset.xIndex] = [textContent, element.style.fontSize,
        //                         element.style.color, computedStyleRowHead.backgroundColor, textAlign];
        //                 break;
        //             }
        //         }
        //     }
        //     if( ! contentsForHeader[rowHeadChildren[i].dataset.xIndex] ) {
        //         contentsForHeader[rowHeadChildren[i].dataset.xIndex] = ['', '',
        //                     '', computedStyleRowHead.backgroundColor, ''];
        //     }
        // }
        // for ( let i = 1; i < rows.length; i++ ) {
        //     let thisRow = rows[i],
        //         thisRowChildren = thisRow.children;
        //     for( let j = 0; j < thisRowChildren.length; j++ ) {
        //         if ( contentsForHeader[thisRowChildren[j].dataset.xIndex] ) {
        //             thisRowChildren[j].dataset.wptbTitleColumn = contentsForHeader[thisRowChildren[j].dataset.xIndex][0];
        //             thisRowChildren[j].dataset.wptbTitleColumnFontSize = contentsForHeader[thisRowChildren[j].dataset.xIndex][1];
        //             thisRowChildren[j].dataset.wptbTitleColumnColor = contentsForHeader[thisRowChildren[j].dataset.xIndex][2];
        //             thisRowChildren[j].dataset.wptbTitleBackgroundColor = contentsForHeader[thisRowChildren[j].dataset.xIndex][3];
        //             thisRowChildren[j].dataset.wptbTitleAlign = contentsForHeader[thisRowChildren[j].dataset.xIndex][4];
        //         } else {
        //             thisRowChildren[j].dataset.wptbTitleColumn = null;
        //             thisRowChildren[j].dataset.wptbTitleColumnFontSize = null;
        //             thisRowChildren[j].dataset.wptbTitleColumnColor = null;
        //             thisRowChildren[j].dataset.wptbTitleBackgroundColor = null;
        //             thisRowChildren[j].dataset.wptbTitleAlign = null;
        //         }
        //     }
        // }
    },
    findAncestor: function findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls)) {}
        return el;
    },
    rowIsTop: function rowIsTop(row) {
        var parent = row.parentNode;
        if (parent.children[0] == row) {
            return true;
        } else {
            return false;
        }
    },
    getSelectionText: function getSelectionText() {
        var txt = '';
        if (txt = window.getSelection) {
            txt = window.getSelection().toString();
        } else {
            txt = document.selection.createRange().text;
        }
        return txt;
    },
    elementOptionsPanelClear: function elementOptionsPanelClear() {
        var elementOptionsGroup = document.getElementById('element-options-group');
        if (elementOptionsGroup) {
            elementOptionsGroup.innerHTML = '';
        }
    },
    wpColorPickerCheckChangeForTableStateSaving: function wpColorPickerCheckChangeForTableStateSaving(event) {
        if (event.originalEvent.type == 'external') {
            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        } else {
            var wpPickerContainer = WPTB_Helper.findAncestor(event.target, 'wp-picker-container');
            if (wpPickerContainer) {
                if (event.originalEvent.type == 'square' || event.originalEvent.type == 'strip') {
                    var body = document.getElementsByTagName('body')[0];
                    body.removeEventListener('mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false);
                    body.addEventListener('mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false);
                }
            }
        }
    },
    irisStripMouseUpStateSaveManager: function irisStripMouseUpStateSaveManager() {
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();

        var body = document.getElementsByTagName('body')[0];
        body.removeEventListener('mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false);
    },
    wpColorPickerClear: function wpColorPickerClear(attribute, isId) {
        var input = void 0;
        if (isId) {
            input = [document.getElementById(attribute)];
            input.length = 1;
        } else {
            input = document.getElementsByClassName(attribute);
        }
        for (var i = 0; i < input.length; i++) {
            var wpPickerContainer = WPTB_Helper.findAncestor(input[i], 'wp-picker-container');
            if (wpPickerContainer) {
                var parent = wpPickerContainer.parentNode;
                parent.removeChild(wpPickerContainer);
                var newInput = document.createElement('input');
                if (isId) {
                    newInput.setAttribute('id', attribute);
                } else {
                    newInput.classList.add('wptb-element-property', attribute);
                }
                newInput.value = "";
                parent.appendChild(newInput);
            }
        }
    },
    detectMode: function detectMode() {
        var url = window.location.href,
            regex = new RegExp('[?&]table(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return false;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    getTableId: function getTableId() {
        var tableId = WPTB_Helper.detectMode();
        if (!tableId) {
            tableId = 'startedid-0';
        }

        return tableId;
    },

    getColumnWidth: function getColumnWidth(table, cell) {
        var xIndex = cell.dataset.xIndex;
        var xIndexes = table.querySelectorAll('[data-x-index="' + xIndex + '"]');
        var cellWidth = cell.getCellDimensions().width;
        for (var i = 0; i < xIndexes.length; i++) {
            if (cellWidth > xIndexes[i].getCellDimensions().width) {
                cellWidth = xIndexes[i].getCellDimensions().width;
            }
        }
        return cellWidth;
    },
    getRowHeight: function getRowHeight(table, cell) {
        var yIndex = cell.dataset.yIndex;
        var yIndexes = table.querySelectorAll('[data-y-index="' + yIndex + '"]');
        var cellHeight = cell.getCellDimensions().height;
        for (var i = 0; i < yIndexes.length; i++) {
            if (cellHeight > yIndexes[i].getCellDimensions().height) {
                cellHeight = yIndexes[i].getCellDimensions().height;
            }
        }
        return cellHeight;
    },
    newElementProxy: function newElementProxy(el) {
        if (el) {
            var data = { kind: el };
            return new WPTB_ElementObject(data);
        }
    },
    wpColorPickerChange: function wpColorPickerChange(event, ui) {
        var uiColor = void 0;
        if (ui) {
            uiColor = ui.color.toString();
        } else {
            uiColor = '';
        }

        var parent = WPTB_Helper.findAncestor(event.target, 'wp-picker-input-wrap').getElementsByClassName('wptb-color-picker')[0],
            classe = void 0,
            type = void 0,
            ps = void 0,
            number = void 0;
        classe = parent.dataset.element.match(/wptb-options-(.+)-(\d+)/i);
        type = classe[1];
        number = classe[2];
        var affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + number)[0];
        if (type == 'button') {
            if (parent.dataset.type == 'button-text-color') {
                affectedEl.getElementsByClassName('wptb-button')[0].style.color = uiColor;
            } else {
                affectedEl.getElementsByClassName('wptb-button')[0].style.backgroundColor = uiColor;
            }
        } else if (type == 'list') {
            var _ps = affectedEl.querySelectorAll('p');
            if (_ps.length > 0) {
                for (var i = 0; i < _ps.length; i++) {
                    _ps[i].style.color = uiColor;
                }
            }
        } else if (type == 'star_rating') {
            if (parent.dataset.type == 'star-color') {
                var ratingStar = affectedEl.querySelectorAll('li');
                for (var _i3 = 0; _i3 < ratingStar.length; _i3++) {
                    var span = ratingStar[_i3].getElementsByTagName('span');
                    for (var j = 0; j < span.length; j++) {
                        span[j].style.fill = uiColor;
                    }
                }
            } else if (parent.dataset.type == 'numeral-rating-color') {
                var wptbTextMessageSize = affectedEl.querySelector('.wptb-number-rating');
                wptbTextMessageSize.style.color = uiColor;
            }
        } else {
            affectedEl.style.color = uiColor;
        }
    },
    numberImputSize: function numberImputSize(wptbNumberInputs, maxCount, maxValue) {
        wptbNumberInputs.onkeydown = function () {
            var thisValue = this.value;
            thisValue = String(thisValue);
            if (thisValue[0] == 0) {
                this.value = "";
            } else {
                thisValue = thisValue.substring(0, maxCount);
                this.value = thisValue;
            }
        };
        wptbNumberInputs.onkeyup = function () {
            var thisValue = this.value;
            if (parseInt(thisValue, 10) > parseInt(maxValue, 10)) {
                this.value = maxValue;
            }

            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        };
    },
    ucfirst: function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    wptbDocumentEventGenerate: function wptbDocumentEventGenerate(eventName, element, details) {
        if (eventName && element) {
            if (!details) {
                details = true;
            }
            var event = new CustomEvent(eventName, { detail: details, bubbles: true });
            element.dispatchEvent(event);
        }
    },
    // run script for the pointed element
    elementStartScript: function elementStartScript(element, kind) {
        //let script = element.getElementsByTagName( 'script' );
        if (!kind) {
            var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
            if (infArr && Array.isArray(infArr)) {
                kind = infArr[1];
            }
        }

        if (kind) {
            //                let wpTemplateId = 'wptb-' + kind + '-script';
            //                let template = wp.template( wpTemplateId );
            //                let data  = {elemClass: infArr[0]};
            //                let elementScriptText = template( data );
            //                elementScriptText = elementScriptText.replace(/\r|\n|\t/g, '').trim();
            //
            //                let scriptNew = document.createElement( 'script' );
            //                scriptNew.setAttribute( 'type', 'text/javascript' );
            //                scriptNew.innerHTML = elementScriptText;
            //                element.parentNode.appendChild( scriptNew );

            //                element.parentNode.removeChild( scriptNew );
            if (kind in WPTB_ElementsScriptsLauncher) {
                WPTB_ElementsScriptsLauncher[kind](element);
            }
        }
    },
    // deletes event handlers from the pointed option element and from all his daughter elements
    deleteEventHandlers: function deleteEventHandlers(element) {
        if (element) {
            jQuery(element).off();
            var elementChildren = element.children;
            if (elementChildren) {
                for (var i = 0; i < elementChildren.length; i++) {
                    WPTB_Helper.deleteEventHandlers(elementChildren[i]);
                }
            }
        } else {
            return;
        }
    },
    // replace all occurrences in a string
    replaceAll: function replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    },
    // clears code from TinyMCE attributes
    elementClearFromTinyMce: function elementClearFromTinyMce(element) {
        var mceContentBodys = element.querySelectorAll('.mce-content-body');
        if (mceContentBodys.length > 0) {
            for (var k = 0; k < mceContentBodys.length; k++) {
                mceContentBodys[k].classList.remove('mce-content-body');
            }
        }

        var dataMceStyle = element.querySelectorAll('[data-mce-style]');
        if (dataMceStyle.length > 0) {
            for (var _k = 0; _k < dataMceStyle.length; _k++) {
                dataMceStyle[_k].removeAttribute('data-mce-style');
            }
        }

        var mceEditFocus = element.querySelectorAll('.mce-edit-focus');
        if (mceEditFocus.length > 0) {
            for (var _k2 = 0; _k2 < mceEditFocus.length; _k2++) {
                mceEditFocus[_k2].classList.remove('mce-edit-focus');
            }
        }

        var contentEditable = element.querySelectorAll('[contenteditable]');
        if (contentEditable.length > 0) {
            for (var _k3 = 0; _k3 < contentEditable.length; _k3++) {
                contentEditable[_k3].removeAttribute('contenteditable');
            }
        }

        var spellCheck = element.querySelectorAll('[spellcheck]');
        if (spellCheck.length > 0) {
            for (var _k4 = 0; _k4 < spellCheck.length; _k4++) {
                spellCheck[_k4].removeAttribute('spellcheck');
            }
        }

        var mceIds = element.querySelectorAll('[id^=mce_]');
        if (mceIds.length > 0) {
            for (var _k5 = 0; _k5 < mceIds.length; _k5++) {
                mceIds[_k5].removeAttribute('id');
            }
        }

        return element;
    },
    elementOptionContainerCustomClassSet: function elementOptionContainerCustomClassSet(targetInput, customClassForContainer) {
        if (targetInput && customClassForContainer) {
            var containerElement = WPTB_Helper.findAncestor(targetInput, 'wptb-element-option');
            if (containerElement) {
                containerElement.classList.add(customClassForContainer);
            }
        }
    },
    elementOptionContainerAdditionalStyles: function elementOptionContainerAdditionalStyles(targetInput, containerAdditionalStyles) {
        if (targetInput && containerAdditionalStyles) {
            var containerElement = WPTB_Helper.findAncestor(targetInput, 'wptb-element-option');
            var containerStylesArrOne = containerAdditionalStyles.split(';');

            if (containerElement && containerStylesArrOne) {
                var containerStylesSet = function containerStylesSet(containerStyleStr, containerElement) {
                    if (containerStyleStr) {
                        containerStyleStrArr = containerStyleStr.split(':');

                        if (containerStyleStrArr && Array.isArray(containerStyleStrArr)) {
                            containerElement.style[containerStyleStrArr[0]] = containerStyleStrArr[1];
                        }
                    }
                };

                if (containerStylesArrOne && Array.isArray(containerStylesArrOne)) {
                    for (var i = 0; i < containerStylesArrOne.length; i++) {
                        if (containerStylesArrOne[i]) {
                            containerStylesSet(containerStylesArrOne[i], containerElement);
                        }
                    }
                } else {
                    containerStylesSet(containerStylesArrOne, containerElement);
                }
            }
        }
    },
    // function which set handler for event of changes of control
    controlsInclude: function controlsInclude(element, functionHandler) {
        var acceptEventValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && typeof functionHandler === 'function') {
            element.addEventListener('element:controls:active', function () {
                if (!element.hasOwnProperty('controlConnectFunctionsName') || !Array.isArray(element.controlConnectFunctionsName) || element.controlConnectFunctionsName.indexOf(functionHandler.name) == -1) {
                    (function () {
                        var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i),
                            elementKind = void 0;

                        if (infArr && Array.isArray(infArr)) {
                            elementKind = infArr[1];
                        }

                        //                if( ! element.hasOwnProperty( 'сontrolsConnectIndic' ) || element.сontrolsConnectIndic !== true && elementKind  ) {
                        //                    let elementsSettingsTemplateJs = document.getElementsByClassName( 'wptb-element-datas' );
                        //                    if( elementsSettingsTemplateJs.length > 0 ) {
                        //                        elementsSettingsTemplateJs = elementsSettingsTemplateJs[0];
                        //
                        //                        let elementsSettings = elementsSettingsTemplateJs.innerHTML;
                        //                        let controlClassesNames = [];
                        //                        if( elementsSettings ) {
                        //                            elementsSettings = elementsSettings.trim();
                        //                            elementsSettings = JSON.parse( elementsSettings );
                        //                            if( elementsSettings && typeof elementsSettings === 'object' ) {
                        //                                if( 'tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2] in elementsSettings ) {
                        //                                    let elementSettings = elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]];
                        //                                    if( elementSettings && typeof elementSettings === 'object' ) {
                        //                                        Object.keys( elementSettings ).forEach( function( key ) {
                        //                                            let regularText = new RegExp( 'data-wptb-el-' + elementKind + '-(\\d+)-([a-zA-Z0-9_-]+)', "i" );
                        //                                            let keyInfArr = key.match( regularText );
                        //                                            if( keyInfArr && Array.isArray( keyInfArr ) ) {
                        //                                                let controlClass = key.replace( 'data-', '' );
                        //                                                controlClassesNames.push( [controlClass, keyInfArr[2]] );
                        //                                            }
                        //                                        });
                        //                                    }
                        //                                }
                        //                            }
                        //                        }
                        //                    }
                        //                }
                        if (elementKind) {
                            var elementOptionsGroupIds = element.optionsGroupIds;
                            if (elementOptionsGroupIds && Array.isArray(elementOptionsGroupIds)) {
                                for (var i = 0; i < elementOptionsGroupIds.length; i++) {
                                    var _elementOptionsGroupId = elementOptionsGroupIds[i];

                                    var elementOptionsGroup = document.getElementById(_elementOptionsGroupId);

                                    var controlActiveElements = elementOptionsGroup.querySelectorAll('.wptb-element-property');
                                    controlActiveElements = [].concat(_toConsumableArray(controlActiveElements));

                                    controlActiveElements.map(function (controlActiveElement) {
                                        var regularText = new RegExp('wptb-el-' + elementKind + '-(\\d+)-([a-zA-Z0-9_-]+)', "i");
                                        var controlInfArr = controlActiveElement.className.match(regularText);
                                        if (controlInfArr && Array.isArray(controlInfArr)) {
                                            var controlUnicClassName = controlInfArr[0];

                                            element.addEventListener('wptb-control:' + controlUnicClassName, function (e) {
                                                var controls = {};
                                                var controlName = controlInfArr[2];
                                                var control = document.getElementsByClassName(controlUnicClassName);
                                                if (control.length > 0 && controlName) {
                                                    var targetControlValue = WPTB_Helper.targetControlValueGet(control);

                                                    if (acceptEventValues) {
                                                        controls[controlName] = {
                                                            targetValue: targetControlValue,
                                                            eventValue: e.detail.value
                                                        };
                                                    } else {
                                                        controls[controlName] = targetControlValue;
                                                    }
                                                }
                                                functionHandler(controls, element);
                                            }, false);
                                        }
                                    });
                                }
                            }
                            //let elementOptionsContainer = document.querySelector( '.wptb-element-options.wptb-options-' + infArr[1] + '-' + infArr[2] );

                            // from time to time depend on table cells hierarchy, cell td items may catch mouse clicks which are intended for elements. since the active section is not cell management, this will gives and unharmfull error of not found element, simple check for null equality will be sufficient for now.
                            // if(!elementOptionsContainer){
                            //     return;
                            // }

                            // let elementOptions = elementOptionsContainer.querySelectorAll( '.wptb-element-option' );
                            // let controlActiveElements = elementOptions[i].querySelector( '.wptb-element-property' );
                            //
                            //
                            // for( let i = 0; i < elementOptions.length; i++ ) {
                            //     let controlActiveElement = elementOptions[i].querySelector( '.wptb-element-property' );
                            //     if( controlActiveElement ) {
                            //
                            //     }
                            // }

                            if (!element.controlConnectFunctionsName && !Array.isArray(element.controlConnectFunctionsName)) {
                                element.controlConnectFunctionsName = [];
                            }

                            element.controlConnectFunctionsName.push(functionHandler.name);
                        }
                    })();
                }
            }, false);
        }
    },
    oneControlInclude: function oneControlInclude(element, functionHandler, controlName) {
        if (element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && typeof functionHandler === 'function' && typeof controlName === 'string') {
            var infArr = element.className.match(/wptb-element-((.+-)\d+)/i),
                elementKind = void 0;

            if (infArr && Array.isArray(infArr)) {
                elementKind = infArr[1].split('-')[0];

                var wptbContrlStacksConfigId = 'wptb-' + elementKind + '-control-stack';
                var tmplControlsConfig = wp.template(wptbContrlStacksConfigId);
                var data = {
                    container: '.' + infArr[0]
                };
                var jsonControlsConfigJson = tmplControlsConfig(data);
                var jsonControlsConfig = JSON.parse(jsonControlsConfigJson);

                if (jsonControlsConfig && (typeof jsonControlsConfig === 'undefined' ? 'undefined' : _typeof(jsonControlsConfig)) === 'object' && jsonControlsConfig.hasOwnProperty(controlName)) {
                    var controlClassName = 'wptb-el-' + infArr[1] + '-' + controlName;

                    element.addEventListener('wptb-control:' + controlClassName, function (event) {
                        var control = document.getElementsByClassName(controlClassName);
                        if (control.length > 0) {
                            var targetControlValue = WPTB_Helper.targetControlValueGet(control);

                            functionHandler(targetControlValue, element);
                        }
                    }, false);
                }
            }
        } else {
            return false;
        }
    },
    //
    innerElementCopyIncludeHandler: function innerElementCopyIncludeHandler(element, functionHandler) {
        if (element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && typeof functionHandler === 'function') {
            element.addEventListener('wptb-inner-element:copy', function (event) {
                var innerElement = event.detail;
                if (innerElement) {
                    WPTB_Helper.elementClearFromTinyMce(innerElement);
                    functionHandler(innerElement, element);
                }
            }, false);
        }
    },
    /**
     * Sets the control elements when changing which to will restart this control
     * @param {array} dependOnControlName
     * @param {string} targetControlElementClass
     * @param {array} valueDependOnControlCorrect
     * @param {string} kind
     * @param {HTMLElement} element
     */
    valueDependOnControl: function valueDependOnControl(dependOnControlName, targetControlElementClass, valueDependOnControlCorrect, kind, element) {
        function dependOnControlDataGet(dependOnControlName, targetControlElementClass, valueDependOnControlCorrect) {
            if (typeof dependOnControlName === 'string') {
                dependOnControlName = [dependOnControlName];
            }
            var infArr = targetControlElementClass.match(/wptb-el-((.+-)\d+)-(.+)/i);
            var valueDependOnControl = {};
            var dependOnControlElementsArr = [];
            if (infArr && Array.isArray(infArr)) {
                var controlName = infArr[3];
                var dependOnControlElements = void 0;
                var valueDependOnControlCorrectObj = {};
                if (Array.isArray(valueDependOnControlCorrect)) {
                    if (Array.isArray(valueDependOnControlCorrect[0])) {
                        valueDependOnControlCorrect.map(function (s) {
                            valueDependOnControlCorrectObj[s[0]] = [s[1], s[2]];
                        });
                    } else {
                        valueDependOnControlCorrectObj[valueDependOnControlCorrect[0]] = [valueDependOnControlCorrect[1], valueDependOnControlCorrect[2]];
                    }
                }
                dependOnControlName.map(function (s) {
                    var dependOnControlElementClass = targetControlElementClass.replace(controlName, s);
                    if (dependOnControlElementClass) {
                        dependOnControlElements = document.getElementsByClassName(dependOnControlElementClass);
                        if (dependOnControlElements.length > 0 && dependOnControlElements[0].type) {
                            valueDependOnControl[s] = dependOnControlElements[0].value;
                            if (s in valueDependOnControlCorrectObj) {
                                if (valueDependOnControlCorrectObj[s][1] === 'integer') {
                                    valueDependOnControl[s] = parseInt(valueDependOnControl[s]) + parseInt(valueDependOnControlCorrectObj[s][0]);
                                } else if (valueDependOnControlCorrectObj[s][1] === 'string') {
                                    valueDependOnControl[s] = valueDependOnControl[s] + valueDependOnControlCorrectObj[s][0];
                                }
                            }
                            dependOnControlElementsArr.push(dependOnControlElements[0]);
                        }
                    }
                });
            }

            return [valueDependOnControl, dependOnControlElementsArr];
        }

        var dependOnControlData = dependOnControlDataGet(dependOnControlName, targetControlElementClass, valueDependOnControlCorrect);
        WPTB_Helper.elementOptionsSet(kind, element, dependOnControlData[0], targetControlElementClass);

        Object.keys(dependOnControlData[0]).forEach(function (key) {
            var infArr = element.className.match(/wptb-element-((.+-)\d+)/i);
            var unicClass = 'wptb-el-' + infArr[1] + '-' + [key];
            element.addEventListener('wptb-control:' + unicClass, function (event) {
                var dependOnControlData = dependOnControlDataGet(dependOnControlName, targetControlElementClass, valueDependOnControlCorrect);
                WPTB_Helper.elementOptionsSet(kind, element, dependOnControlData[0], targetControlElementClass);
            }, false);
        });
    },
    /**
     * Sets the visibility of one control to depend on the state of other controls
     * @param dependOnMain
     * @param targetControlElementClass
     */
    appearDependOnControl: function appearDependOnControl(dependOnMain, targetControlElementClass) {
        if (Array.isArray(dependOnMain)) {
            var dependOnControlElementChangeHandler = function dependOnControlElementChangeHandler(controlContainerElem, dependOnControlElementsValue, k) {
                var dependOn = dependOnControlElementsValue[k][2];
                var dependOnControlElements = dependOnControlElementsValue[k][1];
                dependOnControlElementsValue[dependOn[0]] = [dependOnControlElementValue(dependOnControlElements, dependOn), dependOnControlElements, dependOn];
                showHideTargetControlElement(controlContainerElem, dependOnControlElementsValue);
            };

            var showHideTargetControlElement = function showHideTargetControlElement(controlContainerElem, dependOnControlElementsValue) {
                var display = 'block';
                Object.keys(dependOnControlElementsValue).map(function (k) {
                    if (Object.prototype.hasOwnProperty.call(dependOnControlElementsValue, k)) {
                        if (dependOnControlElementsValue[k][0] === false) {
                            display = 'none';
                        }
                    }
                });

                controlContainerElem.style.display = display;
            };

            var dependOnControlElementValue = function dependOnControlElementValue(dependOnControlElements, dependOn) {
                var targetControlValue = WPTB_Helper.targetControlValueGet(dependOnControlElements);

                if (dependOn[1] && Array.isArray(dependOn[1]) && dependOn[1].indexOf(targetControlValue) !== -1) {
                    return true;
                    // let childCheck = controlContainerElem.querySelector('input[type="checkbox"]')
                    // if (childCheck) {
                    //     childCheck.checked = true;
                    // }
                } else if (dependOn[2] && Array.isArray(dependOn[2]) && dependOn[2].indexOf(targetControlValue) !== -1) {
                    return false;
                }
            };

            if (typeof dependOnMain[0] === 'string') {
                dependOnMain = [dependOnMain];
            } else if (!Array.isArray(dependOnMain[0])) {
                return;
            }
            var dependOnControlElementsValue = {};
            for (var i = 0; i < dependOnMain.length; i++) {
                var dependOn = dependOnMain[i];
                var dependOnControlName = dependOn[0];
                var infArr = targetControlElementClass.match(/wptb-el-((.+-)\d+)-(.+)/i);

                if (infArr && Array.isArray(infArr)) {
                    var controlName = infArr[3];

                    var dependOnControlElementClass = targetControlElementClass.replace(controlName, dependOnControlName);
                    if (dependOnControlElementClass) {
                        var dependOnControlElements = document.getElementsByClassName(dependOnControlElementClass);
                        if (dependOnControlElements.length > 0) {
                            dependOnControlElementsValue[dependOn[0]] = [dependOnControlElementValue(dependOnControlElements, dependOn), dependOnControlElements, dependOn];
                        }
                    }
                }
            }

            var targetControlElement = document.getElementsByClassName(targetControlElementClass);
            if (targetControlElement.length > 0) {
                targetControlElement = targetControlElement[0];
                var controlContainerElem = WPTB_Helper.findAncestor(targetControlElement, 'wptb-element-option');

                if (controlContainerElem) {
                    showHideTargetControlElement(controlContainerElem, dependOnControlElementsValue);

                    Object.keys(dependOnControlElementsValue).map(function (k) {
                        if (Object.prototype.hasOwnProperty.call(dependOnControlElementsValue, k)) {
                            var _dependOnControlElements = dependOnControlElementsValue[k][1];
                            var dependOnControlElement = _dependOnControlElements[0];
                            dependOnControlElement.addEventListener('change', dependOnControlElementChangeHandler.bind(null, controlContainerElem, dependOnControlElementsValue, k), false);
                        }
                    });
                }
            }
        }
    },
    //
    controlsStateManager: function controlsStateManager(targetControlClass, controlChangeIndic) {
        var targetControls = document.getElementsByClassName(targetControlClass);
        if (targetControls.length > 0) {
            //targetControls = targetControls[0];

            var infArr = targetControlClass.match(/wptb-el-((.+-)\d+)-(.+)/i);

            if (infArr && Array.isArray(infArr)) {
                var selectorElement = void 0;
                selectorElement = document.querySelector('.wptb-element-' + infArr[1]);

                if (selectorElement) {
                    var elementsSettingsTemplatesJs = void 0;
                    var elementSettings = {};
                    var elementsSettings = void 0;
                    elementsSettingsTemplatesJs = document.getElementsByClassName('wptb-element-datas');
                    if (elementsSettingsTemplatesJs.length == 0 || elementsSettingsTemplatesJs[0].innerHTML == '') {
                        var targetControlValue = WPTB_Helper.targetControlValueGet(targetControls);
                        elementSettings['data-' + targetControlClass] = targetControlValue;

                        elementsSettings = {};
                        elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] = elementSettings;
                        elementsSettings = JSON.stringify(elementsSettings);

                        if (elementsSettingsTemplatesJs.length == 0) {
                            elementsSettingsTemplatesJs = document.createElement('script');
                            elementsSettingsTemplatesJs.setAttribute('type', 'text/html');
                            elementsSettingsTemplatesJs.setAttribute('class', 'wptb-element-datas');
                        } else {
                            elementsSettingsTemplatesJs = elementsSettingsTemplatesJs[0];
                        }

                        elementsSettingsTemplatesJs.innerHTML = elementsSettings;

                        var body = document.getElementsByTagName('body')[0];
                        body.appendChild(elementsSettingsTemplatesJs);
                    } else {
                        elementsSettingsTemplatesJs = elementsSettingsTemplatesJs[0];
                        elementsSettings = elementsSettingsTemplatesJs.innerHTML;
                        if (elementsSettings) {
                            elementsSettings = elementsSettings.trim();
                            elementsSettings = JSON.parse(elementsSettings);

                            if (elementsSettings && (typeof elementsSettings === 'undefined' ? 'undefined' : _typeof(elementsSettings)) === 'object') {

                                if (controlChangeIndic) {
                                    var _targetControlValue = WPTB_Helper.targetControlValueGet(targetControls);
                                    if (!('tmpl-wptb-el-datas-' + infArr[1] in elementsSettings) || _typeof(elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]) !== 'object') {
                                        elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] = {};
                                    }
                                    elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]['data-' + targetControlClass] = _targetControlValue;
                                    elementsSettingsTemplatesJs.innerHTML = JSON.stringify(elementsSettings);
                                } else if (!('tmpl-wptb-el-datas-' + infArr[1] in elementsSettings && _typeof(elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]) === 'object' && 'data-' + targetControlClass in elementsSettings['tmpl-wptb-el-datas-' + infArr[1]])) {
                                    var _targetControlValue2 = WPTB_Helper.targetControlValueGet(targetControls);
                                    if (!('tmpl-wptb-el-datas-' + infArr[1] in elementsSettings) || _typeof(elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]) !== 'object') {
                                        elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] = {};
                                    }
                                    elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]['data-' + targetControlClass] = _targetControlValue2;
                                    elementsSettingsTemplatesJs.innerHTML = JSON.stringify(elementsSettings);
                                } else if ('tmpl-wptb-el-datas-' + infArr[1] in elementsSettings && _typeof(elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]) === 'object' && 'data-' + targetControlClass in elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]) {
                                    for (var i = 0; i < targetControls.length; i++) {
                                        if (targetControls[i].type == 'checkbox') {
                                            var _targetControlValue3 = void 0;
                                            if (targetControls[i].name) {
                                                _targetControlValue3 = elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]['data-' + targetControlClass][targetControls[i].name];
                                            } else {
                                                _targetControlValue3 = elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]['data-' + targetControlClass];
                                            }

                                            if (_targetControlValue3 == 'checked') {
                                                targetControls[i].checked = true;
                                            } else if (_targetControlValue3 == 'unchecked') {
                                                targetControls[i].checked = false;
                                            }
                                        } else {
                                            targetControls[i].value = elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]['data-' + targetControlClass];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    //
    targetControlValueGet: function targetControlValueGet(targetControls) {
        var targetControlValue = void 0;
        for (var i = 0; i < targetControls.length; i++) {
            if (targetControls[i].type == 'checkbox' && targetControls[i].name) {
                if (!targetControlValue) targetControlValue = {};
                if (targetControls[i].checked == true) {
                    targetControlValue[targetControls[i].name] = 'checked';
                } else {
                    targetControlValue[targetControls[i].name] = 'unchecked';
                }
            } else if (targetControls[i].type == 'checkbox') {
                if (targetControls[i].checked == true) {
                    targetControlValue = 'checked';
                } else {
                    targetControlValue = 'unchecked';
                }
            } else if (targetControls[i].type) {
                targetControlValue = targetControls[i].value;
            } else if (targetControls[i].dataset.alignmentValue && targetControls[i].classList.contains('selected')) {
                targetControlValue = targetControls[i].dataset.alignmentValue;
            }
        }
        return targetControlValue;
    },
    //
    elementControlsStateCopy: function elementControlsStateCopy(elementProt, copyElem) {
        if (elementProt && copyElem) {
            var infArrProt = elementProt.className.match(/wptb-element-((.+-)\d+)/i);
            var infArrCopy = copyElem.className.match(/wptb-element-((.+-)\d+)/i);
            if (infArrProt && Array.isArray(infArrProt) && infArrCopy && Array.isArray(infArrCopy)) {
                var elemProtKind = infArrProt[1];
                var elemCopyKind = infArrCopy[1];
                var elementsSettingsTemplateJs = document.getElementsByClassName('wptb-element-datas');
                if (elementsSettingsTemplateJs.length > 0) {
                    elementsSettingsTemplateJs = elementsSettingsTemplateJs[0];

                    var elementsSettings = elementsSettingsTemplateJs.innerHTML;
                    if (elementsSettings) {
                        elementsSettings = elementsSettings.trim();
                        elementsSettings = JSON.parse(elementsSettings);

                        if (elementsSettings && (typeof elementsSettings === 'undefined' ? 'undefined' : _typeof(elementsSettings)) === 'object') {
                            var elementSettingsProt = elementsSettings['tmpl-wptb-el-datas-' + elemProtKind];
                            if (elementSettingsProt && (typeof elementSettingsProt === 'undefined' ? 'undefined' : _typeof(elementSettingsProt)) === 'object') {
                                var elementSettingsCopy = {};

                                Object.keys(elementSettingsProt).forEach(function (key) {
                                    var elementSettingValue = elementSettingsProt[key];
                                    var elementSettingKeyCopy = key.replace(elemProtKind, elemCopyKind);
                                    elementSettingsCopy[elementSettingKeyCopy] = elementSettingValue;
                                });

                                if (Object.keys(elementSettingsCopy).length > 0) {
                                    elementsSettings['tmpl-wptb-el-datas-' + elemCopyKind] = elementSettingsCopy;

                                    elementsSettings = JSON.stringify(elementsSettings);
                                    elementsSettingsTemplateJs.innerHTML = elementsSettings;
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    //
    elementControlsStateDelete: function elementControlsStateDelete(element, nameControl) {
        var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
        var body = document.getElementsByTagName('body')[0];
        var wptbElementDatas = body.getElementsByClassName('wptb-element-datas');
        if (infArr && Array.isArray(infArr) && wptbElementDatas.length > 0) {
            wptbElementDatas = wptbElementDatas[0];
            var elementsSettings = wptbElementDatas.innerHTML;
            if (elementsSettings) {
                elementsSettings = elementsSettings.trim();
                elementsSettings = JSON.parse(elementsSettings);
                if (elementsSettings && (typeof elementsSettings === 'undefined' ? 'undefined' : _typeof(elementsSettings)) === 'object' && 'tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2] in elementsSettings) {
                    if (!nameControl) {
                        delete elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]];
                    } else {
                        if (elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]] && _typeof(elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]]) === 'object' && 'data-wptb-el-' + infArr[1] + '-' + infArr[2] + '-' + nameControl in elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]]) {
                            delete elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]]['data-wptb-el-' + infArr[1] + '-' + infArr[2] + '-' + nameControl];
                        }
                    }

                    if (Object.keys(elementsSettings).length == 0) {
                        body.removeChild(wptbElementDatas);
                    } else {
                        elementsSettings = JSON.stringify(elementsSettings);
                        wptbElementDatas.innerHTML = elementsSettings;
                    }
                }
            }
        }
    },
    //
    elementOptionsSet: function elementOptionsSet(kind, element, valueDependOnControl, targetControlElementClass) {
        // get controls config for this element
        var wptbContrlStacksConfigId = 'wptb-' + kind + '-control-stack';
        var tmplControlsConfig = wp.template(wptbContrlStacksConfigId);
        var data = void 0;
        var elementContainerClass = void 0;
        var elementOptionClassIndic = void 0;
        var elementOptionsGroup = void 0;

        var controlElementParent = void 0;
        var elementOptionsScriptsContainer = void 0;

        var infArr = element.className.match(/wptb-element-((.+-)\d+)/i);
        if (!infArr) {
            var table_id = WPTB_Helper.detectMode();
            if (!table_id) {
                table_id = 'startedid-0';
            }
            if (element.classList.contains('wptb-preview-table')) {
                element.classList.add('wptb-element-main-table_setting-' + table_id);
            } else if (element.classList.contains('wptb-cell')) {
                var cellEditActiveClass = document.querySelector('.wptb-element-table_cell_setting-' + element.dataset.xIndex + '-' + element.dataset.yIndex);
                if (!cellEditActiveClass) element.classList.add('wptb-element-table_cell_setting-' + element.dataset.xIndex + '-' + element.dataset.yIndex);
            } else if (element.classList.contains('wptb-responsive')) {
                // if table id parsed from url is starting with 'wptb-team', it means it is team built prebuilt table with a unique id that doesn't fit infArr match regex, in that case, use default id for elements options
                if (table_id.startsWith('wptb_team')) {
                    table_id = 'startedid-0';
                }
                element.classList.add('wptb-element-table_responsive_setting-' + table_id);
            }

            infArr = element.className.match(/wptb-element-((.+-)\d+)/i);
        }

        data = {
            container: '.' + infArr[0]
        };
        var controlName = void 0;
        data.valueDependOnControl = {};
        if (valueDependOnControl) {
            Object.keys(valueDependOnControl).forEach(function (key) {
                data.valueDependOnControl[key] = valueDependOnControl[key];
            });
        }
        if (targetControlElementClass) {
            var _infArr = targetControlElementClass.match(/wptb-el-((.+-)\d+)-(.+)/i);

            if (_infArr && Array.isArray(_infArr)) {
                controlName = _infArr[3];
            }
        }

        elementContainerClass = infArr[0];
        elementOptionClassIndic = infArr[1];

        if (element.classList.contains('wptb-preview-table')) {} else if (element.classList.contains('wptb-cell')) {
            this.activateSection('cell_settings');
        } else if (element.classList.contains('wptb-responsive')) {
            elementOptionsGroupId = 'table-responsive-group';
            wptbelementOptionClass = 'wptb-element-option';
        } else {
            var children = document.getElementById('element-options-group').childNodes;
            for (var _i4 = 0; _i4 < children.length; _i4++) {
                if (children[_i4].style) children[_i4].style.display = 'none';
            }
            this.activateSection('options_group');
        }

        var controlsConfigJson = tmplControlsConfig(data);
        var controlsConfig = JSON.parse(controlsConfigJson);

        var elementOptionsGroupIdsInvolved = [],
            elementOptionsGroupInvolved = {},
            elementOptionsContainerInvolved = {};

        // object for save all scrips for each controls
        var controlScriptsObj = {};

        // array for keep "appear depend on" params
        var controlappearDependOnControl = [];

        // array for keep "value depend on" params
        var controlValueDependOnControl = [];

        // create controls
        var elementOptionsScriptsContainerIndic = false;
        if (controlName) {
            var controlsConfigNew = {};
            controlsConfigNew[controlName] = controlsConfig[controlName];
            controlsConfig = controlsConfigNew;
        }
        var i = 0;
        Object.keys(controlsConfig).forEach(function (key) {
            var data = controlsConfig[key];
            data.controlKey = key;

            // get necessary wp js template
            var tmplControlTemplate = wp.template('wptb-' + data.type + '-control');

            data.elemContainer = elementContainerClass;
            data.elementControlTargetUnicClass = 'wptb-el-' + elementOptionClassIndic + '-' + data.controlKey;
            Object.keys(data).map(function (k) {
                if (Object.prototype.hasOwnProperty.call(data, k) && data[k] === 'control_param_calculate_value') {
                    data[k] = WPTB_Helper.controlParamCalculateValue(data.elementControlTargetUnicClass, k);
                }
            });
            var controlTemplate = tmplControlTemplate(data);
            if ('appearDependOnControl' in data) {
                if (Array.isArray(data.appearDependOnControl)) {
                    controlappearDependOnControl.push([data.appearDependOnControl, data.elementControlTargetUnicClass]);
                }
            }

            if ('valueDependOnControl' in data && !valueDependOnControl && !targetControlElementClass) {
                var valueDependOnControlCorrect = '';
                if (data.valueDependOnControlCorrect) valueDependOnControlCorrect = data.valueDependOnControlCorrect;
                controlValueDependOnControl.push([data.valueDependOnControl, data.elementControlTargetUnicClass, valueDependOnControlCorrect]);
            }

            function elementOptionsContainerInvolvedGet(elementOptionsGroupId, elementOptionsContainerInvolved) {
                if (!elementOptionsContainerInvolved[elementOptionsGroupId]) {
                    var elementOptionsContainer = document.createElement('div');
                    elementOptionsContainer.classList.add('wptb-element-options', 'wptb-options-' + infArr[1]);
                    document.getElementById(elementOptionsGroupId).appendChild(elementOptionsContainer);
                    elementOptionsContainerInvolved[elementOptionsGroupId] = elementOptionsContainer;
                }

                return elementOptionsContainerInvolved[elementOptionsGroupId];
            }

            if (elementOptionsGroupIdsInvolved.indexOf(data.elementOptionsGroupId) == -1 && !controlName) {
                elementOptionsGroupIdsInvolved.push(data.elementOptionsGroupId);
                // clear elements from options group
                //document.getElementById( 'element-options-group' ).innerHTML = '';
                elementOptionsGroup = document.getElementById(data.elementOptionsGroupId);
                var elementOptionsGroupChildren = [].concat(_toConsumableArray(elementOptionsGroup.children));
                for (var _i5 = 0; _i5 < elementOptionsGroupChildren.length; _i5++) {
                    elementOptionsGroup.removeChild(elementOptionsGroupChildren[_i5]);
                }
                elementOptionsGroupInvolved[data.elementOptionsGroupId] = elementOptionsGroup;
            }

            controlElementParent = elementOptionsGroupInvolved[data.elementOptionsGroupId];

            if (data.elementOptionsContainerOn === 'true' && !controlName) {
                controlElementParent = elementOptionsContainerInvolvedGet(data.elementOptionsGroupId, elementOptionsContainerInvolved);
            }

            if (data.elementOptionContainerOn === 'true') {
                var elementOptionContainer = document.createElement('div');
                elementOptionContainer.classList.add(data.elementOptionClass, 'wptb-settings-items');

                if (data.customClassForContainer) {
                    elementOptionContainer.classList.add(data.customClassForContainer);
                }

                if (data.containerAdditionalStyles) {
                    elementOptionContainer.setAttribute('style', data.containerAdditionalStyles);
                }

                if (targetControlElementClass) {
                    var targetControlElement = document.getElementsByClassName(targetControlElementClass);
                    if (targetControlElement.length > 0) {
                        targetControlElement = targetControlElement[0];
                        var controlContainerElem = WPTB_Helper.findAncestor(targetControlElement, 'wptb-element-option');

                        if (controlContainerElem) {
                            var controlContainerElemParent = controlContainerElem.parentNode;
                            controlContainerElemParent.insertBefore(elementOptionContainer, controlContainerElem);
                            controlContainerElemParent.removeChild(controlContainerElem);
                        }
                    }
                } else {
                    controlElementParent.appendChild(elementOptionContainer);
                }
                controlElementParent = elementOptionContainer;
            }
            controlElementParent.innerHTML = controlElementParent.innerHTML + controlTemplate;

            var helperJavascriptElem = controlElementParent.getElementsByTagName('wptb-template-script');
            if (helperJavascriptElem.length > 0) {
                helperJavascriptElem = helperJavascriptElem[0];
                var helperJavascriptCode = helperJavascriptElem.innerText;
                controlElementParent.removeChild(helperJavascriptElem);
                var script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('id', kind + '-' + data.controlKey);
                script.innerHTML = helperJavascriptCode.replace(/\r|\n|\t/g, '').trim();
                if (!controlScriptsObj[data.elementOptionsGroupId] || !Array.isArray(controlScriptsObj[data.elementOptionsGroupId])) {
                    controlScriptsObj[data.elementOptionsGroupId] = [];
                }
                controlScriptsObj[data.elementOptionsGroupId].push(script);
            }

            i++;
        });

        element.optionsGroupIds = elementOptionsGroupIdsInvolved;

        Object.keys(controlScriptsObj).forEach(function (elementOptionsGroupId) {
            if (!targetControlElementClass) {
                elementOptionsScriptsContainer = document.createElement('div');
                elementOptionsScriptsContainer.classList.add('wptb-element-options-scripts', 'wptb-options-' + infArr[1]);
                elementOptionsGroupInvolved[elementOptionsGroupId].appendChild(elementOptionsScriptsContainer);
            }

            var controlScriptsArr = controlScriptsObj[elementOptionsGroupId];
            if (controlScriptsArr.length > 0) {
                for (var _i6 = 0; _i6 < controlScriptsArr.length; _i6++) {
                    if (targetControlElementClass) {
                        var id = kind + '-' + controlName;
                        var script = document.getElementById(id);
                        elementOptionsScriptsContainer = script.parentNode;
                        elementOptionsScriptsContainer.insertBefore(controlScriptsArr[_i6], script);
                        elementOptionsScriptsContainer.removeChild(script);
                    } else {
                        elementOptionsScriptsContainer.appendChild(controlScriptsArr[_i6]);
                    }
                }
            }
        });

        // run the scripts of controls

        // run appearDependOnControl function
        for (var _i7 = 0; _i7 < controlappearDependOnControl.length; _i7++) {
            WPTB_Helper.appearDependOnControl(controlappearDependOnControl[_i7][0], controlappearDependOnControl[_i7][1]);
        }

        WPTB_Helper.wptbDocumentEventGenerate('element:controls:active', element);
        // run valueDependOnControl function
        for (var _i8 = 0; _i8 < controlValueDependOnControl.length; _i8++) {
            WPTB_Helper.valueDependOnControl(controlValueDependOnControl[_i8][0], controlValueDependOnControl[_i8][1], controlValueDependOnControl[_i8][2], kind, element);
        }
    },

    /**
     *
     * @param unicClass
     * @param controlKey
     * @param key
     * @returns {*}
     */
    controlParamCalculateValue: function controlParamCalculateValue(unicClass, key) {
        var unicClassP = WPTB_Helper.replaceAll(unicClass, '-', '_');
        if (window['paramCalculateValue_' + unicClassP + '_' + key] && typeof window['paramCalculateValue_' + unicClassP + '_' + key] === "function") {
            return window['paramCalculateValue_' + unicClassP + '_' + key]();
        }
    },

    controlParamCalculateValueCreateFunction: function controlParamCalculateValueCreateFunction(element, controlKey, key, handlerFunction) {
        var infArr = element.className.match(/wptb-element-((.+-)\d+)/i);
        var unicClass = 'wptb-el-' + infArr[1] + '-' + controlKey;
        var unicClassP = WPTB_Helper.replaceAll(unicClass, '-', '_');
        window['paramCalculateValue_' + unicClassP + '_' + key] = function () {
            return handlerFunction(element);
        };
    },

    /**
     * function for create, update css for element
     *
     * @param elementContainer
     * @param selector
     * @param cssName
     * @param cssValue
     */
    managerExternalCssStyles: function managerExternalCssStyles(elementContainer, selector, cssName, cssValue) {
        var infArr = elementContainer.match(/wptb-element-main(.+)-(\d+)/i);
        if (!infArr || !Array.isArray(infArr)) {
            var table = document.getElementsByClassName('wptb-preview-table');

            if (table.length > 0) {
                table = table[0];

                var _infArr2 = table.className.match(/wptb-element-main(.+)-(\d+)/i);
                if (_infArr2 && Array.isArray(_infArr2)) {
                    selector = '.' + _infArr2[0] + ' ' + selector;
                }
            }
        }

        var head = document.head;
        if (head) {
            var cssForThisElement = head.querySelector('#styles-' + elementContainer);
            if (cssForThisElement) {
                var cssText = cssForThisElement.innerHTML;
                if (cssText) {
                    var cssTextArrFirst = cssText.split('}');
                    cssTextArrFirst.pop();
                    var selectorExists = false;
                    for (var i = 0; i < cssTextArrFirst.length; i++) {
                        var cssTextArrSecond = cssTextArrFirst[i].split('{');
                        if (cssTextArrSecond[0] === selector) {
                            var cssTextArrThird = cssTextArrSecond[1].split(';');
                            cssTextArrThird.pop();
                            var cssNameExists = false;
                            for (var j = 0; j < cssTextArrThird.length; j++) {
                                var cssTextArrFourth = cssTextArrThird[j].split(':');
                                if (cssTextArrFourth[0] === cssName) {
                                    if (cssValue) {
                                        cssTextArrThird[j] = cssName + ':' + cssValue;
                                    } else {
                                        cssTextArrThird.splice(j, 1);
                                    }

                                    cssTextArrSecond[1] = cssTextArrThird.join(';') ? cssTextArrThird.join(';') + ';' : '';
                                    cssNameExists = true;
                                    break;
                                }
                            }
                            if (!cssNameExists) {
                                if (cssValue) {
                                    cssTextArrSecond[1] += cssName + ':' + cssValue + ';';
                                }
                            }
                            if (cssTextArrSecond[1]) {
                                cssTextArrFirst[i] = cssTextArrSecond[0] + '{' + cssTextArrSecond[1];
                            } else {
                                cssTextArrFirst.splice(i, 1);
                            }
                            if (cssTextArrFirst.join('}')) {
                                cssForThisElement.innerHTML = cssTextArrFirst.join('}') + '}';
                            } else {
                                head.removeChild(cssForThisElement);
                            }

                            selectorExists = true;
                            break;
                        }
                    }

                    if (!selectorExists) {
                        if (cssValue) {
                            cssForThisElement.innerHTML = cssText + selector + '{' + cssName + ':' + cssValue + ';}';
                        } else {
                            cssForThisElement.innerHTML = cssText;
                        }
                    }
                } else {
                    if (cssValue) {
                        cssForThisElement.innerHTML = selector + '{' + cssName + ':' + cssValue + ';}';
                    } else {
                        head.removeChild(cssForThisElement);
                    }
                }
            } else {
                if (cssValue) {
                    var _cssForThisElement = document.createElement('style');
                    _cssForThisElement.setAttribute('id', 'styles-' + elementContainer);
                    _cssForThisElement.classList.add('styles-wptb-elements');
                    _cssForThisElement.innerHTML = selector + '{' + cssName + ':' + cssValue + ';}';
                    head.appendChild(_cssForThisElement);
                }
            }
        }
    },
    /**
     *
     * Register section parts for sidebar
     *
     * @param {array} sections an array of section names
     */
    registerSections: function registerSections(sections) {
        var _this = this;

        this.sections = {};
        this.currentSection = '';
        if (!Array.isArray(sections)) {
            sections = [sections];
        }

        sections.map(function (s) {
            var sectionElement = document.querySelector('[data-wptb-section=' + s + ']');
            if (sectionElement) {
                _this.sections[s] = sectionElement;
            }
        });
    },

    /**
     * Activate a registered section and deactivates others
     *
     * @param {string} sectionDataId section name to be activated
     * @param {string} displayType display type override for section to be used in its display style property
     */
    activateSection: function activateSection(sectionDataId) {
        var _this2 = this;

        var displayType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'block';

        this.currentSection = sectionDataId;
        this.triggerSectionEvent(sectionDataId);
        Object.keys(this.sections).map(function (k) {
            if (Object.prototype.hasOwnProperty.call(_this2.sections, k)) {
                var visibility = sectionDataId === k ? displayType : 'none';
                _this2.sections[k].style = 'display: ' + visibility + ' !important';
            }
        });
    },

    /**
     * Get id of current active section
     *
     * @returns {string} active section i
     */
    getCurrentSection: function getCurrentSection() {
        return this.currentSection;
    },

    /**
     * Get current section from search parameter 'wptb-builder-section' of window location
     */
    getSectionFromUrl: function getSectionFromUrl() {
        var parsedUrl = new URL(window.location.href);
        var urlSection = parsedUrl.searchParams.get('wptb-builder-section');
        if (urlSection) {
            if (Object.keys(this.sections).some(function (key) {
                return key === urlSection;
            })) {
                this.activateSection(urlSection);
            }
        }
    },

    /**
     * Set up related buttons and links to trigger certain elements
     */
    setupSectionButtons: function setupSectionButtons() {
        var sectionButtons = Array.from(document.querySelectorAll('[data-wptb-section-button'));
        var vm = this;

        sectionButtons.map(function (s) {
            var sectionName = s.dataset.wptbSectionButton;
            s.addEventListener('click', function () {
                var displayType = s.dataset.wptbSectionDisplayType;
                vm.activateSection(sectionName, displayType);
            });

            document.addEventListener('wptbSectionChanged', function (e) {
                if (e.detail === sectionName) {
                    s.classList.remove('disabled');
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                    s.classList.add('disabled');
                }
            });
        });
    },
    setupPanelToggleButtons: function setupPanelToggleButtons() {
        var $ = jQuery;

        $('.wptb-panel-toggle-group').each(function () {
            var vm = $(this);
            $(this).find('.toggle-icon').click(function () {
                vm.find('.wptb-panel-toggle-target').slideToggle();
                vm.toggleClass('wptb-panel-toggle-content');
            });
        });
    },

    /**
     * Trigger a section change event
     *
     * @param {string} sectionName section name
     */
    triggerSectionEvent: function triggerSectionEvent(sectionName) {
        var sectionEvent = new CustomEvent('wptbSectionChanged', { detail: sectionName });

        document.dispatchEvent(sectionEvent);
    },

    /**
     * Setup sidebar toggle element
     *
     * @param {string} toggleSelector query selector for drawer toggle element
     */
    setupSidebarToggle: function setupSidebarToggle(toggleSelector) {
        var toggleButton = document.querySelector(toggleSelector);
        if (toggleButton) {
            toggleButton.addEventListener('click', function (e) {
                e.preventDefault();
                document.body.classList.toggle('collapsed');
            });
        }
    },

    // function for deleting all external CSS for the element
    externalCssStylesDelete: function externalCssStylesDelete(elementContainerClass) {
        var head = document.head;
        if (head) {
            var cssForThisElement = head.querySelector('#styles-' + elementContainerClass);

            if (cssForThisElement) {
                head.removeChild(cssForThisElement);
            }
        }
    },
    // function for copy all external CSS for the element
    externalCssStylesCopy: function externalCssStylesCopy(activeElement, copyElement) {
        if (activeElement) {
            var infArr = activeElement.className.match(/wptb-element-(.+)-(\d+)/i);
            if (infArr && Array.isArray(infArr)) {
                var activeElemClass = infArr[0];

                var head = document.head;
                if (head) {
                    var cssForActiveElement = head.querySelector('#styles-' + activeElemClass);

                    if (cssForActiveElement) {
                        var cssForNewElement = cssForActiveElement.cloneNode(true);

                        cssForNewElement.removeAttribute('id', 'styles-' + activeElemClass);

                        var infArrCopyEl = copyElement.className.match(/wptb-element-(.+)-(\d+)/i);
                        if (infArrCopyEl && Array.isArray(infArrCopyEl)) {
                            cssForNewElement.setAttribute('id', 'styles-' + infArrCopyEl[0]);
                            var cssForActiveElementInnerHTML = cssForActiveElement.innerHTML;
                            var cssForNewElementInnerHTML = WPTB_Helper.replaceAll(cssForActiveElementInnerHTML, activeElemClass, infArrCopyEl[0]);
                            cssForNewElement.innerHTML = cssForNewElementInnerHTML;
                            head.appendChild(cssForNewElement);
                        }
                    }
                }
            }
        }
    },
    // function for convertation elements stiles in json
    elementsStylesConvertToObject: function elementsStylesConvertToObject() {
        var head = document.head;
        var stylesElements = head.querySelectorAll('.styles-wptb-elements');
        var stylesObj = {};
        for (var i = 0; i < stylesElements.length; i++) {
            var styleElemId = stylesElements[i].getAttribute('id');
            if (styleElemId && stylesElements[i].innerHTML) {
                stylesObj[styleElemId] = stylesElements[i].innerHTML;
            }
        }

        if (Object.keys(stylesObj).length != 0) {
            return JSON.stringify(stylesObj);
        }
        return '';
    },
    // function for set scc styles tags to head
    elementsStylesSetFromObject: function elementsStylesSetFromObject(jsonObject) {
        var head = document.head;
        if (head) {
            var stylesElements = head.querySelectorAll('.styles-wptb-elements');
            if (stylesElements.length > 0) {
                stylesElements = [].concat(_toConsumableArray(stylesElements));
                for (var i = 0; i < stylesElements.length; i++) {
                    head.removeChild(stylesElements[i]);
                }
            }
            if (jsonObject) {
                var stylesObj = JSON.parse(jsonObject);
                if (Object.keys(stylesObj).length != 0) {
                    Object.keys(stylesObj).forEach(function (key) {
                        var cssText = stylesObj[key];
                        var styleCss = document.createElement('style');
                        styleCss.setAttribute('id', key);
                        styleCss.classList.add('styles-wptb-elements');
                        styleCss.innerHTML = cssText;
                        head.appendChild(styleCss);
                    });
                }
            }
        }
    },
    // function for table saving
    saveTable: function saveTable(event, startSaving, previewSaving) {
        if (!previewSaving && !startSaving) {
            if (!event.target.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0 || window.wptbTableStateNumberShow == event.target.dataset.wptbTableStateNumberSave) {
                //return;
            }
        }

        if (!previewSaving) {
            var bar = document.querySelector('.wptb-edit-bar');
            if (bar && bar.classList.contains('visible')) {
                var table = document.getElementsByClassName('wptb-preview-table')[0];
                WPTB_Helper.toggleTableEditMode();
            }
        }

        // before save event trigger
        WPTB_Helper.wptbDocumentEventGenerate('wptb:save:before', document);

        var http = new XMLHttpRequest(),
            url = (wptb_admin_object ? wptb_admin_object.ajaxurl : ajaxurl) + "?action=save_table",
            t = document.getElementById('wptb-setup-name').value.trim(),
            messagingArea = void 0,
            code = void 0,
            datas = void 0;

        code = document.getElementsByClassName('wptb-preview-table');

        var postId = void 0;
        if ((rs = WPTB_Helper.detectMode()) || (rs = document.wptbId)) {
            postId = rs;
        }
        var paramIdsNecessaryChange = false;
        if (code.length > 0) {
            code = code[0];
            var codeClone = code.cloneNode(true);
            if (postId) {
                if (codeClone.classList.contains('wptb-element-main-table_setting-startedid-0')) {
                    codeClone.classList.remove('wptb-element-main-table_setting-startedid-0');
                    codeClone.classList.add('wptb-element-main-table_setting-' + postId);
                    var wptbTableSetup = document.querySelector('.wptb-table-setup');
                    if (wptbTableSetup) {
                        wptbTableSetup.innerHTML = '';
                        wptbTableSetup.appendChild(codeClone);
                        WPTB_Table();
                    }
                    paramIdsNecessaryChange = true;
                }
            }
            codeClone.columns = code.columns;
            code = WPTB_Stringifier(codeClone);
            code = code.outerHTML;
        } else {
            code = '';
        }

        if (!previewSaving) {
            datas = '';
            var datas_containers = document.getElementsByClassName('wptb-element-datas');

            if (datas_containers.length > 0) {
                if (datas_containers[0].innerHTML) {
                    datas = datas_containers[0].innerHTML;

                    if (paramIdsNecessaryChange) {
                        datas = WPTB_Helper.replaceAll(datas, 'tmpl-wptb-el-datas-main-table_setting-startedid-0', 'tmpl-wptb-el-datas-main-table_setting-' + postId);

                        datas = WPTB_Helper.replaceAll(datas, 'data-wptb-el-main-table_setting-startedid-0', 'data-wptb-el-main-table_setting-' + postId);
                    }
                }
            }
        }

        var styleObjJson = WPTB_Helper.elementsStylesConvertToObject();
        if (paramIdsNecessaryChange) {
            styleObjJson = WPTB_Helper.replaceAll(styleObjJson, '.wptb-element-main-table_setting-startedid-0', '.wptb-element-main-table_setting-' + postId);
        }

        if (t === '' && code === '') {
            var messagingAreaText = '';
            if (t === '') messagingAreaText += 'You must assign a name to the table before saving it.</br>';
            if (code === '') messagingAreaText += 'Table wasn\'t created';
            messagingArea = document.getElementById('wptb-messaging-area');
            messagingArea.innerHTML = '<div class="wptb-error wptb-message">Error: ' + messagingAreaText + '</div>';
            messagingArea.classList.add('wptb-warning');
            setTimeout(function () {
                messagingArea.removeChild(messagingArea.firstChild);
            }, 4000);
            return;
        }

        var params = {
            title: t,
            content: code,
            elements_datas: datas,
            elements_styles: styleObjJson,
            security_code: wptb_admin_object.security_code
        };

        if (previewSaving) {
            params.preview_saving = previewSaving;
        }

        if (postId) {
            params.id = postId;
        }

        // wptb save before event
        WPTB_Helper.wptbDocumentEventGenerate('wptb:save:before', document, params);

        params = JSON.stringify(params);

        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        http.onreadystatechange = function (action) {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(http.responseText);
                messagingArea = document.getElementById('wptb-messaging-area');

                if (data[0] == 'saved') {
                    var builderPageUrl = document.location.href.replace('#', '');
                    var regex = new RegExp('&table=(.+)', "i");
                    builderPageUrl = builderPageUrl.replace(regex, '');
                    window.history.pushState(null, null, builderPageUrl + '&table=' + data[1]);

                    document.wptbId = data[1];
                    messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully saved.</div>';
                    document.getElementsByClassName('wptb-embed-btn')[0].classList.remove('wptb-button-disable');
                    document.getElementById('wptb-embed-shortcode').value = '[wptb id=' + data[1] + ']';
                    var wptbPreviewTable = document.querySelector('.wptb-preview-table');
                    var wptbPreviewBtn = document.getElementsByClassName('wptb-preview-btn');
                    if (wptbPreviewBtn.length > 0) {
                        wptbPreviewBtn = wptbPreviewBtn[0];
                        wptbPreviewBtn.classList.remove('wptb-button-disable');
                        var wptbPreviewBtnHref = wptbPreviewBtn.dataset.previewHref;
                        wptbPreviewBtnHref = wptbPreviewBtnHref.replace('empty', data[1]);
                        wptbPreviewBtn.setAttribute('href', wptbPreviewBtnHref);
                    }

                    event.target.dataset.wptbTableStateNumberSave = window.wptbTableStateNumberShow;
                    var wptbSaveBtn = document.getElementsByClassName('wptb-save-btn');
                    if (wptbSaveBtn.length > 0) {
                        wptbSaveBtn = wptbSaveBtn[0];
                        wptbSaveBtn.classList.add('wptb-save-disabled');
                        wptbSaveBtn.classList.remove('active');
                    }
                    // WPTB_Helper.saveTable( event, true );
                    return;
                } else if (data[0] == 'edited' && startSaving) {
                    document.wptbId = data[1];
                    messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully saved.</div>';
                    document.getElementsByClassName('wptb-embed-btn')[0].classList.remove('wptb-button-disable');
                    document.getElementById('wptb-embed-shortcode').value = '[wptb id=' + data[1] + ']';
                    var _wptbPreviewTable = document.querySelector('.wptb-preview-table');
                    var _wptbPreviewBtn = document.getElementsByClassName('wptb-preview-btn');
                    if (_wptbPreviewBtn.length > 0) {
                        _wptbPreviewBtn = _wptbPreviewBtn[0];
                        _wptbPreviewBtn.classList.remove('wptb-button-disable');
                        var _wptbPreviewBtnHref = _wptbPreviewBtn.dataset.previewHref;
                        _wptbPreviewBtnHref = _wptbPreviewBtnHref.replace('empty', data[1]);
                        _wptbPreviewBtn.setAttribute('href', _wptbPreviewBtnHref);
                    }

                    event.target.dataset.wptbTableStateNumberSave = window.wptbTableStateNumberShow;
                    var _wptbSaveBtn = document.getElementsByClassName('wptb-save-btn');
                    if (_wptbSaveBtn.length > 0) {
                        _wptbSaveBtn = _wptbSaveBtn[0];
                        _wptbSaveBtn.classList.add('wptb-save-disabled');
                        _wptbSaveBtn.classList.remove('active');
                    }
                } else if (data[0] == 'edited') {
                    messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully updated.</div>';
                    event.target.dataset.wptbTableStateNumberSave = window.wptbTableStateNumberShow;

                    var _wptbSaveBtn2 = document.getElementsByClassName('wptb-save-btn');
                    if (_wptbSaveBtn2.length > 0) {
                        _wptbSaveBtn2 = _wptbSaveBtn2[0];
                        _wptbSaveBtn2.classList.add('wptb-save-disabled');
                        _wptbSaveBtn2.classList.remove('active');
                    }
                } else if (data[0] == 'preview_edited') {
                    return;
                } else {
                    messagingArea.innerHTML = '<div class="wptb-error wptb-message">Safety problems</div>';
                }
                messagingArea.classList.add('wptb-success');
                setTimeout(function () {
                    messagingArea.removeChild(messagingArea.firstChild);
                }, 4000);
            }
        };
        http.send(params);
    },
    //
    clickOnFreeSpace: function clickOnFreeSpace() {
        // if current active section is responsive menu, ignore this functionality
        if (this.getCurrentSection() === 'table_responsive_menu') {
            return;
        }

        var cellModeBackground = document.querySelector('#wptb-cell_mode_background');
        if (cellModeBackground && cellModeBackground.classList.contains('visible')) {
            return;
        }
        // document.getElementsByClassName( 'wptb-elements-container' )[0].style.display = 'table';
        // document.getElementsByClassName( 'wptb-settings-section' )[0].style.display = 'block';
        // document.getElementById( 'element-options-group' ).style.display = 'none';
        this.activateSection('elements');

        var wpcdFixedToolbar = document.getElementById('wpcd_fixed_toolbar');
        if (wpcdFixedToolbar.hasAttribute('data-toolbar-active-id')) {
            document.getElementById(wpcdFixedToolbar.getAttribute('data-toolbar-active-id')).classList.remove('toolbar-active');
        }
        var element = document.querySelector('.wptb-preview-table');
        if (element) {
            WPTB_Helper.elementOptionsSet('table_setting', element);
        }
    },

    /*
     * function for sending of element ajax request
     */
    elementAjax: function elementAjax(dataAjaxData, element) {
        var http = new XMLHttpRequest(),
            url = (wptb_admin_object ? wptb_admin_object.ajaxurl : ajaxurl) + "?action=wptb_element_ajax";
        var element_name = void 0;
        var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
        if (infArr && Array.isArray(infArr)) {
            element_name = infArr[1];
        }

        var params = {
            element_ajax_data: dataAjaxData,
            element_name: element_name,
            security_code: wptb_admin_object.security_code
        };
        params = JSON.stringify(params);

        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        http.onreadystatechange = function (action) {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(http.responseText);
                var detail = void 0;
                if (data && Array.isArray(data) && data[0] == 'element_ajax_responce') {
                    detail = { value: data[1] };
                } else {
                    detail = '';
                }
                WPTB_Helper.wptbDocumentEventGenerate('wptb-element:ajax-response', element, detail);
            }
        };
        http.send(params);
    },

    /*
     * This just toggles visibility of cell edit bar, and toggles
     * cell selecting mode.
     */
    toggleTableEditMode: function toggleTableEditMode() {
        var close = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var bar = document.getElementsByClassName('wptb-edit-bar'),
            cellModeBackground = document.getElementById('wptb-cell_mode_background'),
            leftScrollPanelCurtain = document.getElementById('wptb-left-scroll-panel-curtain'),
            leftScrollPanelCellSettings = document.getElementById('wptb-left-scroll-panel-cell-settings'),
            wptbPreviewTable = document.getElementsByClassName('wptb-preview-table');
        if (wptbPreviewTable.length > 0) {
            wptbPreviewTable = wptbPreviewTable[0];
        }

        if (bar.length > 0) {
            var toggleEditMode = '';
            for (var i = 0; i < bar.length; i++) {
                if (bar[i].classList.contains('visible')) {
                    document.select.deactivateMultipleSelectMode();
                    bar[i].classList.remove('visible');
                    cellModeBackground.classList.remove('visible');
                    leftScrollPanelCurtain.classList.remove('visible');
                    leftScrollPanelCellSettings.classList.remove('visible');
                    wptbPreviewTable.parentNode.classList.remove('wptb-preview-table-manage-cells');
                    var wptbPreviewTableTds = wptbPreviewTable.getElementsByTagName('td');
                    if (wptbPreviewTableTds.length > 0) {
                        for (var _i9 = 0; _i9 < wptbPreviewTableTds.length; _i9++) {
                            wptbPreviewTableTds[_i9].classList.remove('wptb-highlighted');
                        }
                    }
                    toggleEditMode = 'closed';
                    WPTB_Helper.activateSection('elements');
                } else if (!close) {
                    document.select.activateMultipleSelectMode();
                    bar[i].classList.add('visible');
                    cellModeBackground.classList.add('visible');
                    leftScrollPanelCurtain.classList.add('visible');
                    wptbPreviewTable.parentNode.classList.add('wptb-preview-table-manage-cells');

                    toggleEditMode = 'opened';
                }
            }

            WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-edit-mode/' + toggleEditMode, wptbPreviewTable);
        }
    },

    /*
     * checking of dimension of value
     */
    checkingDimensionValue: function checkingDimensionValue(value, dimension) {
        value = String(value);
        dimension = String(dimension);
        if (value && dimension) {
            var searchIndex = value.indexOf(dimension);
            if (searchIndex != -1 && searchIndex == value.length - dimension.length) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    /*
     * if dimension is included - checking and if it necessary setting value
     * without dimension - return value
     */
    checkSetGetStyleSizeValue: function checkSetGetStyleSizeValue(element, styleName, computedStyleName, dimension) {
        var elemStyleValue = element.style[styleName];
        elemStyleValue = String(elemStyleValue);

        if (!elemStyleValue || dimension ? !WPTB_Helper.checkingDimensionValue(elemStyleValue, dimension) : false) {
            var elementStyles = window.getComputedStyle(element);
            if (computedStyleName && elementStyles.getPropertyValue(computedStyleName) && dimension ? WPTB_Helper.checkingDimensionValue(elementStyles.getPropertyValue(computedStyleName), dimension) : true) {
                if (!dimension) {
                    return elementStyles.getPropertyValue(computedStyleName);
                } else {
                    element.style[styleName] = elementStyles.getPropertyValue(computedStyleName);
                }
            } else {
                if (!dimension) {
                    return false;
                } else {
                    element.style[styleName] = null;
                }
            }
        } else if (!dimension) {
            return elemStyleValue;
        }

        return element.style[styleName];
    },

    /*
     * function checking that element has the style
     * if this style is present - checking the format color
     * if param set is true - setting style for element (consider hex format of color)
     * if param set is false - getting style from element
     */
    checkSetGetStyleColorValue: function checkSetGetStyleColorValue(element, styleName, computedStyleName) {
        var set = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var elemStyleColorValue = element.style[styleName];

        if (!elemStyleColorValue) {
            var elementStyles = window.getComputedStyle(element, null);

            if (elementStyles && elementStyles.getPropertyValue(computedStyleName)) {

                if (set) {
                    elemStyleColorValue = WPTB_Helper.rgbToHex(elementStyles.getPropertyValue(computedStyleName));
                    if (WPTB_Helper.isHex(elemStyleColorValue)) {
                        element.style[styleName] = elemStyleColorValue;
                    } else {
                        element.style[styleName] = '';
                    }
                } else {
                    return elementStyles.getPropertyValue(computedStyleName);
                }
            } else {
                if (set) {
                    element.style[styleName] = '';
                } else {
                    return '';
                }
            }
        } else if (!set) {
            return elemStyleColorValue;
        }
    },

    /*
     * function checking that element has the style
     * if this style is present - checking the format color
     * if param set is true - setting style for element (consider hex format of color)
     * if param set is false - getting style from element
     */
    checkSetGetStyleValue: function checkSetGetStyleValue(element, styleName, computedStyleName) {
        var set = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var elemStyleColorValue = element.style[styleName];

        if (!elemStyleColorValue) {
            var elementStyles = window.getComputedStyle(element, null);

            if (elementStyles && elementStyles.getPropertyValue(computedStyleName)) {

                if (set) {
                    element.style[styleName] = elementStyles.getPropertyValue(computedStyleName);
                } else {
                    return elementStyles.getPropertyValue(computedStyleName);
                }
            } else if (!set) {
                return '';
            }
        } else if (!set) {
            return elemStyleColorValue;
        }
    },

    /*
     * get the value of the same elements that have the most count
     */
    getValueMaxCountSameElementsInArray: function getValueMaxCountSameElementsInArray(arr) {
        if (arr && Array.isArray(arr)) {
            var check = {};
            var countEmpty = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    if (check[arr[i]]) {
                        check[arr[i]]++;
                    } else {
                        check[arr[i]] = 1;
                    }
                } else {
                    countEmpty++;
                }
            }

            var maxPropName = void 0;
            for (var key in check) {
                if (!maxPropName) {
                    maxPropName = key;
                    continue;
                } else {
                    if (check[maxPropName] < check[key]) {
                        maxPropName = key;
                    }
                }
            }

            return check[maxPropName] >= countEmpty ? maxPropName : '';
        }
    },

    /*
     * For assigning to each cell xIndex and y Index attributes,
     * these are the column number and row number of cell in table.
     */
    recalculateIndexes: function recalculateIndexes(table) {
        WPTB_RecalculateIndexes(table);
    },

    /**
     * Table Rows colors reinstall
     */
    tableRowsColorsReinstall: function tableRowsColorsReinstall(table) {
        var infArr = table.className.match(/wptb-element-main(.+)-(\d+)/i);
        if (infArr && Array.isArray(infArr)) {
            var tableIndex = '';
            if (infArr[infArr.length - 1] == '0') {
                tableIndex = 'startedid-0';
            } else {
                tableIndex = infArr[infArr.length - 1];
            }

            var tableHeaderBackground = document.querySelector('.wptb-el-main-table_setting-' + tableIndex + '-tableHeaderBackground');
            if (tableHeaderBackground) {
                var details = { value: tableHeaderBackground.value };
                WPTB_Helper.wptbDocumentEventGenerate('controlColor:change', tableHeaderBackground, details);
            }

            var tableEvenRowBackground = document.querySelector('.wptb-el-main-table_setting-' + tableIndex + '-tableEvenRowBackground');
            if (tableEvenRowBackground) {
                var _details = { value: tableEvenRowBackground.value };
                WPTB_Helper.wptbDocumentEventGenerate('controlColor:change', tableEvenRowBackground, _details);
            }

            var tableOddRowBackground = document.querySelector('.wptb-el-main-table_setting-' + tableIndex + '-tableOddRowBackground');
            if (tableOddRowBackground) {
                var _details2 = { value: tableOddRowBackground.value };
                WPTB_Helper.wptbDocumentEventGenerate('controlColor:change', tableOddRowBackground, _details2);
            }
        }
    },
    /**
     * Get parent html element of given type
     *
     * @param {string} parentType type of parent element
     * @param {HTMLElement} el current element
     * @returns {*} html element of type
     */
    getParentOfType: function getParentOfType(parentType, el) {
        if (el.nodeName === parentType.toUpperCase()) {
            return el;
        }

        return WPTB_Helper.getParentOfType(parentType, el.parentElement);
    },
    // current relative type of drag element
    // this type is used on differentiating certain elements based on their positioning on table
    dragRelativeType: '',
    /**
     *
     * @param {string} val drag relative type
     */
    setDragRelativeType: function setDragRelativeType(val) {
        this.dragRelativeType = val;
    },
    // get drag relative type
    getDragRelativeType: function getDragRelativeType() {
        return this.dragRelativeType;
    },
    /**
     *
     * @param {HTMLElement} element
     * @param {string} styleName
     */
    getElementColorStylesHex: function getElementColorStylesHex(element, styleName) {
        var color = element.style[styleName];
        color = WPTB_Helper.rgbToHex(color);
        if (!WPTB_Helper.isHex(color)) {
            color = '';
        }
        return color;
    },
    /**
     * Show element controls on adding them to table.
     */
    showControlsOnElementMount: function showControlsOnElementMount() {
        document.addEventListener('element:mounted:dom', function (e) {
            e.target.click();
        });
    },

    /**
     * Show elements list menu on left panel on removing element from table
     */
    showElementsListOnRemove: function showElementsListOnRemove() {
        document.addEventListener('element:removed:dom', function () {
            WPTB_Helper.activateSection('elements');
        });
    },

    blockTinyMCEManageCells: function blockTinyMCEManageCells() {
        var addBlocker = function addBlocker(parent) {
            var blockerElement = document.createElement('div');
            blockerElement.classList.add('wptb-plugin-blocker-element');

            var haveChild = parent.childNodes.length > 0;
            parent.appendChild(blockerElement);

            // if don't have any children, then add before/after css element states to blocker in order to reflect table builder menu visuals
            if (!haveChild) {
                parent.classList.add('wptb-plugin-blocker-element-empty');
            }
        };

        var removeBlocker = function removeBlocker(parent) {
            var blockerElement = parent.querySelector('.wptb-plugin-blocker-element');
            if (blockerElement) {
                blockerElement.remove();
            }

            parent.classList.remove('wptb-plugin-blocker-element-empty');
        };
        document.addEventListener('wptbSectionChanged', function (_ref) {
            var detail = _ref.detail;

            var table = document.querySelector('.wptb-table-setup table.wptb-preview-table');
            if (table) {
                var cells = Array.from(table.querySelectorAll('td'));

                cells.map(removeBlocker);

                if (detail === 'manage_cells' || detail === 'cell_settings') {
                    cells.map(addBlocker);
                }
            }
        });

        document.addEventListener('wptb:save:before', function () {
            var table = document.querySelector('.wptb-table-setup table.wptb-preview-table');
            var cells = Array.from(table.querySelectorAll('td'));

            cells.map(removeBlocker);
        });
    }
};
var WPTB_Initializer = function WPTB_Initializer() {

    var MIN_COLUMNS = 1,
        MIN_ROWS = 1,
        MAX_COLUMNS = 30,
        MAX_ROWS = 30;

    var tableGenerator = document.body;
    columnsDecrementButton = tableGenerator.getElementsByClassName('wptb-input-number-decrement')[0], columnsIncrementButton = tableGenerator.getElementsByClassName('wptb-input-number-increment')[0], rowsDecrementButton = tableGenerator.getElementsByClassName('wptb-input-number-decrement')[1], rowsIncrementButton = tableGenerator.getElementsByClassName('wptb-input-number-increment')[1], columnsInput = document.getElementById('wptb-columns-number'), rowsInput = document.getElementById('wptb-rows-number');

    // columnsDecrementButton.onclick = function () {
    //         if (columnsInput.value > MIN_COLUMNS) {
    //                 columnsInput.value--;
    //         }
    // };
    //
    // columnsIncrementButton.onclick = function () {
    //         if (columnsInput.value < MAX_COLUMNS) {
    //                 columnsInput.value++;
    //         }
    // };
    //
    // rowsDecrementButton.onclick = function () {
    //         if (rowsInput.value > MIN_ROWS) {
    //                 rowsInput.value--;
    //         }
    // };
    //
    // rowsIncrementButton.onclick = function () {
    //         if (rowsInput.value < MAX_ROWS) {
    //                 rowsInput.value++;
    //         }
    // };

    // document.getElementById( 'wptb-generate-table' ).onclick = function (  ) {
    //         var columns = document.getElementById('wptb-columns-number').value,
    //             rows = document.getElementById('wptb-rows-number').value;
    //
    //         //wptbTableStateSaveManager.tableStateClear();
    //
    //         WPTB_Table(columns, rows);
    //
    //         let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
    //         wptbTableStateSaveManager.tableStateSet();
    // }

    // register and setup section buttons
    WPTB_Helper.registerSections(['elements', 'table_settings', 'cell_settings', 'options_group', 'table_responsive_menu', 'manage_cells']);
    WPTB_Helper.setupSectionButtons();

    // activate elements section for startup
    WPTB_Helper.activateSection('elements');

    // side bar toggle setup
    WPTB_Helper.setupSidebarToggle('.wptb-panel-toggle-section .wptb-panel-drawer-icon');

    // setup panel sections that have the ability to be toggled on/off
    WPTB_Helper.setupPanelToggleButtons();

    // setup responsive menu both at left and builder panel
    new WptbResponsive('table_responsive_menu', 'wptbResponsiveApp', '.wptb-builder-content');

    // get builder section from url parameter for easy switch at page load
    WPTB_Helper.getSectionFromUrl();

    // automatically show element controls when dropped to table
    WPTB_Helper.showControlsOnElementMount();

    // show elements list menu on left panel on removing elements from table
    WPTB_Helper.showElementsListOnRemove();

    // block tinyMCE from activation at manage cells menu
    WPTB_Helper.blockTinyMCEManageCells();
    // initialize header toolbox
    new WPTB_HeaderToolbox('.wptb-plugin-header-toolbar').init();

    // redirect active menu to elements after closing manage cells menu
    document.addEventListener('wp-table-builder/table-edit-mode/closed', function () {
        WPTB_Helper.activateSection('elements');
    });
};
var WPTB_innerElementSet = function WPTB_innerElementSet(element) {

    element.ondragenter = function (e) {
        var div;
        if (e.dataTransfer.types.indexOf('wptbelement') == -1 && e.dataTransfer.types.indexOf('wptb-moving-mode') == -1) {
            return;
        }
        WPTB_DropHandle(this, e);

        element.classList.add('wptb-ondragenter');
    };
    element.ondragover = function (e) {
        e.preventDefault();
        WPTB_DropHandle(this, e);
    };
    element.ondragleave = function (e) {
        WPTB_DropHandle(this, e, true);
    };
    element.ondrop = function (e) {
        this.classList.remove('wptb-ondragenter');
        var element = void 0,
            classId = void 0;
        e.preventDefault();
        e.stopPropagation();

        if (!e.dataTransfer.getData('wptbElement') && !e.dataTransfer.getData('node')) {
            return;
        }
        var wptbDropHandle = void 0,
            wptbDropBorderMarker = void 0;
        if (document.getElementsByClassName('wptb-drop-handle').length > 0) {
            wptbDropHandle = document.getElementsByClassName('wptb-drop-handle')[0];
        }
        if (document.getElementsByClassName('wptb-drop-border-marker').length > 0) {
            wptbDropBorderMarker = document.getElementsByClassName('wptb-drop-border-marker')[0];
        }

        if (e.dataTransfer.getData('wptbElement')) {
            element = WPTB_Helper.newElementProxy(e.dataTransfer.getData('wptbElement'));
            element = element.getDOMElement();
        } else {
            classId = e.dataTransfer.getData('node');
            element = document.getElementsByClassName(classId)[0];
            //element.classList.remove( 'wptb-moving-mode' );
        }

        if (WPTB_Helper.getDragRelativeType() === 'td_relative') {
            WPTB_DropHandle(this, e, true);
            var parentCell = WPTB_Helper.getParentOfType('td', e.target);

            parentCell.appendChild(element);
            WPTB_Helper.wptbDocumentEventGenerate('element:mounted:dom', element);
        } else if (wptbDropHandle.style.display == 'block') {
            var td = void 0;
            if (wptbDropHandle.dataset.text == 'Drop Here') {
                td = wptbDropHandle.getDOMParentElement();
                td.appendChild(element);
                WPTB_Helper.wptbDocumentEventGenerate('element:mounted:dom', element);
            } else {
                var innerElement = wptbDropHandle.getDOMParentElement();
                td = innerElement.parentNode;

                if (wptbDropHandle.dataset.text == 'Above Element') {
                    td.insertBefore(element, innerElement);
                    WPTB_Helper.wptbDocumentEventGenerate('element:mounted:dom', element);
                } else if (wptbDropHandle.dataset.text == 'Below Element') {
                    var innerElementNext = innerElement.nextSibling;
                    td.insertBefore(element, innerElementNext);
                    WPTB_Helper.wptbDocumentEventGenerate('element:mounted:dom', element);
                }
            }

            var thisRow = td.parentNode;
            if (WPTB_Helper.rowIsTop(thisRow)) {
                var table = WPTB_Helper.findAncestor(thisRow, 'wptb-preview-table');

                if (table.classList.contains('wptb-table-preview-head')) {
                    WPTB_Helper.dataTitleColumnSet(table);
                }
            }

            // start item javascript if item is new
            var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
            var elemKind = infArr[1];
            if (e.dataTransfer.getData('wptbElement') && (elemKind == 'text' || elemKind == 'button' || elemKind == 'image' || elemKind == 'star_rating' || elemKind == 'list')) {
                //WPTB_Helper.elementStartScript( element );
            }
        } else {
            return;
        }

        if (wptbDropHandle) {
            wptbDropHandle.style.display = 'none';
            wptbDropBorderMarker.style.display = 'none';
        }

        WPTB_innerElementSet(element);

        if (!element.classList.contains('wptb-image-container') || element.classList.contains('wptb-moving-mode')) {
            element.classList.remove('wptb-moving-mode');
            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
        return true;
    };
    element.onmouseover = function (e) {
        element.classList.remove('wptb-ondragenter');
    };
};
var WPTB_LeftPanel = function WPTB_LeftPanel() {

    var table = document.getElementsByClassName('wptb-preview-table')[0],
        wptbElementButtons = document.getElementsByClassName('wptb-element');

    for (var i = 0; i < wptbElementButtons.length; i++) {
        wptbElementButtons[i].ondragstart = function (e) {
            e.dataTransfer.setData('wptbElement', this.dataset.wptbElement);
            e.dataTransfer.setData('wptbElIndic-' + this.dataset.wptbElement, 'wptbElIndic-' + this.dataset.wptbElement);
        };
    };

    if (table) {
        var wptbTablesEditModeCloseButton = document.getElementsByClassName('wptb-table-edit-mode-close');
        for (var _i = 0; _i < wptbTablesEditModeCloseButton.length; _i++) {
            wptbTablesEditModeCloseButton[_i].onclick = WPTB_Helper.toggleTableEditMode;
        }
    };

    // this code hides the "element parameters" area
    // when clicked outside this element and its "tinymce" toolbar 
    var wptbBuilderPanel = document.getElementsByClassName('wptb-builder-panel')[0];
    wptbBuilderPanel.onclick = function (e) {
        if (!e.target.classList.contains('wptb-ph-element') && !WPTB_Helper.findAncestor(e.target, 'wptb-ph-element') && !e.target.classList.contains('wptb-fixed-toolbar') && !WPTB_Helper.findAncestor(e.target, 'wptb-fixed-toolbar')) {
            WPTB_Helper.clickOnFreeSpace();
        }
    };

    var wptbHeader = document.getElementsByClassName('wptb-header');
    if (wptbHeader.length > 0) wptbHeader = wptbHeader[0];
    wptbHeader.onclick = function () {
        WPTB_Helper.clickOnFreeSpace();
    };
};
var MultipleSelect = function MultipleSelect() {

	var selectedCells = [],
	    multipleCellMode = false;

	this.activateMultipleSelectMode = function () {
		selectedCells = [];
		var tds = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
		for (var i = 0; i < tds.length; i++) {
			tds[i].classList.remove('wptb-highlighted');
		}
		multipleCellMode = true;
	};

	this.deactivateMultipleSelectMode = function () {
		multipleCellMode = false;
	};

	this.isActivated = function () {
		return multipleCellMode;
	};

	this.pushSelectedCell = function (cell) {
		if (!multipleCellMode) {
			return;
		}
		selectedCells.push(cell);
		cell.classList.add('wptb-highlighted');
	};

	this.selectedCells = function () {
		return selectedCells;
	};

	this.flushSelectedCells = function () {
		selectedCells = [];
	};

	this.getFirst = function () {
		var minXIndex = 1000,
		    minYIndex = 1000,
		    first;
		for (var i = selectedCells.length - 1; i >= 0; i--) {
			if (minXIndex >= selectedCells[i].dataset.xIndex && minYIndex >= selectedCells[i].dataset.yIndex) {
				first = selectedCells[i];
				minXIndex = selectedCells[i].dataset.xIndex;
				minYIndex = selectedCells[i].dataset.yIndex;
			}
		}
		return first;
	};

	this.getLast = function () {
		var maxXIndex = -1,
		    maxYIndex = -1,
		    last;
		for (var i = selectedCells.length - 1; i >= 0; i--) {
			if (maxXIndex <= selectedCells[i].dataset.xIndex && maxYIndex <= selectedCells[i].dataset.yIndex) {
				last = selectedCells[i];
				maxXIndex = selectedCells[i].dataset.xIndex;
				maxYIndex = selectedCells[i].dataset.yIndex;
			}
		}
		return last;
	};

	this.removeAllButFirst = function () {
		var td = this.getFirst();
		for (var i = 1; i < selectedCells.length; i++) {
			selectedCells[i].classList.add('wptb-fused-cell-' + td.dataset.xIndex + '-' + td.dataset.yIndex);
		}
	};

	return this;
};
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_Parser = function WPTB_Parser(code) {
    var div = document.createElement('div');
    div.innerHTML = code;

    var table = div.children[0];
    var columnTitleMobile = [].concat(_toConsumableArray(table.querySelectorAll('.wptb-column-title-mobile-container')));

    for (var i = 0; i < columnTitleMobile.length; i++) {
        var parent = columnTitleMobile[i].parentNode;
        parent.removeChild(columnTitleMobile[i]);
    }

    var tds = table.querySelectorAll('td');
    for (var _i = 0; _i < tds.length; _i++) {
        tds[_i].classList.add('wptb-droppable');
        tds[_i].classList.remove('wptb-column-title-mobile-not-elements');
    }

    return table;
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = function () {
        'use strict';

        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
            dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [],
                prop,
                i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }();
}
var WPTB_RecalculateIndexes = function WPTB_RecalculateIndexes(table) {
    var trs = table.getElementsByTagName('tr'),
        tds = void 0,
        maxCols = 0,
        maxColsFull = 0,
        tdsArr = [];

    for (var i = 0; i < trs.length; i++) {
        tds = trs[i].getElementsByTagName('td');

        if (tdsArr[i] == undefined) {
            tdsArr[i] = [];
        }

        var jMainIter = 0;
        for (var j = 0; j < tds.length; j++) {
            if (tdsArr[i][j] != undefined) {
                for (var y = 0; y < 100; y++) {
                    if (tdsArr[i][jMainIter] != undefined) {
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

            if (tds[j].colSpan > 1) {
                for (var k = 1; k < tds[j].colSpan; k++) {
                    jMainIter++;
                    tdsArr[i][jMainIter] = 'tdDummy';
                }
            }

            if (tds[j].rowSpan > 1) {
                for (var x = 1; x < tds[j].rowSpan; x++) {
                    if (tdsArr[i + x] == undefined) {
                        tdsArr[i + x] = [];
                    }
                    for (var z = 0; z < tds[j].colSpan; z++) {
                        tdsArr[i + x][jMainIter - tds[j].colSpan + 1 + z] = 'tdDummy';
                    }
                }
            }
            jMainIter++;
        }

        if (tds.length > maxCols) {
            maxCols = tds.length;
        }

        if (i == 0) {
            maxColsFull = jMainIter;
        }
    }
    table.columns = maxCols;
    table.maxCols = maxColsFull;
};
/**
 * Responsive menu and options class.
 *
 * This class will be called and instanced at table builder menu to add it the responsive menu and its controls.
 *
 * @param {string} sectionName section name
 * @param {string} responsiveWrapperId id for mount point
 * @param {string} mainContainerQuery query to find parent container for responsive menu
 * @throws {Error} will throw an error if mainContainerQuery failed to find any element
 * @constructor
 */
// eslint-disable-next-line no-unused-vars
function WptbResponsive(sectionName, responsiveWrapperId, mainContainerQuery) {
	var _this = this;

	this.sectionName = sectionName;
	this.responsiveWrapperId = responsiveWrapperId;
	this.responsiveTable = null;
	this.loaded = false;

	/**
  * Add responsive container to dom.
  */
	this.addContainerToDom = function () {
		var responsiveContainer = document.querySelector('#' + _this.responsiveWrapperId);
		if (!responsiveContainer) {
			var mainContainer = document.querySelector(mainContainerQuery);

			// parent container not found, throw error
			if (!mainContainer) {
				throw new Error('[WPTB_Responsive]: no parent container is found with the given query of [' + mainContainerQuery + ']');
			}

			var range = document.createRange();
			range.setStart(mainContainer, 0);

			var responsiveElement = range.createContextualFragment('<div class="wptb-responsive" id="' + _this.responsiveWrapperId + '">responsive element</div>');
			mainContainer.appendChild(responsiveElement);
			_this.loaded = true;
		}

		_this.responsiveTable = document.querySelector('#' + _this.responsiveWrapperId);
	};

	/**
  * Load and make necessary mount preparations for component.
  */
	this.load = function () {
		if (!_this.loaded) {
			_this.addContainerToDom();

			WPTB_Helper.elementStartScript(_this.responsiveTable, 'table_responsive_menu');
			WPTB_Helper.elementOptionsSet('table_responsive_menu', _this.responsiveTable);
			WPTB_ControlsManager.callControlScript('ResponsiveTable', _this.responsiveWrapperId);
		}
	};

	/**
  * Startup hook for the component.
  */
	this.startUp = function () {
		// event listener for section change events
		document.addEventListener('wptbSectionChanged', function (e) {
			var tablePreview = document.querySelector('.wptb-table-setup .wptb-preview-table');

			// check if activated section is related to responsive and there is a main table already in the view
			if (e.detail === _this.sectionName && tablePreview) {
				_this.load();
			}
		});

		// event listener for table ready signal
		document.addEventListener('wptb:table:generated', function () {
			// check current section to be sure that responsive menu is the active one before calling load related scripts
			if (WPTB_Helper.getCurrentSection() === 'table_responsive_menu') {
				_this.load();
			}
		});
	};

	this.startUp();
}
var WPTB_Settings = function WPTB_Settings() {
    var elems = document.getElementsByClassName('wptb-element');

    for (var i = 0; i < elems.length; i++) {
        elems[i].ondragstart = function (event) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('wptbElement', event.target.dataset.wptbElement);
            event.dataTransfer.setData('wptbElIndic-' + event.target.dataset.wptbElement, 'wptbElIndic-' + event.target.dataset.wptbElement);

            // set drag relative helper field for future use
            WPTB_Helper.setDragRelativeType(this.dataset.wptbRelativeElements || '');
        };
        elems[i].ondragend = function () {
            WPTB_Helper.elementDragEndClear();
        };
    };

    var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
    var wptbUndo = document.getElementsByClassName('wptb-undo');
    if (wptbUndo.length > 0) {
        wptbUndo = wptbUndo[0];

        wptbUndo.onclick = function (event) {
            if (!this.classList.contains('wptb-undoredo-disabled')) {
                wptbTableStateSaveManager.tableStateGet(this.dataset.wptbUndoredo);
                var wptbUndoRedoContainer = document.getElementsByClassName('wptb-undo-redo-container');
                if (wptbUndoRedoContainer.length > 0) {
                    wptbUndoRedoContainer = wptbUndoRedoContainer[0];
                    wptbUndoRedoContainer.onmouseleave = function (event) {
                        event.target.onmouseleave = '';
                        var table = document.querySelector('.wptb-preview-table');
                        WPTB_Table();
                    };
                }
            }
        };
    }

    var wptbRedo = document.getElementsByClassName('wptb-redo');
    if (wptbRedo.length > 0) {
        wptbRedo = wptbRedo[0];

        wptbRedo.onclick = function (event) {
            if (!this.classList.contains('wptb-undoredo-disabled')) {
                wptbTableStateSaveManager.tableStateGet(this.dataset.wptbUndoredo);
                var wptbUndoRedoContainer = document.getElementsByClassName('wptb-undo-redo-container');
                if (wptbUndoRedoContainer.length > 0) {
                    wptbUndoRedoContainer = wptbUndoRedoContainer[0];
                    wptbUndoRedoContainer.onmouseleave = function (event) {
                        event.target.onmouseleave = '';
                        var table = document.querySelector('.wptb-preview-table');
                        WPTB_Table();
                    };
                }
            }
        };
    }

    var shortcodePopupWindow = document.getElementsByClassName('wptb-popup-window-modal')[0];
    document.getElementsByClassName('wptb-embed-btn')[0].onclick = function () {
        if (!this.classList.contains('wptb-button-disable')) {
            shortcodePopupWindow.classList.add('wptb-popup-show');
        }
    };

    window.onbeforeunload = function (e) {
        var wptbSaveDisabled = document.getElementsByClassName('wptb-save-disabled');
        if (wptbSaveDisabled.length == 0) {
            return true;
        } else {
            return null;
        }
    };

    document.getElementsByClassName('wptb-popup-dark-area')[0].onclick = function () {
        shortcodePopupWindow.classList.remove('wptb-popup-show');
    };

    document.getElementsByClassName('wptb-popup-window-close-icon')[0].onclick = function () {
        shortcodePopupWindow.classList.remove('wptb-popup-show');
    };

    document.getElementsByClassName('wptb-preview-btn')[0].onclick = function (event) {
        if (this.classList.contains('wptb-button-disable')) {
            return;
        }

        var previewId = Math.floor(Math.random() * 10000);

        var newHref = new URL(event.target.href);
        newHref.searchParams.set('preview_id', previewId);
        event.target.href = newHref.toString();
        WPTB_Helper.saveTable(event, false, previewId);
    };

    document.getElementsByClassName('wptb-save-btn')[0].onclick = function (event) {
        if (!this.classList.contains('wptb-save-disabled')) {
            WPTB_Helper.saveTable(event);
        }
    };

    var tableTitleField = document.querySelector('#wptb-setup-name');
    if (tableTitleField) {
        tableTitleField.onchange = function () {
            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        };
    }
};
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_SortableTable = function WPTB_SortableTable(table) {
	this.table = table;
	var thisObject = this;
	this.topRow = table.rows.length ? table.rows[0] : null;
	this.itemsPerHeader = 0;

	/**
  * sets the table to sort mode
  * @param {string} type
  * @param {boolean} active
  * @param {number} number
  */
	this.sortModeSwitcher = function (type, active, number) {
		if (type === 'vertical') {
			this.table.removeEventListener('click', this.sortableTableVerticalStart, false);

			if (active) {
				this.sortModeSwitcher('horizontal', false);
				this.sortingCellMouseMoveSwitcher('vertical', true);
				this.table.addEventListener('click', this.sortableTableVerticalStart, false);
				this.table.dataset.wptbSortableTableVertical = '1';
			} else {
				this.sortingCellMouseMoveSwitcher('vertical', false);
				delete this.table.dataset.wptbSortableTableVertical;
			}
		} else if (type === 'horizontal') {
			this.table.removeEventListener('click', this.sortableTableHorizontalStart, false);

			if (active) {
				this.sortModeSwitcher('vertical', false);
				this.sortingCellMouseMoveSwitcher('horizontal', true);
				this.table.addEventListener('click', this.sortableTableHorizontalStart, false);
				this.table.dataset.wptbSortableTableHorizontal = '1';
			} else {
				this.sortingCellMouseMoveSwitcher('horizontal', false);
				delete this.table.dataset.wptbSortableTableHorizontal;
			}
		}
	};

	/**
  * checks whether the table should be in the sort state
  * and connects the necessary handlers
  *
  * @param {object} responsiveFront
  */
	this.sortableTableInitialization = function (responsiveFront) {
		var type = '';
		var typeFirst = void 0;
		var typeSecond = void 0;
		if (this.table.dataset.wptbSortableTableVertical && this.table.dataset.wptbSortableTableVertical === '1') {
			typeFirst = 'vertical';
			typeSecond = 'horizontal';
		} else if (this.table.dataset.wptbSortableTableHorizontal && this.table.dataset.wptbSortableTableHorizontal === '1') {
			typeFirst = 'horizontal';
			typeSecond = 'vertical';
		}

		var switchMode = void 0;
		if (responsiveFront && responsiveFront.getDirective(this.table)) {
			switchMode = function switchMode() {
				var size = void 0;
				var directives = responsiveFront.getDirective(this.table);
				if (directives && directives.relativeWidth) {
					switch (directives.relativeWidth) {
						case 'window':
							// eslint-disable-next-line no-param-reassign
							size = window.innerWidth;
							break;
						case 'container':
							// get the size of the container table is in
							// eslint-disable-next-line no-param-reassign
							size = o.el.parentNode.parentNode.parentNode.clientWidth;
							break;
						default:
							// eslint-disable-next-line no-param-reassign
							size = window.innerWidth;
							break;
					}
				} else {
					size = this.table.getBoundingClientRect().width;
				}
				var sizeRangeId = responsiveFront.calculateRangeId(size, directives.breakpoints);
				type = typeFirst;
				if (sizeRangeId !== 'desktop') {
					if (directives.hasOwnProperty('modeOptions')) {
						var mode = directives.responsiveMode;
						var modeOptions = directives.modeOptions[mode];

						if (modeOptions.hasOwnProperty('topRowAsHeader') && modeOptions.topRowAsHeader.hasOwnProperty(sizeRangeId) && modeOptions.topRowAsHeader[sizeRangeId]) {
							if (modeOptions.hasOwnProperty('cellStackDirection') && modeOptions.cellStackDirection.hasOwnProperty(sizeRangeId)) {
								if (modeOptions.cellStackDirection[sizeRangeId] === 'row') {
									type = typeSecond;
								} else if (modeOptions.cellStackDirection[sizeRangeId] === 'column') {
									if (modeOptions.hasOwnProperty('cellsPerRow')) {
										this.itemsPerHeader = modeOptions.cellsPerRow[sizeRangeId];
									}
								}
							}
						}
					}
				}
				this.sortModeSwitcher(type, true);
			};
		} else {
			switchMode = function switchMode() {
				var type = typeFirst;
				if (this.table.classList.contains('wptb-mobile-view-active')) {
					if (this.table.classList.contains('wptb-table-preview-head')) {
						type = typeSecond;
					}
					var _table = this.table;
					this.table = _table.parentNode.parentNode.querySelector('.wptb-preview-table-mobile');
					this.sortModeSwitcher(type, true);
					this.table = _table;
					return;
				}

				this.sortModeSwitcher(type, true);
			};
		}

		switchMode.call(thisObject);
		this.table.addEventListener('table:rebuilt', function (e) {
			switchMode.call(thisObject);
		}, false);
	};

	/**
  * adds and deletes mousemove and mouseleave events handlers when happens switch sorting mode
  * and also can add necessary attributes
  *
  * @param {string} type
  * @param {boolean} active
  */
	this.sortingCellMouseMoveSwitcher = function (type, active) {
		if (type === 'vertical') {
			var rowsLength = this.table.rows.length;
			var dataYIndexStart = 0;
			while (rowsLength > 0) {
				var tds = this.table.querySelectorAll('[data-y-index="' + dataYIndexStart + '"]');
				tds = [].concat(_toConsumableArray(tds));
				tds.map(function (td) {
					td.removeEventListener('mousemove', sortingCellMouseMoveVertical, false);
					td.removeEventListener('mouseleave', tdMouseLeave, false);
					if (active) {
						td.addEventListener('mousemove', sortingCellMouseMoveVertical, false);
						td.addEventListener('mouseleave', tdMouseLeave, false);
						if (!td.dataset.sortedVertical) {
							td.dataset.sortedVertical = 'ask';
						}
					}
				});

				if (this.itemsPerHeader) {
					rowsLength -= this.itemsPerHeader + 1;
					dataYIndexStart += this.itemsPerHeader + 1;
				} else {
					rowsLength = 0;
				}
			}
		} else if (type === 'horizontal') {
			var _tds = this.table.querySelectorAll('[data-x-index="0"]');
			_tds = [].concat(_toConsumableArray(_tds));
			_tds.map(function (td) {
				td.removeEventListener('mousemove', sortingCellMouseMoveHorizontal, false);
				td.removeEventListener('mouseleave', tdMouseLeave, false);
				if (active) {
					td.addEventListener('mousemove', sortingCellMouseMoveHorizontal, false);
					td.addEventListener('mouseleave', tdMouseLeave, false);
				}
			});
		}
	};

	/**
  * adds a sortable-hover class for a cell when the cursor is over the sort icon (arrow)
  *
  * @param {event} e
  * @param {string} type
  * @param {HTMLElement} element td
  */
	function sortingCellMouseMov(e, type, element) {
		if (e.target.tagName === 'TD') {
			var x = e.offsetX == undefined ? e.layerX : e.offsetX;
			var y = e.offsetY == undefined ? e.layerY : e.offsetY;
			var xMatch = false;
			if (type === 'vertical' && e.target.clientWidth - x <= 35 || type === 'horizontal' && x <= 35) {
				xMatch = true;
			}
			if (xMatch && (e.target.clientHeight - 35) / 2 < y && (e.target.clientHeight + 35) / 2 > y) {
				element.classList.add('sortable-hover');
			} else {
				element.classList.remove('sortable-hover');
			}
		} else {
			element.classList.remove('sortable-hover');
		}
	}

	/**
  * calls sortingCellMouseMov with the type parameter set to vertical
  *
  * @param {event} e
  */
	function sortingCellMouseMoveVertical(e) {
		sortingCellMouseMov(e, 'vertical', this);
	}

	/**
  * calls sortingCellMouseMov with the type parameter set to horizontal
  *
  * @param {event} e
  */
	function sortingCellMouseMoveHorizontal(e) {
		sortingCellMouseMov(e, 'horizontal', this);
	}

	/**
  * remove sortable-hover class from cell when cursor leave cell
  */
	function tdMouseLeave() {
		this.classList.remove('sortable-hover');
	}

	/**
  * function for sorting the table vertically by the numeric content of cells
  *
  * @param {event} e
  * @param {HTMLElement} table
  * @param {string} type
  */
	function sortableTable(e, table, type) {
		if (e.target && e.target.tagName === 'TD' && !table.parentNode.classList.contains('wptb-preview-table-manage-cells')) {
			var tableWasSorted = false;
			if (type === 'vertical' && e.target.dataset.hasOwnProperty('sortedVertical')) {

				/**
     * if table have enabled param topRowAsHeader and sellsStackDirection is column
     * the top and bottom rows that will not be sorted are temporarily removed from the table
     */
				var tableRowsBefore = [];
				var tableRowsAfter = [];
				if (this.itemsPerHeader && this.itemsPerHeader < table.rows.length) {
					WPTB_RecalculateIndexes(table);
					var tableRowsArr = [].concat(_toConsumableArray(table.rows));
					var tableLastCont = table.querySelector('tbody') ? table.querySelector('tbody') : table;
					for (var i = 0; i < tableRowsArr.length; i++) {
						if (i < e.target.dataset.yIndex) {
							tableRowsBefore.push(tableRowsArr[i]);
							tableLastCont.removeChild(tableRowsArr[i]);
						} else if (i > e.target.dataset.yIndex + this.itemsPerHeader) {
							tableRowsAfter.push(tableRowsArr[i]);
							tableLastCont.removeChild(tableRowsArr[i]);
						}
					}
					WPTB_RecalculateIndexes(table);
				}

				var tds = table.querySelectorAll('[data-x-index="' + e.target.dataset.xIndex + '"]');
				tds = [].concat(_toConsumableArray(tds));

				/**
     * preparing table for sorting
     */
				var rowspan = void 0;
				var rowNum = void 0;
				tds.map(function (td) {
					if (!(rowspan = parseInt(td.rowSpan, 10))) {
						rowspan = 1;
					}
					rowNum = td.dataset.yIndex;
					WPTB_CutGlueTable.cutTableHorizontally(rowNum, table);
					rowNum += rowspan;
					WPTB_CutGlueTable.cutTableHorizontally(rowNum, table);
				});

				var rowsValuesArr = [];
				var rowsTdFirst = void 0;
				var tdYCoordsRowSpanPrevious = 0;
				var tableRowsPushed = [];
				for (var _i = 0; _i < tds.length; _i++) {
					var tdsChanged = changeSortingTdsCollection(e, table, tds, _i, tdYCoordsRowSpanPrevious, 'vertical');
					if (tdsChanged && tdsChanged.hasOwnProperty('i')) {
						tds = tdsChanged.tds;
						_i = tdsChanged.i;
						continue;
					} else if (tdsChanged) {
						tds = tdsChanged.tds;
					}

					var td = tds[_i];

					var tdRowspan = parseInt(td.rowSpan, 10);
					if (!tdRowspan) tdRowspan = 1;

					tdYCoordsRowSpanPrevious = parseInt(td.dataset.yIndex, 10) + tdRowspan;

					var textElementsValues = textElementsValuesGet(td);

					var rowsTd = [];
					for (var j = 0; j < tdRowspan; j++) {
						rowsTd.push(table.rows[parseInt(td.dataset.yIndex, 10) + j]);
						tableRowsPushed.push(parseInt(td.dataset.yIndex, 10) + j);
					}
					if (td.dataset.yIndex > 0) {
						rowsValuesArr.push({
							rowsTd: rowsTd,
							value: textElementsValues
						});
					} else {
						rowsTdFirst = rowsTd;
					}
				}

				var orderBy = setSortedAscDataAttr(e, 'sortedVertical');
				if (!orderBy) return;

				if (rowsValuesArr.length) rowsValuesArr.sort(function (prev, next) {
					return sortOrder(orderBy, prev, next);
				});

				rowsValuesArr.unshift({ rowsTd: rowsTdFirst });

				if (rowsValuesArr.length < table.rows.length) {
					for (var _i2 = 0; _i2 < table.rows.length; _i2++) {
						if (tableRowsPushed.indexOf(_i2) > -1) continue;
						var _rowsTd = [];
						_rowsTd.push(table.rows[_i2]);

						rowsValuesArr.push({
							rowsTd: _rowsTd
						});
					}
				}

				var tBody = table.querySelector('tbody');
				tBody.innerHTML = '';

				rowsValuesArr.map(function (rowsValObj) {
					rowsValObj.rowsTd.map(function (row) {
						tBody.appendChild(row);
					});
				});

				/**
     * returning previously deleted rows
     */
				if (tableRowsBefore.length) {
					var _tableLastCont = table.querySelector('tbody') ? table.querySelector('tbody') : table;
					if (_tableLastCont) {
						var trRef = _tableLastCont.querySelector('tr');
						tableRowsBefore.map(function (tr) {
							_tableLastCont.insertBefore(tr, trRef);
						});
					}
				}
				if (tableRowsAfter.length) {
					var _tableLastCont2 = table.querySelector('tbody') ? table.querySelector('tbody') : table;
					if (tBody) {
						tableRowsAfter.map(function (tr) {
							_tableLastCont2.appendChild(tr);
						});
					}
				}

				WPTB_RecalculateIndexes(table);

				WPTB_CutGlueTable.glueTableHorizontally(table);

				tableWasSorted = true;
			} else if (type === 'horizontal' && e.target.dataset.xIndex === '0') {
				var _tds2 = table.querySelectorAll('[data-y-index="' + e.target.dataset.yIndex + '"]');
				_tds2 = [].concat(_toConsumableArray(_tds2));

				// preparing table for sorting
				var colspan = void 0;
				var colNum = void 0;
				_tds2.map(function (td) {
					if (!(colspan = parseInt(td.colSpan, 10))) {
						colspan = 1;
					}
					colNum = td.dataset.xIndex;
					WPTB_CutGlueTable.cutTableVertically(colNum, table);
					colNum += colspan;
					WPTB_CutGlueTable.cutTableVertically(colNum, table);
				});

				var columnsValuesArr = [];
				var columnsTdFirst = void 0;

				var tdXCoordsColSpanPrevious = 0;
				for (var _i3 = 0; _i3 < _tds2.length; _i3++) {
					var _tdsChanged = changeSortingTdsCollection(e, table, _tds2, _i3, tdXCoordsColSpanPrevious, 'horizontal');
					if (_tdsChanged && _tdsChanged.hasOwnProperty('i')) {
						_tds2 = _tdsChanged.tds;
						_i3 = _tdsChanged.i;
						continue;
					} else if (_tdsChanged) {
						_tds2 = _tdsChanged.tds;
					}

					var _td = _tds2[_i3];
					var tdColspan = parseInt(_td.colSpan, 10);
					if (!tdColspan) tdColspan = 1;

					tdXCoordsColSpanPrevious = parseInt(_td.dataset.xIndex, 10) + tdColspan;

					var _textElementsValues = textElementsValuesGet(_td);
					var columnsTd = [];
					for (var _j = 0; _j < tdColspan; _j++) {
						var tdsColumn = [].concat(_toConsumableArray(table.querySelectorAll('[data-x-index="' + (parseInt(_td.dataset.xIndex, 10) + _j) + '"]')));
						columnsTd.push(tdsColumn);
					}
					if (_td.dataset.xIndex > 0) {
						columnsValuesArr.push({
							columnsTd: columnsTd,
							value: _textElementsValues
						});
					} else {
						columnsTdFirst = columnsTd;
					}
				}

				var _orderBy = setSortedAscDataAttr(e, 'sortedHorizontal');
				if (!_orderBy) return;

				if (columnsValuesArr.length) columnsValuesArr.sort(function (prev, next) {
					return sortOrder(_orderBy, prev, next);
				});

				columnsValuesArr.unshift({ columnsTd: columnsTdFirst });

				if (columnsValuesArr.length < table.maxCols) {
					var difference = table.maxCols - columnsValuesArr.length;
					for (var _i4 = 0; _i4 < difference; _i4++) {
						var _tdsColumn = [].concat(_toConsumableArray(table.querySelectorAll('[data-x-index="' + (parseInt(table.maxCols, 10) - parseInt(difference, 10) + _i4) + '"]')));

						columnsValuesArr.push({
							columnsTd: [_tdsColumn]
						});
					}
				}

				for (var _i5 = 0; _i5 < table.rows.length; _i5++) {
					table.rows[_i5].innerHTML = '';
				}

				columnsValuesArr.map(function (columnsValObj) {
					columnsValObj.columnsTd.map(function (tdsColumn) {
						tdsColumn.map(function (td) {
							table.rows[td.dataset.yIndex].appendChild(td);
						});
					});
				});

				WPTB_RecalculateIndexes(table);

				WPTB_CutGlueTable.glueTableVertically(table);

				tableWasSorted = true;
			}

			if (tableWasSorted) {
				removeCellsAttrAfterDivision(table);

				if (table.hasOwnProperty('tableSM')) {
					var tableSM = table.tableSM();
					new tableSM().tableStateSet();
				}
			}
		}
	}

	/**
  * Function that sets the data-attribute with the number of the row or column
  * that the table was sorted by. Returns the number of a row or column
  *
  * @param {event} e
  * @param {string} dataAttr
  * @returns {null|boolean}
  */
	function setSortedAscDataAttr(e, dataAttr) {
		if (e.currentTarget && (e.currentTarget.classList.contains('wptb-preview-table') || e.currentTarget.classList.contains('wptb-preview-table-mobile'))) {
			if (!e.target.dataset[dataAttr] || e.target.dataset[dataAttr] === 'ask') {
				e.target.dataset[dataAttr] = 'desk';
			} else {
				e.target.dataset[dataAttr] = 'ask';
			}

			return e.target.dataset[dataAttr];
		}

		return false;
	}

	/**
  * defines the sorting order
  *
  * @param {string} orderBy
  * @param prev
  * @param next
  * @returns {number}
  */
	function sortOrder() {
		var orderBy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ask';
		var prev = arguments[1];
		var next = arguments[2];

		var prevValue = prev.value;
		var nextValue = next.value;
		if (parseInt(prevValue) && parseInt(nextValue)) {
			prevValue = parseInt(prevValue);
			nextValue = parseInt(nextValue);
		}

		if (orderBy === 'ask') {
			if (prevValue < nextValue) {
				return -1;
			}
			if (prevValue === nextValue) {
				return 0;
			}
			return 1;
		}
		if (prevValue < nextValue) {
			return 1;
		}
		if (prevValue === nextValue) {
			return 0;
		}
		return -1;
	}

	/**
  * return cell text elements values
  *
  * @param cell {HTMLElement}
  * @returns {string}
  */
	function textElementsValuesGet(cell) {
		var textElements = cell.querySelectorAll('.wptb-text-container');
		textElements = [].concat(_toConsumableArray(textElements));
		var value = '';
		for (var j = 0; j < textElements.length; j++) {
			var p = textElements[j].querySelector('p');
			value += p.innerText;
			if (j !== textElements.length - 1) value += ' ';
		}

		return value;
	}

	/**
  * adds cells to the collection of cells in the row or column that the table is sorted by.
  * These added cells are not originally were added in the collection,
  * because they are combined with cells from higher rows or left-side columns
  *
  * @param {event} e
  * @param {HTMLElement} table
  * @param {array} tds
  * @param {number} i
  * @param {number} tdIndexSpanPrev
  * @param {string} type
  * @returns {{tds: *}|boolean|{tds: *, i: *}}
  */
	function changeSortingTdsCollection(e, table, tds, i, tdIndexSpanPrev, type) {
		var td = tds[i];
		var tdsCollectionChanged = false;
		var collectionTds = void 0;
		var collectionTdsJSpan = void 0;
		var collectionTdsJSpanProperty = void 0;
		var indexName = void 0;
		var indexNameCamelCase = void 0;
		var indexNamePerpendicularCamelCase = void 0;
		var tdSpanProperty = void 0;
		// max rows or columns column
		var tableGroupCount = void 0;

		if (type === 'vertical') {
			collectionTdsJSpanProperty = 'colSpan';
			indexName = 'data-y-index';
			indexNameCamelCase = 'yIndex';
			indexNamePerpendicularCamelCase = 'xIndex';
			tdSpanProperty = 'rowSpan';
			tableGroupCount = table.rows.length;
		} else if (type === 'horizontal') {
			collectionTdsJSpanProperty = 'rowSpan';
			indexName = 'data-x-index';
			indexNameCamelCase = 'xIndex';
			indexNamePerpendicularCamelCase = 'yIndex';
			tdSpanProperty = 'colSpan';
			tableGroupCount = table.maxCols;
		}

		if (td.dataset[indexNameCamelCase] - tdIndexSpanPrev > 0) {
			collectionTds = table.querySelectorAll('[' + indexName + '="' + tdIndexSpanPrev + '"]');

			for (var j = 0; j < collectionTds.length; j++) {
				collectionTdsJSpan = collectionTds[j][collectionTdsJSpanProperty];
				if (!collectionTdsJSpan) collectionTdsJSpan = 1;

				if (collectionTds[j].dataset[indexNamePerpendicularCamelCase] < e.target.dataset[indexNamePerpendicularCamelCase] && parseInt(collectionTds[j].dataset[indexNamePerpendicularCamelCase], 10) + parseInt(collectionTdsJSpan, 10) > e.target.dataset[indexNamePerpendicularCamelCase]) {
					tds.splice(i, 0, collectionTds[j]);
					tdsCollectionChanged = true;
					i--;
					break;
				}
			}
		}

		if (tdsCollectionChanged) return { tds: tds, i: i };

		var tdSpan = parseInt(td[tdSpanProperty], 10);
		if (!tdSpan) tdSpan = 1;
		if (i == tds.length - 1 && parseInt(td.dataset[indexNameCamelCase], 10) + tdSpan < tableGroupCount) {
			collectionTds = table.querySelectorAll('[' + indexName + '="' + (parseInt(td.dataset[indexNameCamelCase], 10) + tdSpan) + '"]');
			for (var _j2 = 0; _j2 < collectionTds.length; _j2++) {
				collectionTdsJSpan = collectionTds[_j2][collectionTdsJSpanProperty];
				if (!collectionTdsJSpan) collectionTdsJSpan = 1;

				if (collectionTds[_j2].dataset[indexNamePerpendicularCamelCase] < e.target.dataset[indexNamePerpendicularCamelCase] && parseInt(collectionTds[_j2].dataset[indexNamePerpendicularCamelCase], 10) + parseInt(collectionTdsJSpan, 10) > e.target.dataset[indexNamePerpendicularCamelCase]) {
					tds.push(collectionTds[_j2]);
					tdsCollectionChanged = true;
					break;
				}
			}
		}

		if (tdsCollectionChanged) return { tds: tds };
		return false;
	}

	/**
  * remove cells attributes which were used for division table
  *
  * @param {HTMLElement} table
  */
	function removeCellsAttrAfterDivision(table) {
		var tdsAll = [].concat(_toConsumableArray(table.getElementsByTagName('td')));
		for (var i = 0; i < tdsAll.length; i++) {
			if (tdsAll[i].hasAttribute('data-same-cell-before-division')) {
				tdsAll[i].removeAttribute('data-same-cell-before-division');
			}
		}
	}

	/**
  * function for run sorting table vertically
  *
  * @param {event} e
  */
	this.sortableTableVerticalStart = function (e) {
		sortableTable.call(thisObject, e, table, 'vertical');
	};

	/**
  * function for run sorting table horizontally
  *
  * @param {event} e
  */
	this.sortableTableHorizontalStart = function (e) {
		sortableTable.call(thisObject, e, table, 'horizontal');
	};
};
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_Stringifier = function WPTB_Stringifier(codeMain) {
    if (codeMain) {
        var code = codeMain.cloneNode(true);
        code.dataset.tableColumns = codeMain.columns;
        code.style.width = null;
        code.style.minWidth = null;
        code.style.maxWidth = null;

        var tds = code.getElementsByTagName('td');
        if (tds.length > 0) {
            for (var i = 0; i < tds.length; i++) {

                // tds[i].removeAttribute( 'data-x-index' );
                // tds[i].removeAttribute( 'data-y-index' );
                tds[i].removeAttribute('draggable');
                tds[i].classList.remove('wptb-droppable');
                var infArr = tds[i].className.match(/wptb-element-((.+-)\d+)/i);
                if (infArr) tds[i].classList.remove(infArr[0]);
                var innerElements = tds[i].getElementsByClassName('wptb-ph-element');

                if (innerElements.length > 0) {
                    for (var j = 0; j < innerElements.length; j++) {

                        var mceContentBodys = innerElements[j].querySelectorAll('.mce-content-body');
                        if (mceContentBodys.length > 0) {
                            for (var k = 0; k < mceContentBodys.length; k++) {
                                mceContentBodys[k].classList.remove('mce-content-body');
                            }
                        }

                        var dataMceStyle = innerElements[j].querySelectorAll('[data-mce-style]');
                        if (dataMceStyle.length > 0) {
                            for (var _k = 0; _k < dataMceStyle.length; _k++) {
                                dataMceStyle[_k].removeAttribute('data-mce-style');
                            }
                        }

                        var contentEditable = innerElements[j].querySelectorAll('[contenteditable]');
                        if (contentEditable.length > 0) {
                            for (var _k2 = 0; _k2 < contentEditable.length; _k2++) {
                                contentEditable[_k2].removeAttribute('contenteditable');
                            }
                        }

                        var spellCheck = innerElements[j].querySelectorAll('[spellcheck]');
                        if (spellCheck.length > 0) {
                            for (var _k3 = 0; _k3 < spellCheck.length; _k3++) {
                                spellCheck[_k3].removeAttribute('spellcheck');
                            }
                        }

                        var mceIds = innerElements[j].querySelectorAll('[id^=mce_]');
                        if (mceIds.length > 0) {
                            for (var _k4 = 0; _k4 < mceIds.length; _k4++) {
                                mceIds[_k4].removeAttribute('id');
                            }
                        }

                        var wptbActions = innerElements[j].querySelectorAll('.wptb-actions');
                        var wptbActionsLength = wptbActions.length;
                        while (wptbActionsLength > 0) {
                            if (wptbActions[0] && wptbActions[0].parentNode) {
                                wptbActions[0].parentNode.removeChild(wptbActions[0]);
                                wptbActionsLength--;
                            } else {
                                break;
                            }
                        }

                        var dataMceBogus = innerElements[j].querySelectorAll('[data-mce-bogus]');
                        if (dataMceBogus.length > 0) {
                            dataMceBogus = [].concat(_toConsumableArray(dataMceBogus));
                            for (var _k5 = 0; _k5 < dataMceBogus.length; _k5++) {
                                if (dataMceBogus[_k5] && dataMceBogus[_k5].parentNode) {
                                    dataMceBogus[_k5].parentNode.removeChild(dataMceBogus[_k5]);
                                }
                            }
                        }
                    }
                }

                // TODO dataTitleColumnSet
                // if( tds[i].hasAttribute( 'data-wptb-title-column' ) ) {
                //     let columnNameDivContainer = document.createElement( 'div' ),
                //         columnNameDiv = document.createElement( 'div' );
                //     columnNameDivContainer.classList.add( 'wptb-column-title-mobile-container' );
                //     columnNameDiv.classList.add( 'wptb-column-title-mobile' );
                //     columnNameDiv.dataset.wptbTitleColumn = tds[i].dataset.wptbTitleColumn;
                //     columnNameDiv.setAttribute( 'style', 'font-size:' + tds[i].dataset.wptbTitleColumnFontSize + '; \n\
                //         color:' + tds[i].dataset.wptbTitleColumnColor + '; background-color:' + tds[i].dataset.wptbTitleBackgroundColor + '; text-align:' + tds[i].dataset.wptbTitleAlign + ';' );
                //     columnNameDiv.style.padding = tds[i].style.padding;
                //     if( tds[i].children.length == 0 ) {
                //         tds[i].classList.add( 'wptb-column-title-mobile-not-elements' );
                //     }
                //     columnNameDivContainer.appendChild( columnNameDiv );
                //     tds[i].insertBefore( columnNameDivContainer, tds[i].firstChild );
                // }
            }
        }

        return code;
    }
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var array = [],
    WPTB_Table = function WPTB_Table(columns, rows, wptb_preview_table) {

    /* The members of the class */
    var settings = document.getElementsByClassName('wptb-settings-items'),
        wptbTableSetup = document.getElementsByClassName("wptb-table-setup")[0],
        table,
        row,
        cell,
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
    var mark = function mark(event) {
        var thisElem = event.currentTarget;
        var rs = thisElem.rowSpan,
            cs = thisElem.colSpan,
            noCells = document.getElementsByClassName('wptb-no-cell-action'),
            singleCells = document.getElementsByClassName('wptb-single-action'),
            multipleCells = document.getElementsByClassName('wptb-multiple-select-action'),
            cellSettings = document.getElementById('wptb-left-scroll-panel-cell-settings'),
            position = getCoords(thisElem),
            row = position[0],
            column = position[1];
        if (!document.select.isActivated()) {
            return;
        }
        if (thisElem.className.match(/wptb-highlighted/)) {
            thisElem.classList.remove('wptb-highlighted');
            for (var i = 0; i < rs; i++) {
                for (var j = 0; j < cs; j++) {
                    array[row + i][column + j] = 0;
                }
            }
        } else {
            thisElem.classList.add('wptb-highlighted');
            for (var i = 0; i < rs; i++) {
                for (var j = 0; j < cs; j++) {
                    array[row + i][column + j] = 1;
                }
            }
        }

        var cellHighlighted = document.getElementsByClassName('wptb-highlighted'),
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
            cellSettings.classList.remove('visible');
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
            WPTB_Helper.elementOptionsSet('table_cell_setting', cellHighlighted);

            var _infArr = cellHighlighted.className.match(/wptb-element-((.+-)\d+)/i);

            var controlElemIds = ['cellWidth', 'cellHeight'];

            controlElemIds.map(function (s) {
                var elementControlSizeUnicClass = 'wptb-el-' + _infArr[1] + '-' + s,
                    elementControlSizeFixedUnicClass = 'wptb-el-' + _infArr[1] + '-' + s + 'Fixed';
                if (s === 'cellWidth' || s === 'cellHeight') {
                    var sizeName = '',
                        getSizeFunctionName = '';
                    if (s === 'cellWidth') {
                        sizeName = 'width';
                        getSizeFunctionName = 'getColumnWidth';
                    } else if (s === 'cellHeight') {
                        sizeName = 'height';
                        getSizeFunctionName = 'getRowHeight';
                    }
                    var size = cellHighlighted.style[sizeName],
                        cellSizeInputs = document.querySelectorAll('.' + elementControlSizeUnicClass),
                        cellSizeFixedInput = document.querySelector('.' + elementControlSizeFixedUnicClass);
                    cellSizeInputs = [].concat(_toConsumableArray(cellSizeInputs));

                    if (!size && !cellHighlighted.dataset['wptbFixed' + sizeName.toUpperCase()]) {
                        size = WPTB_Helper[getSizeFunctionName](table, cellHighlighted);
                        cellSizeInputs.map(function (s) {
                            s.value = size;
                        });

                        cellSizeFixedInput.checked = false;
                    } else {
                        cellSizeInputs.map(function (s) {
                            if (size) {
                                s.value = parseFloat(size, 10);
                            } else if (cellHighlighted.dataset['wptbFixed' + sizeName.toUpperCase()]) {
                                s.value = cellHighlighted.dataset['wptbFixed' + sizeName.toUpperCase()];
                            }
                        });

                        cellSizeFixedInput.checked = true;
                    }
                }
            });

            cellSettings.classList.add('visible');
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
            cellSettings.classList.remove('visible');
        }

        /**
         * empty cell setting
         */
        // let emptySetting = document.
        var infArr = thisElem.className.match(/wptb-element-table_cell_setting-((.+-)\d+)/i);
        if (infArr && infArr.length > 1) {
            var controlKey = 'emptyCell';
            var settingId = 'wptb-el-table_cell_setting-' + infArr[1] + '-' + controlKey;
            var settingElem = document.getElementById(settingId);
            if (settingElem) {
                settingElem.querySelector('input[type="checkbox"]').checked = thisElem.classList.contains('wptb-empty');
            }
        }

        var details = { countMarkedCells: markedCells };
        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/cell/mark', thisElem, details);
    };

    /*
     * This function fills an array with 1's according to the actual design
     * of HTML table.
     * @returns an array of arrays containing an abstract representation
     * of HTML table.
     * @deprecated
     * */

    var realTimeArray = function realTimeArray() {
        var carried = [],
            tds,
            cols,
            matriz = [];

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
                if (_typeof(carried[k]) == 'object' && carried[k].amount > 0) {
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
    var carriedRowspans = function carriedRowspans(row) {
        var carried = [],
            tds,
            cols;

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
    var drawTable = function drawTable(a) {
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

    var undoSelect = function undoSelect() {
        var noCells = document.getElementsByClassName('wptb-no-cell-action'),
            singleCells = document.getElementsByClassName('wptb-single-action'),
            multipleCells = document.getElementsByClassName('wptb-multiple-select-action'),
            cellSettings = document.getElementById('wptb-left-scroll-panel-cell-settings'),
            tds = table.getElementsByClassName('wptb-highlighted');
        while (tds.length) {
            tds[0].classList.remove('wptb-highlighted');
        }
        cellSettings.classList.remove('visible');
        for (var _i = 0; _i < array.length; _i++) {
            for (var _j = 0; _j < array[_i].length; _j++) {
                array[_i][_j] = 0;
            }
        }
        for (var _i2 = 0; _i2 < multipleCells.length; _i2++) {
            multipleCells[_i2].classList.remove('visible');
            multipleCells[_i2].setAttribute('disabled', 'disabled');
        }
        for (var _i3 = 0; _i3 < noCells.length; _i3++) {
            noCells[_i3].classList.add('visible');
            noCells[_i3].removeAttribute('disabled');
        }
        for (var _i4 = 0; _i4 < singleCells.length; _i4++) {
            singleCells[_i4].classList.remove('visible');
            singleCells[_i4].setAttribute('disabled', 'disabled');
        }

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/undo-select/active', table);
    };

    /*
     * This fills the abstract representation of our table with
     * zeros, at the start. the max amount of cells is the greatest sum
     * of all colspans for row.
     */

    var fillTableArray = function fillTableArray() {
        var colspansSums = [],
            a = [];

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
    var getActualPointsInRow = function getActualPointsInRow(row) {
        var tds = table.rows[row].getElementsByTagName('td'),
            points = 0;
        for (var i = 0; i < tds.length; i++) {
            points += tds[i].colSpan;
        }
        return points;
    };

    /*
     * This function gets us the exact coordinates of
     * an exact cell, in a more reliable way than xIndex and yIndex,
     * these last ones were meant to be used for getting the cell trough them.
     * @param DOMElement the cell to get the coordinates.
     */
    var getCoords = function getCoords(search) {
        var skipInCols = [],
            cell;

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
                        for (var _k = 0; _k < td.colSpan; _k++) {
                            skipInCols[xPosition + _k] = td.rowSpan - 1;
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

    if (columns || rows) {
        //END OF PRIVATE FUNCTIONS
        for (var i = 0; i < settings.length; i++) {
            if (settings[i].id !== 'wptb-apply-inner-border') {
                settings[i].classList.add('visible');
            }
        }

        //Create a HTML Table element.
        table = document.createElement('table');
        table.classList.add('wptb-preview-table', 'wptb-element-main-table_setting-startedid-0');
        table.style.border = '0px solid';
        table.dataset.reconstraction = 1;
        //table.dataset.wptbAdaptiveTable = 1;
        //Add the data rows.
        for (var i = 0; i < rows; i++) {

            row = table.insertRow(-1);
            row.classList.add('wptb-row');

            for (var j = 0; j < columns; j++) {
                cell = new WPTB_Cell(mark);
                cell.setCoords(i, j);
                cell.getDOMElement().style.borderWidth = '1px';
                row.appendChild(cell.getDOMElement());
            }
        }
    } else {
        if (!wptb_preview_table) wptb_preview_table = document.querySelector('.wptb-preview-table');

        if (wptb_preview_table) {
            table = wptb_preview_table;

            var cells = table.getElementsByTagName('td');

            if (cells.length > 0) {
                for (var _i5 = 0; _i5 < cells.length; _i5++) {
                    WPTB_Cell(mark, cells[_i5]);
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
    table.mark = function (event) {
        mark(event);
    };

    table.wptbCell = function (callback, DOMElement) {
        return WPTB_Cell(callback, DOMElement);
    };

    table.tableSM = function () {
        return WPTB_TableStateSaveManager;
    };

    /**
     * this method run "undoSelect" method of WPTB_Table object
     * @param event
     */
    table.undoSelect = function () {
        undoSelect();
    };

    /**
     * method for set value for maxAmountOfCells
     * @param value
     */
    table.setMaxAmountOfCells = function (value) {
        maxAmountOfCells = value;
    };

    /**
     * this method return maxAmountOfCells value
     * @returns {*}
     */
    table.getMaxAmountOfCells = function () {
        return maxAmountOfCells;
    };

    /**
     * this method run "fillTableArray" method of WPTB_Table object
     * @returns {[]}
     */
    table.fillTableArray = function () {
        return fillTableArray();
    };
    /*
     * For assigning to each cell xIndex and y Index attributes,
     * these are the column number and row number of cell in table.
     */

    table.recalculateIndexes = function () {
        WPTB_Helper.recalculateIndexes(this);
    };

    table.addColumnWidth = function (value, cleaner) {
        var highlighted = table.getElementsByClassName('wptb-highlighted');
        if (highlighted.length > 0) {
            for (var _k2 = 0; _k2 < highlighted.length; _k2++) {
                var dataXIndex = highlighted[_k2].dataset.xIndex;
                if (dataXIndex) {
                    (function () {
                        var tableTdsFor = function tableTdsFor(dataXIndex, colspan) {
                            var tableRows = table.rows;
                            var widthIsSet = false;
                            var arrayTdsFromPreviousRow = [];
                            for (var _i6 = 0; _i6 < tableRows.length; _i6++) {
                                var _row = tableRows[_i6];
                                var tds = _row.children;
                                for (var _j2 = 0; _j2 < tds.length; _j2++) {
                                    var td = tds[_j2];
                                    if (td.dataset.xIndex == dataXIndex) {
                                        if (value) {
                                            if (td.colSpan == colspan) {
                                                td.style.width = value + 'px';
                                                td.removeAttribute('data-wptb-fixed-width');
                                                widthIsSet = true;
                                            } else {
                                                td.style.width = null;
                                                td.dataset.wptbFixedWidth = value;
                                                if (_i6 == tableRows.length - 1 && !widthIsSet) {
                                                    tableTdsFor(dataXIndex, colspan + 1);
                                                }
                                            }
                                        } else if (cleaner) {
                                            td.style.width = null;
                                            td.removeAttribute('data-wptb-fixed-width');
                                        } else {
                                            if (td.dataset.wptbFixedWidth) {
                                                if (td.colSpan == colspan) {
                                                    td.style.width = td.dataset.wptbFixedWidth + 'px';
                                                    td.removeAttribute('data-wptb-fixed-width');
                                                }
                                            } else if (td.style.width) {
                                                for (var z = 0; z < arrayTdsFromPreviousRow.length; z++) {
                                                    arrayTdsFromPreviousRow[z].style.width = td.style.width;
                                                }
                                                arrayTdsFromPreviousRow = [];
                                            } else {
                                                arrayTdsFromPreviousRow.push(td);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        };

                        tableTdsFor(dataXIndex, 1);
                    })();
                }
            }

            table.tdDefaultWidth();

            WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);
        }
    };

    table.tdDefaultWidth = function () {
        var rows = table.rows;

        var tableTdsSumMaxWidth = 0;
        var tableTdsSumMaxWidthFixed = 0;
        var tableTdsSumMaxWidthAuto = 0;

        var wptbTableSetup = document.getElementsByClassName('wptb-table-setup')[0];
        var wptbTableSetupWidth = wptbTableSetup.offsetWidth;

        var arrayCellsWidthFixedHelper = [];
        var arrayCellsWidthAutoHelper = [];
        var tdPaddingCommon = 0;
        var tableTdBorderCommonWidth = 0;
        var cssForTdsWidthAuto = '';

        var tableFullStyleObj = window.getComputedStyle(table, null);
        var borderLeftWidth = tableFullStyleObj.getPropertyValue('border-left-width');
        var borderRightWidth = tableFullStyleObj.getPropertyValue('border-right-width');
        var tableBorderCommon = parseFloat(borderLeftWidth, 10) + parseFloat(borderRightWidth, 10);

        for (var _i7 = 0; _i7 < rows.length; _i7++) {
            var tds = rows[_i7].children;
            for (var _j3 = 0; _j3 < tds.length; _j3++) {
                var td = tds[_j3];

                if (!arrayCellsWidthFixedHelper[parseFloat(td.dataset.xIndex)] && !arrayCellsWidthAutoHelper[parseFloat(td.dataset.xIndex)]) {
                    if (td.style.width) {
                        arrayCellsWidthFixedHelper[parseFloat(td.dataset.xIndex)] = parseFloat(td.style.width);
                        td.removeAttribute('data-wptb-css-td-auto-width');
                    } else {
                        if (!td.dataset.wptbFixedWidth) {
                            arrayCellsWidthAutoHelper[parseFloat(td.dataset.xIndex)] = table.dataset.wptbTdWidthAuto ? parseFloat(table.dataset.wptbTdWidthAuto, 10) : 100;
                            td.dataset.wptbCssTdAutoWidth = true;
                        }
                    }

                    if (window.getComputedStyle(td, null)) {
                        var tdStyleObj = window.getComputedStyle(td, null);
                        var tdPaddingLeft = tdStyleObj.getPropertyValue('padding-left');
                        var tdPaddingRight = tdStyleObj.getPropertyValue('padding-right');
                        tdPaddingCommon = parseFloat(tdPaddingLeft, 10) + parseFloat(tdPaddingRight, 10);

                        var tableTdBorderLeftWidth = tdStyleObj.getPropertyValue('border-left-width');
                        var tableTdBorderRightWidth = tdStyleObj.getPropertyValue('border-right-width');
                        tableTdBorderCommonWidth = parseFloat(tableTdBorderLeftWidth, 10) + parseFloat(tableTdBorderRightWidth, 10);
                        tableTdBorderCommonWidth = tableTdBorderCommonWidth / 2;

                        if (arrayCellsWidthFixedHelper[parseFloat(td.dataset.xIndex)]) {
                            arrayCellsWidthFixedHelper[parseFloat(td.dataset.xIndex)] += tdPaddingCommon;
                            arrayCellsWidthFixedHelper[parseFloat(td.dataset.xIndex)] += tableTdBorderCommonWidth;

                            if (_j3 == 0 && tableBorderCommon / 2 <= parseFloat(tableTdBorderLeftWidth, 10)) {
                                arrayCellsWidthFixedHelper[parseFloat(td.dataset.xIndex)] += parseFloat(tableTdBorderLeftWidth, 10) / 2;
                            } else if (_j3 == 0 && tableBorderCommon / 2 > parseFloat(tableTdBorderLeftWidth, 10)) {
                                arrayCellsWidthFixedHelper[parseFloat(td.dataset.xIndex)] += tableBorderCommon / 2 - parseFloat(tableTdBorderRightWidth, 10) / 2;
                            }

                            if (_j3 == tds.length - 1 && tableBorderCommon / 2 <= parseFloat(tableTdBorderRightWidth, 10)) {
                                arrayCellsWidthFixedHelper[parseFloat(td.dataset.xIndex)] += parseFloat(tableTdBorderRightWidth, 10) / 2;
                            } else if (_j3 == tds.length - 1 && tableBorderCommon / 2 > parseFloat(tableTdBorderRightWidth, 10)) {
                                arrayCellsWidthFixedHelper[parseFloat(td.dataset.xIndex)] += tableBorderCommon / 2 - parseFloat(tableTdBorderRightWidth, 10) / 2;
                            }
                        } else if (arrayCellsWidthAutoHelper[parseFloat(td.dataset.xIndex)]) {
                            arrayCellsWidthAutoHelper[parseFloat(td.dataset.xIndex)] += tdPaddingCommon;
                            arrayCellsWidthAutoHelper[parseFloat(td.dataset.xIndex)] += tableTdBorderCommonWidth;

                            if (_j3 == 0 && tableBorderCommon / 2 <= parseFloat(tableTdBorderLeftWidth, 10)) {
                                arrayCellsWidthAutoHelper[parseFloat(td.dataset.xIndex)] += parseFloat(tableTdBorderLeftWidth, 10) / 2;
                            } else if (_j3 == 0 && tableBorderCommon / 2 > parseFloat(tableTdBorderLeftWidth, 10)) {
                                arrayCellsWidthAutoHelper[parseFloat(td.dataset.xIndex)] += tableBorderCommon / 2 - parseFloat(tableTdBorderLeftWidth, 10) / 2;
                            }

                            if (_j3 == tds.length - 1 && tableBorderCommon / 2 <= parseFloat(tableTdBorderRightWidth, 10)) {
                                arrayCellsWidthAutoHelper[parseFloat(td.dataset.xIndex)] += parseFloat(tableTdBorderRightWidth, 10) / 2;
                            } else if (_j3 == tds.length - 1 && tableBorderCommon / 2 > parseFloat(tableTdBorderRightWidth, 10)) {
                                arrayCellsWidthAutoHelper[parseFloat(td.dataset.xIndex)] += tableBorderCommon / 2 - parseFloat(tableTdBorderLeftWidth, 10) / 2;
                            }
                        }
                    }
                } else if (arrayCellsWidthAutoHelper[parseFloat(td.dataset.xIndex)]) {
                    if (!td.dataset.wptbFixedWidth) {
                        td.dataset.wptbCssTdAutoWidth = true;
                    }
                } else if (arrayCellsWidthFixedHelper[parseFloat(td.dataset.xIndex)]) {
                    td.removeAttribute('data-wptb-css-td-auto-width');
                }
            }
        }

        for (var _i8 = 0; _i8 < arrayCellsWidthFixedHelper.length; _i8++) {
            if (arrayCellsWidthFixedHelper[_i8]) {
                tableTdsSumMaxWidthFixed += arrayCellsWidthFixedHelper[_i8];
            }
        }

        var CellsWidthAutoCount = 0;
        for (var _i9 = 0; _i9 < arrayCellsWidthAutoHelper.length; _i9++) {
            if (arrayCellsWidthAutoHelper[_i9]) {
                tableTdsSumMaxWidthAuto += arrayCellsWidthAutoHelper[_i9];
                CellsWidthAutoCount++;
            }
        }

        tableTdsSumMaxWidth = tableTdsSumMaxWidthFixed + tableTdsSumMaxWidthAuto;

        table.dataset.wptbTableTdsSumMaxWidth = tableTdsSumMaxWidth;
        if (CellsWidthAutoCount) {
            table.dataset.wptbCellsWidthAutoCount = CellsWidthAutoCount;
            if (table.mergingСellsHorizontally) {
                table.dataset.wptbFixedWidthSize = tableTdsSumMaxWidthFixed;
            } else {
                table.removeAttribute('data-wptb-fixed-width-size');
            }
        } else {
            table.removeAttribute('data-wptb-fixed-width-size');
            table.removeAttribute('data-wptb-cells-width-auto-count');
        }

        var styleElementCreate = false;
        var tableTdWidthAuto = void 0;
        if (tableTdsSumMaxWidth < wptbTableSetupWidth) {
            if (CellsWidthAutoCount) {
                table.style.minWidth = '100%';
                if (table.mergingСellsHorizontally) {
                    table.style.width = 'auto';
                    var tableTdsWidthAutoCommon = wptbTableSetupWidth - tableTdsSumMaxWidthFixed;
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

        var head = document.head;
        if (head) {
            var cssForTdsWidthAutoOld = head.querySelector('style[data-wptb-td-auto-width="true"]');
            if (cssForTdsWidthAutoOld) {
                head.removeChild(cssForTdsWidthAutoOld);
            }
        }

        if (styleElementCreate) {
            cssForTdsWidthAuto = document.createElement('style');
            cssForTdsWidthAuto.setAttribute('data-wptb-td-auto-width', true);
            cssForTdsWidthAuto.innerHTML = '[data-wptb-css-td-auto-width=true]{width:' + tableTdWidthAuto + 'px}';
            if (head) {
                head.appendChild(cssForTdsWidthAuto);
            }
        }

        if (table.dataset.wptbTableAlignment) {
            var wptbTableAlignment = table.dataset.wptbTableAlignment;

            var _wptbTableSetupWidth = wptbTableSetup.offsetWidth;
            if (_wptbTableSetupWidth < table.offsetWidth) {
                table.style.float = null;
            } else {
                if (wptbTableAlignment == 'center') {
                    table.style.float = null;
                } else {
                    table.style.float = wptbTableAlignment;
                }
            }

            if (wptbTableAlignment == 'center') {
                wptbTableSetup.style.float = null;
            } else {
                wptbTableSetup.style.float = wptbTableAlignment;
            }

            if (tableTdWidthAuto && table.dataset.wptbTableContainerMaxWidth && table.offsetWidth < table.dataset.wptbTableContainerMaxWidth) {
                table.style.width = '100%';
            }
        } else {
            table.style.float = null;
        }
    };

    table.addRowHeight = function (value, cleaner) {
        var highlighted = table.getElementsByClassName('wptb-highlighted');
        if (highlighted.length > 0) {
            for (var _k3 = 0; _k3 < highlighted.length; _k3++) {
                var dataYIndex = highlighted[_k3].dataset.yIndex;
                if (dataYIndex) {
                    (function () {
                        var tableTdsFor = function tableTdsFor(dataYIndex, rowspan) {
                            var tableRows = table.rows;
                            var heightIsSet = false;
                            var arrayTdsPrevious = [];
                            for (var _i10 = 0; _i10 < tableRows.length; _i10++) {
                                var _row2 = tableRows[_i10];
                                var tds = _row2.children;
                                for (var _j4 = 0; _j4 < tds.length; _j4++) {
                                    var td = tds[_j4];
                                    if (td.dataset.yIndex == dataYIndex) {
                                        if (value) {
                                            if (td.rowSpan == rowspan) {
                                                td.style.height = value + 'px';
                                                td.removeAttribute('data-wptb-fixed-heidht');
                                                heightIsSet = true;
                                                continue;
                                            } else {
                                                td.style.height = null;
                                                td.dataset.wptbFixedHeight = value;
                                                if (_j4 == tds.length - 1 && !heightIsSet) {
                                                    tableTdsFor(dataYIndex, rowspan + 1);
                                                }
                                            }
                                        } else if (cleaner) {
                                            td.style.height = null;
                                            td.removeAttribute('data-wptb-fixed-heidht');
                                        } else {
                                            if (td.dataset.wptbFixedHeight) {
                                                if (td.rowSpan = rowspan) {
                                                    td.style.height = td.dataset.wptbFixedHeight + 'px';
                                                    td.removeAttribute('data-wptb-fixed-width');
                                                }
                                            } else if (td.style.height) {
                                                for (var z = 0; z < arrayTdsPrevious.length; z++) {
                                                    arrayTdsPrevious[z].style.height = td.style.height;
                                                }
                                                arrayTdsPrevious = [];
                                            } else {
                                                arrayTdsPrevious.push(td);
                                            }
                                        }
                                    }
                                }
                            }
                        };

                        tableTdsFor(dataYIndex, 1);
                    })();
                }
            }

            WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);
        }
    };

    table.reconstraction = function () {
        var tds = table.getElementsByTagName('td');
        table.mergingСellsHorizontally = false;
        table.mergingCellsVertically = false;
        table.dataset.reconstraction = 1;
        var forBreak = 0;
        for (var _i11 = 0; _i11 < tds.length; _i11++) {
            if (tds[_i11].colSpan > 1) {
                table.dataset.reconstraction = 0;
                table.mergingСellsHorizontally = true;
                forBreak++;
            }

            if (tds[_i11].rowSpan > 1) {
                table.dataset.reconstraction = 0;
                table.mergingCellsVertically = true;
                forBreak++;
            }

            if (forBreak == 2) {
                break;
            }
        }
    };

    /*
     * As simple as it is: adds a column to the end of table.
     */
    table.addColumnEnd = function () {
        var td = void 0,
            currentTable = document.getElementsByClassName('wptb-preview-table'),
            currentTableTd = void 0,
            currentTdStyle = void 0;
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
        WPTB_Helper.dataTitleColumnSet(table);
        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * As simple as it looks: adds a column to the start of table.
     */

    table.addColumnStart = function () {
        var td = void 0,
            firstCell = void 0,
            currentTable = document.getElementsByClassName('wptb-preview-table'),
            currentTableTd = void 0,
            currentTdStyle = void 0;
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
        WPTB_Helper.dataTitleColumnSet(table);
        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * Well, not so simple as previous functions.
     * It adds a column after a certain column of reference.
     * @param integer the column number to be used as reference.
     *	If empty, then the first highlighted cell is used as reference.
     */

    table.addColumnAfter = function (c_pos) {
        var rows = table.rows,
            cell = void 0,
            cellStyle = void 0,
            pos = void 0;

        if (c_pos != undefined && typeof c_pos === 'number') {
            pos = c_pos;
            cell = document.querySelector('[data-x-index="' + pos + '"]');
        } else {
            cell = document.querySelector('.wptb-highlighted');
            pos = getCoords(cell)[1];
        }

        if (cell) {
            cellStyle = cell.getAttribute('style');

            if (maxAmountOfCells - pos - cell.colSpan + 1 == 1) {
                table.addColumnEnd();
            } else {
                var newTd = function newTd(cellStyle) {
                    var td = new WPTB_Cell(mark);
                    if (cellStyle) {
                        td.getDOMElement().setAttribute('style', cellStyle);
                        td.getDOMElement().style.width = null;
                        td.getDOMElement().style.height = null;
                    }
                    td.getDOMElement().style.borderColor = WPTB_TableSettingsData.getTableSetting('borderColor');
                    return td;
                };

                for (var _i12 = 0; _i12 < rows.length; _i12++) {
                    var tds = rows[_i12].children;
                    for (var _j5 = 0; _j5 < tds.length; _j5++) {
                        if (parseInt(tds[_j5].dataset.xIndex) <= pos) {
                            if (parseInt(tds[_j5].dataset.xIndex) + tds[_j5].colSpan == pos + cell.colSpan) {
                                var td = newTd(cellStyle);
                                var nextSib = tds[_j5].nextSibling;
                                if (nextSib) {
                                    rows[_i12].insertBefore(td.getDOMElement(), nextSib);
                                } else {
                                    rows[_i12].appendChild(td.getDOMElement());
                                }

                                break;
                            } else if (parseInt(tds[_j5].dataset.xIndex) + tds[_j5].colSpan > pos + cell.colSpan) {
                                tds[_j5].colSpan++;
                                if (tds[_j5].rowSpan > 1) _i12 += tds[_j5].rowSpan - 1;
                                break;
                            }
                        } else if (parseInt(tds[_j5].dataset.xIndex) > pos) {
                            var _td = newTd(cellStyle);
                            rows[_i12].insertBefore(_td.getDOMElement(), tds[_j5]);
                            break;
                        }
                    }
                }

                for (var i = 0; i < array.length; i++) {
                    array[i].push(0);
                }
                maxAmountOfCells++;
                drawTable(array);
                table.recalculateIndexes();
                table.addColumnWidth();
                table.addRowHeight();
                WPTB_Helper.dataTitleColumnSet(table);
                undoSelect();

                WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

                var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
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
        var r = table.insertRow(-1),
            td = void 0,
            aux = void 0,
            currentTable = document.getElementsByClassName('wptb-preview-table');
        r.classList.add('wptb-row');
        if (currentTable.length > 0) {
            currentTable = currentTable[0];

            for (var i = 0; i < maxAmountOfCells; i++) {
                td = new WPTB_Cell(mark);
                var currentTableTd = currentTable.querySelector('[data-x-index="' + i + '"]');
                if (currentTableTd) {
                    var currentTdStyle = currentTableTd.getAttribute('style');

                    td.getDOMElement().setAttribute('style', currentTdStyle);
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
            WPTB_Helper.dataTitleColumnSet(table);
            undoSelect();

            WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    };

    /*
     * Yet another simple function,
     * it just add a row to the start of table.
     */

    table.addRowToTheStart = function () {
        var r = table.insertRow(0),
            td = void 0,
            aux = void 0,
            currentTable = document.getElementsByClassName('wptb-preview-table'),
            currentTableTd = void 0,
            currentTdStyle = void 0;
        r.classList.add('wptb-row');
        if (currentTable.length > 0) {
            currentTable = currentTable[0];

            for (var i = 0; i < maxAmountOfCells; i++) {
                td = new WPTB_Cell(mark);
                var _currentTableTd = currentTable.querySelector('[data-x-index="' + i + '"]');
                if (_currentTableTd) {
                    var _currentTdStyle = _currentTableTd.getAttribute('style');

                    td.getDOMElement().setAttribute('style', _currentTdStyle);
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
            WPTB_Helper.dataTitleColumnSet(table);
            undoSelect();

            WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    };

    /*
     * This function adds a row before the current one.
     * Since the biggest factor of problem is a not-started but ongoing rowspan,
     * the most of the troubles is not here.
     */

    table.addRowBefore = function () {
        var cell = document.querySelector('.wptb-highlighted'),
            cellStyle = cell.getAttribute('style'),
            row = getCoords(cell)[0],
            cellNew = void 0;

        if (row === 0) {
            row = -1;
        }

        for (var _i13 = row - 1; _i13 >= 0; _i13--) {
            var rowChildren = table.rows[_i13].children;
            var rowChildrenLength = rowChildren.length;
            if (rowChildrenLength > 0) {
                for (var _j6 = 0; _j6 < rowChildrenLength; _j6++) {
                    if (rowChildren[_j6].rowSpan == 1) {
                        row = _i13;
                        cellNew = true;
                        break;
                    }
                }
            }
            if (cellNew) {
                break;
            }
        }

        if (row === -1) {
            table.addRowToTheStart();
        } else {
            table.addRowAfter(row, cellStyle);
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

    table.addRowAfter = function (row, cellStyle) {
        var cellRowSpan = void 0,
            rowAfter = void 0,
            aux = void 0;

        if ((row == undefined || typeof row !== 'number') && cellStyle == undefined) {
            var _cell = document.querySelector('.wptb-highlighted');
            cellStyle = _cell.getAttribute('style'), row = getCoords(_cell)[0], cellRowSpan = _cell.rowSpan, rowAfter = row + cellRowSpan - 1;
        } else {
            rowAfter = row;
        }

        var cellsColSpan = 0;
        if (rowAfter < table.rows.length - 1) {
            for (var _i14 = 0; _i14 <= rowAfter; _i14++) {
                var tableRowsIChildren = table.rows[_i14].children,
                    tableRIChildrenLength = tableRowsIChildren.length;
                if (tableRIChildrenLength > 0) {
                    for (var _j7 = 0; _j7 < tableRIChildrenLength; _j7++) {
                        var rowIRowSpan = tableRowsIChildren[_j7].rowSpan;

                        if (rowIRowSpan - 1 + _i14 > rowAfter) {
                            tableRowsIChildren[_j7].rowSpan++;
                        }
                    }
                }
            }

            var rNext = table.rows[rowAfter + 1],
                rNextChildren = rNext.children,
                rNextChildrenLength = rNextChildren.length;

            if (rNextChildrenLength > 0) {
                for (var _i15 = 0; _i15 < rNextChildrenLength; _i15++) {
                    cellsColSpan += rNextChildren[_i15].colSpan;
                }
            }
        } else {
            cellsColSpan = array[0].length;
        }

        var r = table.insertRow(rowAfter + 1);
        r.classList.add('wptb-row');

        for (j = 0; j < cellsColSpan; j++) {
            var td = new WPTB_Cell(mark);
            var currentTableTd = table.querySelector('[data-x-index="' + j + '"]');
            if (currentTableTd) {
                var currentTdStyle = currentTableTd.getAttribute('style');

                td.getDOMElement().setAttribute('style', currentTdStyle);
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
        WPTB_Helper.dataTitleColumnSet(table);
        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after');

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
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
                    if (j < columnStart || columnStart == -1) {
                        columnStart = j;
                    }
                    if (i < rowStart || rowStart == -1) {
                        rowStart = i;
                    }
                }
            }
        }

        for (var i = a.length - 1; i > -1; i--) {
            for (var j = a[i].length - 1; j > -1; j--) {
                if (a[i][j] == 1) {
                    if (j > columnEnd) {
                        columnEnd = j;
                    }
                    if (i > rowEnd) {
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

        for (var _i16 = 0; _i16 < tds.length; _i16++) {
            var tdsInternalElements = tds[_i16].getElementsByClassName('wptb-ph-element');
            if (tdsInternalElements.length > 0) {
                var tdsIntElemLength = tdsInternalElements.length;
                for (var _j8 = 0; _j8 < tdsIntElemLength; _j8++) {
                    tdsChildrenNew.push(tdsInternalElements[_j8]);
                }
            }
            var p = tds[_i16].parentNode;
            p.removeChild(tds[_i16]);
        }
        if (tdsChildrenNew.length > 0) {
            for (var _i17 = 0; _i17 < tdsChildrenNew.length; _i17++) {
                first.appendChild(tdsChildrenNew[_i17]);
            }
        }

        first.colSpan = colspan;
        first.rowSpan = rowspan;
        table.recalculateIndexes();
        table.reconstraction();
        var firstWidth = first.style.width;
        var firstDataFixedWidth = first.dataset.wptbFixedWidth;
        if (firstWidth) {
            table.addColumnWidth(parseFloat(firstWidth, 10));
        } else if (firstDataFixedWidth) {
            table.addColumnWidth();
        } else {
            table.addColumnWidth(false, true);
        }

        var firstHeight = first.style.height;
        var firstDataFixedHeight = first.dataset.wptbFixedHeight;
        if (firstHeight) {
            table.addRowHeight(parseFloat(firstHeight, 10));
        } else if (firstDataFixedHeight) {
            table.addRowHeight();
        } else {
            table.addRowHeight(false, true);
        }
        WPTB_Helper.dataTitleColumnSet(table);
        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
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
            cellXIndex = cell.dataset.xIndex;

        cell.rowSpan = 1;
        cell.colSpan = 1;

        for (var _i18 = 1; _i18 < colspan; _i18++) {
            var td = new WPTB_Cell(mark);
            td.getDOMElement().setAttribute('style', cellStyles);
            td.getDOMElement().classList.add('wptb-highlighted');
            if (cell.nextSibling) {
                thisRow.insertBefore(td.getDOMElement(), cell.nextSibling);
            } else {
                thisRow.appendChild(td.getDOMElement());
            }
        }

        if (rowspan > 1) {
            for (var _i19 = 1; _i19 < rowspan; _i19++) {
                var rowChildInsertBefore = undefined,
                    rowNext = table.rows[row + _i19],
                    rowChildren = rowNext.children,
                    rowChildrenLength = rowChildren.length;

                if (rowChildrenLength > 0) {
                    for (var _k4 = 0; _k4 < rowChildrenLength; _k4++) {
                        if (Number(rowChildren[_k4].dataset.xIndex) > Number(cellXIndex)) {
                            rowChildInsertBefore = rowChildren[_k4];
                            break;
                        }
                    }
                }
                for (var _j9 = 0; _j9 < colspan; _j9++) {
                    var _td2 = new WPTB_Cell(mark);
                    _td2.getDOMElement().setAttribute('style', cellStyles);
                    if (rowChildInsertBefore != undefined) {
                        rowNext.insertBefore(_td2.getDOMElement(), rowChildInsertBefore);
                    } else {
                        rowNext.appendChild(_td2.getDOMElement());
                    }
                }
            }
        }

        table.recalculateIndexes();
        table.reconstraction();
        table.addColumnWidth();
        table.addRowHeight();
        WPTB_Helper.dataTitleColumnSet(table);
        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
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
    };

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
        var cell = document.querySelector('.wptb-highlighted'),
            cellStyles = cell.getAttribute('style'),
            rowspan = cell.rowSpan,
            row = getCoords(cell)[0],
            thisRow = void 0,
            aux = void 0;

        if (rowspan == undefined) rowspan = 1;

        for (var _i20 = 0; _i20 < rowspan; _i20++) {
            thisRow = table.rows[row];
            var thisRowChildren = thisRow.children,
                nextRow = table.rows[row + 1],
                nextRowChildren = void 0,
                nextRowChildrenLength = void 0,
                tdArr = [];

            if (nextRow != undefined) {
                nextRowChildren = nextRow.children;
                nextRowChildrenLength = nextRowChildren.length;
                for (var _j10 = 0; _j10 < thisRowChildren.length; _j10++) {
                    if (thisRowChildren[_j10].rowSpan > 1) {
                        var td = new WPTB_Cell(mark);
                        td.getDOMElement().setAttribute('style', cellStyles);
                        td.getDOMElement().colSpan = thisRowChildren[_j10].colSpan;
                        td.getDOMElement().rowSpan = thisRowChildren[_j10].rowSpan - 1;

                        var nextRowChildrenK = undefined;
                        for (var _k5 = 0; _k5 < nextRowChildrenLength; _k5++) {
                            if (Number(nextRowChildren[_k5].dataset.xIndex) > Number(thisRowChildren[_j10].dataset.xIndex)) {
                                nextRowChildrenK = nextRowChildren[_k5];
                                break;
                            }
                        }

                        if (nextRowChildrenK) {
                            tdArr.push([td, nextRowChildrenK]);
                        } else {
                            tdArr.push([td]);
                        }
                    }
                }

                if (tdArr.length > 0) {
                    for (var _k6 = 0; _k6 < tdArr.length; _k6++) {
                        if (tdArr[_k6][1] != undefined) {
                            nextRow.insertBefore(tdArr[_k6][0].getDOMElement(), tdArr[_k6][1]);
                        } else {
                            nextRow.appendChild(tdArr[_k6][0].getDOMElement());
                        }
                    }
                }
            }

            var tableRows = table.rows;
            if (tableRows.length > 0) {
                for (var _j11 = 0; _j11 < row; _j11++) {
                    var jRowChildren = tableRows[_j11].children;
                    if (jRowChildren.length > 0) {
                        for (var x = 0; x < jRowChildren.length; x++) {
                            if (jRowChildren[x].rowSpan - 1 >= row - _j11) {
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

            if (table.rows.length == 0) {
                WPTB_Helper.toggleTableEditMode();
                wptbTableSetup.innerHTML = '';
                document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
                var wptbSaveBtn = document.getElementsByClassName('wptb-save-btn');
                if (wptbSaveBtn.length > 0) {
                    wptbSaveBtn = wptbSaveBtn[0];

                    wptbSaveBtn.classList.add('wptb-save-disabled');
                    wptbSaveBtn.classList.remove('active');
                }
            } else {
                table.recalculateIndexes();
                WPTB_Helper.tableRowsColorsReinstall(table);
                WPTB_Helper.dataTitleColumnSet(table);
                table.reconstraction();
            }
        }

        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * This function deletes the column of currently
     * selected cell. Again, this is way more complicated than
     * delete row case.
     */

    table.deleteColumn = function () {
        var cell = document.querySelector('.wptb-highlighted'),
            cellXIndex = cell.dataset.xIndex,
            colspan = cell.colSpan;

        for (var _i21 = 0; _i21 < colspan; _i21++) {
            for (var _j12 = 0; _j12 < table.rows.length; _j12++) {
                var rowChildren = table.rows[_j12].children;
                var rowChildrenLength = rowChildren.length;
                if (rowChildrenLength > 0) {
                    for (var _k7 = rowChildrenLength - 1; _k7 >= 0; _k7--) {
                        if (Number(rowChildren[_k7].dataset.xIndex) == Number(cellXIndex)) {
                            if (rowChildren[_k7].colSpan > 1) {
                                rowChildren[_k7].colSpan--;
                            } else {
                                table.rows[_j12].removeChild(rowChildren[_k7]);
                            }
                            break;
                        } else if (Number(rowChildren[_k7].dataset.xIndex) < Number(cellXIndex) && Number(rowChildren[_k7].dataset.xIndex) + Number(rowChildren[_k7].colSpan - 1) >= cellXIndex) {
                            if (rowChildren[_k7].colSpan > 1) {
                                rowChildren[_k7].colSpan--;
                            }
                            break;
                        }
                    }
                }
            }

            for (var _j13 = 0; _j13 < table.rows.length; _j13++) {
                if (array[_j13] != undefined) array[_j13].pop();
            }

            maxAmountOfCells--;

            if (table.querySelectorAll('td').length == 0) {
                WPTB_Helper.toggleTableEditMode();
                wptbTableSetup.innerHTML = '';
                document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
                var wptbSaveBtn = document.getElementsByClassName('wptb-save-btn');
                if (wptbSaveBtn.length > 0) {
                    wptbSaveBtn = wptbSaveBtn[0];

                    wptbSaveBtn.classList.add('wptb-save-disabled');
                    wptbSaveBtn.classList.remove('active');
                }
            } else {
                table.recalculateIndexes();
                table.tdDefaultWidth();
                WPTB_Helper.dataTitleColumnSet(table);
                table.reconstraction();
            }
        }

        undoSelect();

        WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-changed/after', table);

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    // @deprecated old generate logic
    // document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';

    array = fillTableArray();

    undoSelect();
    drawTable(array);

    wptbTableSetup.appendChild(table);
    //if (columns || rows) {
    table.recalculateIndexes(true);
    //}
    table.reconstraction();
    table.tdDefaultWidth();

    wptbTableSetup.onresize = function () {
        table.tdDefaultWidth();
    };

    WPTB_LeftPanel();

    // event hook to signal that table is generated and ready to be used
    WPTB_Helper.wptbDocumentEventGenerate('wptb:table:generated', document);

    WPTB_Helper.elementStartScript(table, 'table_setting');
    WPTB_Helper.elementOptionsSet('table_setting', table);

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
var WPTB_TableSettingsData = {
    borderColor: '',
    /**
     *
     * @param {string} name
     * @param {string} value
     */
    setTableSetting: function setTableSetting(name, value) {
        this[name] = value;
    },
    /**
     *
     * @param {string} name
     * @returns {*}
     */
    getTableSetting: function getTableSetting(name) {
        return this[name];
    }
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var WPTB_TableStateSaveManager = function WPTB_TableStateSaveManager() {
	this.tableStateSet = function (generate) {
		if (generate && window.wptbTableStateSaving && Array.isArray(window.wptbTableStateSaving)) {
			return;
		}

		// get table setup
		var wptbTableSetup = document.getElementsByClassName('wptb-table-setup');
		var wptbPreviewTable = '';
		if (wptbTableSetup.length > 0) {
			wptbTableSetup = wptbTableSetup[0];

			wptbPreviewTable = wptbTableSetup.querySelector('.wptb-preview-table');
		} else {
			wptbTableSetup = '';
		}

		// check if a global array doesn't exist with saved versions of the table
		// them create it
		if (!window.wptbTableStateSaving && !Array.isArray(window.wptbTableStateSaving)) {
			window.wptbTableStateSaving = [];
		}

		// remove the extra part of the array after changing the table
		// when it is showed in the not last modified version
		if (window.wptbTableStateSaving.length > window.wptbTableStateNumberShow) {
			window.wptbTableStateSaving = window.wptbTableStateSaving.slice(0, window.wptbTableStateNumberShow + 1);
		}

		// add new state of table
		var wptbNewTableSetup = '';
		if (wptbTableSetup) {
			wptbNewTableSetup = wptbTableSetup.cloneNode(true);
			var wptbHighlighted = wptbNewTableSetup.getElementsByClassName('wptb-highlighted');
			for (var i = 0; i < wptbHighlighted.length; i++) {
				wptbHighlighted[i].classList.remove('wptb-highlighted');
			}
			var wptbDirectlyhovered = wptbNewTableSetup.getElementsByClassName('wptb-directlyhovered');
			for (var _i = 0; _i < wptbDirectlyhovered.length; _i++) {
				wptbDirectlyhovered[_i].classList.remove('wptb-directlyhovered');
			}
			var mceContentBodys = wptbNewTableSetup.querySelectorAll('.mce-content-body');
			if (mceContentBodys.length > 0) {
				for (var k = 0; k < mceContentBodys.length; k++) {
					mceContentBodys[k].classList.remove('mce-content-body');
				}
			}
			var dataMceStyle = wptbNewTableSetup.querySelectorAll('[data-mce-style]');
			if (dataMceStyle.length > 0) {
				for (var _k = 0; _k < dataMceStyle.length; _k++) {
					dataMceStyle[_k].removeAttribute('data-mce-style');
				}
			}
			var mceIds = wptbNewTableSetup.querySelectorAll('[id^=mce_]');
			if (mceIds.length > 0) {
				for (var _k2 = 0; _k2 < mceIds.length; _k2++) {
					mceIds[_k2].removeAttribute('id');
				}
			}
		}

		var cssForTdsWidthAutoValue = '';
		var _document = document,
		    head = _document.head;

		if (head) {
			var cssForTdsWidthAuto = head.querySelector('style[data-wptb-td-auto-width="true"]');
			if (cssForTdsWidthAuto) {
				cssForTdsWidthAutoValue = cssForTdsWidthAuto.innerHTML;
			}
		}

		var wptbTableTitle = '';
		var wptbSetupName = document.getElementById('wptb-setup-name');
		if (wptbSetupName) wptbTableTitle = wptbSetupName.value;

		window.wptbTableStateSaving.push([wptbNewTableSetup, cssForTdsWidthAutoValue, wptbTableTitle]);

		// set new number of state which is showed now
		window.wptbTableStateNumberShow = window.wptbTableStateSaving.length - 1;

		// make undo arrow active when the table was changed
		if (window.wptbTableStateSaving.length - 1 > 0) {
			var wptbUndo = document.getElementsByClassName('wptb-undo');
			if (wptbUndo.length > 0) {
				wptbUndo = wptbUndo[0];

				wptbUndo.classList.remove('wptb-undoredo-disabled');
			}
		}

		// make redo arrow not active when the table was changed
		var wptbRedo = document.getElementsByClassName('wptb-redo');
		if (wptbRedo.length > 0) {
			wptbRedo = wptbRedo[0];

			wptbRedo.classList.add('wptb-undoredo-disabled');
		}

		var wptbSaveBtn = document.getElementsByClassName('wptb-save-btn');
		if (wptbSaveBtn.length > 0) {
			wptbSaveBtn = wptbSaveBtn[0];
			if (!wptbSaveBtn.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0 || window.wptbTableStateNumberShow == wptbSaveBtn.dataset.wptbTableStateNumberSave || !wptbPreviewTable) {
				wptbSaveBtn.classList.add('wptb-save-disabled');
				wptbSaveBtn.classList.remove('active');
			} else {
				wptbSaveBtn.classList.remove('wptb-save-disabled');
				wptbSaveBtn.classList.add('active');
			}
		}
	};

	this.tableStateGet = function (datawptbUndoredo) {
		if (datawptbUndoredo && window.wptbTableStateSaving && window.wptbTableStateSaving.length > 0) {
			// changes the number of the state which displays now
			if (datawptbUndoredo == 'undo') {
				if (window.wptbTableStateNumberShow > 0) {
					window.wptbTableStateNumberShow--;
				} else {
					return false;
				}
			} else if (datawptbUndoredo == 'redo') {
				if (window.wptbTableStateNumberShow < window.wptbTableStateSaving.length) {
					window.wptbTableStateNumberShow++;
				} else {
					return false;
				}
			}

			// add or delete class "wptb-undoredo-disabled" for undo button
			var wptbUndo = document.getElementsByClassName('wptb-undo');
			if (wptbUndo.length > 0) {
				wptbUndo = wptbUndo[0];

				if (window.wptbTableStateNumberShow == 0) {
					if (wptbUndo) {
						wptbUndo.classList.add('wptb-undoredo-disabled');
					}
				} else if (window.wptbTableStateNumberShow > 0) {
					if (wptbUndo) {
						wptbUndo.classList.remove('wptb-undoredo-disabled');
					}
				}
			}

			// add or delete class "wptb-undoredo-disabled" for redo button
			var wptbRedo = document.getElementsByClassName('wptb-redo');
			if (wptbRedo.length > 0) {
				wptbRedo = wptbRedo[0];

				if (window.wptbTableStateNumberShow == window.wptbTableStateSaving.length - 1) {
					if (wptbRedo) {
						wptbRedo.classList.add('wptb-undoredo-disabled');
					}
				} else if (window.wptbTableStateNumberShow < window.wptbTableStateSaving.length - 1) {
					if (wptbRedo) {
						wptbRedo.classList.remove('wptb-undoredo-disabled');
					}
				}
			}

			// add or delete class "wptb-save-disabled" for save button
			var wptbSaveBtn = document.getElementsByClassName('wptb-save-btn');
			if (wptbSaveBtn.length > 0) {
				wptbSaveBtn = wptbSaveBtn[0];
				if (!wptbSaveBtn.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0 || window.wptbTableStateNumberShow == wptbSaveBtn.dataset.wptbTableStateNumberSave) {
					wptbSaveBtn.classList.add('wptb-save-disabled');
					wptbSaveBtn.classList.remove('active');
				} else {
					wptbSaveBtn.classList.add('active');
					wptbSaveBtn.classList.remove('wptb-save-disabled');
				}
			}

			// load necessary saved table state
			var wptbTableSetup = document.getElementsByClassName('wptb-table-setup');
			if (wptbTableSetup.length > 0) {
				wptbTableSetup = wptbTableSetup[0];

				// wptbTableSetup.outerHTML = '';
				if (window.wptbTableStateSaving[window.wptbTableStateNumberShow]) {
					if (window.wptbTableStateSaving[window.wptbTableStateNumberShow][0] && _typeof(window.wptbTableStateSaving[window.wptbTableStateNumberShow][0]) === 'object') {
						if ('outerHTML' in window.wptbTableStateSaving[window.wptbTableStateNumberShow][0]) {
							wptbTableSetup.outerHTML = window.wptbTableStateSaving[window.wptbTableStateNumberShow][0].outerHTML;
						}
					}

					var wptbTableSetupNew = document.querySelector('.wptb-table-setup');
					if (wptbTableSetupNew && wptbTableSetupNew.children.length == 0) {
						document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
						wptbSaveBtn.classList.add('wptb-save-disabled');
						wptbSaveBtn.classList.remove('active');
					} else {
						document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
					}

					// add or change or delete style element in the head for table cells who have auto width
					var _document2 = document,
					    head = _document2.head;

					if (head) {
						var cssForTdsWidthAutoOld = head.querySelector('style[data-wptb-td-auto-width="true"]');
						if (cssForTdsWidthAutoOld) {
							head.removeChild(cssForTdsWidthAutoOld);
						}

						if (window.wptbTableStateSaving[window.wptbTableStateNumberShow][1]) {
							var cssForTdsWidthAuto = document.createElement('style');
							cssForTdsWidthAuto.setAttribute('data-wptb-td-auto-width', true);
							cssForTdsWidthAuto.innerHTML = window.wptbTableStateSaving[window.wptbTableStateNumberShow][1];
							head.appendChild(cssForTdsWidthAuto);
						}
					}

					// change value of table title field
					var wptbSetupName = document.getElementById('wptb-setup-name');
					if (typeof window.wptbTableStateSaving[window.wptbTableStateNumberShow][2] !== 'undefined') {
						if (wptbSetupName) wptbSetupName.value = window.wptbTableStateSaving[window.wptbTableStateNumberShow][2];
					}
				}

				var body = document.getElementsByTagName('body');
				if (body.length > 0) {
					body = body[0];
				}

				WPTB_Helper.elementOptionsPanelClear();
				WPTB_LeftPanel();

				var wptbLeftScrollPanelCellSetting = document.getElementById('wptb-left-scroll-panel-cell-settings');
				if (wptbLeftScrollPanelCellSetting) {
					wptbLeftScrollPanelCellSetting.classList.remove('visible');
				}
			}
		}
	};

	this.tableStateClear = function () {
		delete window.wptbTableStateSaving;
		delete window.wptbTableStateNumberShow;

		var wptbSaveBtn = document.getElementsByClassName('wptb-save-btn');
		if (wptbSaveBtn.length > 0) {
			wptbSaveBtn = wptbSaveBtn[0];

			wptbSaveBtn.removeAttribute('data-wptb-table-state-number-save');
		}

		var wptbUndo = document.getElementsByClassName('wptb-undo');
		if (wptbUndo.length > 0) {
			wptbUndo = wptbUndo[0];

			wptbUndo.classList.add('wptb-undoredo-disabled');
		}

		var wptbRedo = document.getElementsByClassName('wptb-redo');
		if (wptbRedo.length > 0) {
			wptbRedo = wptbRedo[0];

			wptbRedo.classList.add('wptb-undoredo-disabled');
		}
	};
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Responsive class assignment for frontend operations.
 *
 * This file can be used as an UMD.
 */
(function assignToGlobal(key, context, factory) {
	if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined') {
		module.exports = factory();
	} else {
		// eslint-disable-next-line no-param-reassign
		context[key] = factory();
	}
	// eslint-disable-next-line no-restricted-globals
})('WPTB_ResponsiveFrontend', self || global, function () {
	/**
  * Log a message to console.
  *
  * @param {string} message message to be logged
  * @param {string} type console log type (e.g info, warn, error)
  * @throws An error will be given for invalid type value
  */
	function logToConsole(message) {
		var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'log';

		if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
			if (console[type]) {
				console[type]('[WPTB]: ' + message);
			} else {
				throw new Error('no logging type found with given type value of [' + type + ']');
			}
		}
	}

	/**
  * Object implementation for cell element operations.
  * If an empty cellElement parameter is given, a fresh cell element will be created.
  *
  * @param {HTMLElement | null} cellElement cell element
  * @param {null | CellObject} [isReference=null] main cell object if the current cell is a reference to that cell in cases like merged cells
  * @constructor
  */
	function CellObject(cellElement) {
		var _this = this;

		var reference = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		// cell element
		this.element = cellElement;

		this.referenceObject = reference;

		// variable for deciding part of merged cells to be visible or not
		this.mergedRenderStatus = true;

		// connected merged cell references
		this.mergedCells = {
			row: [],
			column: []
		};

		/**
   * Get merged render status.
   * @return {boolean} render status
   */
		this.getMergedRenderStatus = function () {
			return _this.mergedRenderStatus;
		};

		/**
   * Set merged render status.
   * @param {boolean} status render status
   */
		this.setMergedRenderStatus = function (status) {
			_this.mergedRenderStatus = status;
		};

		/**
   * Add merged cells.
   *
   * @param {string} mergeType merge type
   * @param {CellObject} cellObj cell object instance
   */
		this.addToMergedCells = function (mergeType, cellObj) {
			_this.mergedCells[mergeType].push(cellObj);
		};

		/**
   * Determine if current cell is a reference to a main cell.
   * @return {boolean} a reference or not
   */
		this.isReference = function () {
			return _this.referenceObject !== null;
		};

		if (this.isReference()) {
			this.element = cellElement.cloneNode(true);
		}

		// modifications object
		// this object will keep track of the modifications that has done to the cell to make sure we can roll them back to their original values
		this.modifications = {};

		// spans object for cell's original merge values
		this.spans = {
			row: 1,
			col: 1
		};

		this.remainingSpans = {
			row: 0,
			col: 0
		};

		/**
   * Cache cell element's original span values.
   * @private
   */
		this.cacheSpanValues = function () {
			// eslint-disable-next-line array-callback-return
			Object.keys(_this.spans).map(function (k) {
				if (Object.prototype.hasOwnProperty.call(_this.spans, k)) {
					var defaultVal = _this.spans[k];

					_this.spans[k] = _this.element.getAttribute(k + 'Span') || defaultVal;
				}
			});
		};

		this.cacheSpanValues();

		/**
   * Get original span value of cell object.
   *
   * @param {string} spanType span type, available values are row-column
   * @param {boolean} fromElement, instead of original value, get the assigned span value from HTMLElement itself
   * @throws An error will be given for invalid span type
   */
		this.getSpan = function (spanType) {
			var fromElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var spanVal = fromElement ? _this.getElement().getAttribute(spanType + 'Span') : _this.spans[spanType];
			if (spanVal) {
				return spanVal;
			}
			throw new Error('no span value found with the given type of [' + spanType + ']');
		};

		this.getRemainingSpans = function (spanType) {
			return _this.remainingSpans[spanType];
		};

		this.setRemainingSpans = function (spanType, value) {
			_this.remainingSpans[spanType] = value;
		};

		/**
   * Get cell element.
   *
   * @return {HTMLElement} cell element
   */
		this.getElement = function () {
			return _this.element;
		};

		/**
   * Create a cell element.
   * @private
   * @return {HTMLTableDataCellElement}
   */
		this.createCellElement = function () {
			return document.createElement('td');
		};

		// create a new cell element if no cellElement argument is given with constructor function
		if (!cellElement) {
			this.element = this.createCellElement();
		}

		/**
   * Add attribute to cell element.
   *
   * This function have the ability to add/remove attributes from cell element.
   * All attributes modified with this function will be cached with their before value for an easy reset on demand.
   *
   * @param {string} attributeKey attribute name in camelCase format, for sub-keys, use dot object notation
   * @param {any} attributeValue attribute value
   * @param {boolean} [append=false] append the value or replace it
   * @param {string} [glue=,] glue to join attribute value if append option is enabled
   */
		this.setAttribute = function (attributeKey, attributeValue) {
			var append = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
			var glue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ',';

			var defaultVal = _this.getElement()[attributeKey];

			// if attribute value is a function or an object, it means we pulled a whole declaration instead of only inline attribute values, in that case, use getAttribute to get only inline values related to that attribute
			if (typeof defaultVal === 'function' || (typeof defaultVal === 'undefined' ? 'undefined' : _typeof(defaultVal)) === 'object') {
				defaultVal = _this.getElement().getAttribute(attributeKey);
			}

			// if there is already a default value defined, use that instead
			if (_this.modifications[attributeKey]) {
				defaultVal = _this.modifications[attributeKey].default;
			}

			var currentVal = defaultVal;

			// join attributes
			if (append) {
				currentVal += '' + currentVal + glue + attributeValue;
			} else {
				currentVal = attributeValue;
			}

			_this.modifications[attributeKey] = { value: currentVal, default: defaultVal };

			_this.getElement()[attributeKey] = currentVal;
		};

		/**
   * Set row/colspan for cell.
   *
   * @param {string} spanType span type
   * @param {number} value value to assign to span
   * @return {boolean} if any space left to render the element
   */
		this.setSpan = function (spanType, value) {
			// working on main cell
			if (!_this.isReference()) {
				var _valueToApply = _this.getSpan(spanType) - value < 0 ? _this.getSpan(spanType) : value;

				_this.setAttribute(spanType + 'Span', _valueToApply);

				// calculate remaining cells amount to merge in this span type
				_this.setRemainingSpans(spanType, _this.getSpan(spanType) - _valueToApply);

				// set visibility of connected merge group cells to false to not render them since we added necessary span values to main cell which will leak into their position
				for (var mc = 0; mc < _valueToApply - 1; mc += 1) {
					if (_this.mergedCells[spanType] && _this.mergedCells[spanType][mc]) {
						_this.mergedCells[spanType][mc].setMergedRenderStatus(false);
					}
				}

				return true;
			}
			// working on reference

			if (!_this.getMergedRenderStatus()) {
				return false;
			}

			var remainingVal = _this.referenceObject.getRemainingSpans(spanType);

			// no space left to put cell
			if (remainingVal === 0) {
				return false;
			}

			var valueToApply = remainingVal - value < 0 ? remainingVal : value;

			var remainingParentSpans = remainingVal - valueToApply;
			_this.referenceObject.setRemainingSpans(spanType, remainingParentSpans);

			_this.setAttribute(spanType + 'Span', valueToApply);

			// change render status of remaining connected merge cells
			if (remainingParentSpans !== 0) {
				var totalConnectedCells = _this.referenceObject.mergedCells[spanType].length;
				var startIndex = totalConnectedCells - remainingVal + 1;
				var endIndex = startIndex + valueToApply - 1;

				for (var _mc = startIndex; _mc < endIndex; _mc += 1) {
					_this.mergedCells[spanType][_mc].setMergedRenderStatus(false);
				}
			}

			return true;
		};

		/**
   * Reset a modified attribute to its default value
   *
   * @param {string} attributeKey attribute name
   */
		this.resetAttribute = function (attributeKey) {
			if (_this.modifications[attributeKey]) {
				_this.getElement()[attributeKey] = _this.modifications[attributeKey].default;
				_this.modifications[attributeKey] = undefined;
			}
		};

		/**
   * Reset all modified attributes of cell element to their default values.
   */
		this.resetAllAttributes = function () {
			// eslint-disable-next-line array-callback-return
			Object.keys(_this.modifications).map(function (k) {
				if (Object.prototype.hasOwnProperty.call(_this.modifications, k)) {
					_this.resetAttribute(k);
				}
			});
		};

		return {
			getElement: this.getElement,
			el: this.element,
			setAttribute: this.setAttribute,
			resetAllAttributes: this.resetAllAttributes,
			getSpan: this.getSpan,
			setSpan: this.setSpan,
			getRemainingSpans: this.getRemainingSpans,
			setRemainingSpans: this.setRemainingSpans,
			isReference: this.isReference,
			addToMergedCells: this.addToMergedCells,
			mergedCells: this.mergedCells,
			setMergedRenderStatus: this.setMergedRenderStatus,
			getMergedRenderStatus: this.getMergedRenderStatus
		};
	}

	CellObject.spanTypes = { row: 'row', column: 'col' };

	/**
  * Object implementation for table element operations.
  *
  * @param {HTMLElement} tableEl table element
  * @return {object} instance
  * @constructor
  */
	function TableObject(tableEl) {
		var _this2 = this;

		/**
   * Table element.
   * @private
   * @type {HTMLElement}
   */
		this.tableElement = tableEl;

		/**
   * Parsed table object.
   *
   * @private
   * @type {array}
   */
		this.parsedTable = [];

		/**
   * An array of created table rows elements that are id'd according to their index in array.
   * @type {[HTMLElement]}
   */
		this.rowCache = [];

		/**
   * Original table elements minus the cells.
   * @type {{rows: []}}
   * @private
   */
		this.originals = { rows: [] };

		/**
   * Row colors of original table.
   * @type {{even: string, header: string, odd: string}}
   */
		this.rowColors = {
			header: null,
			even: null,
			odd: null
		};

		/**
   * Add cell to parsed array.
   *
   * @private
   * @param {number} r row id
   * @param {number} c column id
   * @param {CellObject} cellObject cell object to add to parsed array
   */
		this.addToParsed = function (r, c, cellObject) {
			if (!_this2.parsedTable[r]) {
				_this2.parsedTable[r] = [];
			}

			_this2.parsedTable[r][c] = cellObject;
		};

		/**
   * Assign table cells into row and column numbers.
   * @private
   */
		this.parseTable = function () {
			var rows = Array.from(_this2.tableElement.querySelectorAll('tr'));

			// eslint-disable-next-line array-callback-return
			rows.map(function (r, ri) {
				// cache original rows for future use
				_this2.originals.rows.push(r);

				var cells = Array.from(r.querySelectorAll('td'));

				// eslint-disable-next-line array-callback-return
				cells.map(function (c, ci) {
					var currentCellObject = new CellObject(c);
					_this2.addToParsed(ri, ci, currentCellObject);

					var spanRow = currentCellObject.getSpan(CellObject.spanTypes.row);
					var spanCol = currentCellObject.getSpan(CellObject.spanTypes.column);

					if (spanRow > 1) {
						for (var sr = 1; sr < spanRow; sr += 1) {
							var referenceCell = new CellObject(c, currentCellObject);
							currentCellObject.addToMergedCells('row', referenceCell);
							_this2.addToParsed(ri + sr, ci, referenceCell);
						}
					}
					if (spanCol > 1) {
						for (var sc = 1; sc < spanCol; sc += 1) {
							var _referenceCell = new CellObject(c, currentCellObject);
							currentCellObject.addToMergedCells('column', _referenceCell);
							_this2.addToParsed(ri, ci + sc, _referenceCell);
						}
					}
				});
			});
			_this2.parseRowColors(rows);
		};

		/**
   * Parse row colors of original table for futures uses.
   * @param {[HTMLElement]} rows html row elements
   * @private
   */
		this.parseRowColors = function (rows) {
			if (!rows || rows.length <= 0) {
				logToConsole('no rows are found to parse their colors', 'error');
			}

			// get row colors if they are defined as datasets on table element
			var headerDatasetColor = _this2.tableElement.dataset.wptbHeaderBackgroundColor;
			var evenRowDatasetColor = _this2.tableElement.dataset.wptbEvenRowBackgroundColor;
			var oddRowDatasetColor = _this2.tableElement.dataset.wptbOddRowBackgroundColor;

			// header row color
			_this2.rowColors.header =
			// eslint-disable-next-line no-nested-ternary
			headerDatasetColor !== undefined ? headerDatasetColor : rows[0].style.backgroundColor === '' ? null : rows[0].style.backgroundColor;

			// calculate needed number of rows to get even and odd row background colors
			// eslint-disable-next-line no-nested-ternary
			var rowsNeeded = rows.length / 3 >= 1 ? 0 : rows.length === 1 ? 2 : (rows.length - 1) % 2;

			// create additional rows and add them to table to get their row background colors since table row count may be lower to get even/odd rows
			for (var rn = 0; rn < rowsNeeded; rn += 1) {
				var tempRow = document.createElement('tr');

				_this2.tableElement.querySelector('tbody').appendChild(tempRow);
				rows.push(tempRow);
			}

			// even & odd row colors
			// dataset colors have priority over colors gathered from computed row styles
			_this2.rowColors.even = evenRowDatasetColor || getComputedStyle(rows[1]).backgroundColor;
			_this2.rowColors.odd = evenRowDatasetColor ? oddRowDatasetColor : getComputedStyle(rows[2]).backgroundColor;

			// remove created rows from DOM
			for (var r = 0; r < rowsNeeded; r += 1) {
				rows[rows.length - (r + 1)].remove();
			}
		};

		/**
   * Add a row to the table.
   * @param {array} classList an array of class names to be added to row
   * @param {boolean} fromOriginals use rows from original table instead of creating a new one
   * @param {number} originalIndex original row index
   */
		this.addRow = function (classList) {
			var fromOriginals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
			var originalIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

			if (!Array.isArray(classList)) {
				// eslint-disable-next-line no-param-reassign
				classList = [classList];
			}

			var tableBody = _this2.tableElement.querySelector('tbody');
			var tempRow = void 0;

			if (!fromOriginals) {
				var range = document.createRange();
				range.setStart(tableBody, 0);
				// eslint-disable-next-line prefer-destructuring
				tempRow = range.createContextualFragment('<tr class="' + classList.join(' ') + '"></tr>').childNodes[0];
			} else {
				tempRow = _this2.originals.rows[originalIndex];
			}

			// add row to table body
			tableBody.appendChild(tempRow);

			// cache row for future use
			_this2.rowCache.push(tempRow);

			return { el: tempRow, id: _this2.rowCache.length - 1 };
		};

		/**
   * Clear the contents of table element.
   */
		this.clearTable = function () {
			// clear row cache
			_this2.rowCache = [];

			// clear children of `tbody` element
			_this2.tableElement.querySelector('tbody').innerHTML = '';
		};

		/**
   * Get row element from cache.
   *
   * @param {number} id row id
   * @return {null|HTMLElement} row element if present or null if not
   */
		this.getRow = function (id) {
			if (_this2.rowCache[id]) {
				return _this2.rowCache[id];
			}

			// eslint-disable-next-line no-console
			logToConsole('no row with id [' + id + '] found in the cache.', 'warn');
			return null;
		};

		/**
   * Get maximum number of rows available at table.
   *
   * @return {number} maximum amount of rows
   */
		this.maxRows = function () {
			return _this2.parsedTable.length;
		};

		/**
   * Get the number of maximum available column count in the table.
   *
   * @return {number} maximum available column count
   */
		this.maxColumns = function () {
			return _this2.parsedTable.reduce(function (p, c) {
				if (c.length > p) {
					// eslint-disable-next-line no-param-reassign
					p = c.length;
				}

				return p;
			}, 0);
		};

		/**
   * Get the table cell at specified row-column location.
   *
   * As in arrays, row and column numbering starts from number 0.
   *
   * @param {number} r row number
   * @param {number} c column number
   * @param {boolean} returnObject return object instead of HTMLElement
   * @return {HTMLElement | null | CellObject} element if address is possible, null if not
   */
		this.getCell = function (r, c) {
			var returnObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			try {
				if (_this2.parsedTable[r][c]) {
					if (returnObject) {
						return _this2.parsedTable[r][c];
					}
					return _this2.parsedTable[r][c].el;
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				logToConsole('no cell found at the given address of [' + r + '-' + c + ']', 'warn');
				return null;
			}
			// eslint-disable-next-line no-console
			logToConsole('no cell found at the given address of [' + r + '-' + c + ']', 'warn');
			return null;
		};

		/**
   * Get cells at a given row.
   *
   * @param {number} rowId row id
   * @param {boolean} returnObj return an array of CellObject instead
   * @return {array} cells in row
   */
		this.getCellsAtRow = function (rowId) {
			var returnObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var cells = [];
			for (var c = 0; c < _this2.maxColumns(); c += 1) {
				var tempCell = _this2.getCell(rowId, c, returnObj);
				if (tempCell) {
					cells.push(tempCell);
				}
			}
			return cells;
		};

		/**
   * Append the cell with given ids to a cached row
   *
   * @param {number} cellRowId cell row id
   * @param {number} cellColumnId cell column id
   * @param {number} rowId id of row in row cache
   */
		this.appendToRow = function (cellRowId, cellColumnId, rowId) {
			var cachedRow = _this2.getRow(rowId);
			var cell = _this2.getCell(cellRowId, cellColumnId, true);

			if (cell && cachedRow) {
				cachedRow.appendChild(cell.getElement());
			}
			return cell;
		};

		/**
   * Append html element to a cached row.
   *
   * @param {HTMLElement} el element
   * @param {number} rowId if of row in row cache
   */
		this.appendElementToRow = function (el, rowId) {
			var cachedRow = _this2.getRow(rowId);

			if (el && cachedRow) {
				cachedRow.appendChild(el);
			}
		};

		/**
   * Add cell object to a cached row.
   *
   * @param {CellObject} cellObj cell object
   * @param {number} rowId row id
   */
		this.appendObjectToRow = function (cellObj, rowId) {
			var cachedRow = _this2.getRow(rowId);
			if (cellObj && cachedRow) {
				cachedRow.appendChild(cellObj.getElement());
			}
		};

		this.parseTable();

		return {
			maxRows: this.maxRows,
			maxColumns: this.maxColumns,
			addRow: this.addRow,
			clearTable: this.clearTable,
			getCell: this.getCell,
			appendToRow: this.appendToRow,
			appendElementToRow: this.appendElementToRow,
			appendObjectToRow: this.appendObjectToRow,
			getCellsAtRow: this.getCellsAtRow,
			el: this.tableElement,
			rowColors: this.rowColors
		};
	}

	// default options for responsive class
	var responsiveClassDefaultOptions = {
		query: '.wptb-preview-table',
		defaultClasses: ['wptb-plugin-responsive-base'],
		bindToResize: false
	};

	/**
  * Class for handling operations related to responsive functionalities of tables.
  *
  * @constructor
  * @param {object} options options object
  */
	function ResponsiveFront() {
		var _this3 = this;

		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		// merge default options with user sent options
		//this.options = { ...responsiveClassDefaultOptions, ...options };
		this.options = Object.assign({}, responsiveClassDefaultOptions, options);

		this.elements = Array.from(document.querySelectorAll(this.options.query));

		this.elementObjects = this.elements.map(function (e) {
			return {
				el: e,
				tableObject: new TableObject(e)
			};
		});

		/**
   * Bind rebuilding of tables to window resize event.
   */
		this.bindRebuildToResize = function () {
			window.addEventListener('resize', function () {
				_this3.rebuildTables();
			});
		};

		/**
   * Get responsive directives of table element.
   *
   * @private
   * @param {HTMLElement} el table element
   * @return {object|null} JSON representation of the directive element, if not available, null will be returned
   */
		this.getDirective = function (el) {
			var directiveString = el.dataset.wptbResponsiveDirectives;

			if (!directiveString) {
				return null;
			}

			return JSON.parse(atob(directiveString));
		};

		/**
   * Add default classes to rebuilt tables.
   *
   * This classes are added to lay out a base style for the responsive table.
   *
   * @param {HTMLElement} el table element
   */
		this.addDefaultClasses = function (el) {
			el.classList.add(_this3.options.defaultClasses);
		};

		/**
   * Remove default classes from target table.
   * @param {HTMLElement} el table element
   */
		this.removeDefaultClasses = function (el) {
			el.classList.remove(_this3.options.defaultClasses);
		};

		/**
   * Rebuild table in auto mode.
   *
   * Main characteristic of auto mode is table is rebuilt by stacking rows/columns on top of each other, leaving minimal effort from user to create a responsive table at breakpoints.
   *
   * @param {HTMLElement} tableEl table element
   * @param {string} sizeRange range id for current screen size
   * @param {object} autoOption mode options
   * @param {TableObject} tableObj table object
   */
		this.autoBuild = function (tableEl, sizeRange, autoOption, tableObj) {
			// base options
			var direction = autoOption.cellStackDirection[sizeRange];
			// eslint-disable-next-line prefer-destructuring
			var topRowAsHeader = autoOption.topRowAsHeader[sizeRange];
			var cellsPerRow = autoOption.cellsPerRow[sizeRange];

			// new options
			var staticTopRow = autoOption.staticTopRow ? autoOption.staticTopRow[sizeRange] : false;

			tableObj.clearTable();

			if (sizeRange === 'desktop') {
				_this3.buildDefault(tableObj);
				_this3.removeDefaultClasses(tableEl);
			} else {
				_this3.autoDirectionBuild(tableObj, direction, topRowAsHeader, staticTopRow, cellsPerRow);
				_this3.addDefaultClasses(tableEl);
			}
		};

		/**
   * Rebuild table with a direction to read cells.
   *
   * Direction in question in here is either by row or column:
   * * row: cells will be read row by row, in each row starting from the first column
   * * column: cells will be read column by column, in each column starting from the first row of the table
   *
   * @param {TableObject} tableObj table object
   * @param {string} direction direction to read cells, possible options [row, column]
   * @param {boolean} topRowAsHeader use top row as header
   * @param {boolean} staticTopRow use top row as static
   * @param {number} cellsPerRow cells per row
   */
		this.autoDirectionBuild = function (tableObj, direction) {
			var topRowAsHeader = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
			var staticTopRow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
			var cellsPerRow = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

			var rows = tableObj.maxRows();
			var columns = tableObj.maxColumns();
			var isRowStacked = direction === 'row';

			// build table with top row as header
			if (topRowAsHeader) {
				_this3.headerBuild(tableObj, direction, cellsPerRow);
			} else {
				// cell stack direction is selected as row
				// for future new functionality additions, keep different cell stack direction logic separate instead of generalizing the inner logic
				// eslint-disable-next-line no-lonely-if
				if (isRowStacked) {
					(function () {
						var allCellsByRow = [];
						var rowStartIndex = 0;

						// static top row option is enabled
						if (staticTopRow) {
							var topCells = tableObj.getCellsAtRow(0, true);

							var baseCells = topCells.filter(function (c) {
								return !c.isReference();
							});

							// eslint-disable-next-line array-callback-return
							baseCells.map(function (b) {
								rowStartIndex += 1;
								var rowObj = tableObj.addRow('wptb-row');
								rowObj.el.style.backgroundColor = tableObj.rowColors.header;

								tableObj.appendObjectToRow(b, rowObj.id);

								b.setAttribute('colSpan', cellsPerRow);
							});
						}

						// get cells by reading row by row
						for (var r = rowStartIndex; r < rows; r += 1) {
							// eslint-disable-next-line no-loop-func
							tableObj.getCellsAtRow(r, true).forEach(function (c) {
								// only use non reference cells to avoid duplication for non top row as header tables
								if (!c.isReference()) {
									allCellsByRow.push(c);
								}
							});
						}

						var cellCount = allCellsByRow.length;

						for (var c = 0, _r = 0; c < cellCount; c += cellsPerRow, _r += 1) {
							// const rowId = tableObj.addRow('wptb-row').id;
							var rowObj = tableObj.addRow('wptb-row');

							// preserve original row colors for even and odd rows
							rowObj.el.style.backgroundColor = tableObj.rowColors[_r % 2 === 0 ? 'odd' : 'even'];

							// place cells by 'cells by row' option value
							for (var pR = 0; pR < cellsPerRow; pR += 1) {
								var tempCell = allCellsByRow[c + pR];

								if (tempCell) {
									tableObj.appendElementToRow(tempCell.getElement(), rowObj.id);

									tempCell.resetAllAttributes();
									tempCell.setAttribute('style', 'width: 100% !important', true, ';');
									tempCell.setAttribute('colSpan', 1);
									tempCell.setAttribute('rowSpan', 1);
								}
							}
						}
					})();
				}
				// cell stack direction is selected as column
				else {
						var allCellsByCol = [];
						var rowStartIndex = 0;

						// static top row option is enabled
						if (staticTopRow) {
							var topCells = tableObj.getCellsAtRow(0, true);

							var baseCells = topCells.filter(function (t) {
								return !t.isReference();
							});

							// eslint-disable-next-line array-callback-return
							baseCells.map(function (b) {
								rowStartIndex += 1;
								var rowObj = tableObj.addRow('wptb-row');
								rowObj.el.style.backgroundColor = tableObj.rowColors.header;

								tableObj.appendObjectToRow(b, rowObj.id);

								b.setAttribute('colSpan', cellsPerRow);
							});
						}

						// read all cells column by column
						for (var c = 0; c < columns; c += 1) {
							for (var r = rowStartIndex; r < rows; r += 1) {
								var tCell = tableObj.getCell(r, c, true);
								// only use non reference cells to avoid duplication for non top row as header tables
								if (tCell && !tCell.isReference()) {
									allCellsByCol.push(tCell);
								}
							}
						}

						var cellCount = allCellsByCol.length;

						for (var _c = 0, _r2 = 0; _c < cellCount; _c += cellsPerRow, _r2 += 1) {
							var rowObj = tableObj.addRow('wptb-row');

							// preserve original row colors for even and odd rows
							rowObj.el.style.backgroundColor = tableObj.rowColors[_r2 % 2 === 0 ? 'odd' : 'even'];

							for (var cR = 0; cR < cellsPerRow; cR += 1) {
								var tempCell = allCellsByCol[_c + cR];

								if (tempCell) {
									tableObj.appendElementToRow(tempCell.getElement(), rowObj.id);

									tempCell.resetAllAttributes();
									tempCell.setAttribute('style', 'width: 100% !important', true, ';');
									tempCell.setAttribute('colSpan', 1);
									tempCell.setAttribute('rowSpan', 1);
								}
							}
						}
					}
			}
		};

		/**
   * Build table with top row assigned as header.
   *
   * @param {TableObject} tableObj table object
   * @param {string} direction cell stack direction, possible options are [row, column]
   * @param {number} itemsPerHeader items bound to each header element
   */
		this.headerBuild = function (tableObj, direction) {
			var itemsPerHeader = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

			// cells at header
			// applying header row color to cells
			var headerCells = tableObj.getCellsAtRow(0, true).map(function (h) {
				h.setAttribute('style', 'background-color: ' + tableObj.rowColors.header, true, ';');
				return h;
			});

			var stackedAsColumn = direction === 'column';

			// row count
			var rows = tableObj.maxRows();
			// column count
			var columns = tableObj.maxColumns();

			var rowBorderStyle = '3px solid gray';

			// stack direction is column
			if (stackedAsColumn) {
				/**
     * Add header cells as new row to table.
     * @param {boolean} addBorder add top border to header row
     */
				// eslint-disable-next-line no-inner-declarations
				var addHeaderCells = function addHeaderCells() {
					var addBorder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

					var rowObj = tableObj.addRow('wptb-row');

					if (addBorder) {
						rowObj.el.style.borderTop = rowBorderStyle;
					}

					// eslint-disable-next-line array-callback-return
					headerCells.map(function (h) {
						// clone header cell to reuse it for multiple rows
						tableObj.appendElementToRow(h.el.cloneNode(true), rowObj.id);
					});
				};

				// count of header rows that will be created


				var headerCount = Math.ceil((rows - 1) / itemsPerHeader);
				// row index on original table
				var currentOriginalRow = 1;
				for (var r = 0; r < headerCount; r += 1) {
					// create header row and add to table
					addHeaderCells(r > 0);
					for (var c = 0; c < itemsPerHeader; c += 1) {
						// break iteration when current row surpasses original row amount
						if (currentOriginalRow >= rows) {
							break;
						}
						var rowObj = tableObj.addRow('wptb-row');

						// apply row color relative to current header row
						rowObj.el.style.backgroundColor = tableObj.rowColors[c % 2 === 0 ? 'even' : 'odd'];
						for (var cc = 0; cc < columns; cc += 1) {
							var currentCell = tableObj.getCell(currentOriginalRow, cc, true);

							if (currentCell) {
								currentCell.resetAllAttributes();

								// status to decide whether render cell or not
								var cellAddStatus = true;

								var rowSpan = currentCell.getSpan(CellObject.spanTypes.row);
								var colSpan = currentCell.getSpan(CellObject.spanTypes.column);

								if (rowSpan > 1) {
									// items remaining in current header
									var remainingItems = itemsPerHeader - c;

									// calculate whether to apply full rowspan value or remaining item value depending on the current position of the cell
									var currentRowSpan = Math.min(rowSpan, remainingItems);

									cellAddStatus = currentCell.setSpan(CellObject.spanTypes.row, currentRowSpan);
									// reset render status of cell to visible for future use
									currentCell.setMergedRenderStatus(true);
								}

								if (cellAddStatus) {
									tableObj.appendObjectToRow(currentCell, rowObj.id);
								}
							}
						}
						currentOriginalRow += 1;
					}
				}
			} else {
				// stack direction is row
				// number of headers that will be created
				var _headerCount = Math.ceil((rows - 1) / itemsPerHeader);

				var _currentOriginalRow = 1;

				for (var hc = 0; hc < _headerCount; hc += 1) {
					for (var _c2 = 0; _c2 < columns; _c2 += 1) {
						var _rowObj = tableObj.addRow('wptb-row');

						// clear out row color to override row color with cell colors
						_rowObj.el.style.backgroundColor = 'none';

						if (hc > 0 && _c2 === 0) {
							_rowObj.el.style.borderTop = rowBorderStyle;
						}

						var clonedHeaderCell = headerCells[_c2].el.cloneNode(true);

						// apply header row color to header cell
						clonedHeaderCell.style.backgroundColor = tableObj.rowColors.header + ' !important';

						tableObj.appendElementToRow(clonedHeaderCell, _rowObj.id);

						for (var _r3 = 0; _r3 < itemsPerHeader; _r3 += 1) {
							if (_currentOriginalRow + _r3 >= rows) {
								break;
							}

							// const currentCell = tableObj.appendToRow(currentOriginalRow + r, c, rowObj.id);
							var _currentCell = tableObj.getCell(_currentOriginalRow + _r3, _c2, true);

							if (_currentCell) {
								_currentCell.resetAllAttributes();

								var _cellAddStatus = true;

								var _rowSpan = _currentCell.getSpan(CellObject.spanTypes.row);
								var _colSpan = _currentCell.getSpan(CellObject.spanTypes.column);

								if (_rowSpan > 1) {
									var _remainingItems = itemsPerHeader - _r3;

									var _currentRowSpan = Math.min(_rowSpan, _remainingItems);

									_cellAddStatus = _currentCell.setSpan(CellObject.spanTypes.row, _currentRowSpan);

									var rS = _currentCell.el.getAttribute('rowSpan');
									var cS = _currentCell.el.getAttribute('colSpan');

									// switch span values
									_currentCell.setAttribute('rowSpan', cS);
									_currentCell.setAttribute('colSpan', rS);

									_currentCell.setMergedRenderStatus(true);
								}
								if (_cellAddStatus) {
									// color index for the cell, this will be used to reflect table row colors to cells. currently, grouping up the same items with the same color code
									var colorIndex = (_currentOriginalRow + _r3 + hc) % 2 === 0 ? 'even' : 'odd';

									// for better visuals and distinction for tables with 1 item per header, using this calculation for color index
									if (itemsPerHeader === 1) {
										colorIndex = _currentOriginalRow % 2 === 0 ? 'even' : 'odd';
									}

									_currentCell.setAttribute('style', 'background-color: ' + tableObj.rowColors[colorIndex], true, ';');
									tableObj.appendObjectToRow(_currentCell, _rowObj.id);
								}
							}
						}
					}
					_currentOriginalRow += itemsPerHeader;
				}
			}
		};

		/**
   * Build table in its default form.
   *
   * Default form of table is the layout it has in desktop breakpoint.
   *
   * @param {TableObject} tableObj table object
   */
		this.buildDefault = function (tableObj) {
			var rows = tableObj.maxRows();
			var columns = tableObj.maxColumns();

			for (var r = 0; r < rows; r += 1) {
				var rowId = tableObj.addRow('', true, r).id;
				for (var c = 0; c < columns; c += 1) {
					var tempCell = tableObj.getCell(r, c, true);

					// only render cell if a valid cell is found and it is not a reference
					if (tempCell && !tempCell.isReference()) {
						// reset all modified attributes of cell to their default values
						tempCell.resetAllAttributes();
						tableObj.appendElementToRow(tempCell.getElement(), rowId);
					}
				}
			}
		};

		/**
   * Calculate range id for given size value.
   *
   * @param {number} val value
   * @param {object} stops an object containing stop ids as keys and respective sizes as values
   * @return {string} range id
   */
		this.calculateRangeId = function (val, stops) {
			// eslint-disable-next-line prefer-destructuring
			var sortedStops = Object.keys(stops).sort(function (a, b) {
				return stops[a].width - stops[b].width;
			});

			var rangeId = sortedStops[0];

			// eslint-disable-next-line array-callback-return
			sortedStops.map(function (s) {
				if (val >= stops[s].width) {
					rangeId = s;
				}
			});

			return rangeId;
		};

		/**
   * Rebuild table according to its responsive directives.
   *
   * @private
   * @param {HTMLElement} el table element
   * @param {number} size size in pixels
   * @param {TableObject} tableObj table object instance
   * @throws An error will be given for invalid mode name
   */
		this.rebuildTable = function (el, size, tableObj) {
			var directive = _this3.getDirective(el);

			if (directive) {
				if (!directive.responsiveEnabled) {
					// this.buildDefault(tableObj);
					return;
				}

				var mode = directive.responsiveMode;

				// main build logic for different responsive modes should be named in the format of `{modeName}Build` to automatically call the associated function from here
				var buildCallable = _this3[mode + 'Build'];

				if (!size) {
					// eslint-disable-next-line no-param-reassign
					size = el.getBoundingClientRect().width;
				}

				var sizeRangeId = _this3.calculateRangeId(size, directive.breakpoints);

				if (buildCallable) {
					var modeOptions = directive.modeOptions[mode];
					buildCallable.call(_this3, el, sizeRangeId, modeOptions, tableObj);

					WPTB_RecalculateIndexes(el);
					var tabEvent = new CustomEvent('table:rebuilt', { detail: { sizeRangeId: sizeRangeId, topRowAsHeader: directive.modeOptions[mode]['topRowAsHeader'] } });
					el.dispatchEvent(tabEvent);
				} else {
					throw new Error('No build mode named as [' + mode + '] found.');
				}
			}
		};

		/**
   * Rebuild tables with the given screen size.
   *
   * @param {number} size screen size
   */
		this.rebuildTables = function (size) {
			// eslint-disable-next-line array-callback-return
			_this3.elementObjects.map(function (o) {
				var innerSize = size;
				if (!size) {
					// eslint-disable-next-line no-param-reassign
					innerSize = window.innerWidth;

					var directives = _this3.getDirective(o.el);
					// calculate size according to relative width directive
					if (directives && directives.relativeWidth) {
						switch (directives.relativeWidth) {
							case 'window':
								// eslint-disable-next-line no-param-reassign
								innerSize = window.innerWidth;
								break;
							case 'container':
								// get the size of the container table is in
								// eslint-disable-next-line no-param-reassign
								innerSize = o.el.parentNode.parentNode.parentNode.clientWidth;
								break;
							default:
								// eslint-disable-next-line no-param-reassign
								innerSize = window.innerWidth;
								break;
						}
					}
				}
				_this3.rebuildTable(o.el, innerSize, o.tableObject);
			});
		};

		if (this.options.bindToResize) {
			this.bindRebuildToResize();
		}

		return { rebuildTables: this.rebuildTables, getDirective: this.getDirective, calculateRangeId: this.calculateRangeId };
	}

	return ResponsiveFront;
});
//# sourceMappingURL=admin.js.map
