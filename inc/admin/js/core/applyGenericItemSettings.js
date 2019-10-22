var applyGenericItemSettings = function ( element, kindIndexProt, copy = false ) {
    var node = element.getDOMElement(),
        index,
        listItems,
        copy;
    
    if ( kindIndexProt == undefined || copy == true ) {
        index = document.counter.nextIndex( element.kind );
        let wptbElements = document.getElementsByClassName( 'wptb-ph-element' );
        let elementIndexesArr = [];
        for( let i = 0; i < wptbElements.length; i++ ) {
            var regex = new RegExp( 'wptb-element-' + element.kind + '-(\\d+)', "i" );
            let infArr = wptbElements[i].className.match( regex );
            if( infArr ) {
                elementIndexesArr.push( infArr[1] );
            }
        }
        if( elementIndexesArr.length > 0 ) {
            let elementIndexMax = Math.max( ...elementIndexesArr );
            index = elementIndexMax + 1;
        } else { 
            index = 1;
        }
    } else if ( kindIndexProt && ! copy ) {
        let kindIndexProtArr = kindIndexProt.split('-');
        index = kindIndexProtArr[kindIndexProtArr.length - 1];
        // start item javascript if item is new
        if( element.kind == 'text' ) {
            WPTB_Helper.wptbItemStartScript( element.getDOMElement() );
        }
    }
    
            
    
    node.onmouseenter = function ( event ) {
        if( event.target.classList.contains( 'wptb-moving-mode' ) ) {
            return;
        }
        
        WPTB_Helper.wptbDocumentEventGenerate( 'item:onmouseenter' );
        
        let i, wptbActionsField = new WPTB_ActionsField();
        
        wptbActionsField.addActionField( 1, node );
        
        wptbActionsField.setParameters( node );
        
        node.classList.remove( 'wptb-ondragenter' );
        
        //wptbActionsField.addActionField( 1, node )
        
        if ( element.kind === 'button' ) {
            let a = node.querySelector( 'a' ),
                target = a.querySelector( 'div' );
            a.onclick = function( e ) {
                e.preventDefault();
            }
            WPTB_Helper.buttonsTinyMceInit( target );
        } else if (element.kind === 'text') {
//            tinyMCE.init({
//                target: node.childNodes[0],
//                inline: true,
//                plugins: "link, paste",
//                dialog_type: "modal",
//                theme: 'modern',
//                menubar: false,
//                force_br_newlines : false,
//                force_p_newlines : false,
//                forced_root_block : '',
//                fixed_toolbar_container: '#wpcd_fixed_toolbar',
//                paste_as_text: true,
//                toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
//                setup : function( ed ) {
//                    ed.on( 'change', function(e) {
//                        let row = WPTB_Helper.findAncestor( node, 'wptb-row' );
//                        if( row.classList.contains( 'wptb-table-head' ) ) {
//                            let table = WPTB_Helper.findAncestor( row, 'wptb-preview-table' );
//                            WPTB_Helper.dataTitleColumnSet( table );
//                        }
//                        
//                        
//                    });
//                    
//                    ed.on( 'keydown', function(e) {
//                        let wptbActionsField = new WPTB_ActionsField();
//                        
//                        wptbActionsField.addActionField( 1, node );
//        
//                        wptbActionsField.setParameters( node );
//                    });
//                    ed.on( 'keyup', function(e) {
//                        let wptbActionsField = new WPTB_ActionsField();
//                        
//                        wptbActionsField.addActionField( 1, node );
//        
//                        wptbActionsField.setParameters( node );
//                        
//                        e.target.onblur = function() {
//                            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
//                            wptbTableStateSaveManager.tableStateSet();
//                        }
//                    });
//                    
//                },
//                init_instance_callback: function (editor) {
//                    window.currentEditor = editor;
//                    //editor.fire('focus');
//                    editor.on('focus', function (e) {
//                        var totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;
//                        if (window.currentEditor &&
//                            document.getElementById('wptb_builder').scrollTop >= 55 &&
//                            window.currentEditor.bodyElement.style.display != 'none') {
//                            document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
//                            document.getElementById('wpcd_fixed_toolbar').style.right = (totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2) + 'px';
//                            document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
//                        } else {
//                            document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
//                            delete document.getElementById('wpcd_fixed_toolbar').style.right;
//                            delete document.getElementById('wpcd_fixed_toolbar').style.top;
//                        }
//                    });
//                }
//            });
        } else if( element.kind === 'list' ) {
            listItems = node.getElementsByClassName( 'wptb-list-item-content' );
            for ( let i = 0; i < listItems.length; i++ ) {
                WPTB_Helper.listItemsTinyMceInit( listItems[i] );
            }
        } 
    };
    
    node.onmouseleave = function ( event ) {
        let wptbActionsField = new WPTB_ActionsField();
        
        if( wptbActionsField.wptbActions && wptbActionsField.wptbActions.type != '1' ) {
            return;
        }
        
        wptbActionsField.leaveFromField( event, node, 1 );
    };
    
    let wptbActions = document.getElementsByClassName( 'wptb-actions' );
    if( wptbActions.length > 0 ) {
        wptbActions = wptbActions[0];
        
    }
    
    // Change data-title-column if the title was changed
    if( element.kind == 'text' ) {
//        var observer = new MutationObserver( function( mutations ) {
//            let row = WPTB_Helper.findAncestor( node, 'wptb-row' );
//            if( row.classList.contains( 'wptb-table-head' ) ) {
//                let table = WPTB_Helper.findAncestor( row, 'wptb-preview-table' );
//                WPTB_Helper.dataTitleColumnSet( table );
//            }
//        });
//        var config = { attributes: true, attributeFilter: ['style'] };
//        observer.observe( element.getDOMElement(), config );
    } else if( element.kind == 'star_rating' ) {
        let ratingStars = node.getElementsByClassName( 'wptb-rating-star' );
        for ( let i = 0; i < ratingStars.length; i++ ) {
            let ratingStar = ratingStars[i];
            
            
            WPTB_Helper.starRatingEventHandlersAdd( ratingStar );
            
            let ritingStarZeroSet = ratingStar.querySelector( '.wptb-rating-star-zero-set' );
            if( ritingStarZeroSet ) {
                ritingStarZeroSet.onclick = function( event ) {
                    let ulStarList = WPTB_Helper.findAncestor( event.target, 'wptb-rating-stars-list' );
                    if( ulStarList ) {
                        let children = ulStarList.children;
                        for( let i = 0; i < children.length; i++ ) {
                            children[i].classList.remove( 'wptb-rating-star-selected-full' );
                            children[i].classList.remove( 'wptb-rating-star-selected-half' );
                        }
                    }
                }
            }
        }
    }

    let node_wptb_element_kind_num = node.className.match(/wptb-element-(.+)-(\d+)/i);
    if ( node_wptb_element_kind_num ) {
        node.classList.remove( node_wptb_element_kind_num[0] );
    }
    if ( ! node.classList.contains( 'wptb-ph-element' ) ) {
        node.classList.add( 'wptb-ph-element' );
        if( ! node.classList.contains( 'wptb-element-' + element.kind + '-' + index ) ) {
            node.classList.add( 'wptb-element-' + element.kind + '-' + index );
        }
    } else {
        if( ! node.classList.contains( 'wptb-element-' + element.kind + '-' + index ) ) {
            node.classList.add( 'wptb-element-' + element.kind + '-' + index );
        }
    }
    new WPTB_ElementOptions( element, index, kindIndexProt );

    document.counter.increment(element.kind);
};