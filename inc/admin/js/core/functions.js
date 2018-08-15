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
            toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
        });
    }

    window.copyList = function (event) {
        var srcList = event.target.parentNode.parentNode,
            newList = srcList.cloneNode(true),
            container = srcList.parentNode,
            listItems = newList.querySelectorAll('article');
        newList.onmouseenter = showListSettings;
        newList.onmouseleave = hideListSettings;
        for (var i = listItems.length - 1; i >= 0; i--) {
            let cont = listItems[i].getElementsByClassName('wptb-list-item-content')[0];
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
    }

    window.showListSettings = function (event) {
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous, i;
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
            let parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    window.showListItemSettings = function (event) {
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous, i;
        actions.classList.add('wptb-actions');
        actions.innerHTML = 'Item Actions';
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');

        previousAct = document.getElementsByClassName('wptb-actions');
        for (i = 0; i < previousAct.length; i++) {
            let par = previousAct[i].parentNode;
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
            let parent = actions.parentNode;
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
    }

    window.listItemKeyListener = function (event) { 
        var key = (event.which != undefined) ? event.which
            : event.keyCode,
            liEl = $(this).parent(),
            duplicate, lastP;
        if (key !== 13 || 
        (window.dontAddItems !== undefined && window.dontAddItems === true) ){
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

            els.dec.onmousedown= function (e) {
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
    }
})(jQuery);