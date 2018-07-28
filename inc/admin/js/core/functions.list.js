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
    }

    window.deleteList = function () {
        var act = this.parentNode.parentNode,
            el = act.parentNode;
        el.removeChild(act);
        window.add_Elements_tab();
    }

    window.showListSettings = function (event) {
        this.classList.add('wptb-directlyhovered');
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous, i;
        actions.classList.add('wptb-actions');
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        btnDelete.onclick = window.deleteList;
        btnCopy.onclick = window.copyList;
        actions.appendChild(btnCopy);
        actions.appendChild(btnDelete);
        this.appendChild(actions);
    };

    window.hideListSettings = function (event) {
        this.classList.remove('wptb-directlyhovered');
        var actions = this.querySelector('.wptb-actions');
        if (actions != undefined) {
            let parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    window.showListItemSettings = function (event) {
        //el Article
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous, i;
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
            let parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    window.newList = function (innerElements) {
        var elList = document.createElement('div');
        //elList.classList.add('editable');
        var el_L = document.createElement('ul');
        if (!innerElements)
            for (var i = 0; i < 3; i++) {
                el_L.appendChild(newListItem('List Item ' + (i + 1)));
            }
        else {
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
    }

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
    }

    window.listItemKeyListener = function (event) {
        var key = (event.which != undefined) ? event.which :
            event.keyCode,
            liEl = $(this).parent(),
            duplicate, lastP;
        if (key !== 13 ||
            (window.dontAddItems !== undefined && window.dontAddItems === true)) {
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