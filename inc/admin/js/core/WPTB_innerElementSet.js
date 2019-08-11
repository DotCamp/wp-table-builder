var WPTB_innerElementSet = function  ( element ) {
    
    function newElementProxy(el) {
        if (el == 'list') {
            return new WPTB_List();
        } else if (el == 'image') {
            return new WPTB_Image();
        } else if (el == 'text') {
            return new WPTB_Text();
        } else if (el == 'button') {
            return new WPTB_Button();
        }
    }
    
    element.ondragenter = function (e) {
        var div;
        if ( e.dataTransfer.types.indexOf( 'wptbelement' ) == -1 && e.dataTransfer.types.indexOf( 'wptb-moving-mode' ) == -1 ) {
            return;
        }
        WPTB_DropHandle(this, e);
        
        element.classList.add( 'wptb-ondragenter' );
    }
    element.ondragover = function (e) {
        e.preventDefault();
        WPTB_DropHandle(this, e);
    }
    element.ondragleave = function () {
        
    }
    element.ondrop = function(e) {
        let element, classId;
        e.preventDefault();
        e.stopPropagation();

        if ( !e.dataTransfer.getData('wptbElement') && !e.dataTransfer.getData('node') ) {
            return;
        }
        let wptbDropHandle,
            wptbBorderMarkerActionsField = new WPTB_BorderMarkerActionsField();
        if ( document.getElementsByClassName( 'wptb-drop-handle' ).length > 0 ) {
            wptbDropHandle = document.getElementsByClassName( 'wptb-drop-handle' )[0];
        }

        if ( e.dataTransfer.getData( 'wptbElement' ) ) {
            element = newElementProxy( e.dataTransfer.getData( 'wptbElement' ) );
            element = element.getDOMElement();
        } else {
            classId = e.dataTransfer.getData( 'node' );
            element = document.getElementsByClassName( classId )[0];
            element.classList.remove( 'wptb-moving-mode' );
            wptbDropHandle.classList.remove('wptb-moving-into-same-elem');
            wptbBorderMarkerActionsField.wptbBorderMarker.classList.remove( 'wptb-moving-into-same-elem' );
        }
        
        element.classList.remove( 'wptb-ondragenter' );
        
        if( wptbDropHandle.style.display == 'block' ) {
            let td;
            if( wptbDropHandle.dataset.text == 'Drop Here' ) {
                td = wptbDropHandle.getDOMParentElement();
                td.appendChild( element );
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
            
        } else {
            return;
        }
        
        wptbDropHandle.style.display = 'none';
        wptbBorderMarkerActionsField.borderMarkerHide();

        WPTB_innerElementSet( element );

        return true;
    }
    element.mouseenter = function(e) {
        element.classList.remove( 'wptb-ondragenter' );
    }
}