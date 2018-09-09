var WPTB_ListItem = function(text){

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
        divcontent.onkeyup = window.listItemKeyListener;

        DOMElement.onmouseenter = function (event) {

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
                console.log('Clicking item');
                var article = event.target.parentNode.parentNode,
                    content = article.querySelector('.wptb-list-item-content'),
                    html = content.innerHTML;
                var duplicate = new WPTB_ListItem(html);
                article.parentNode.appendChild(duplicate.getDOMElement());
            };

            actions.append(btnCopy, btnDelete);
            this.appendChild(actions);
        };

        DOMElement.onmouseleave = function (event) {
            this.classList.remove('wptb-directlyhovered');
            var actions = this.parentNode.querySelector('.wptb-actions');
            if (actions != undefined) {
                let parent = actions.parentNode;
                parent.removeChild(actions);
            }
        };

        divcontent.onkeydown = function (event) {
            var key = (event.which != undefined) ? event.which :
                event.keyCode, 
                duplicate, lastP;
            if (key !== 13 ||
                (window.dontAddItems !== undefined && window.dontAddItems === true)) {
                return;
            }
            event.preventDefault();
            duplicate = new WPTB_ListItem(this.innerHTML);
            console.log('duplicate',duplicate.getDOMElement());
            DOMElement.parentNode.insertBefore(duplicate.getDOMElement(),DOMElement);
            console.log(divcontent);
            divcontent.innerHTML = 'New List Item';
            duplicate.getDOMElement().querySelector('.wptb-list-item-content').focus();

            return false;
        };

        this.getDOMElement = function (){ 
        	return DOMElement;
        }

        return this;

};