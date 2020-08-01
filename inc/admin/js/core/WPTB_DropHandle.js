var WPTB_DropHandle = function (thisElem, e, hide = false) {

    let wptbDropHandle,
        wptbDropBorderMarker,
        wptbDropBorderMarkerTop,
        wptbDropBorderMarkerRight,
        wptbDropBorderMarkerBottom,
        wptbDropBorderMarkerLeft;

    /**
     * Add px suffix to a value
     *
     * @param {any} val value
     * @returns {string} string value suffixed with px
     */
    function toPx(val){
        return `${val}px`;
    }

    if(WPTB_Helper.getDragRelativeType() === 'td_relative'){
        let cellRelatedDropHandle = document.querySelector('.wptb-cell-related-drop-handle');
        if(hide && cellRelatedDropHandle ){
            cellRelatedDropHandle.style.display = 'none';
            return;
        }
       if(cellRelatedDropHandle === null){
           const range = document.createRange();
           range.setStart(document.body , 0);

           const shadowRoot = range.createContextualFragment('<div class="wptb-cell-related-drop-handle">Add to cell</div>').children[0];

           document.body.appendChild(shadowRoot);
           cellRelatedDropHandle = shadowRoot.children[0];
       }

       const parentTd = WPTB_Helper.getParentOfType('td', thisElem);
       const {top,left,width,height} = parentTd.getBoundingClientRect();

       if(!cellRelatedDropHandle){
           return;
       }

        cellRelatedDropHandle.style.display = 'flex';
        cellRelatedDropHandle.style.top = toPx(top);
        cellRelatedDropHandle.style.width = toPx(width);
        cellRelatedDropHandle.style.height = toPx(height);
        cellRelatedDropHandle.style.left = toPx(left);

       return;
    }

    if ( document.getElementsByClassName( 'wptb-drop-handle' ).length == 0 ) {
        wptbDropHandle = document.createElement( 'div' );
        wptbDropHandle.classList.add( 'wptb-drop-handle' );
        
        wptbDropBorderMarker = document.createElement( 'div' );
        wptbDropBorderMarker.classList.add( 'wptb-drop-border-marker' );
        
        wptbDropBorderMarkerTop = document.createElement( 'div' ),
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
            if (e.target.classList.contains('wptb-empty')) {
                e.preventDefault();
                return false;
            }
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
                element = WPTB_Helper.newElementProxy( e.dataTransfer.getData('wptbElement') );
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
                    WPTB_Helper.wptbDocumentEventGenerate('element:mounted:dom', element);
                }
            } else {
                let innerElement = wptbDropHandle.getDOMParentElement();
                td = innerElement.parentNode;
                
                if( wptbDropHandle.dataset.text == 'Above Element' ) {
                    td.insertBefore( element, innerElement );
                    WPTB_Helper.wptbDocumentEventGenerate('element:mounted:dom', element);
                } else if( wptbDropHandle.dataset.text == 'Below Element' ) {
                    let innerElementNext = innerElement.nextSibling;
                    td.insertBefore( element, innerElementNext );
                    WPTB_Helper.wptbDocumentEventGenerate('element:mounted:dom', element);
                }
            }
            
            let thisRow = td.parentNode;
            if( WPTB_Helper.rowIsTop( thisRow ) ) {
                let table = WPTB_Helper.findAncestor( thisRow, 'wptb-preview-table' );

                if( table.classList.contains( 'wptb-table-preview-head' ) ) {
                    WPTB_Helper.dataTitleColumnSet( table );
                }
            }
            
            wptbDropHandle.style.display = 'none';
            wptbDropBorderMarker.style.display = 'none';
            
            WPTB_innerElementSet( element );
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
            thisElem.getElementsByClassName( 'wptb-ph-element' ).length != 0) {
        return;
    }

    if( thisElem && thisElem.nodeName.toLowerCase() == 'td' && 
            thisElem.classList.contains('wptb-empty')) {
        return;
    }
    
    let thisRow;
    if ( thisElem.localName == 'td' ) {
        thisRow = thisElem.parentNode;
    } else if ( thisElem.localName == 'div' && thisElem.classList.contains( 'wptb-ph-element' ) ) {
        thisRow = thisElem.parentNode.parentNode;
    }
    
    if( WPTB_Helper.rowIsTop( thisRow ) ) {
        let table = WPTB_Helper.findAncestor( thisRow, 'wptb-preview-table' );
        
        if( table.classList.contains( 'wptb-table-preview-head' ) ) {
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