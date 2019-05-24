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
        let btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            btnMove = document.createElement('span'),
            actions = document.createElement('span'), i;

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
            if (element.kind == 'list') {
                var td = event.target.parentNode.parentNode.parentNode,
                    temp = [],
                    srcList = event.target.parentNode.parentNode.querySelectorAll('ul li .wptb-list-item-content');

                for (var i = 0; i < srcList.length; i++) {
                    temp.push(srcList[i].innerHTML);
                }

                var copy = new WPTB_List( temp, node );

                node.parentNode.insertBefore( copy.getDOMElement(), node.nextSibling );
            } else if (element.kind == 'text') {
                var td = event.target.parentNode.parentNode.parentNode,
                    copy = new WPTB_Text(event.target.parentNode.parentNode.childNodes[0].innerHTML, node);

                node.parentNode.insertBefore( copy.getDOMElement(), node.nextSibling );
            } else if ( element.kind == 'image' ) {
                var td = event.target.parentNode.parentNode.parentNode,
                    copy = new WPTB_Image( event.target.parentNode.parentNode.children[0].children[0].src, node );

                node.parentNode.insertBefore( copy.getDOMElement(), node.nextSibling );
            } else {
                var td = event.target.parentNode.parentNode.parentNode,
                    copy = new WPTB_Button( event.target.parentNode.parentNode.childNodes[0].innerHTML, node );

                node.parentNode.insertBefore( copy.getDOMElement(), node.nextSibling );
            }
        };
        btnMove.ondragstart = function (event) {
            var parent = this, infArr, type;

            while (parent.className == '' ||
                !parent.classList.contains('wptb-ph-element')) {
                parent = parent.parentNode;
            }
            this.parentNode.style.display = 'none';
            parent.classList.add( 'moving-mode' );
            parent.classList.remove( 'wptb-directlyhovered' );

            infArr = parent.className.match(/wptb-element-(.+)-(\d+)/i);
            type = infArr[1];

            var img = document.createElement("img");
            img.src = "http://localhost/sandbox/wp-content/plugins/wp-table-builder/inc/admin/views/builder/icons/" + type + ".png";
            event.dataTransfer.setDragImage(img, 0, 0);
            event.dataTransfer.setData('node', 'wptb-element-' + infArr[1] + '-' + infArr[2]);
        };

        if (element.kind === 'button') {
            tinyMCE.init({
                target: node.childNodes[0].childNodes[0],
                inline: true,
                plugins: "link",
                dialog_type: "modal",
                theme: 'modern',
                menubar: false,
                fixed_toolbar_container: '#wpcd_fixed_toolbar',
                toolbar: 'bold italic strikethrough',
                verify_html: false,
                setup: function (ed) {
                    ed.on("init",
                        function (ed) {
                        tinyMCE.execCommand('mceRepaint');
                        }
                    );
                },
                init_instance_callback: function (editor) {
                    editor.on('change', function (e) {
                        // check if it becomes empty because if there's no value it's hard to edit the editor in button element
                        if (editor.getContent().trim() == "") {
                            editor.setContent("<a class='wptb-button'>Button Text</a>");
                        }
                    });
                    editor.on('KeyDown', function (e) {
                        var range = editor.selection.getRng();
                        var KeyID = e.keyCode;
                        if (range.startOffset == 0 && (KeyID == 8 || KeyID == 46)) {
                            e.preventDefault();
                            editor.setContent("<p class='wptb-button'></p>");
                        }
                    });

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
            listItems = node.getElementsByClassName('wptb-list-item-content');
            for ( let i = 0; i < listItems.length; i++ ) {
                tinyMCE.init({
                    target: listItems[i],
                    inline: true,
                    plugins: "link, paste",
                    dialog_type: "modal",
                    theme: 'modern',
                    menubar: false,
                    fixed_toolbar_container: '#wpcd_fixed_toolbar',
                    paste_as_text: true,
                    toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
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
            }
        }

        actions.appendChild(btnMove);
        actions.appendChild(btnCopy);
        actions.appendChild(btnDelete);
//                let actionOld = this.querySelector( '.wptb-actions' );
//                if( actionOld ) {
//                    this.removeChild( actionOld );
//                }
        this.appendChild( actions );
    };

    node.onmouseleave = function ( event ) {
        this.classList.remove('wptb-directlyhovered');
        let iter = 0;
        while( event.target.querySelector( '.wptb-actions' ) && iter < 5 ) {
            event.target.querySelector( '.wptb-actions' ).remove();
            iter++;
        }
    };

    let node_wptb_element_kind_num = node.className.match(/wptb-element-(.+)-(\d+)/i);
    if ( node_wptb_element_kind_num ) {
        node.classList.remove( node_wptb_element_kind_num[0] );
    }
    if ( ! node.classList.contains( 'wptb-ph-element' ) ) {
        node.classList.add('wptb-ph-element' );
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