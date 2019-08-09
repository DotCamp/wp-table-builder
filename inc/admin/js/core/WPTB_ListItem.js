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
    
    DOMElement.onmouseenter = function ( event ) {
        let wptbBorderMarkerActionsField = new WPTB_BorderMarkerActionsField();
        
        wptbBorderMarkerActionsField.addActionField( 2, DOMElement )

        wptbBorderMarkerActionsField.setParameters( DOMElement );
    };

    DOMElement.onmouseleave = function ( event ) {
        let wptbBorderMarkerActionsField = new WPTB_BorderMarkerActionsField();
        
        wptbBorderMarkerActionsField.addActionField( 2, DOMElement )
        
        wptbBorderMarkerActionsField.leaveFromField( event, DOMElement, 2 );
        
        return false;
    };

    this.getDOMElement = function () {
        return DOMElement;
    };
    
    if ( wptbListItemReturn ) {
        return this;
    }
};