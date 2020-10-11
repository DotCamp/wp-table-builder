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

            let btnDelete, btnCopy;

            btnDelete = document.createElement( 'span' ),
            btnCopy = document.createElement( 'span' ),
            actions = document.createElement( 'div' );

            actions.classList.add( 'wptb-actions' );
            btnDelete.classList.add( 'dashicons', 'dashicons-trash', 'wptb-delete-action' );
            btnCopy.classList.add( 'dashicons', 'dashicons-admin-page', 'wptb-duplicate-action' );

            actions.appendChild( btnCopy );
            actions.appendChild( btnDelete );

            body.appendChild( actions );

            actions.activeElem = thisNode;

            actions.type = 1;

            btnDelete.onclick = function( event ) {
                let act = event.target.parentNode.activeElem,
                    el = act.parentNode;
                let infArr = act.className.match( /wptb-element-(.+)-(\d+)/i );
//                if( act && infArr && Array.isArray( infArr ) ) {
//                    WPTB_Helper.elementControlsStateDelete( act );
//                    WPTB_Helper.externalCssStylesDelete( infArr[0] );
//                }

                if( act ) {
                    el.removeChild( act );
                }

                if( act && typeof act === 'object' && act.hasOwnProperty( 'kind' ) && act.kind == 'text' ) {
                    let thisRow = el.parentNode;

                    if( WPTB_Helper.rowIsTop( thisRow ) ) {
                        let table = WPTB_Helper.findAncestor( thisRow, 'wptb-preview-table' );

                        if( table.classList.contains( 'wptb-table-preview-head' ) ) {
                            WPTB_Helper.dataTitleColumnSet( table );
                        }
                    }
                }

                let wptbActionsField = new WPTB_ActionsField();
                wptbActionsField.actionsRemove();

                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();

                WPTB_Helper.wptbDocumentEventGenerate('element:removed:dom', document, act);
            };

            btnCopy.onclick = ( event ) => {
                let copy,
                    infArr,
                    type;
                let activeElement = event.target.parentNode.activeElem;
                let activeElemParent = activeElement.parentNode;
                infArr = activeElement.className.match( /wptb-element-(.+)-(\d+)/i );
                if( infArr && Array.isArray( infArr ) ) {
                    type = infArr[1];
                    let data = {};
                    data.kind = type;
                    data.elemProt = activeElement;
                    data.tinyMceClear = true;
                    copy = new WPTB_ElementObject( data );
                    //WPTB_Helper.elementControlsStateCopy( activeElement, copy.getDOMElement() );
                    //WPTB_Helper.externalCssStylesCopy( activeElement, copy.getDOMElement() );
                    //WPTB_Helper.elementStartScript( copy.getDOMElement() );
                    copy.getDOMElement().classList.remove('edit-active');
                    activeElemParent.insertBefore( copy.getDOMElement(), activeElement.nextSibling );
                } else {
                    copy = {};
                    let elementCopy = activeElement.cloneNode( true );
                    elementCopy.classList.remove( 'wptb-directlyhovered' );

                    copy.getDOMElement = function() {
                        return elementCopy;
                    }

                    applyGenericItemSettings( copy );

                    activeElemParent.insertBefore( copy.getDOMElement(), activeElement.nextSibling );

                    WPTB_Helper.wptbDocumentEventGenerate( 'wptb-inner-element:copy', activeElement, copy.getDOMElement() );
                }

                WPTB_innerElementSet( copy.getDOMElement() );

                let wptbActionsField = new WPTB_ActionsField( 1, activeElement );
                wptbActionsField.setParameters( activeElement );

                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
            };


            if( thisNode.classList.contains( 'wptb-ph-element' ) ) {
                let btnMove;
                btnMove = document.createElement( 'span' );
                btnMove.classList.add( "dashicons", "dashicons-move", 'wptb-move-action' );
                btnMove.draggable = true;
                actions.appendChild( btnMove );

                btnMove.ondragstart = ( event ) => {
                    let wptbElementIconsDirectories = 'wptb-element-icons-directories';
                    let tmplIconsDirectories = wp.template( wptbElementIconsDirectories );
                    let data = {};
                    let jsonIconsDirectories = tmplIconsDirectories( data );
                    let IconsDirectories = JSON.parse( jsonIconsDirectories );

                    let dragImages,
                        actions = event.target.parentNode,
                        activeElem = actions.activeElem,
                        infArr,
                        type;
                    infArr = activeElem.className.match( /wptb-element-(.+)-(\d+)/i );
                    if( infArr && Array.isArray( infArr ) ) {
                        type = infArr[1];
                        activeElem.classList.add( 'wptb-moving-mode' );

                        if( IconsDirectories && typeof IconsDirectories === 'object' && IconsDirectories[type] ) {
                            dragImages =  WPTB_Helper.getElementIcon( IconsDirectories[type] );
                        }

                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setDragImage( dragImages, 0, 0 );
                        event.dataTransfer.setData( 'node', 'wptb-element-' + infArr[1] + '-' + infArr[2] );
                        event.dataTransfer.setData( 'wptb-moving-mode', 'wptb-element-' + infArr[1] + '-' + infArr[2] );
                        event.dataTransfer.setData( 'wptbElIndic-' + infArr[1], 'wptbElIndic-' + infArr[1] );
                        let act = event.target.parentNode.activeElem;
                        if( act.kind == 'text' ) {
                            let thisRow = act.parentNode.parentNode;

                            if( WPTB_Helper.rowIsTop( thisRow ) ) {
                                let table = WPTB_Helper.findAncestor( thisRow, 'wptb-preview-table' );

                                if( table.classList.contains( 'wptb-table-preview-head' ) ) {
                                    WPTB_Helper.dataTitleColumnSet( table );
                                }
                            }
                        }
                    } else {
                        this.style.display = 'none';
                    }

                    this.actionsHide();
                };

                btnMove.ondragend = ( event ) => {
                    WPTB_Helper.elementDragEndClear();
                }
            }

            actions.style.display = 'flex';

            this.wptbActions = actions;
        }

        WPTB_Helper.wptbDocumentEventGenerate('wptb:actionfield:generated', document);
    }

    this.setParameters = ( thisNode ) => {

        if( ! this.wptbActions ) {
            let actions = document.getElementsByClassName( 'wptb-actions' );
            if( actions.length > 0 ) {
                this.wptbActions = actions[0];
            } else {
                this.wptbActions = false;
            }
        }

        if( this.wptbActions && this.wptbActions.classList.contains( 'wptb-actions' ) ) {
            this.wptbActions.style.display = 'flex';
        } else {
            return;
        }

        let coordinatesElement = thisNode.getBoundingClientRect();

        let wptbContainer = document.getElementsByClassName( 'wptb-container' )[0];
        let correctTop = () => {
            let coordinatesElement = thisNode.getBoundingClientRect();
            this.wptbActions.style.top = parseFloat( coordinatesElement.top ) - 15 + 'px';
        }
        //wptbContainer.removeEventListener( 'scroll', correctTop, false );

        this.wptbActions.style.top = parseFloat( coordinatesElement.top ) - 15 + 'px';
        this.wptbActions.style.left = ( parseFloat( coordinatesElement.right ) - parseFloat( this.wptbActions.clientWidth ) ) + 1 + 'px';

        this.wptbActions.style.display = 'flex';
        thisNode.classList.add( 'wptb-directlyhovered' );

        //wptbContainer.addEventListener( 'scroll', correctTop, false );
        wptbContainer.onscroll = correctTop;
    }

    this.leaveFromField = ( event, node, actionType ) => {
        if( ! this.wptbActions ) {
            let actions = document.getElementsByClassName( 'wptb-actions' );
            if( actions.length > 0 ) {
                this.wptbActions = actions[0];
            } else {
                this.wptbActions = false;
            }
        }

        if( ! this.wptbActions ) {
            return;
        }

        if( event.relatedTarget ) {
            if ( event.relatedTarget.classList.contains( 'wptb-actions' ) ||
                event.relatedTarget.classList.contains( 'wptb-move-action' ) ||
                event.relatedTarget.classList.contains( 'wptb-duplicate-action' ) ||
                event.relatedTarget.classList.contains( 'wptb-delete-action' )  || event.relatedTarget.classList.contains( 'wptb-prebuilt-mark-action' ) )
            {
                if( ! this.wptbActions ) {
                    this.wptbActions = document.getElementsByClassName( 'wptb-actions' )[0];
                }
                this.wptbActions.onmouseleave = ( event ) => {
                    if( event.relatedTarget != null && ( event.relatedTarget.classList.contains( 'wptb-ph-element' ) ||
                            WPTB_Helper.findAncestor( event.relatedTarget, 'wptb-ph-element') ) && event.relatedTarget != this.wptbActions.activeElem &&
                        WPTB_Helper.findAncestor( event.relatedTarget, 'wptb-directlyhovered' ) != this.wptbActions.activeElem ) {

//                        this.wptbActions.style.display = 'none';
//                        event.relatedTarget.parentNode.parentNode.classList.remove( 'wptb-directlyhovered' );
//
//                        let wptbActionsField = new WPTB_ActionsField();
//
//                        wptbActionsField.addActionField( 1, event.relatedTarget.parentNode.parentNode );
//
//                        wptbActionsField.setParameters( event.relatedTarget.parentNode.parentNode );
                    } else {

                    }

                    let wptbActionsField = new WPTB_ActionsField();

                    wptbActionsField.leaveFromField( event, event.relatedTarget.parentNode.parentNode );

                    event.target.activeElem.classList.remove( 'wptb-directlyhovered' );
                }

                return;
            }
        }

        node.classList.remove( 'wptb-directlyhovered' );
        this.wptbActions.style.display = 'none';

        if( event.relatedTarget ) {
            if( event.relatedTarget.classList.contains( 'wptb-ph-element' ) || WPTB_Helper.findAncestor( event.relatedTarget, 'wptb-ph-element' ) ) {
                this.addActionField( 1, event.relatedTarget.parentNode );

                this.setParameters( event.relatedTarget.parentNode );
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
