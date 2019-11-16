var WPTB_ActionsField = function() {
    //this.wptbBorderMarker;
    this.wptbActions;
    if( document.getElementsByClassName( 'wptb-actions' ).length != 0 ) {
        this.wptbActions = document.getElementsByClassName( 'wptb-actions' )[0];
    }
    
    this.addActionField = ( actionType, thisNode ) => {
        let body = document.getElementsByTagName( 'body' )[0];
        
        let actions = document.getElementsByClassName( 'wptb-actions' );
        if( actions.length != 0 ) {
            let previousNode = actions[0].activeElem;
            if( previousNode ) {
                previousNode.classList.remove( 'wptb-directlyhovered' );
            }
            
            while( actions.length != 0 ) {
                actions[0].parentNode.removeChild( actions[0] );
            }
        }
        
        if( actionType == 1 ) {
        
            let btnDelete, btnCopy, btnMove;

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
            body.appendChild( actions );

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

                let wptbActionsField = new WPTB_ActionsField();

                wptbActionsField.actionsRemove();
                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
            };



            btnCopy.onclick = ( event ) => {
                let copy,
                    infArr,
                    type;
                let activeElement = event.target.parentNode.activeElem;
                let activeElementClone = activeElement.cloneNode( true );
                activeElementClone.classList.remove( 'wptb-directlyhovered' );
                infArr = activeElement.className.match(/wptb-element-(.+)-(\d+)/i);
                type = infArr[1];
                let td = activeElement.parentNode;
                if ( type == 'list1' ) {
                    var temp = [],
                        srcList = activeElement.querySelectorAll('ul li .wptb-list-item-content');

                    for (var i = 0; i < srcList.length; i++) {
                        temp.push(srcList[i].innerHTML);
                    }

                    copy = new WPTB_List( temp, activeElementClone );

                    td.insertBefore( copy.getDOMElement(), activeElement.nextSibling );
                    WPTB_innerElementSet( copy.getDOMElement() );
                } else if ( type == 'text' || type == 'button' || type == 'image' || type == 'star_rating' || type == 'list' ) {
                    let data = {};
                    data.kind = type;
                    data.elemProt = activeElement;
                    data.tinyMceClear = true;
                    copy = new WPTB_ItemObject( data );
                    td.insertBefore( copy.getDOMElement(), activeElement.nextSibling );
                    
                    WPTB_Helper.elementStartScript( copy.getDOMElement() );
                    
                    WPTB_innerElementSet( copy.getDOMElement() );
                } else if ( type == 'image' ) {
                    copy = new WPTB_Image( '', activeElement );
                    
                    td.insertBefore( copy.getDOMElement(), activeElement.nextSibling );
                    WPTB_innerElementSet( copy.getDOMElement() );
                } else if( type == 'button' ) {
                    let text = activeElementClone.childNodes[0].querySelector( 'p' ).innerHTML;
 
                    copy = new WPTB_Button( text, activeElementClone );

                    td.insertBefore( copy.getDOMElement(), activeElement.nextSibling );
                    
                    WPTB_Helper.elementStartScript( copy.getDOMElement() );
                    
                    WPTB_innerElementSet( copy.getDOMElement() );
                } else if( type = 'star_rating' ) {
                    copy = new WPTB_StarRating( activeElementClone );

                    td.insertBefore( copy.getDOMElement(), activeElement.nextSibling );
                    WPTB_innerElementSet( copy.getDOMElement() );
                }


                let wptbActionsField = new WPTB_ActionsField( 1, activeElement );
    
                wptbActionsField.setParameters( activeElement );
                
                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
            };

            btnMove.ondragstart = ( event ) => {
                let dragImagesArr =  WPTB_Helper.dragImagesArr(),
                    actions = event.target.parentNode,
                    activeElem = actions.activeElem,
                    infArr,
                    type;
                infArr = activeElem.className.match(/wptb-element-(.+)-(\d+)/i);
                type = infArr[1];
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
                //actions.style.display = 'none';
                this.actionsHide();
            };
            
            btnMove.ondragend = ( event ) => {
                WPTB_Helper.elementDragEndClear();
            }

            //actions.style.right = '-' + parseFloat( thisNode.offsetWidth ) + 'px';
            actions.style.display = 'block';

            this.wptbActions = actions;
        } else if( actionType == 2 ) {
            let btnDelete,
                btnCopy,
                previous,
                i;

            btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span')

            actions.classList.add('wptb-actions');
            btnDelete.classList.add('dashicons', 'dashicons-trash', 'wptb-delete-action');
            btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'wptb-duplicate-action');

            actions.append( btnCopy, btnDelete );
            body.appendChild( actions );

            actions.activeElem = thisNode;
            
            let wptbDirectlyhovered = WPTB_Helper.findAncestor( thisNode, 'wptb-directlyhovered' );
            if( wptbDirectlyhovered ) {
                wptbDirectlyhovered.classList.remove( 'wptb-directlyhovered' );
            }

            actions.type = 2;

            btnDelete.onclick = ( event ) => {
                var action = event.target.parentNode, 
                    item = action.activeElem,
                    parent = item.parentNode;
                let wptbActionsField = new WPTB_ActionsField( 4 );
                wptbActionsField.actionsRemove();
                parent.removeChild( item );
                WPTB_Helper.listItemsRecalculateIndex( parent );
                
                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
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
                    let wptbActionsField = new WPTB_ActionsField( 2, thisNode );
                    wptbActionsField.setParameters( thisNode );
                }
                
                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
            };

            actions.style.display = 'block';

            this.wptbActions = actions;
        }
    }
    
    this.setParameters = ( thisNode ) => {
        if( ! this.wptbActions ) {
            let actions = document.getElementsByClassName( 'wptb-actions' );
            if( actions.length > 0 ) {
                this.wptbActions = actions[0];
            }
        }
        
        if( this.wptbActions ) {
            this.wptbActions.style.display = 'block';
        }
        
        let coordinatesElement = thisNode.getBoundingClientRect();
        
        let wptbContainer = document.getElementsByClassName( 'wptb-container' )[0];
        let correctTop = () => {
            let coordinatesElement = thisNode.getBoundingClientRect();
            this.wptbActions.style.top = parseFloat( coordinatesElement.top ) - 15 + 'px';
        }
        wptbContainer.removeEventListener( 'scroll', correctTop, false );
        
        this.wptbActions.style.top = parseFloat( coordinatesElement.top ) - 15 + 'px';
        this.wptbActions.style.left = ( parseFloat( coordinatesElement.right ) - parseFloat( this.wptbActions.clientWidth ) ) + 1 + 'px';

//        let wptbBorderMarkerTop = this.wptbBorderMarker.querySelector( '.wptb-border-marker-top' );
//        wptbBorderMarkerTop.style.width = ( parseFloat( thisNode.offsetWidth )  + 3 ) + 'px';
//
//        let wptbBorderMarkerRight = this.wptbBorderMarker.querySelector( '.wptb-border-marker-right' );
//        wptbBorderMarkerRight.style.height = ( parseFloat( coordinatesElement.bottom ) - parseFloat( coordinatesElement.top )  + 4 ) + 'px';
//        wptbBorderMarkerRight.style.left = ( parseFloat( thisNode.offsetWidth )  + 3 ) + 'px';
//
//        let wptbBorderMarkerBottom = this.wptbBorderMarker.querySelector( '.wptb-border-marker-bottom' );
//        wptbBorderMarkerBottom.style.width = wptbBorderMarkerTop.style.width;
//        wptbBorderMarkerBottom.style.top = ( parseFloat( coordinatesElement.bottom ) - parseFloat( coordinatesElement.top )  + 3 ) + 'px';;
//
//        let wptbBorderMarkerLeft = this.wptbBorderMarker.querySelector( '.wptb-border-marker-left' );
//      
        
        //this.wptbBorderMarker.style.display = 'block';
        this.wptbActions.style.display = 'block';
        thisNode.classList.add( 'wptb-directlyhovered' );
        
        wptbContainer.addEventListener( 'scroll', correctTop, false );
    }
    
//        if( actionType == 1 || actionType == 2 ) {
//            this.setParameters( thisNode );
//        }
//    } else {
//        this.wptbActions.style.display = 'block';
//        thisNode.classList.add( 'wptb-directlyhovered' );
//    }
    
    this.leaveFromField = ( event, node, actionType ) => {
        if( event.relatedTarget ) {
            if ( event.relatedTarget.classList.contains( 'wptb-actions' ) ||
                event.relatedTarget.classList.contains( 'wptb-move-action' ) ||
                event.relatedTarget.classList.contains( 'wptb-duplicate-action' ) ||
                event.relatedTarget.classList.contains( 'wptb-delete-action' ) ) {
                if( ! this.wptbActions ) {
                    this.wptbActions = document.getElementsByClassName( 'wptb-actions' )[0];
                }
                this.wptbActions.onmouseleave = ( event ) => {
                    if( event.relatedTarget != null && event.relatedTarget != this.wptbActions.activeElem &&
                        WPTB_Helper.findAncestor( event.relatedTarget, 'wptb-directlyhovered') != this.wptbActions.activeElem ) {
                        event.target.activeElem.classList.remove( 'wptb-directlyhovered' );
                        this.wptbActions.style.display = 'none';

                        if( this.wptbActions.type == 2 ) {
                            let wptbActionsField = new WPTB_ActionsField();

                            wptbActionsField.addActionField( 1, event.relatedTarget.parentNode.parentNode );

                            wptbActionsField.setParameters( event.relatedTarget.parentNode.parentNode );
                        }
                    } else {
                        return;
                    }
                }

                return;
            } 
//            else if( event.relatedTarget.classList.contains( 'wptb-drop-handle' ) ) {
//                let wptbDropHandle = document.getElementsByClassName( 'wptb-drop-handle' );
//                if( wptbDropHandle.length > 0 ) {
//                    wptbDropHandle = wptbDropHandle[0];
//                    wptbDropHandle.onmouseleave
//                }
//            }
        }
        
        node.classList.remove( 'wptb-directlyhovered' );
        this.wptbActions.style.display = 'none';
        
        if( this.wptbActions.type == 2 ) {
            if( event.relatedTarget ) {
                if( event.relatedTarget.localName == 'ul' ) {
                    //let wptbActionsField = new WPTB_ActionsField();

                    this.addActionField( 1, event.relatedTarget.parentNode );

                    this.setParameters( event.relatedTarget.parentNode );
                }
            }
            
        }
    }
    
    this.actionsRemove = () => {
        if( ! this.wptbActions ) {
            let actions = document.getElementsByClassName( 'wptb-actions' );
            if( actions.length > 0 ) {
                this.wptbActions = actions[0];
            }
        }
        
        if( this.wptbActions ) {
            this.wptbActions.parentNode.removeChild( this.wptbActions );
        }
    }
    
    this.actionsHide = () => {
        if( ! this.wptbActions ) {
            let actions = document.getElementsByClassName( 'wptb-actions' );
            if( actions.length > 0 ) {
                this.wptbActions = actions[0];
            }
        }
        
        if( this.wptbActions ) {
            this.wptbActions.style.opacity = 0;
        }
    }
}