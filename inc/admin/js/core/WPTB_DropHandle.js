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
        wptbDropBorderMarker;
    if ( document.getElementsByClassName( 'wptb-drop-handle' ).length == 0 ) {
        wptbDropHandle = document.createElement( 'div' );
        wptbDropHandle.classList.add( 'wptb-drop-handle' );
        
        wptbDropBorderMarker = document.createElement( 'div' );
        wptbDropBorderMarker.classList.add( 'wptb-drop-border-marker' );
        
        let wptbDropBorderMarkerTop = document.createElement( 'div' ),
            wptbDropBorderMarkerRight = document.createElement( 'div' ),
            wptbDropBorderMarkerBottom = document.createElement( 'div' ),
            wptbDropBorderMarkerLeft = document.createElement( 'div' );
        
        wptbDropBorderMarkerTop.classList.add( 'wptb-drop-border-marker-top' );
        wptbDropBorderMarkerRight.classList.add( 'wptb-drop-border-marker-right' );
        wptbDropBorderMarkerBottom.classList.add( 'wptb-drop-border-marker-bottom' );
        wptbDropBorderMarkerLeft.classList.add( 'wptb-drop-border-marker-left' );
        
        wptbDropBorderMarker.appendChild( wptbDropBorderMarkerTop );
        wptbDropBorderMarker.appendChild( wptbDropBorderMarkerRight );
        wptbDropBorderMarker.appendChild( wptbDropBorderMarkerBottom );
        wptbDropBorderMarker.appendChild( wptbDropBorderMarkerLeft );
        
        let body = document.getElementsByTagName( 'body' );
        if ( body.length > 0 ) {
            body[0].appendChild( wptbDropHandle );
            body[0].appendChild( wptbDropBorderMarker );
        }
        
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
                element.wptbMovingMode = 1;
            }
            
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
                
                if( wptbDropHandle.dataset.text == 'Above Element' ) {
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
            wptbDropBorderMarker.style.display = 'none';
            
            WPTB_innerElementSet(element);
            console.log(element);
            if( ! element.classList.contains( 'wptb-image-container' ) || element.wptbMovingMode == 1 ) {
                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
                element.wptbMovingMode == undefined;
            }
        }
        let wptbContainer = document.querySelector( '.wptb-container' );
        wptbContainer.onscroll = function() {
            wptbDropHandle.style.display = 'none';
            wptbDropBorderMarker.style.display = 'none';
        }
    } else {
        wptbDropHandle = document.getElementsByClassName( 'wptb-drop-handle' )[0];
        wptbDropBorderMarker = document.getElementsByClassName( 'wptb-drop-border-marker' )[0];
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
    
    wptbDropHandle.style.width = thisElem.offsetWidth + 'px';
    let height = thisElem.offsetHeight,
        coordinatesElement = thisElem.getBoundingClientRect(),
        left = parseFloat( coordinatesElement.left ),
        top;
    wptbDropHandle.style.left = left + 'px';
    
    if( e.dataTransfer.types.indexOf( 'wptb-moving-mode' ) != -1 ) {
        let elementDrag = document.getElementsByClassName( 'wptb-moving-mode' )[0];
        if( thisElem == elementDrag ) {
            wptbDropHandle.classList.add('wptb-moving-into-same-elem');
            wptbDropBorderMarker.classList.add('wptb-moving-into-same-elem');
        } else {
            wptbDropHandle.classList.remove('wptb-moving-into-same-elem');
            wptbDropBorderMarker.classList.remove('wptb-moving-into-same-elem');
        }
    }
    
    wptbDropHandle.getDOMParentElement = function() {
        return thisElem;
    }
    
    wptbDropHandle.style.display = 'block';
    wptbDropBorderMarker.style.display = 'block';
    if( thisElem.nodeName.toLowerCase() != 'td' ) {
        let y = e.offsetY==undefined?e.layerY:e.offsetY;
        top = parseFloat( coordinatesElement.top ) - parseFloat( 11 );
        wptbDropHandle.dataset.text = 'Above Element';
        if ( y > height/2 ) {
            top = parseFloat( coordinatesElement.top ) + height - 1;
            wptbDropHandle.dataset.text = 'Below Element';
        }
    } else {
        wptbDropHandle.dataset.text = 'Drop Here';
        top = parseFloat( coordinatesElement.top ) + height/2 - 5;
    }
    wptbDropHandle.style.top = top + 'px';

    wptbDropBorderMarker.style.top = coordinatesElement.top + 'px';
    wptbDropBorderMarker.style.left = coordinatesElement.left + 'px';

    wptbDropBorderMarkerTop = wptbDropBorderMarker.querySelector( '.wptb-drop-border-marker-top' );
    wptbDropBorderMarkerTop.style.width = ( parseFloat( thisElem.offsetWidth ) - parseFloat( 1 ) ) + 'px';

    wptbDropBorderMarkerRight = wptbDropBorderMarker.querySelector( '.wptb-drop-border-marker-right' );
    wptbDropBorderMarkerRight.style.height = ( parseFloat( coordinatesElement.bottom ) - parseFloat( coordinatesElement.top ) - 1 ) + 'px';
    wptbDropBorderMarkerRight.style.left = wptbDropBorderMarkerTop.style.width;

    wptbDropBorderMarkerBottom = wptbDropBorderMarker.querySelector( '.wptb-drop-border-marker-bottom' );
    wptbDropBorderMarkerBottom.style.width = wptbDropBorderMarkerTop.style.width;
    wptbDropBorderMarkerBottom.style.top = wptbDropBorderMarkerRight.style.height;

    wptbDropBorderMarkerLeft = wptbDropBorderMarker.querySelector( '.wptb-drop-border-marker-left' );
    wptbDropBorderMarkerLeft.style.height = wptbDropBorderMarkerRight.style.height;
}