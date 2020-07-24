let lis = element.getElementsByTagName( 'li' );
if( lis.length > 0 ) {
    for( let i = 0; i < lis.length; i++ ) {
        lis[i].classList.add( 'wptb-in-element' );

        let tinyMceInitStart = function() {
            let listItemContent = lis[i].getElementsByClassName( 'wptb-list-item-content' );
            if( listItemContent.length > 0 ) {
                listItemsTinyMceInit( listItemContent[0] );
            }

            lis[i].removeEventListener( 'mouseover', tinyMceInitStart, false );
        }

        lis[i].addEventListener( 'mouseover', tinyMceInitStart, false );
    }
}



function listItemsRecalculateIndex ( ulElem ) {
    let par = ulElem.querySelectorAll( 'p' );
    if ( par.length > 0 ) {
        for ( let i = 0; i < par.length; i++ ) {
            par[i].dataset.listStyleTypeIndex = Number( i ) + 1 + '.';
        }
    }
}

let ulElem = element.getElementsByTagName( 'ul' );
if( ulElem.length > 0 ) {
    ulElem = ulElem[0];
    listItemsRecalculateIndex( ulElem );
}

function listItemsTinyMceInit( listItem ) {
    tinyMCE.init({
        target: listItem,
        inline: true,
        plugins: "link, paste",
        dialog_type: "modal",
        theme: 'modern',
        menubar: false,
        fixed_toolbar_container: '#wpcd_fixed_toolbar',
        paste_as_text: true,
        toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
        setup: function( ed ) {
            ed.on( 'keydown', function( e ) {
                let article = e.target.parentNode;
                if ( e.keyCode == 13 ) {
                    e.preventDefault();
                    
                    if( article ) {
                        let duplicate = {};
                        let elementCopy = article.cloneNode( true );
                        duplicate.getDOMElement = function() {
                            return elementCopy;
                        }

                        applyGenericItemSettings( duplicate );
                        e.target.querySelector( 'p' ).innerHTML = 'New List Item';
                        article.parentNode.insertBefore( elementCopy, article );
                        elementCopy.classList.remove( 'wptb-directlyhovered' );
                        article.classList.remove( 'wptb-directlyhovered' );
                        WPTB_Helper.elementClearFromTinyMce( elementCopy );
                        
                        let listItemContent = elementCopy.getElementsByClassName( 'wptb-list-item-content' );
                        if( listItemContent.length > 0 ) {
                            listItemsTinyMceInit( listItemContent[0] );
                        }
                        
                        listItemsRecalculateIndex( article.parentNode );
                        
                        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();
                    }
                } else {
                    let p = e.target.querySelector( 'p' );
                    let pText = p.innerHTML.replace(/<[^>]+>/g, '');
                    pText = pText.replace( /\s+/g, ' ' ).trim();
                    pText = pText.replace( /&nbsp;/g, '').trim();
                    
                    if ( e.keyCode == '8' || e.keyCode == '46' ) {
                        if( pText == '' ) {
                            e.preventDefault();
                            e.target.querySelector( 'p' ).innerText = '\n';
                        } else {
                            let selectedText = WPTB_Helper.getSelectionText();
                            selectedText = selectedText.replace( /\s+/g, ' ' ).trim();
                            selectedText = selectedText.replace( /&nbsp;/g, '' ).trim();
                            if( selectedText == pText ) {
                                e.preventDefault();
                                e.target.querySelector( 'p' ).innerText = '\n';
                            }
                        }
                    }
                    
                    if( ! window.listItemPTextKeyDown ) {
                        window.listItemPTextKeyDown = pText;
                    }
                } 
            });
            ed.on( 'keyup', function( e ) {
                if ( e.keyCode != 13 ) {
                    let p = e.target.querySelector( 'p' );
                    let pText = p.innerHTML.replace(/<[^>]+>/g, '');
                    pText = pText.replace( /\s+/g, ' ' ).trim();
                    pText = pText.replace( /&nbsp;/g, '').trim();
                    if( pText !== window.listItemPTextKeyDown ) {
                        e.target.onblur = function() {
                            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                            wptbTableStateSaveManager.tableStateSet();
                            
                            window.listItemPTextKeyDown = '';
                            e.target.onblur = '';
                        }
                    } else {
                        e.target.onblur = '';
                    }
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
}

function liCopyHandler( li, element ) {
    let ulElem = element.getElementsByTagName( 'ul' );
    if( ulElem.length > 0 ) {
        ulElem = ulElem[0];
        listItemsRecalculateIndex( ulElem );
    }
    
    if( li ) {
        let listItemContent = li.getElementsByClassName( 'wptb-list-item-content' );
        if( listItemContent.length > 0 ) {
            listItemsTinyMceInit( listItemContent[0] );
        }
    }
}

WPTB_Helper.innerElementCopyIncludeHandler( element, liCopyHandler );

function selectControlsChange( selects, element ) {
    if( selects && typeof selects === 'object' ) {
        let listItem = element.querySelectorAll( 'li' );
        
        if( selects.hasOwnProperty( 'select1' ) ) {
            if( selects.select1 == 'numbered' ) {
                for ( let i = 0; i < listItem.length; i++ ) {
                    let p = listItem[i].querySelector( 'p' );
                    p.removeAttribute ( 'class' );
                }
            } else if( selects.select1 == 'unordered' ) {
                for ( let i = 0; i < listItem.length; i++ ) {
                    let p = listItem[i].querySelector( 'p' );
                    p.removeAttribute ( 'class' );
                    p.classList.add( 'wptb-list-style-type-disc' );
                }
            }
        }
        
        if( selects.hasOwnProperty( 'select2' ) && selects.select2 ) {
            for ( let i = 0; i < listItem.length; i++) {
                let p = listItem[i].querySelector( 'p' );
                p.removeAttribute ( 'class' );
                p.classList.add( 'wptb-list-style-type-' + selects.select2.toLowerCase() );
            }
        }
    }
}

//WPTB_Helper.controlsInclude( element, selectControlsChange );
function controlsChange( inputs, element ) {
    if( inputs && typeof inputs === 'object' ) {
        if( inputs.hasOwnProperty( 'select1' ) ) {
            let infArr = element.className.match( /wptb-element-((.+-)\d+)/i );
            
            if( infArr ) {
                let controlSelect2 = document.querySelector( '.wptb-el-' + infArr[1] + '-select2' );
                if( controlSelect2 ) {
                    for( let i = 0; i < controlSelect2.options.length; i++ ) {
                        controlSelect2.options[i].removeAttribute( 'selected' );

                        if( controlSelect2.options[i].value == 'disc' ) {
                            controlSelect2.options[i].selected = true;
                        }
                    }
                }
            }
        }
    } 
}

WPTB_Helper.controlsInclude( element, controlsChange );

// for old elements which were before the change of structure of the plugin
if( element.classList.contains( 'wptb-list-item-container' ) ) {
    element.classList.add( 'wptb-list-container' );
}