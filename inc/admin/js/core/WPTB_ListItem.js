var WPTB_ListItem = function ( text, DOMElementProt, copy ) {
    let wptbListItemReturn;
    if ( DOMElementProt == undefined || ( DOMElementProt && copy )) {
        if (text == undefined) text = 'New List Item';
        var DOMElement = document.createElement('li'),
            //divdot = document.createElement('div'),
            divcontent = document.createElement('div');
            //libullet = document.createElement('li');
        //divdot.classList.add('wptb-list-item-style-dot');
        divcontent.classList.add('wptb-list-item-content');
        //libullet.classList.add('wptb-bullet');
        if ( DOMElementProt ) {
            let styleDot = DOMElementProt.getAttribute( 'style' );
            if ( styleDot ) {
                DOMElement.setAttribute( 'style', styleDot );
            }
        }
        //DOMElement.appendChild(divdot);
        DOMElement.appendChild(divcontent);
        //divdot.appendChild(libullet);
        divcontent.innerHTML = text;
        divcontent.onkeyup = window.listItemKeyListener;
        
        wptbListItemReturn = true;
    } else {
        var DOMElement = DOMElementProt;
        var divcontent = DOMElement.getElementsByClassName( 'wptb-list-item-content' )[0];
    
        divcontent.onkeyup = window.listItemKeyListener;
        
        wptbListItemReturn = false;
    }
    
    DOMElement.onmouseenter = function (event) {

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
            var action = this.parentNode, 
                item = this.parentNode.parentNode,
                parent = item.parentNode;
            item.removeChild( action );
            parent.removeChild( item );
            WPTB_Helper.listItemsRecalculateIndex( parent );
        };

        btnCopy.onclick = function (event) {
            var listItem = event.target.parentNode.parentNode,
                content = listItem.querySelector('.wptb-list-item-content'),
                html = content.innerHTML;
            var duplicate = new WPTB_ListItem( html, listItem, true );
            listItem.parentNode.insertBefore( duplicate.getDOMElement(), DOMElement );
            WPTB_Helper.listItemsTinyMceInit( duplicate.getDOMElement().firstChild );
            setTimeout( function(){
                divcontent.innerHTML = html;
                WPTB_Helper.listItemsRecalculateIndex( listItem.parentNode );
            }, 5 );
        };

        actions.append(btnCopy, btnDelete);
        this.appendChild(actions);
    };

    DOMElement.onmouseleave = function (event) {
        this.removeAttribute( 'class' );
        let iter = 0;
        while( event.target.querySelector( '.wptb-actions' ) && iter < 5 ) {
            event.target.querySelector( '.wptb-actions' ).remove();
            iter++;
        }
    };

    this.getDOMElement = function () {
        return DOMElement;
    };
    
    if ( wptbListItemReturn ) {
        return this;
    }
};