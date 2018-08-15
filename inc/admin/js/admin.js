(function ($) {

    window.deleteButton = function (event) {
        var act = this.parentNode.parentNode,
            el = act.parentNode;
        el.removeChild(act);
        window.add_Elements_tab();
    };

    window.copyButton = function (event) {
        var td = event.target.parentNode.parentNode.parentNode,
            copy = newButton(event.target.parentNode.parentNode.childNodes[0].innerHTML);
        td.appendChild(copy);
    };

    window.showButtonSettings = function (event) {

        if (window.currentlyDragging != undefined) {
            return;
        }

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
        btnDelete.onclick = window.deleteButton;
        btnCopy.onclick = window.copyButton;
        btnMove.onmousedown = window.putItemDragStart;
        actions.appendChild(btnMove);
        actions.appendChild(btnCopy);
        actions.appendChild(btnDelete);
        this.appendChild(actions);
    };

    window.hideButtonSettings = function (event) {
        var formerActions = this.getElementsByClassName('wptb-actions');
        if (formerActions && formerActions[0]) {
            var par = formerActions[0].parentNode;
            par.removeChild(formerActions[0]);
        }
        this.classList.remove('wptb-directlyhovered');
    };

    window.newButton = function (text) {
        var elButton = document.createElement('div');
        elButton.classList.add('wptb-button-container');
        var elButton2 = document.createElement('div');
        elButton2.classList.add('wptb-button-wrapper');
        var el_B = document.createElement('p');
        el_B.classList.add('wptb-button');
        el_B.classList.add('editable');
        el_B.innerHTML = text != undefined ? text : 'Button Text';
        elButton2.appendChild(el_B);
        elButton.appendChild(elButton2);
        elButton.onmouseenter = showButtonSettings;
        elButton.onmouseleave = hideButtonSettings;
        elButton.classList.add('wptb-ph-element', 'wptb-element-button-' + window.wptb_num['button']);
        window.addElementOptions('button', elButton);
        window.wptb_num['button']++;
        tinyMCE.init({
            target: el_B,
            inline: true,
            plugins: "link",
            dialog_type: "modal",
            theme: 'modern',
            menubar: false,
            fixed_toolbar_container: '#wpcd_fixed_toolbar',
            toolbar: 'bold italic strikethrough',
            setup: function setup(ed) {
                ed.on("init", function (ed) {
                    tinyMCE.execCommand('mceRepaint');
                });
            },
            init_instance_callback: function init_instance_callback(editor) {
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
        });

        return elButton;
    };
})(jQuery);
(function ($) {

    window.selectionWidth = 0;
    window.selectionHeight = 0;

    window.createCell = function () {
        var cell = document.createElement("td"),
            allowDrop = function allowDrop(event) {
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
        return cell;
    };

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
        console.log('Coords', parseInt(this.dataset.xIndex), parseInt(this.dataset.yIndex));
        console.log(this);
        var buttons = document.getElementsByClassName('wptb-relative-action');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].dataset.xIndex = this.dataset.xIndex;
            buttons[i].dataset.yIndex = this.dataset.yIndex;
        }
    };

    window.undoAllPreviousHighlights = function () {
        var params = window.getParameters(),
            tds;
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
            var classToAdd = i == 0 ? 'highlighted-row-first' : i == columnCount - 1 ? 'highlighted-row-last' : 'highlighted-row-inner';
            var ttd = parentRow.getElementsByTagName('td')[i];
            if (ttd !== td) {
                ttd.classList.add(classToAdd);
            }
        }
    };

    window.highlightColumn = function (td) {

        var index,
            parentRow = td.parentNode;
        columnCount = parseInt(document.getElementById('wptb-columns-number').value), rowCount = parseInt(document.getElementById('wptb-rows-number').value), table = document.getElementsByClassName('wptb-preview-table')[0];
        for (var i = 0; i < columnCount; i++) {
            if (parentRow.getElementsByTagName('td')[i] === td) {
                index = i;
                break;
            }
        }

        for (var i = 0; i < rowCount; i++) {
            var classToAdd = i == 0 ? 'highlighted-column-first' : i == rowCount - 1 ? 'highlighted-column-last' : 'highlighted-column-inner';
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
        activateGroupActions();
        deactivateIndividualActions();
        deactivateNoneActions();
    };

    window.mergeCells = function () {
        var firstCell = window.selectedCells[0],
            lastCell = window.selectedCells[window.selectedCells.length - 1],
            colspan = Math.abs(lastCell.dataset.xIndex - firstCell.dataset.xIndex) + 1,
            rowspan = Math.abs(lastCell.dataset.yIndex - firstCell.dataset.yIndex) + 1;

        for (var i = 1; i < window.selectedCells.length; i++) {
            var p = window.selectedCells[i].parentNode;
            p.removeChild(window.selectedCells[i]);
            delete window.selectedCells[i];
        }

        if (colspan > 1) {
            firstCell.colSpan = colspan;
        }

        if (rowspan > 1) {
            firstCell.rowSpan = rowspan;
        }
    };

    window.splitCells = function () {};

    /*
     * This function finds the table cell DOM element for its coordinates
     *
     * @param int the number of row
     * @param int the number of column
     * @returns object
     */

    window.getCellByCoords = function (x, y) {
        return document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('tr')[y].getElementsByTagName('td')[x];
    };

    /*
     * This function checks wether we should make the selection squared 
     *
     * @returns boolean
     * @see makeSquareSelection
     */

    window.makeSelection = function (startPoint) {
        var cell;

        undoAllPreviousHighlights();

        selectedCells = [];

        selectedCells.push(cell);

        for (var i = 0; i < selectionHeight; i++) {
            for (var j = 0; j < selectionWidth; j++) {
                cell = getCellByCoords(parseInt(startPoint.dataset.xIndex) + j, parseInt(startPoint.dataset.yIndex) + i);
                if (cell.colSpan && cell.colSpan > 1) {
                    j += cel.colSpan - 1; //Let's remember j is incremented by 1 at each iteration anyways. 
                }
                cell.classList.add('highlighted');
                selectedCells.push(cell);
            }
        }
    };
})(jQuery);
(function ($) {

    //When dragging starts for all elements from Add Items panel

    window.itemDragStart = function (event) {

        event.preventDefault();

        if (!event.target.classList.contains('wptb-draggable-prototype')) {
            return;
        }

        var dragEl = event.target;

        while (!dragEl.classList.contains('wptb-element')) {
            dragEl = dragEl.parentNode;
        }

        window.currentlyDragging = true;
        window.elementToDrag = dragEl.cloneNode(true);
        window.elementToDrag.style.position = 'absolute';
        window.elementToDrag.style.zIndex = '110000';
        window.elementToDrag.style.left = event.clientX + 'px';
        window.elementToDrag.style.top = event.clientY + 'px';
        window.elementToDrag.style.width = 'auto';
        window.elementToDrag.classList.remove('wptb-draggable-prototype');
        window.elementToDrag.classList.add('wptb-draggable');
        document.body.classList.add('wptb-state-dragging');
        document.body.appendChild(window.elementToDrag);
        /* window.currentlyDragging = true;
         wptbElement = event.target.id.substring(5, event.target.id.length);
            event.dataTransfer.effectAllowed = 'move';
         event.dataTransfer.setData("text/plain", event.target.getAttribute('id')); */
    };

    window.putItemDragStart = function () {
        var temp = this;

        while (!temp.classList.contains('wptb-ph-element')) {
            temp = temp.parentNode;
        }

        window.alreadyPut = true;
        window.currentlyDragging = true;
        window.elementToDrag = temp;
        window.elementToDrag.style.position = 'absolute';
        window.elementToDrag.style.zIndex = '110000';
        window.elementToDrag.style.left = event.clientX + 'px';
        window.elementToDrag.style.top = event.clientY + 'px';
        window.elementToDrag.style.width = 'auto';
        document.body.classList.add('wptb-state-dragging');
        window.nextSpace = temp.nextSibling;
    };

    /*
    This function, checking if there is currently an element being dragged,
    updates its position on the screen. I see coming the hardest part: to put it inside
    a droppable element, but without using droppable.
    */

    window.onmousemove = function (event) {
        event.preventDefault();

        if (window.currentlyDragging === undefined) {
            return;
        }
        if (window.alreadyPut) {
            var offsetX = document.getElementsByClassName('wptb-builder-panel')[0].getBoundingClientRect().x,
                offsetY = document.getElementsByClassName('wptb-builder-panel')[0].getBoundingClientRect().y;

            window.elementToDrag.style.left = event.clientX - offsetX + 15 + 'px';
            window.elementToDrag.style.top = event.clientY - offsetY + 15 + 'px';
        } else {
            window.elementToDrag.style.left = event.clientX + 'px';
            window.elementToDrag.style.top = event.clientY + 'px';
        }
    };

    window.makeSpace = function () {
        var spaceBetween = document.createElement('div'),
            insertHere = document.createElement('div'),
            spanInsert = document.createElement('span'),
            newNode,
            el = window.elementToDrag.id.substring(5, window.elementToDrag.id.length);

        spaceBetween.onmouseover = function (evt) {
            if (window.currentlyDragging) this.childNodes[0].style.display = 'block';
        };

        spaceBetween.onmouseout = function (evt) {
            this.childNodes[0].style.display = 'none';
        };

        spanInsert.innerHTML = 'Insert Here';
        spaceBetween.classList.add('wptb-space-between');
        insertHere.classList.add('wptb-insert-here');
        spaceBetween.appendChild(insertHere);
        insertHere.appendChild(spanInsert);
        return spaceBetween;
    };

    /*
     * This deletes absolute positioning and z-index from dragging item
     * 
     * @param object the node to cleanse
     */

    window.trimInlineStyle = function (el) {
        el.style.top = 'auto';
        el.style.left = 'auto';
        el.style.position = 'relative';
        el.style.width = '100%';
        el.style.zIndex = 'auto';
    };

    /*
     * Here we save ourselves a few code lines since this is made twice in next function
     * 
     * @param string the currently selected new item to create
     * @return object the new node
     */

    window.newItemProxy = function (el) {
        if (el == 'list') {
            return window.newList();
        } else if (el == 'image') {
            return window.newImage();
        } else if (el == 'text') {
            return window.newText();
        } else if (el == 'button') {
            return window.newButton();
        }
    };

    /* Well, this function has turned out to be so complicated
     * for me keeping track of it without notes.
     *
     */

    window.onmouseup = function (event) {

        // There's nothing to do on mouse button being released if there is no item being dragged

        if (window.currentlyDragging == undefined) {
            return;
        }

        var p = window.elementToDrag.parentNode;

        // Item just can be dropped in spaces between elements or in empty cells

        if (!event.target.classList.contains('wptb-droppable') && !event.target.classList.contains('wptb-space-between') && !event.target.classList.contains('wptb-insert-here')) {
            window.currentlyDragging = undefined;

            if (alreadyPut == undefined) {
                p.removeChild(window.elementToDrag);
            } else {
                window.trimInlineStyle(window.elementToDrag);
                alreadyPut = undefined;
            }

            window.elementToDrag = undefined;
            document.body.classList.remove('wptb-state-dragging');
            return;
        }

        //If item is being released in a cell

        if (event.target.classList.contains('wptb-droppable')) {

            var sp2 = window.makeSpace();

            console.log('Item is being released in a cell');

            if (event.target.innerHTML == '') {
                var sp1 = window.makeSpace();
                event.target.appendChild(sp1);
            }

            if (window.alreadyPut == undefined) {
                var newNode = window.newItemProxy(window.elementToDrag.id.substring(5, window.elementToDrag.id.length));
                event.target.appendChild(newNode);
                event.target.appendChild(sp2);
                p.removeChild(window.elementToDrag);
                console.log('Additionally, we are creating a new item');
            } else {
                console.log('We are just moving an item');
                window.trimInlineStyle(window.elementToDrag);
                event.target.appendChild(window.elementToDrag);
                event.target.appendChild(sp2);

                if (window.nextSpace != undefined) {
                    var p = window.nextSpace.parentNode;
                    p.removeChild(window.nextSpace);
                    window.nextSpace = undefined;
                }
            }
        } else {
            // If item is being released in a space
            console.log('Item is being released in space');

            var p = event.target.parentNode.nextSibling,
                td = event.target;

            while (!td.classList.contains('wptb-droppable')) {
                td = td.parentNode;
            }

            if (window.alreadyPut == undefined) {
                var newNode = window.newItemProxy(window.elementToDrag.id.substring(5, window.elementToDrag.id.length));

                if (p == null) {
                    td.appendChild(newNode);
                    td.appendChild(window.makeSpace());
                } else {
                    td.insertBefore(newNode, p);
                    td.insertBefore(window.makeSpace(), p);
                }
                document.body.removeChild(window.elementToDrag);

                console.log('Additionally, we are creating a new item');
            } else {
                console.log('We are just moving an item');

                if (p == null) {
                    td.appendChild(window.elementToDrag);
                    td.appendChild(window.makeSpace());
                } else {
                    td.insertBefore(window.elementToDrag, p);
                    td.insertBefore(window.makeSpace(), p);
                }
                window.trimInlineStyle(window.elementToDrag);

                if (window.nextSpace != undefined) {
                    var p = window.nextSpace.parentNode;
                    p.removeChild(window.nextSpace);
                    window.nextSpace = undefined;
                }
            }
        }

        /*
        if(window.alreadyPut == undefined )
        { 
            
              if(! event.target.classList.contains('wptb-space-between')){
            event.target.appendChild(spaceBetween);  
            }
            else{
                var p = event.target.parentNode;
                   if(event.target.nextSibling != undefined){
                    p.insertBefore(newNode,event.target.nextSibling);
                }
                else{
                    p.appendChild(newNode);
                }
            }
        }
        else
        {
            window.elementToDrag.style.top='auto';
            window.elementToDrag.style.left='auto';
            window.elementToDrag.style.position='relative';
            window.elementToDrag.style.width='100%';
            window.elementToDrag.style.zIndex='auto';
            if(! event.target.classList.contains('wptb-space-between'))
            {
                event.target.appendChild(spaceBetween);  
            }
            else
            {  
                var p = event.target.parentNode;
                if(event.target.nextSibling != undefined){
                    p.insertBefore(window.elementToDrag,event.target.nextSibling);
                }
                else{
                    p.appendChild(window.elementToDrag);
                }
                
            }
        } */
        window.alreadyPut = undefined;
        document.body.classList.remove('wptb-state-dragging');
        window.currentlyDragging = undefined;
        window.elementToDrag = undefined;
    };
})(jQuery);
(function ($) {

    window.copyImage = function (event) {
        var srcList = event.target.parentNode.parentNode,
            newList = srcList.cloneNode(true),
            container = srcList.parentNode,
            listItems = newList.querySelectorAll('article');
        newList.onmouseenter = showListSettings;
        newList.onmouseleave = hideListSettings;
        for (var i = listItems.length - 1; i >= 0; i--) {
            var cont = listItems[i].getElementsByClassName('wptb-list-item-content')[0];
            listItems[i].onmouseenter = showListItemSettings;
            listItems[i].onmouseleave = hideListItemSettings;
            cont.id = '';
            tinyFastCall(cont);
            cont.onkeyup = listItemKeyListener;
        }

        var infArr = newList.className.match(/wptb-element-(.+)-(\d)+/i),
            elName = infArr[1],
            oldClass = infArr[0],
            oldClassOptionsPanelClass = "wptb-options-" + elName + "-" + infArr[2];

        var newOptionsPanel = $('.' + oldClassOptionsPanelClass).clone(true, true),
            oldOptionsPanel = document.querySelector('.' + oldClassOptionsPanelClass);
        oldOptionsPanel.parentNode.appendChild(newOptionsPanel[0]);

        var newClass = "wptb-element-" + elName + "-" + wptb_num['list'];
        var newClassOptionsPanelClass = "wptb-options-" + elName + "-" + wptb_num['list'];

        newList.classList.add(newClass);
        newList.classList.remove(oldClass);

        newOptionsPanel.removeClass(oldClassOptionsPanelClass);
        newOptionsPanel.addClass(newClassOptionsPanelClass);

        wptb_num['list']++;

        container.appendChild(newList);
    };

    window.showImageSettings = function (event) {
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous,
            i;
        actions.classList.add('wptb-actions');
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        delete document.getElementsByClassName('wptb-actions');
        previous = document.getElementsByClassName('wptb-directlyhovered');
        for (i = 0; i < previous.length; i++) {
            previous[i].classList.remove('wptb-directlyhovered');
        };
        this.classList.add('wptb-directlyhovered');

        btnDelete.onclick = function () {
            var list = this.parentNode.parentNode,
                tdContainer = list.parentNode;
            $('#add-elements a').trigger('click');
            tdContainer.removeChild(list);
        };
        btnCopy.onclick = copyList;

        actions.append(btnCopy, btnDelete);
        this.append(actions);
    };

    window.hideImageSettings = function (event) {
        this.classList.remove('wptb-directlyhovered');
        var actions = this.getElementsByClassName('wptb-actions')[0];
        if (actions != undefined) {
            var parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    window.newImage = function (text) {
        var imgWrap = document.createElement('div');
        imgWrap.classList.add('wptb-img-wrapper');
        var imgBtn = document.createElement('button');
        imgBtn.classList.add('button');
        imgBtn.classList.add('wptb-img-btn');
        imgBtn.innerHTML = text != undefined ? text : 'Choose Image';
        imgWrap.appendChild(imgBtn);
        return imgWrap;
    };
})(jQuery);
(function ($) {

    window.tinyFastCall = function (obj) {
        tinyMCE.init({
            target: obj,
            inline: true,
            plugins: "link",
            dialog_type: "modal",
            theme: 'modern',
            menubar: false,
            fixed_toolbar_container: '#wpcd_fixed_toolbar',
            toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify'
        });
    };

    window.copyList = function (event) {
        var srcList = event.target.parentNode.parentNode,
            newList = srcList.cloneNode(true),
            container = srcList.parentNode,
            listItems = newList.querySelectorAll('article');
        newList.onmouseenter = showListSettings;
        newList.onmouseleave = hideListSettings;
        for (var i = listItems.length - 1; i >= 0; i--) {
            var cont = listItems[i].getElementsByClassName('wptb-list-item-content')[0];
            console.log(cont);
            listItems[i].onmouseenter = showListItemSettings;
            listItems[i].onmouseleave = hideListItemSettings;
            cont.id = '';
            tinyFastCall(cont);
            cont.onkeyup = listItemKeyListener;
        }

        var infArr = newList.className.match(/wptb-element-(.+)-(\d)+/i),
            elName = infArr[1],
            oldClass = infArr[0],
            oldClassOptionsPanelClass = "wptb-options-" + elName + "-" + infArr[2];

        var newOptionsPanel = $('.' + oldClassOptionsPanelClass).clone(true, true),
            oldOptionsPanel = document.querySelector('.' + oldClassOptionsPanelClass);
        oldOptionsPanel.parentNode.appendChild(newOptionsPanel[0]);

        var newClass = "wptb-element-" + elName + "-" + wptb_num['list'];
        var newClassOptionsPanelClass = "wptb-options-" + elName + "-" + wptb_num['list'];

        newList.classList.add(newClass);
        newList.classList.remove(oldClass);

        newOptionsPanel.removeClass(oldClassOptionsPanelClass);
        newOptionsPanel.addClass(newClassOptionsPanelClass);

        wptb_num['list']++;

        container.appendChild(newList);
    };

    window.showListSettings = function (event) {
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous,
            i;
        actions.classList.add('wptb-actions');
        actions.innerHTML = 'List Actions';
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        delete document.getElementsByClassName('wptb-actions');
        previous = document.getElementsByClassName('wptb-directlyhovered');
        for (i = 0; i < previous.length; i++) {
            previous[i].classList.remove('wptb-directlyhovered');
        };
        this.classList.add('wptb-directlyhovered');

        btnDelete.onclick = function () {
            var list = this.parentNode.parentNode,
                tdContainer = list.parentNode;
            tdContainer.removeChild(list);

            $('.wptb-tab#element-options  a').removeClass('active');
            $('.wptb-tab#add-elements a').addClass('active');

            $('.wptb-elements-container').show();
            $('.wptb-settings-section').show();
            $("#element-options-group").hide();
        };
        btnCopy.onclick = copyList;

        actions.append(btnCopy, btnDelete);
        this.append(actions);
    };

    window.hideListSettings = function (event) {
        this.classList.remove('wptb-directlyhovered');
        var actions = this.getElementsByClassName('wptb-actions')[0];
        if (actions != undefined) {
            var parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    window.showListItemSettings = function (event) {
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous,
            i;
        actions.classList.add('wptb-actions');
        actions.innerHTML = 'Item Actions';
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');

        previousAct = document.getElementsByClassName('wptb-actions');
        for (i = 0; i < previousAct.length; i++) {
            var par = previousAct[i].parentNode;
            par.removeChild(previousAct[i]);
        };

        previous = document.getElementsByClassName('wptb-directlyhovered');
        for (i = 0; i < previous.length; i++) {
            previous[i].classList.remove('wptb-directlyhovered');
        };
        this.classList.add('wptb-directlyhovered');

        btnDelete.onclick = function () {
            var item = this.parentNode.parentNode,
                parent = item.parentNode;
            parent.removeChild(item);
        };

        btnCopy.onclick = function (event) {
            var article = event.target.parentNode.parentNode,
                content = article.querySelector('.wptb-list-item-content'),
                html = content.innerHTML;
            var duplicate = newListItem(html);
            article.parentNode.appendChild(duplicate);
        };

        actions.append(btnCopy, btnDelete);
        this.parentNode.appendChild(actions);
    };

    window.hideListItemSettings = function (event) {
        this.classList.remove('wptb-directlyhovered');
        var actions = this.querySelector('.wptb-actions');
        if (actions != undefined) {
            var parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    window.newListItem = function (text) {
        if (text == undefined) text = 'New List Item';
        var duplicate = document.createElement('article');
        var divdot = document.createElement('div'),
            divcontent = document.createElement('div'),
            libullet = document.createElement('li');
        divdot.classList.add('wptb-list-item-style-dot');
        divcontent.classList.add('wptb-list-item-content');
        libullet.classList.add('wptb-bullet');
        duplicate.appendChild(divdot);
        duplicate.appendChild(divcontent);
        divdot.appendChild(libullet);
        divcontent.innerHTML = text;
        tinyFastCall(divcontent);
        divcontent.onkeyup = window.listItemKeyListener;
        divcontent.onmouseenter = function (event) {
            var previous = document.getElementsByClassName('wptb-directlyhovered');
            for (i = 0; i < previous.length; i++) {
                previous[i].classList.remove('wptb-directlyhovered');
            };
            this.classList.add('wptb-directlyhovered');
        };
        divcontent.onmouseleave = function (event) {
            this.classList.remove('wptb-directlyhovered');
        };
        divcontent.onmouseenter = showListItemSettings;
        divcontent.onmouseleave = hideListItemSettings;
        return duplicate;
    };

    window.listItemKeyListener = function (event) {
        var key = event.which != undefined ? event.which : event.keyCode,
            liEl = $(this).parent(),
            duplicate,
            lastP;
        if (key !== 13 || window.dontAddItems !== undefined && window.dontAddItems === true) {
            return;
        }
        event.preventDefault();
        duplicate = newListItem();
        liEl.after(duplicate);
        duplicate.querySelector('.wptb-list-item-content').focus();

        lastP = this.childNodes[this.childNodes.length - 1];
        this.removeChild(lastP);
        if (this.innerHTML.trim() == '<p><br data-mce-bogus="1"></p>') {
            this.innerHTML = 'New List Item';
        }
        return false;
    };

    window.inputNumber = function (el) {

        var min = el.attr('min') || false;
        var max = el.attr('max') || false;

        var els = {};

        els.dec = el.prev();
        els.inc = el.next();

        el.each(function () {
            init(this);
        });

        function init(el) {

            els.dec[0].onclick = decrement;
            els.inc[0].onclick = increment;

            els.dec.onmousedown = function (e) {
                e.preventDefault();
            };

            els.inc.onmousedown = function (e) {
                e.preventDefault();
            };

            function decrement() {
                var value = el.value;
                value--;
                if (!min || value >= min) {
                    el.value = value;
                }
            }

            function increment() {
                var value = el.value;
                value++;
                if (!max || value <= max) {
                    el.value = value++;
                }
            }
        }
    };
})(jQuery);
(function ($) {

    window.copyList = function (event) {
        var td = event.target.parentNode.parentNode.parentNode,
            temp = [],
            srcList = event.target.parentNode.parentNode.querySelectorAll('ul article .wptb-list-item-content');

        for (var i = 0; i < srcList.length; i++) {
            temp.push(srcList[i].innerHTML);
        }
        var copy = newList(temp);
        td.appendChild(copy);
    };

    window.deleteList = function () {
        var act = this.parentNode.parentNode,
            el = act.parentNode;
        el.removeChild(act);
        window.add_Elements_tab();
    };

    window.showListSettings = function (event) {

        if (window.currentlyDragging != undefined) {
            return;
        }

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
        btnDelete.onclick = window.deleteList;
        btnCopy.onclick = window.copyList;
        btnMove.onmousedown = window.putItemDragStart;
        actions.appendChild(btnMove);
        actions.appendChild(btnCopy);
        actions.appendChild(btnDelete);
        this.appendChild(actions);
    };

    window.hideListSettings = function (event) {
        this.classList.remove('wptb-directlyhovered');
        var actions = this.querySelector('.wptb-actions');
        if (actions != undefined) {
            var parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    window.showListItemSettings = function (event) {

        if (window.currentlyDragging != undefined) {
            return;
        }
        //el Article
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous,
            i;
        actions.classList.add('wptb-actions');
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        this.classList.add('wptb-directlyhovered');

        btnDelete.onclick = function () {
            var item = this.parentNode.parentNode,
                parent = item.parentNode;
            parent.removeChild(item);
        };

        btnCopy.onclick = function (event) {
            var article = event.target.parentNode.parentNode,
                content = article.querySelector('.wptb-list-item-content'),
                html = content.innerHTML;
            var duplicate = newListItem(html);
            article.parentNode.appendChild(duplicate);
        };

        actions.append(btnCopy, btnDelete);
        this.appendChild(actions);
    };

    window.hideListItemSettings = function (event) {
        this.classList.remove('wptb-directlyhovered');
        var actions = this.parentNode.querySelector('.wptb-actions');
        if (actions != undefined) {
            var parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    window.newList = function (innerElements) {
        var elList = document.createElement('div');
        //elList.classList.add('editable');
        var el_L = document.createElement('ul');
        if (!innerElements) for (var i = 0; i < 3; i++) {
            el_L.appendChild(newListItem('List Item ' + (i + 1)));
        } else {
            for (var i = 0; i < innerElements.length; i++) {
                el_L.appendChild(newListItem(innerElements[i]));
            }
        }
        elList.appendChild(el_L);
        elList.onmouseenter = showListSettings;
        elList.onmouseleave = hideListSettings;
        elList.classList.add('wptb-ph-element', 'wptb-element-list-' + window.wptb_num['list']);
        window.addElementOptions('list', elList);
        window.wptb_num['list']++;

        return elList;
    };

    window.newListItem = function (text) {
        if (text == undefined) text = 'New List Item';
        var duplicate = document.createElement('article');
        var divdot = document.createElement('div'),
            divcontent = document.createElement('div'),
            libullet = document.createElement('li');
        divdot.classList.add('wptb-list-item-style-dot');
        divcontent.classList.add('wptb-list-item-content');
        libullet.classList.add('wptb-bullet');
        duplicate.appendChild(divdot);
        duplicate.appendChild(divcontent);
        divdot.appendChild(libullet);
        divcontent.innerHTML = text;
        tinyFastCall(divcontent);
        divcontent.onkeyup = window.listItemKeyListener;
        divcontent.parentNode.onmouseenter = window.showListItemSettings;
        divcontent.parentNode.onmouseleave = window.hideListItemSettings;
        return duplicate;
    };

    window.listItemKeyListener = function (event) {
        var key = event.which != undefined ? event.which : event.keyCode,
            liEl = $(this).parent(),
            duplicate,
            lastP;
        if (key !== 13 || window.dontAddItems !== undefined && window.dontAddItems === true) {
            return;
        }
        event.preventDefault();
        duplicate = newListItem();
        liEl.after(duplicate);
        duplicate.querySelector('.wptb-list-item-content').focus();

        lastP = this.childNodes[this.childNodes.length - 1];
        this.removeChild(lastP);
        if (this.innerHTML.trim() == '<p><br data-mce-bogus="1"></p>') {
            this.innerHTML = 'New List Item';
        }
        return false;
    };
})(jQuery);
(function ($) {

    window.add_Elements_tab = function () {
        document.getElementById('element-options').getElementsByTagName('a')[0].classList.remove('active');
        document.getElementById('add-elements').getElementsByTagName('a')[0].classList.add('active');
        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'table';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'block';
        document.getElementById("element-options-group").style.display = 'none';
    };

    window.Element_options_tab = function () {
        document.getElementById('add-elements').getElementsByTagName('a')[0].classList.remove('active');
        document.getElementById('element-options').getElementsByTagName('a')[0].classList.add('active');

        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'none';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'none';
        document.getElementById("element-options-group").style.display = 'block';
        var children = document.getElementById("element-options-group").childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i].style) children[i].style.display = 'none';
        }
    };

    window.addElementOptions = function (wptbElement, el) {
        var prop = $(".wptb-" + wptbElement + "-options-prototype").clone();
        prop.removeClass("wptb-" + wptbElement + "-options-prototype"); // remove prototype from the class
        prop.addClass('wptb-options-' + wptbElement + "-" + wptb_num[wptbElement]);
        document.getElementById("element-options-group").appendChild(prop[0]);
        //special cases to elements if needed
        switch (wptbElement) {
            case 'text':
                listener_to_element(prop.find('.wptb-color-picker'));
                prop.find('.wptb-color-picker').wpColorPicker();
                break;
        }
        wptb_num[wptbElement]++;
    };

    /**
    * This function is a fix for allowing us to send the add link form with an enter...
    * 
    * @returns {void}
    */

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

    /**
     * to listen to the elements that will change dynamically
     * change by other javascript code then will trigger the change event to them
     * 
     * @param {string} element
     * @returns {void}
     */
    window.listener_to_element = function (element) {
        element.data('old_value', element.val());
        window.setInterval(function () {
            var value = element.val();
            var old_value = element.data('old_value');
            if (value != old_value) {
                old_value = value;
                element.trigger('change');
            }
        }, 300);
    };

    window.tryToChangeMCEWidth = function (e) {
        var totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;

        if (window.currentEditor && document.getElementById('wptb_builder').scrollTop >= 55 && window.currentEditor.bodyElement.style.display != 'none') {
            document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
            document.getElementById('wpcd_fixed_toolbar').style.right = totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2 + 'px';
            document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
        } else {
            document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
            delete document.getElementById('wpcd_fixed_toolbar').style.right;
            delete document.getElementById('wpcd_fixed_toolbar').style.top;
        }
        //if(this.scrollTop > && )
        //                document.getElementById('wpcd_fixed_toolbar').style.left = 'calc(50% - '+width+')';  
    };

    window.tinyFastCall = function (obj) {
        tinyMCE.init({
            target: obj,
            inline: true,
            plugins: "link, paste",
            dialog_type: "modal",
            theme: 'modern',
            menubar: false,
            fixed_toolbar_container: '#wpcd_fixed_toolbar',
            paste_as_text: true,
            toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
            init_instance_callback: function init_instance_callback(editor) {
                window.currentEditor = editor;
                editor.on('focus', function (e) {
                    window.tryToChangeMCEWidth();
                });
            }
        });
    };

    window.inputNumber = function (el) {

        var min = el.min || false;
        var max = el.max || false;

        var els = {};

        els.dec = el.previousSibling;
        els.inc = el.nextSibling;

        init(el);

        function init(el) {

            els.dec.onclick = decrement;
            els.inc.onclick = increment;

            els.dec.onmousedown = function (e) {
                e.preventDefault();
            };

            els.inc.onmousedown = function (e) {
                e.preventDefault();
            };

            function decrement() {
                var value = el.value;
                value--;
                if (!min || value >= min) {
                    el.value = value;
                }
            }

            function increment() {
                var value = el.value;
                value++;
                if (!max || value <= max) {
                    el.value = value++;
                }
            }
        }
    };
})(jQuery);
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
        //On drag elements.
        document.getElementById('wptb-text').onmousedown = window.itemDragStart;
        document.getElementById('wptb-image').onmousedown = window.itemDragStart;
        document.getElementById('wptb-button').onmousedown = window.itemDragStart;
        document.getElementById('wptb-list').onmousedown = window.itemDragStart;
    };

    /**
    * A handler for click event in the page.
    * 
    * @returns {void}
    */

    window.bindClickHandler = function () {

        /*
            * event click to the whole document and then check if it's to one
            * the created element to show it's option
            */
        document.onclick = function (e) {
            setTimeout(function () {
                //window.tryToChangeMCEWidth();
            }, 500);
            var $this = $(e.target);

            if (e.target.classList.contains('wptb-admin-container') || e.target.id == 'wpcd_fixed_toolbar' || e.target.classList.contains('wrapper')) {
                window.selectionWidth = window.selectionHeight = 0;
                undoAllPreviousHighlights();
                activateNoneActions();
                deactivateIndividualActions();
                deactivateGroupActions();
            }

            if (e.target.className !== undefined && e.target.className.match(/delete-action/)) {
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
                var optionsClass = '.wptb-' + infArr[2] + 'options' + '.wptb-options-' + infArr[1];
                $(optionsClass).show();

                //Binds the range slider and input for text font size.
                var sliders = document.getElementsByClassName('wptb-text-font-size-slider');
                for (var i = 0; i < sliders.length; i++) {
                    sliders[i].onchange = function () {
                        this.parentNode.parentNode.childNodes[3].childNodes[1].value = this.value;
                    };
                }

                //Binds the range slider and input for text font size.
                var numbers = document.getElementsByClassName('wptb-text-font-size-number');
                for (var i = 0; i < numbers.length; i++) {
                    numbers[i].onchange = function () {
                        this.parentNode.parentNode.childNodes[1].childNodes[1].value = this.value;
                    };
                }
            } else {
                //show the add elements option
                if ($this.is('#add-elements') || $this.parents('#add-elements').length !== 0 || $this.hasClass('wptb-builder-panel') || $this.parents('.wptb-builder-panel').length !== 0) {
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

    window.getActualTableDimensions = function () {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            rows = table.getElementsByTagName('tr'),
            tds,
            cols = 0,
            dimensions;
        for (var i = 0; i < rows.length; i++) {
            tds = rows[i].getElementsByTagName('td');
            if (tds.length > cols) {
                cols = tds.length;
            }
        }
        dimensions = {
            rows: rows.length,
            columns: cols
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

    window.getParameters = function () {
        var t = document.getElementsByClassName('wptb-preview-table')[0];
        return {
            table: t,
            dimensions: getActualTableDimensions(),
            trs: t.getElementsByTagName('tr'),
            tbody: t.childNodes[0]
        };
    };

    /**
    * A lot of functionality of the tables relies on current cell position,
    + so each time we alter the dimensions by adding or deleting rows/columns,
    * we must reassign to each cell its coordinates.
    *
    * @returns void
    */

    window.recalculateIndexes = function () {
        var table = document.getElementsByClassName('wptb-preview-table')[0],
            trs = table.getElementsByTagName('tr');
        for (var i = 0; i < trs.length; i++) {
            var tds = trs[i].getElementsByTagName('td');
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

    addRow = function addRow(pos, _this) {
        var params = getParameters(),
            row,
            referenceRow = undefined;

        if (pos == 'end' || pos == 'start') {
            row = params.table.insertRow(pos == 'end' ? -1 : 0);
        } else {
            row = document.createElement('tr');
        }

        for (var j = 0; j < params.dimensions.columns; j++) {
            var headerCell = createCell();
            row.appendChild(headerCell);
        }

        row.classList.add('wptb-row');
        document.getElementById('wptb-rows-number').value = params.dimensions.rows + 1;

        if (pos == 'before' || pos == 'after') {
            referenceRow = params.trs[_this.dataset.yIndex];
            if (pos == "before") {
                params.tbody.insertBefore(row, referenceRow);
                var buttons = document.getElementsByClassName('wptb-relative-action');
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].dataset.yIndex++;
                }
            } else {
                params.tbody.insertBefore(row, referenceRow.nextSibling);
            }
        }

        recalculateIndexes();
    };

    window.addRowToTheEnd = function (evt) {
        addRow('end', this);
    };

    window.addRowToTheStart = function (evt) {
        addRow('start', this);
    };

    window.addRowBefore = function () {
        addRow('before', this);
    };

    window.addRowAfter = function () {
        addRow('after', this);
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

    addColumn = function addColumn(pos, _this) {
        var params = getParameters(),
            referenceTd,
            newTd;
        for (var i = 0; i < params.dimensions.rows; i++) {

            var newTd = createCell();
            params.trs[i].appendChild(newTd);
            if (pos == 'before' || pos == 'after') {
                referenceTd = params.trs[i].getElementsByTagName('td')[_this.dataset.xIndex];
                if (pos == 'before') {
                    params.trs[i].insertBefore(newTd, referenceTd);
                    var buttons = document.getElementsByClassName('wptb-relative-action');
                    for (var i = 0; i < buttons.length; i++) {
                        buttons[i].dataset.xIndex++;
                    }
                } else {
                    params.trs[i].insertBefore(newTd, referenceTd.nextSibling);
                }
            } else if (pos == 'end') {
                params.trs[i].appendChild(newTd);
            } else {
                params.trs[i].innerHTML = '<td class="wptb-droppable wptb-cell"></td>' + params.trs[i].innerHTML;
            }
        }
        document.getElementById('wptb-columns-number').value = params.dimensions.columns + 1;
        recalculateIndexes();
    };

    window.addColumnToTheEnd = function (evt) {
        addColumn('end', this);
    };

    window.addColumnToTheStart = function (evt) {
        addColumn('start', this);
    };

    window.addColumnBefore = function () {
        addColumn('before', this);
    };

    window.addColumnAfter = function () {
        addColumn('after', this);
    };

    window.deleteRow = function () {
        var num = window.activeRow,
            table = document.getElementsByClassName('wptb-preview-table')[0],
            row = table.getElementsByTagName('tr')[num],
            rowCount = parseInt(document.getElementById('wptb-rows-number').value),
            tbody = row.parentNode;
        if (rowCount == 1 && columnCount == 1 || tbody == undefined) {
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
        if (rowCount == 1 && columnCount == 1) {
            return;
        }
        for (var i = 0; i < rowCount; i++) {
            var td = table.getElementsByTagName('tr')[i].getElementsByTagName('td')[num],
                tr = td.parentNode;
            tr.removeChild(td);
        }
        document.getElementById('wptb-columns-number').value = columnCount - 1;
        undoAllPreviousHighlights();
    };
})(jQuery);
(function ($) {

    window.copyText = function (event) {
        var td = event.target.parentNode.parentNode.parentNode,
            copy = newText(event.target.parentNode.parentNode.childNodes[0].innerHTML);
        td.appendChild(copy);
    };

    window.deleteText = function (evt) {
        var act = this.parentNode.parentNode,
            el = act.parentNode;
        el.removeChild(act);
        window.add_Elements_tab();
    };

    window.showTextSettings = function (event) {

        if (window.currentlyDragging != undefined) {
            return;
        }
        this.classList.add('wptb-directlyhovered');
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            btnMove = document.createElement('span'),
            previous,
            i;
        actions.classList.add('wptb-actions');
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        btnMove.classList.add("dashicons", "dashicons-move", 'move-action');
        btnDelete.onclick = window.deleteText;
        btnCopy.onclick = window.copyText;
        btnMove.onmousedown = window.putItemDragStart;
        actions.appendChild(btnMove);
        actions.appendChild(btnCopy);
        actions.appendChild(btnDelete);
        this.appendChild(actions);
    };

    window.hideTextSettings = function (event) {
        var formerActions = this.getElementsByClassName('wptb-actions');
        if (formerActions && formerActions[0]) {
            var par = formerActions[0].parentNode;
            par.removeChild(formerActions[0]);
        }
        this.classList.remove('wptb-directlyhovered');
    };

    window.newText = function (text) {
        var elText = document.createElement('div');
        var elText2 = document.createElement('div');
        elText2.classList.add('editable');
        var elP = document.createElement('p');
        elP.innerHTML = text != undefined ? text : 'Text';
        elText2.appendChild(elP);
        elText.appendChild(elText2);
        elText.onmouseenter = showTextSettings;
        elText.onmouseleave = hideTextSettings;
        elText.classList.add('wptb-ph-element', 'wptb-element-text-' + window.wptb_num['text']);
        window.addElementOptions('text', elText);
        window.wptb_num['text']++;
        window.tinyFastCall(elText.childNodes[0]);
        $(elText).click();
        return elText;
    };
})(jQuery);
var wptbElement;

//numbers of elements that have been added
window.wptb_num = new Array();
window.wptb_num["text"] = 0;
window.wptb_num["image"] = 0;
window.wptb_num["list"] = 0;
window.wptb_num["button"] = 0;

jQuery(document).ready(function ($) {

    //Column and Row number Selector.
    inputNumber(document.getElementById('wptb-columns-number'));
    inputNumber(document.getElementById('wptb-rows-number'));

    //document.getElementById('wptb_builder').onscroll = tryToChangeMCEWidth;

    //Generate table and bind associated functions.
    document.onready = function () {
        document.getElementById("wptb-generate-table").onclick = function () {

            //Runs when an element is dropped on a cell.
            initTable();

            /**
             * this function will be called 
             * when a property of any elemnet is changed
             * to determine which element that we should edit
             * and then call edititng_property Function
             * @returns {void}
             */
            function detect_element_for_property() {
                var option = this,
                    parent = option;
                while (!parent.classList.contains('wptb-element-options')) {
                    parent = parent.parentNode;
                }
                var classes = parent.attr("class");

                /**
                 * will carry the extracted infotrmation from the class
                 * @example class =>wptb-options-text-0
                 *          result => [
                 *              0 => wptb-options-text-0
                 *              1 => text
                 *              2 => 0
                 *          ]
                 * @type array
                 */
                var infArr = classes.match(/wptb-options-(.+)-(\d+)/i);

                var type = infArr[1];
                var num = infArr[2];
                var element = document.querySelector('.wptb-ph-element.wptb-element-' + type + '-' + num);
                editing_property(element, option);
            }

            /**
             * will change the element according to the value of option
             * 
             * @param {object} element that will change according to the value of option
             * @param {object} option input element
             * @returns {void}
             */
            function editing_property(element, option) {
                // type of property @Ex: font-size,color ....
                var type = option.data('type');
                var val = option.val();
                switch (type) {
                    case 'font-size':
                        element.find("p").css('font-size', val + 'px');
                        break;
                    case 'color':
                        element.find("p").css('color', val);
                        break;
                    case 'list-class':
                        if (val == 'unordered') {
                            element.querySelector('[data-type=list-style-type]').parentNode.style.display = 'flex';
                            var bullets = element.querySelectorAll('article .wptb-list-item-style-dot li');
                            for (var i = 0; i < bullets.length; i++) {
                                bullets[i].style.listStyleType = 'disc';
                            }
                            document.querySelector('[data-type=list-style-type]').value = 'disc';
                        } else {
                            element.querySelector('[data-type=list-style-type]').parentNode.style.display = 'none';
                            var bullets = element.querySelectorAll('article .wptb-list-item-style-dot li');
                            for (var i = 0; i < bullets.length; i++) {
                                bullets[i].style.listStyleType = 'decimal';
                            }
                        }
                        break;
                    case 'numbering-list-style-type':
                    case 'list-style-type':
                        var bullets = element.querySelectorAll('article .wptb-list-item-style-dot li');
                        for (var i = 0; i < bullets.length; i++) {
                            bullets[i].style.listStyleType = val.toLowerCase();
                        }
                        break;
                }
            }
            $(document.body).on('change input, change select', '.wptb-element-property', detect_element_for_property);

            //Triggers when table border setting changes.
            function addBorder(value) {
                document.getElementsByClassName('wptb-preview-table')[0].style.border = value + 'px solid';
            }

            //Binds the range slider and input, also triggers table border change.
            document.getElementById('wptb-table-border-slider').onchange = function () {
                document.getElementById('wptb-table-border-number').value = this.value;
                addBorder(this.value);
            };

            //Binds the range slider and input, also triggers table border change.
            document.getElementById('wptb-table-border-number').onchange = function () {
                document.getElementById('wptb-table-border-slider').value = this.value;
                addBorder(this.value);
            };

            //Triggers when cell padding setting changes.
            function addCellPadding(value) {
                var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
                for (var i = 0; i < tableCells.length; i++) {
                    tableCells[i].style.padding = value + 'px';
                }
            }

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-cell-slider').onchange = function () {
                document.getElementById('wptb-table-cell-number').value = this.value;
                addCellPadding(this.value);
            };

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-cell-number').onchange = function () {
                document.getElementById('wptb-table-cell-slider').value = this.value;
                addCellPadding(this.value);
            };

            document.getElementById('wptb-activate-cell-management-mode').onclick = function () {
                if (this.value == "Manage Cells") {
                    document.getElementsByClassName('wptb-cell-management')[0].classList.add('visible');
                    this.value = "Close Cell Management Mode";
                } else {
                    document.getElementsByClassName('wptb-cell-management')[0].classList.remove('visible');
                    this.value = "Manage Cells";
                }
            };

            //Triggers when apply inner border setting changes.
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

            //Binding Checkbox Change, triggers inner border add.
            document.getElementById('wptb-inner-border-check').onchange = function () {
                var _val = this.checked ? 'checked' : 'unchecked';
                addInnerBorder(_val);
            };

            //Triggers when cell padding setting changes.
            function addInnerBorderSize(value) {
                var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
                for (var i = 0; i < tableCells.length; i++) {
                    tableCells[i].style.border = value + 'px solid';
                }
            }

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-inner-border-slider').onchange = function () {
                document.getElementById('wptb-table-inner-border-number').value = this.value;
                addInnerBorderSize(this.value);
            };

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-inner-border-number').onchange = function () {
                document.getElementById('wptb-table-inner-border-slider').value = this.value;
                addInnerBorderSize(this.value);
            };
        };

        document.getElementById('wptb-add-row-before').onclick = window.addRowBefore;
        document.getElementById('wptb-add-row-after').onclick = window.addRowAfter;
        document.getElementById('wptb-add-column-before').onclick = window.addColumnBefore;
        document.getElementById('wptb-add-column-after').onclick = window.addColumnAfter;
    }; // Of document.onready

});
//# sourceMappingURL=admin.js.map
