(function ($) {

    window.copyImage = function (event) {
        var srcList = event.target.parentNode.parentNode,
            newList = srcList.cloneNode(true),
            container = srcList.parentNode,
            listItems = newList.querySelectorAll('article');
        newList.onmouseenter = showListSettings;
        newList.onmouseleave = hideListSettings;
        for (var i = listItems.length - 1; i >= 0; i--) {
            let cont = listItems[i].getElementsByClassName('wptb-list-item-content')[0];
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
    }

    window.showImageSettings = function (event) {
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous, i;
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
            let parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    window.newImage = function (text) {
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
    }

})(jQuery);