var WPTB_Settings = function () {
    var elems = document.getElementsByClassName('wptb-element');

    for ( var i = 0; i < elems.length; i++ ) {
        elems[i].ondragstart = function ( event ) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData( 'wptbElement', event.target.dataset.wptbElement );
            event.dataTransfer.setData( 'wptbElIndic-' + event.target.dataset.wptbElement, 'wptbElIndic-' + event.target.dataset.wptbElement );

            // set drag relative helper field for future use
            WPTB_Helper.setDragRelativeType(this.dataset.wptbRelativeElements || '');
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
                if(wptbUndoRedoContainer.length > 0) {
                    wptbUndoRedoContainer = wptbUndoRedoContainer[0];
                    wptbUndoRedoContainer.onmouseleave = function( event ) {
                        event.target.onmouseleave = '';
                        let table = document.querySelector( '.wptb-preview-table' );
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
                if(wptbUndoRedoContainer.length > 0) {
                    wptbUndoRedoContainer = wptbUndoRedoContainer[0];
                    wptbUndoRedoContainer.onmouseleave = function( event ) {
                        event.target.onmouseleave = '';
                        let table = document.querySelector( '.wptb-preview-table' );
                        WPTB_Table();
                    }
                }
            }

        }
    }

    // @deprecated
    // let shortcodePopupWindow = document.getElementsByClassName( 'wptb-popup-window-modal' )[0];
    document.getElementsByClassName( 'wptb-embed-btn' )[0].onclick = function () {
        if( ! this.classList.contains( 'wptb-button-disable' ) ) {
            // show modal window for shortcode embed
            WPTB_Store.commit('embed/showModal');
        }
    }

    // window beforeunload event callback
    window.onbeforeunload = function(e) {
        return WPTB_Store.getters.getTableDirtyStatus? true : null;
    };


    document.getElementsByClassName( 'wptb-popup-dark-area' )[0].onclick = function () {
        shortcodePopupWindow.classList.remove( 'wptb-popup-show' );
    }

    // @deprecated
    // document.getElementsByClassName( 'wptb-popup-window-close-icon' )[0].onclick = function () {
    //     shortcodePopupWindow.classList.remove( 'wptb-popup-show' );
    // }

    document.getElementsByClassName( 'wptb-preview-btn' )[0].onclick = function ( event ) {
        if( this.classList.contains( 'wptb-button-disable' ) ) {
            return;
        }

        let previewId = Math.floor( Math.random() * 10000 );

        var newHref = new URL( event.target.href );
        newHref.searchParams.set( 'preview_id', previewId );
        event.target.href = newHref.toString();
        WPTB_Helper.saveTable( event, false, previewId );
    }

    // @deprecated
    // document.getElementsByClassName( 'wptb-save-btn' )[0].onclick = function ( event ) {
    //     if( ! this.classList.contains( 'wptb-save-disabled' ) ) {
    //         WPTB_Helper.saveTable( event );
    //     }
    // }

    let tableTitleField = document.querySelector( '#wptb-setup-name' );
    if( tableTitleField ) {
        tableTitleField.onchange = function () {
            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    }
};
