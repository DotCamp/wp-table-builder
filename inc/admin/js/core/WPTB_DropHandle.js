var WPTB_DropHandle = function (thisElem, e) {
    
    function newElementProxy(el) {
        if (el.includes('list')) {
            return new WPTB_List();
        } else if (el.includes('image')) {
            return new WPTB_Image();
        } else if (el.includes('text')) {
            return new WPTB_Text();
        } else if (el.includes('button')) {
            return new WPTB_Button();
        }
    }
    
    let wptbDropHandle,
        wptbBorderMarkerActionsField = new WPTB_BorderMarkerActionsField();
        wptbBorderMarkerActionsField.actionsRemove();
    if ( document.getElementsByClassName( 'wptb-drop-handle' ).length == 0 ) {
        let body = document.getElementsByTagName( 'body' )[0];
        wptbDropHandle = document.createElement( 'div' );
        wptbDropHandle.classList.add( 'wptb-drop-handle' );
       
        body.appendChild( wptbDropHandle );
        
        wptbDropHandle.ondragenter = function () {

        }

        wptbDropHandle.ondragover = function (e) {
            e.preventDefault();
        }

        wptbDropHandle.ondragleave = function () {

        }
        wptbDropHandle.ondrop = function (e) {
            e.preventDefault();
            let element;
            
            if ( e.dataTransfer.getData('wptbElement') ) {
                element = newElementProxy( e.dataTransfer.getData('wptbElement') );
                element = element.getDOMElement();
            } else {
                element = document.getElementsByClassName( e.dataTransfer.getData('node') )[0];
                element.classList.remove( 'wptb-moving-mode' );
                element.classList.remove( 'wptb-moving-into-same-elem' );
            }
            
            element.classList.remove( 'wptb-ondragenter' );
            
            let td;
            if( wptbDropHandle.dataset.text == 'Drop Here' ) {
                thisElem = wptbDropHandle.getDOMParentElement();
                if ( thisElem.nodeName.toLowerCase() == 'td' ) {
                    td = wptbDropHandle.getDOMParentElement();
                    td.appendChild( element );
                }
            } else {
                let innerElement = wptbDropHandle.getDOMParentElement();
                td = innerElement.parentNode;
                
                if( wptbDropHandle.dataset.text == 'Abowe Element' ) {
                    td.insertBefore( element, innerElement );
                } else if( wptbDropHandle.dataset.text == 'Below Element' ) {
                    let innerElementNext = innerElement.nextSibling;
                    td.insertBefore( element, innerElementNext );
                }
            }
            
            let thisRow = td.parentNode
            if( thisRow.classList.contains( 'wptb-table-head' ) ) {
                let table = WPTB_Helper.findAncestor( thisRow, 'wptb-preview-table' );
                WPTB_Helper.dataTitleColumnSet( table );
            }
            
            wptbDropHandle.style.display = 'none';
            wptbBorderMarkerActionsField.borderMarkerHide();
            
            WPTB_innerElementSet(element);
        }
    } else {
        wptbDropHandle = document.getElementsByClassName( 'wptb-drop-handle' )[0];
    }
    
    if( thisElem && thisElem.nodeName.toLowerCase() == 'td' && 
            thisElem.getElementsByClassName( 'wptb-ph-element' ).length != 0 ) {
        return;
    }
    
    let thisRow;
    if ( thisElem.localName == 'td' ) {
        thisRow = thisElem.parentNode;
    } else if ( thisElem.localName == 'div' && thisElem.classList.contains( 'wptb-ph-element' ) ) {
        thisRow = thisElem.parentNode.parentNode;
    }
    if( thisRow.classList.contains( 'wptb-table-head' ) ) {
        let indics = e.dataTransfer.types;
        let notDragEnter = false;
        for ( let i = 0; i < indics.length; i++ ) {
            let infArr = indics[i].match( /wptbelindic-([a-z]+)/i );
            if ( infArr && infArr[1] != 'text' ) {
                notDragEnter = true;
                break;
            }
        }
        if( notDragEnter ) {
            return;
        }
    }
    
    wptbDropHandle.style.width = thisElem.offsetWidth + 4 + 'px';
    let height = thisElem.offsetHeight,
        coordinatesElement = thisElem.getBoundingClientRect(),
        left = Number( coordinatesElement.left ),
        top;
    wptbDropHandle.style.left = left - 2 + 'px';
    
    if( e.dataTransfer.types.indexOf( 'wptb-moving-mode' ) != -1 ) {
        let elementDrag = document.getElementsByClassName( 'wptb-moving-mode' )[0];
        if( thisElem == elementDrag ) {
            wptbDropHandle.classList.add('wptb-moving-into-same-elem');
            wptbBorderMarkerActionsField.wptbBorderMarker.classList.add('wptb-moving-into-same-elem');
        } else {
            wptbDropHandle.classList.remove('wptb-moving-into-same-elem');
            wptbBorderMarkerActionsField.wptbBorderMarker.classList.remove('wptb-moving-into-same-elem');
        }
    }
    
    wptbDropHandle.getDOMParentElement = function() {
        return thisElem;
    }
    
    wptbDropHandle.style.display = 'block';
    
    let actions = wptbBorderMarkerActionsField.wptbActions;
    if( actions ) {
        actions.style.display = 'none';
    }
    
    let wptbContainer = document.getElementsByClassName( 'wptb-container' )[0];
    let correctTop = function() {
        let coordinatesElement = thisElem.getBoundingClientRect();
        wptbBorderMarkerActionsField.wptbBorderMarker.style.top = coordinatesElement.top + 'px';
    }
    wptbContainer.removeEventListener( 'scroll', correctTop, false );
    
    if( thisElem.nodeName.toLowerCase() != 'td' ) {
        let y = e.offsetY==undefined?e.layerY:e.offsetY;
        top = parseFloat( coordinatesElement.top ) - parseFloat( 13 );
        wptbDropHandle.dataset.text = 'Abowe Element';
        if ( y > height/2 ) {
            top = parseFloat( coordinatesElement.top ) + height + 1;
            wptbDropHandle.dataset.text = 'Below Element';
        }
    } else {
        wptbDropHandle.dataset.text = 'Drop Here';
        top = parseFloat( coordinatesElement.top ) + height/2 - 5;
    }
    wptbDropHandle.style.top = top + 'px';
    
    wptbContainer.addEventListener( 'scroll', correctTop, false );

    wptbBorderMarkerActionsField.setParameters( thisElem ); 
}