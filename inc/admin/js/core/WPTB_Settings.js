var WPTB_Settings = function () {
    var elems = document.getElementsByClassName('wptb-element');

    for ( var i = 0; i < elems.length; i++ ) {
        elems[i].ondragstart = function ( event ) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData( 'wptbElement', event.target.dataset.wptbElement );
            event.dataTransfer.setData( 'wptbElIndic-' + event.target.dataset.wptbElement, 'wptbElIndic-' + event.target.dataset.wptbElement );
        }
        elems[i].ondragend = function () {
            WPTB_Helper.elementDragEndClear();
        }
    };
    
    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
    let wptbUndo = document.getElementsByClassName( 'wptb-undo' );
    if( wptbUndo.length > 0 ) {
        wptbUndo = wptbUndo[0];
        
        wptbUndo.onclick = function( event ) {
            if( ! this.classList.contains( 'wptb-undoredo-disabled' ) ) {
                wptbTableStateSaveManager.tableStateGet( this.dataset.wptbUndoredo );
                let wptbUndoRedoContainer = document.getElementsByClassName( 'wptb-undo-redo-container' );
                if( wptbUndoRedoContainer.length > 0 ) {
                    wptbUndoRedoContainer = wptbUndoRedoContainer[0];
                    wptbUndoRedoContainer.onmouseleave = function( event ) {
                        event.target.onmouseleave = '';
                        WPTB_Table();
                    }
                }
            }
            
        }
    }
    
    let wptbRedo = document.getElementsByClassName( 'wptb-redo' );
    if( wptbRedo.length > 0 ) {
        wptbRedo = wptbRedo[0];
        
        wptbRedo.onclick = function( event ) {
            if( ! this.classList.contains( 'wptb-undoredo-disabled' ) ) {
                wptbTableStateSaveManager.tableStateGet( this.dataset.wptbUndoredo );
                let wptbUndoRedoContainer = document.getElementsByClassName( 'wptb-undo-redo-container' );
                if( wptbUndoRedoContainer.length > 0 ) {
                    wptbUndoRedoContainer = wptbUndoRedoContainer[0];
                    wptbUndoRedoContainer.onmouseleave = function( event ) {
                        event.target.onmouseleave = '';
                        WPTB_Table();
                    }
                }
            }
            
        }
    }
    
    let shortcodePopupWindow = document.getElementsByClassName( 'wptb-popup-window-modal' )[0];
    document.getElementsByClassName( 'wptb-embed-btn' )[0].onclick = function () {
        if( ! this.classList.contains( 'wptb-button-disable' ) ) {
            shortcodePopupWindow.classList.add( 'wptb-popup-show' );
        }
    }
    
    window.onbeforeunload = function(e) {
        let wptbSaveDisabled = document.getElementsByClassName( 'wptb-save-disabled' );
        if( wptbSaveDisabled.length == 0 ) {
            return true;
        } else {
            return null;
        }
    };
    
    
    document.getElementsByClassName( 'wptb-popup-dark-area' )[0].onclick = function () {
        shortcodePopupWindow.classList.remove( 'wptb-popup-show' );
    }
    
    document.getElementsByClassName( 'wptb-popup-window-close-icon' )[0].onclick = function () {
        shortcodePopupWindow.classList.remove( 'wptb-popup-show' );
    }
    
    document.getElementsByClassName( 'wptb-preview-btn' )[0].onclick = function ( e ) {
        if( this.classList.contains( 'wptb-button-disable' ) ) {
            e.preventDefault();
        }
    }

    document.getElementsByClassName( 'wptb-save-btn' )[0].onclick = function ( event ) {
        if( ( ! event.target.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0 ) || 
                window.wptbTableStateNumberShow == event.target.dataset.wptbTableStateNumberSave ) {
            return;
        }
        let bar = document.querySelector( '.wptb-edit-bar' );
        if ( bar && bar.classList.contains( 'visible' ) ) {
            let table = document.getElementsByClassName( 'wptb-preview-table' )[0];
            table.toggleTableEditMode();
        }

        let http = new XMLHttpRequest(),
            url = ( wptb_admin_object ? wptb_admin_object.ajaxurl : ajaxurl ) + "?action=save_table",
            t = document.getElementById( 'wptb-setup-name' ).value.trim(),
            messagingArea,
            code = document.getElementsByClassName( 'wptb-preview-table' );
        if( code.length > 0 ) {
            code = WPTB_Stringifier( code[0] );
            code = code.outerHTML;
        } else { 
            code = '';
        }
            
        if ( t === '' || code === '' ) {
            let messagingAreaText = '';
            if( t === '' ) messagingAreaText += 'You must assign a name to the table before saving it.</br>';
            if( code === '' ) messagingAreaText += 'Table wasn\'t created';
            messagingArea = document.getElementById( 'wptb-messaging-area' );
            messagingArea.innerHTML = '<div class="wptb-error wptb-message">Error: ' + messagingAreaText + '</div>';
            messagingArea.classList.add( 'wptb-warning' );
            setTimeout(function () {
                    messagingArea.removeChild( messagingArea.firstChild );
            }, 4000 );
            return;
        }

        let params = {
            title: t,
            content: code,
            security_code: wptb_admin_object.security_code
        };
        if (( rs = WPTB_Helper.detectMode() ) || ( rs = document.wptbId )) {
            params.id = rs;
        }
        params = JSON.stringify( params );

        http.open('POST', url, true);
        http.setRequestHeader( 'Content-type', 'application/json; charset=utf-8' );

        http.onreadystatechange = function (action) {
            if ( this.readyState == 4 && this.status == 200 ) {
                var data = JSON.parse( http.responseText );
                messagingArea = document.getElementById( 'wptb-messaging-area' );

                if ( data[0] == 'saved' ) {
                    document.wptbId = data[1];
                    messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully saved.</div>';
                    document.getElementsByClassName( 'wptb-embed-btn' )[0].classList.remove( 'wptb-button-disable' );
                    document.getElementById( 'wptb-embed-shortcode' ).value = '[wptb id=' + data[1] + ']';
                    let wptbPreviewBtn = document.getElementsByClassName( 'wptb-preview-btn' );
                    if( wptbPreviewBtn.length > 0 ) {
                        wptbPreviewBtn = wptbPreviewBtn[0];
                        wptbPreviewBtn.classList.remove( 'wptb-button-disable' );
                        let wptbPreviewBtnHref = wptbPreviewBtn.dataset.previewHref;
                        wptbPreviewBtnHref = wptbPreviewBtnHref.replace( 'empty', data[1] );
                        wptbPreviewBtn.setAttribute( 'href', wptbPreviewBtnHref );
                    }
                    
                } else if( data[0] == 'edited' ) {
                    messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully updated.</div>';
                    event.target.dataset.wptbTableStateNumberSave = window.wptbTableStateNumberShow;
                    
                    let wptbSaveBtn = document.getElementsByClassName( 'wptb-save-btn' );
                    if( wptbSaveBtn.length > 0 ) {
                        wptbSaveBtn = wptbSaveBtn[0];
                        wptbSaveBtn.classList.add( 'wptb-save-disabled' );
                    }
                } else {
                    messagingArea.innerHTML = '<div class="wptb-error wptb-message">Safety problems</div>';
                }
                messagingArea.classList.add( 'wptb-success' );
                setTimeout( function () {
                    messagingArea.removeChild( messagingArea.firstChild );
                }, 4000 );
            }
        }
        http.send( params );
    }
};
