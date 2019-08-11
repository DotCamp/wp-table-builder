var WPTB_BorderMarkerActionsField = function() {
    this.wptbBorderMarker;
    this.wptbActions;
    if( document.getElementsByClassName( 'wptb-border-marker' ).length == 0 ) {
        let body = document.getElementsByTagName( 'body' )[0];
        this.wptbBorderMarker = document.createElement( 'div' );
        this.wptbBorderMarker.classList.add( 'wptb-border-marker' );

        let wptbBorderMarkerTop = document.createElement( 'div' ),
            wptbBorderMarkerRight = document.createElement( 'div' ),
            wptbBorderMarkerBottom = document.createElement( 'div' ),
            wptbBorderMarkerLeft = document.createElement( 'div' );

        wptbBorderMarkerTop.classList.add( 'wptb-border-marker-top' );
        wptbBorderMarkerRight.classList.add( 'wptb-border-marker-right' );
        wptbBorderMarkerBottom.classList.add( 'wptb-border-marker-bottom' );
        wptbBorderMarkerLeft.classList.add( 'wptb-border-marker-left' );

        this.wptbBorderMarker.appendChild( wptbBorderMarkerTop );
        this.wptbBorderMarker.appendChild( wptbBorderMarkerRight );
        this.wptbBorderMarker.appendChild( wptbBorderMarkerBottom );
        this.wptbBorderMarker.appendChild( wptbBorderMarkerLeft );

        body.appendChild( this.wptbBorderMarker );
    } else {
        this.wptbBorderMarker = document.getElementsByClassName( 'wptb-border-marker' )[0];
    }
    
    if( document.getElementsByClassName( 'wptb-actions' ).length != 0 ) {
        this.wptbActions = document.getElementsByClassName( 'wptb-actions' )[0];
    }
    
    
    this.addActionField = ( actionType = 1, thisNode ) => {
        if( actionType == 1 ) {
            let btnDelete, btnCopy, btnMove, actions;

            actions = document.getElementsByClassName( 'wptb-actions' );
            if( actions.length != 0 ) {
                while( actions.length != 0 ) {
                    actions[0].parentNode.removeChild( actions[0] );
                }
            }

            btnDelete = document.createElement( 'span' ),
            btnCopy = document.createElement( 'span' ),
            btnMove = document.createElement( 'span' ),
            actions = document.createElement( 'div' );

            actions.classList.add( 'wptb-actions' );
            btnDelete.classList.add( 'dashicons', 'dashicons-trash', 'wptb-delete-action' );
            btnCopy.classList.add( 'dashicons', 'dashicons-admin-page', 'wptb-duplicate-action' );
            btnMove.classList.add( "dashicons", "dashicons-move", 'wptb-move-action' );
            btnMove.draggable = true;

            actions.appendChild( btnMove );
            actions.appendChild( btnCopy );
            actions.appendChild( btnDelete );

            this.wptbBorderMarker.insertBefore( actions, this.wptbBorderMarker.firstChild );

            actions.activeElem = thisNode;
            
            actions.type = 1;

            btnDelete.onclick = function( event ) {
                let act = event.target.parentNode.activeElem,
                    el = act.parentNode;
                el.removeChild(act);

                if( act.kind == 'text' ) {
                    let thisRow = el.parentNode
                    if( thisRow.classList.contains( 'wptb-table-head' ) ) {
                        let table = WPTB_Helper.findAncestor( thisRow, 'wptb-preview-table' );
                        WPTB_Helper.dataTitleColumnSet( table );
                    }
                }

                let wptbBorderMarkerActionsField = new WPTB_BorderMarkerActionsField(4);
                
                wptbBorderMarkerActionsField.borderMarkerHide();
            };

            

            btnCopy.onclick = ( event ) => {
                let copy,
                    infArr,
                    type;
                let activeElement = event.target.parentNode.activeElem;
                infArr = activeElement.className.match(/wptb-element-(.+)-(\d+)/i);
                type = infArr[1];
                let td = activeElement.parentNode;
                if ( type == 'list' ) {
                    var temp = [],
                        srcList = activeElement.querySelectorAll('ul li .wptb-list-item-content');

                    for (var i = 0; i < srcList.length; i++) {
                        temp.push(srcList[i].innerHTML);
                    }

                    copy = new WPTB_List( temp, activeElement );

                    td.insertBefore( copy.getDOMElement(), activeElement.nextSibling );
                } else if ( type == 'text' ) {
                    copy = new WPTB_Text( activeElement.childNodes[0].innerHTML, activeElement );

                    td.insertBefore( copy.getDOMElement(), activeElement.nextSibling );
                } else if ( type == 'image' ) {
                    copy = new WPTB_Image( activeElement.children[0].children[0].src, thisNode );

                    td.insertBefore( copy.getDOMElement(), activeElement.nextSibling );
                } else {
                    let text = activeElement.childNodes[0].querySelector( 'p' ).innerHTML;

                    copy = new WPTB_Button( text, activeElement );

                    td.insertBefore( copy.getDOMElement(), activeElement.nextSibling );
                }

                WPTB_innerElementSet( copy.getDOMElement() );

                let wptbBorderMarkerActionsField = new WPTB_BorderMarkerActionsField( 1, activeElement );

                wptbBorderMarkerActionsField.setParameters( activeElement );
            };

            btnMove.ondragstart = function( event ) {
                let dragImagesArr =  WPTB_Helper.dragImagesArr(),
                    actions = event.target.parentNode,
                    activeElem = actions.activeElem,
                    infArr,
                    type;
                infArr = activeElem.className.match(/wptb-element-(.+)-(\d+)/i);
                type = infArr[1];
                actions.style.opacity = 0;
                activeElem.classList.add( 'wptb-moving-mode' );
                
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setDragImage( dragImagesArr[type], 0, 0 );
                event.dataTransfer.setData( 'node', 'wptb-element-' + infArr[1] + '-' + infArr[2] );
                event.dataTransfer.setData( 'wptb-moving-mode', 'wptb-element-' + infArr[1] + '-' + infArr[2] );
                event.dataTransfer.setData( 'wptbElIndic-' + infArr[1], 'wptbElIndic-' + infArr[1] );
                let act = event.target.parentNode.activeElem;
                if( act.kind == 'text' ) {
                    let thisRow = act.parentNode.parentNode;
                    if( thisRow.classList.contains( 'wptb-table-head' ) ) {
                        let table = WPTB_Helper.findAncestor( thisRow, 'wptb-preview-table' );
                        WPTB_Helper.dataTitleColumnSet( table );
                    }
                }
            };

            actions.style.right = '-' + ( parseFloat( thisNode.offsetWidth ) + 3 ) + 'px';
            actions.style.display = 'block';
            
            this.wptbActions = actions;
        } else if( actionType == 2 ) {
            let btnDelete,
                btnCopy,
                actions,
                previous,
                i;

            actions = document.getElementsByClassName( 'wptb-actions' );
            if( actions.length != 0 ) {
                while( actions.length != 0 ) {
                    actions[0].parentNode.removeChild( actions[0] );
                }
            }

            btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span')

            actions.classList.add('wptb-actions');
            btnDelete.classList.add('dashicons', 'dashicons-trash', 'wptb-delete-action');
            btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'wptb-duplicate-action');

            actions.append( btnCopy, btnDelete );
            this.wptbBorderMarker.insertBefore( actions, this.wptbBorderMarker.firstChild );

            actions.activeElem = thisNode;
            
            actions.type = 2;

            btnDelete.onclick = ( event ) => {
                var action = event.target.parentNode, 
                    item = action.activeElem,
                    parent = item.parentNode;
                let wptbBorderMarkerActionsField = new WPTB_BorderMarkerActionsField( 4 );
                wptbBorderMarkerActionsField.wptbBorderMarker.removeChild( action );
                parent.removeChild( item );
                WPTB_Helper.listItemsRecalculateIndex( parent );
            };

            btnCopy.onclick = ( event ) => {
                let coordinatesElement = thisNode.getBoundingClientRect();
                let coordinatesElementTopBegin = coordinatesElement.top;

                var listItem = event.target.parentNode.activeElem,
                    content = listItem.querySelector( '.wptb-list-item-content' ),
                    html = content.innerHTML;
                var duplicate = new WPTB_ListItem( html, listItem, true );
                listItem.parentNode.insertBefore( duplicate.getDOMElement(), thisNode.nextSibling );
                WPTB_Helper.listItemsTinyMceInit( duplicate.getDOMElement().firstChild );

                let divcontent = thisNode.getElementsByClassName( 'wptb-list-item-content' );
                if( divcontent.length > 0 ) {
                    divcontent = divcontent[0];
                }
                setTimeout( function(){
                    divcontent.innerHTML = html;
                    WPTB_Helper.listItemsRecalculateIndex( listItem.parentNode );
                }, 5 );

                coordinatesElement = thisNode.getBoundingClientRect();
                let coordinatesElementTopEnd = coordinatesElement.top;

                if( coordinatesElementTopBegin != coordinatesElementTopEnd ) {
                    let wptbBorderMarkerActionsField = new WPTB_BorderMarkerActionsField( 2, thisNode );
                    wptbBorderMarkerActionsField.setParameters( thisNode );
                }
            };

            actions.style.right = '-' + ( parseFloat( thisNode.offsetWidth ) + 3 ) + 'px';
            actions.style.display = 'block';
            
            this.wptbActions = actions;
        }
    }
    
    
    this.setParameters = ( thisNode ) => {
        let coordinatesElement = thisNode.getBoundingClientRect();
        
        let wptbContainer = document.getElementsByClassName( 'wptb-container' )[0];
        let correctTop = () => {
            let coordinatesElement = thisNode.getBoundingClientRect();
            this.wptbBorderMarker.style.top = coordinatesElement.top + 'px';
        }
        wptbContainer.removeEventListener( 'scroll', correctTop, false );
        
        this.wptbBorderMarker.style.top = parseFloat( coordinatesElement.top ) - 2 + 'px';
        this.wptbBorderMarker.style.left = parseFloat( coordinatesElement.left ) - 2 + 'px';

        let wptbBorderMarkerTop = this.wptbBorderMarker.querySelector( '.wptb-border-marker-top' );
        wptbBorderMarkerTop.style.width = ( parseFloat( thisNode.offsetWidth )  + 3 ) + 'px';

        let wptbBorderMarkerRight = this.wptbBorderMarker.querySelector( '.wptb-border-marker-right' );
        wptbBorderMarkerRight.style.height = ( parseFloat( coordinatesElement.bottom ) - parseFloat( coordinatesElement.top )  + 4 ) + 'px';
        wptbBorderMarkerRight.style.left = ( parseFloat( thisNode.offsetWidth )  + 3 ) + 'px';

        let wptbBorderMarkerBottom = this.wptbBorderMarker.querySelector( '.wptb-border-marker-bottom' );
        wptbBorderMarkerBottom.style.width = wptbBorderMarkerTop.style.width;
        wptbBorderMarkerBottom.style.top = ( parseFloat( coordinatesElement.bottom ) - parseFloat( coordinatesElement.top )  + 3 ) + 'px';;

        let wptbBorderMarkerLeft = this.wptbBorderMarker.querySelector( '.wptb-border-marker-left' );
        wptbBorderMarkerLeft.style.height = wptbBorderMarkerRight.style.height;
        
        this.wptbBorderMarker.style.display = 'block';
        
        wptbContainer.addEventListener( 'scroll', correctTop, false );
    }
    
    this.leaveFromField = ( event, node, actionType ) => {
        if( event.relatedTarget != null ) {
            if( event.relatedTarget.classList.contains( 'wptb-border-marker' ) ||
                event.relatedTarget.classList.contains( 'wptb-border-marker-top' ) ||
                event.relatedTarget.classList.contains( 'wptb-border-marker-right' ) ||
                event.relatedTarget.classList.contains( 'wptb-border-marker-bottom' ) ||
                event.relatedTarget.classList.contains( 'wptb-border-marker-left' ) || event.relatedTarget.localName == 'td' ) {
                this.wptbBorderMarker.style.display = 'none';
                this.wptbActions.style.display = 'none';

                if( this.wptbActions.type == 2 ) {
                    let listElement = WPTB_Helper.findAncestor( node, 'wptb-list-item-container' );
                    let wptbBorderMarkerActionsField = new WPTB_BorderMarkerActionsField();
                    wptbBorderMarkerActionsField.addActionField( 1, listElement );
                    wptbBorderMarkerActionsField.setParameters( listElement );
                }
            } else if( event.relatedTarget.classList.contains( 'wptb-actions' ) ||
                event.relatedTarget.classList.contains( 'wptb-move-action' ) ||
                event.relatedTarget.classList.contains( 'wptb-duplicate-action' ) ||
                event.relatedTarget.classList.contains( 'wptb-delete-action' ) ) {
                this.wptbActions.onmouseleave = ( event ) => {
                    if( event.relatedTarget != null && event.relatedTarget.localName == 'td' ) {
                        this.wptbBorderMarker.style.display = 'none';
                        this.wptbActions.style.display = 'none';

                        if( this.wptbActions.type == 2 ) {
                            let listElement = WPTB_Helper.findAncestor( node, 'wptb-list-item-container' );
                            let wptbBorderMarkerActionsField = new WPTB_BorderMarkerActionsField();
                            wptbBorderMarkerActionsField.addActionField( 1, listElement );
                            wptbBorderMarkerActionsField.setParameters( listElement );
                        }
                    } else {
                        return;
                    }
                }
            }
        }
    }
    
    this.borderMarkerHide = () => {
        this.wptbBorderMarker.style.display = 'none';
    }
    
    this.actionsRemove = () => {
        let actions = this.wptbBorderMarker.getElementsByClassName('wptb-actions');
        if( actions.length > 0 ) {
            actions = actions[0];
            this.wptbBorderMarker.removeChild( actions );
        }
    }
}