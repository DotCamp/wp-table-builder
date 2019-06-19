var applyGenericItemSettings = function ( element, kindIndexProt, copy = false ) {
    var node = element.getDOMElement(),
        index,
        listItems,
        copy;
    
    if ( kindIndexProt == undefined || copy == true ) {
        index = document.counter.nextIndex( element.kind );
        let wptbElements = document.getElementsByClassName( 'wptb-ph-element' );
        if ( wptbElements.length > 0 ) {
            index = wptbElements.length + 1;
        } else { 
            index = 1;
        }
    } else if ( kindIndexProt && ! copy ) {
        index = kindIndexProt.split('-')[1];
    }
    
    node.onmouseenter = function (event) {
        this.classList.add('wptb-directlyhovered');
        let btnDelete = document.createElement( 'span' ),
            btnCopy = document.createElement( 'span' ),
            btnMove = document.createElement( 'span' ),
            actions = document.createElement( 'span' ), i;

        actions.classList.add('wptb-actions');
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        btnMove.classList.add("dashicons", "dashicons-move", 'move-action');
        btnMove.draggable = true;
        btnDelete.onclick = function (event) {
            var act = this.parentNode.parentNode,
                el = act.parentNode;
            el.removeChild(act);
        };
        btnCopy.onclick = function (event) {
            let copy;
            if (element.kind == 'list') {
                var td = event.target.parentNode.parentNode.parentNode,
                    temp = [],
                    srcList = event.target.parentNode.parentNode.querySelectorAll('ul li .wptb-list-item-content');

                for (var i = 0; i < srcList.length; i++) {
                    temp.push(srcList[i].innerHTML);
                }

                copy = new WPTB_List( temp, node );

                node.parentNode.insertBefore( copy.getDOMElement(), node.nextSibling );
            } else if (element.kind == 'text') {
                var td = event.target.parentNode.parentNode.parentNode;
                copy = new WPTB_Text(event.target.parentNode.parentNode.childNodes[0].innerHTML, node);

                node.parentNode.insertBefore( copy.getDOMElement(), node.nextSibling );
            } else if ( element.kind == 'image' ) {
                var td = event.target.parentNode.parentNode.parentNode;
                copy = new WPTB_Image( event.target.parentNode.parentNode.children[0].children[0].src, node );

                node.parentNode.insertBefore( copy.getDOMElement(), node.nextSibling );
            } else {
                var td = event.target.parentNode.parentNode.parentNode,
                    text = event.target.parentNode.parentNode.childNodes[0].querySelector( 'p' ).innerHTML;
                copy = new WPTB_Button( text, node );

                node.parentNode.insertBefore( copy.getDOMElement(), node.nextSibling );
            }
            
            WPTB_innerElementSet( copy.getDOMElement() );
        };
        let parent = this,
            infArr,
            type;
        infArr = parent.className.match(/wptb-element-(.+)-(\d+)/i);
        type = infArr[1];
        let dragImagesArr =  WPTB_Helper.dragImagesArr();
        btnMove.ondragstart = function (event) {
            this.parentNode.style.opacity = 0;
            parent.classList.remove( 'wptb-directlyhovered' );
            parent.classList.add( 'moving-mode' );
            
            event.dataTransfer.setDragImage( dragImagesArr[type], 0, 0 );
            event.dataTransfer.setData( 'node', 'wptb-element-' + infArr[1] + '-' + infArr[2] );
            event.dataTransfer.setData( 'moving-mode', 'wptb-element-' + infArr[1] + '-' + infArr[2] );
            event.dataTransfer.setData( 'wptbElIndic-' + infArr[1], 'wptbElIndic-' + infArr[1] );
        };

        if (element.kind === 'button') {
            let a = node.querySelector( 'a' ),
                target = a.querySelector( 'div' );
            a.onclick = function( e ) {
                e.preventDefault();
            }
            WPTB_Helper.buttonsTinyMceInit( target );
        } else if (element.kind === 'text') {
            tinyMCE.init({
                target: node.childNodes[0],
                inline: true,
                plugins: "link, paste",
                dialog_type: "modal",
                theme: 'modern',
                menubar: false,
                fixed_toolbar_container: '#wpcd_fixed_toolbar',
                paste_as_text: true,
                toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
                setup : function( ed ) {
                    ed.on( 'keyup', function(e) {
                        let row = WPTB_Helper.findAncestor( node, 'wptb-row' );
                        if( row.classList.contains( 'wptb-table-head' ) ) {
                            let table = WPTB_Helper.findAncestor( row, 'wptb-preview-table' );
                            WPTB_Helper.dataTitleColumnSet( table );
                        }
                    });
                },
                init_instance_callback: function (editor) {
                    window.currentEditor = editor;
                    editor.on('focus', function (e) {
                        var totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;
                        if (window.currentEditor &&
                            document.getElementById('wptb_builder').scrollTop >= 55 &&
                            window.currentEditor.bodyElement.style.display != 'none') {
                            document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
                            document.getElementById('wpcd_fixed_toolbar').style.right = (totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2) + 'px';
                            document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
                        } else {
                            document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
                            delete document.getElementById('wpcd_fixed_toolbar').style.right;
                            delete document.getElementById('wpcd_fixed_toolbar').style.top;
                        }
                    });
                }
            });
            
        } else {
            listItems = node.getElementsByClassName( 'wptb-list-item-content' );
            for ( let i = 0; i < listItems.length; i++ ) {
                WPTB_Helper.listItemsTinyMceInit( listItems[i] );
            }
        }

        actions.appendChild(btnMove);
        actions.appendChild(btnCopy);
        actions.appendChild(btnDelete);
        this.appendChild( actions );
    };

    node.onmouseleave = function ( event ) {
        this.classList.remove( 'wptb-directlyhovered' );
        let iter = 0;
        while( event.target.querySelector( '.wptb-actions' ) && iter < 5 ) {
            event.target.querySelector( '.wptb-actions' ).remove();
            iter++;
        }
    };
    
    // Change data-title-column if the title was changed
    if( element.kind == 'text' ) {
        var observer = new MutationObserver( function( mutations ) {
            let row = WPTB_Helper.findAncestor( node, 'wptb-row' );
            if( row.classList.contains( 'wptb-table-head' ) ) {
                let table = WPTB_Helper.findAncestor( row, 'wptb-preview-table' );
                WPTB_Helper.dataTitleColumnSet( table );
            }
        });
        var config = { attributes: true, attributeFilter: ['style'] };
        observer.observe( element.getDOMElement(), config );
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