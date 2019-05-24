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
                element.classList.remove( 'moving-mode' );
                element.classList.remove( 'moving-into-same-elem' );
            }
            if( wptbDropHandle.dataset.text == 'Drop Here' ) {
                thisElem = wptbDropHandle.getDOMParentElement();
                if ( thisElem.nodeName.toLowerCase() == 'td' ) {
                    let td = wptbDropHandle.getDOMParentElement();
                    td.appendChild( element );
                }
            } else {
                let innerElement = wptbDropHandle.getDOMParentElement(),
                    td = innerElement.parentNode;
            
                
                if( wptbDropHandle.dataset.text == 'Abowe Element' ) {
                    td.insertBefore( element, innerElement );
                } else if( wptbDropHandle.dataset.text == 'Below Element' ) {
                    let innerElementNext = innerElement.nextSibling;
                    td.insertBefore( element, innerElementNext );
                }
            }
            wptbDropHandle.style.display = 'none';
            wptbDropBorderMarker.style.display = 'none';
            
            WPTB_innerElementSet(element);
        }
    } else {
        wptbDropHandle = document.getElementsByClassName( 'wptb-drop-handle' )[0];
        wptbDropBorderMarker = document.getElementsByClassName( 'wptb-drop-border-marker' )[0];
    }
    if( thisElem && thisElem.nodeName.toLowerCase() == 'td' && 
            thisElem.getElementsByClassName( 'wptb-ph-element' ).length != 0 ) {
        return;
    }
    
    wptbDropHandle.getDOMParentElement = function() {
        return thisElem;
    }
    wptbDropHandle.style.width = thisElem.offsetWidth + 'px';
    let height = thisElem.offsetHeight,
        coordinatesElement = thisElem.getBoundingClientRect(),
        left = Number( coordinatesElement.left ),
        top;
    wptbDropHandle.style.left = left + 'px';
    
    if( e.dataTransfer.getData('node') ) {
        let elementDrag = document.getElementsByClassName( e.dataTransfer.getData('node') )[0];
        if( thisElem == elementDrag ) {
            wptbDropHandle.classList.add('moving-into-same-elem');
            wptbDropBorderMarker.classList.add('moving-into-same-elem');
        } else {
            wptbDropHandle.classList.remove('moving-into-same-elem');
            wptbDropBorderMarker.classList.remove('moving-into-same-elem');
        }
    }
    wptbDropHandle.style.display = 'block';
    wptbDropBorderMarker.style.display = 'block';
    if( thisElem.nodeName.toLowerCase() != 'td' ) {
        let y = e.offsetY==undefined?e.layerY:e.offsetY;
        top = Number( coordinatesElement.top ) - Number( 11 );
        wptbDropHandle.dataset.text = 'Abowe Element';
        if ( y > height/2 ) {
            top = Number( coordinatesElement.top ) + height - 1;
            wptbDropHandle.dataset.text = 'Below Element';
        }
    } else {
        wptbDropHandle.dataset.text = 'Drop Here';
        top = Number( coordinatesElement.top ) + height/2 - 5;
    }
    wptbDropHandle.style.top = top + 'px';

    wptbDropBorderMarker.style.top = coordinatesElement.top + 'px';
    wptbDropBorderMarker.style.left = coordinatesElement.left + 'px';

    wptbDropBorderMarkerTop = wptbDropBorderMarker.querySelector( '.wptb-drop-border-marker-top' );
    wptbDropBorderMarkerTop.style.width = ( Number( thisElem.offsetWidth ) - Number( 1 ) ) + 'px';

    wptbDropBorderMarkerRight = wptbDropBorderMarker.querySelector( '.wptb-drop-border-marker-right' );
    wptbDropBorderMarkerRight.style.height = ( Number( coordinatesElement.bottom ) - Number( coordinatesElement.top ) - 1 ) + 'px';
    wptbDropBorderMarkerRight.style.left = wptbDropBorderMarkerTop.style.width;

    wptbDropBorderMarkerBottom = wptbDropBorderMarker.querySelector( '.wptb-drop-border-marker-bottom' );
    wptbDropBorderMarkerBottom.style.width = wptbDropBorderMarkerTop.style.width;
    wptbDropBorderMarkerBottom.style.top = wptbDropBorderMarkerRight.style.height;

    wptbDropBorderMarkerLeft = wptbDropBorderMarker.querySelector( '.wptb-drop-border-marker-left' );
    wptbDropBorderMarkerLeft.style.height = wptbDropBorderMarkerRight.style.height;
}