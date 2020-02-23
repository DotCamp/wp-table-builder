var WPTB_TableStateSaveManager = function() {
    this.tableStateSet = ( generate ) => {
        
        if( generate && window.wptbTableStateSaving && Array.isArray( window.wptbTableStateSaving ) ) {
            return;
        }
        
        // get preview table
        let wptbPreviewTable = document.getElementsByClassName( 'wptb-preview-table' );
        if( wptbPreviewTable.length > 0 ) {
            wptbPreviewTable = wptbPreviewTable[0];
        } else {
            wptbPreviewTable = '';
        }
            
        // check if a global array doesn't exist with saved versions of the table 
        // them create it
        if( ! window.wptbTableStateSaving && ! Array.isArray( window.wptbTableStateSaving ) ) {
            window.wptbTableStateSaving = [];
        } 

        // remove the extra part of the array after changing the table 
        // when it is showed in the not last modified version
        if( window.wptbTableStateSaving.length > window.wptbTableStateNumberShow ) {
            window.wptbTableStateSaving = window.wptbTableStateSaving.slice( 0, window.wptbTableStateNumberShow + 1 );
        }

        //add new state of table
        let wptbNewPreviewTable = '';
        if( wptbPreviewTable ) {
            wptbNewPreviewTable = wptbPreviewTable.cloneNode( true );
            let wptbHighlighted = wptbNewPreviewTable.getElementsByClassName( 'wptb-highlighted' );
            for( let i = 0; i < wptbHighlighted.length; i++ ) {
                wptbHighlighted[i].classList.remove( 'wptb-highlighted' );
            }
            let wptbDirectlyhovered = wptbNewPreviewTable.getElementsByClassName( 'wptb-directlyhovered' );
            for( let i = 0; i < wptbDirectlyhovered.length; i++ ) {
                wptbDirectlyhovered[i].classList.remove( 'wptb-directlyhovered' );
            }
            let mceContentBodys = wptbNewPreviewTable.querySelectorAll( '.mce-content-body' );
            if( mceContentBodys.length > 0 ) {
                for ( let k = 0; k < mceContentBodys.length; k++ ) {
                    mceContentBodys[k].classList.remove( 'mce-content-body' );
                }
            }
            let dataMceStyle = wptbNewPreviewTable.querySelectorAll( '[data-mce-style]' );
            if ( dataMceStyle.length > 0 ) {
                for ( let k = 0; k < dataMceStyle.length; k++ ) {
                    dataMceStyle[k].removeAttribute( 'data-mce-style' );
                }
            }
            let mceIds = wptbNewPreviewTable.querySelectorAll( '[id^=mce_]' );
            if ( mceIds.length > 0 ) {
                for ( let k = 0; k < mceIds.length; k++ ) {
                    mceIds[k].removeAttribute( 'id' );
                }
            }
        }

        let cssForTdsWidthAutoValue = '';
        let head = document.head;
        if( head ) {
            let cssForTdsWidthAuto = head.querySelector( 'style[data-wptb-td-auto-width="true"]' );
            if( cssForTdsWidthAuto ) {
                cssForTdsWidthAutoValue = cssForTdsWidthAuto.innerHTML;
            }
        }

        window.wptbTableStateSaving.push( [wptbNewPreviewTable, cssForTdsWidthAutoValue] );

        // set new number of state which is showed now
        window.wptbTableStateNumberShow = window.wptbTableStateSaving.length - 1;

        // make undo arrow active when the table was changed
        if( window.wptbTableStateSaving.length - 1 > 0 ) {
            let wptbUndo = document.getElementsByClassName( 'wptb-undo' );
            if( wptbUndo.length > 0 ) {
                wptbUndo = wptbUndo[0];

                wptbUndo.classList.remove( 'wptb-undoredo-disabled' );
            }
        }

        // make redo arrow not active when the table was changed
        let wptbRedo = document.getElementsByClassName( 'wptb-redo' );
        if( wptbRedo.length > 0 ) {
            wptbRedo = wptbRedo[0];

            wptbRedo.classList.add( 'wptb-undoredo-disabled' );
        }

        let wptbSaveBtn = document.getElementsByClassName( 'wptb-save-btn' );
        if( wptbSaveBtn.length > 0 ) {
            wptbSaveBtn = wptbSaveBtn[0];
            if( ( ! wptbSaveBtn.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0 ) || 
                    window.wptbTableStateNumberShow == wptbSaveBtn.dataset.wptbTableStateNumberSave || ! wptbPreviewTable ) {
                wptbSaveBtn.classList.add( 'wptb-save-disabled' );
            } else {
                wptbSaveBtn.classList.remove( 'wptb-save-disabled' );
            }
        }
    }
    
    this.tableStateGet = ( datawptbUndoredo ) => {
        if( datawptbUndoredo && window.wptbTableStateSaving && window.wptbTableStateSaving.length > 0 ) {
            
            // changes the number of the state which displays now
            if( datawptbUndoredo == 'undo' ) {
                if( window.wptbTableStateNumberShow > 0 ) {
                    window.wptbTableStateNumberShow--;
                } else {
                    return false;
                }
            } else if( datawptbUndoredo == 'redo' ) {
                if( window.wptbTableStateNumberShow < window.wptbTableStateSaving.length ) {
                    window.wptbTableStateNumberShow++;
                } else {
                    return false;
                }
            }
            
            // add or delete class "wptb-undoredo-disabled" for undo button
            let wptbUndo = document.getElementsByClassName( 'wptb-undo' );
            if( wptbUndo.length > 0 ) {
                wptbUndo = wptbUndo[0];
                
                if( window.wptbTableStateNumberShow == 0 ) {
                    if( wptbUndo ) {
                        wptbUndo.classList.add( 'wptb-undoredo-disabled' );
                    }
                } else if( window.wptbTableStateNumberShow > 0 ) {
                    if( wptbUndo ) {
                        wptbUndo.classList.remove( 'wptb-undoredo-disabled' );
                    }
                }
            }
            
            // add or delete class "wptb-undoredo-disabled" for redo button
            let wptbRedo = document.getElementsByClassName( 'wptb-redo' );
            if( wptbRedo.length > 0 ) {
                wptbRedo = wptbRedo[0];
                
                if( window.wptbTableStateNumberShow == window.wptbTableStateSaving.length - 1 ) {
                    if( wptbRedo ) {
                        wptbRedo.classList.add( 'wptb-undoredo-disabled' );
                    }
                } else if( window.wptbTableStateNumberShow < window.wptbTableStateSaving.length - 1 ) {
                    if( wptbRedo ) {
                        wptbRedo.classList.remove( 'wptb-undoredo-disabled' );
                    }
                }
            }
            
            // add or delete class "wptb-save-disabled" for save button
            let wptbSaveBtn = document.getElementsByClassName( 'wptb-save-btn' );
            if( wptbSaveBtn.length > 0 ) {
                wptbSaveBtn = wptbSaveBtn[0];
                if( ( ! wptbSaveBtn.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0 ) || 
                        window.wptbTableStateNumberShow == wptbSaveBtn.dataset.wptbTableStateNumberSave ) {
                    wptbSaveBtn.classList.add( 'wptb-save-disabled' );
                } else {
                    wptbSaveBtn.classList.remove( 'wptb-save-disabled' );
                }
            }
            
            // load necessary saved table state
            let wptbTableSetup = document.getElementsByClassName( 'wptb-table-setup' );
            if( wptbTableSetup.length > 0 ) {
                wptbTableSetup = wptbTableSetup[0];

                wptbTableSetup.innerHTML = '';
                if( window.wptbTableStateSaving[window.wptbTableStateNumberShow] ) {
                    if( window.wptbTableStateSaving[window.wptbTableStateNumberShow][0] && 
                            typeof window.wptbTableStateSaving[window.wptbTableStateNumberShow][0] === 'object' ) {
                        if( 'outerHTML' in window.wptbTableStateSaving[window.wptbTableStateNumberShow][0] ) {
                            wptbTableSetup.innerHTML = window.wptbTableStateSaving[window.wptbTableStateNumberShow][0].outerHTML;
                        }
                    }
                    
                    if( ! wptbTableSetup.innerHTML ) {
                        document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
                        wptbSaveBtn.classList.add( 'wptb-save-disabled' );
                    } else {
                        document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
                    }
                }
                // add or change or delete style element in the head for table cells who have auto width
                if( window.wptbTableStateSaving[window.wptbTableStateNumberShow] ) {
                    let head = document.head;
                    if( head ) {
                        let cssForTdsWidthAutoOld = head.querySelector( 'style[data-wptb-td-auto-width="true"]' );
                        if( cssForTdsWidthAutoOld ) {
                            head.removeChild( cssForTdsWidthAutoOld );
                        }
                        
                        if( window.wptbTableStateSaving[window.wptbTableStateNumberShow][1] ) {
                            let cssForTdsWidthAuto = document.createElement( 'style' );
                            cssForTdsWidthAuto.setAttribute( 'data-wptb-td-auto-width', true );
                            cssForTdsWidthAuto.innerHTML = window.wptbTableStateSaving[window.wptbTableStateNumberShow][1];
                            head.appendChild( cssForTdsWidthAuto );
                        }
                    }
                }
                
                
                let body = document.getElementsByTagName( 'body' );
                if( body.length > 0 ) {
                    body = body[0];
                }

                WPTB_Helper.elementOptionsPanelClear();
                WPTB_LeftPanel();

                let wptbLeftScrollPanelCellSetting = document.getElementById( 'wptb-left-scroll-panel-cell-settings' ); 
                if( wptbLeftScrollPanelCellSetting ) {
                    wptbLeftScrollPanelCellSetting.classList.remove( 'visible' );
                }
            }
        }
    }
    
    this.tableStateClear = function() {
        delete window.wptbTableStateSaving;
        delete window.wptbTableStateNumberShow;
        
        let wptbSaveBtn = document.getElementsByClassName( 'wptb-save-btn' );
        if( wptbSaveBtn.length > 0 ) {
            wptbSaveBtn = wptbSaveBtn[0];
            
            wptbSaveBtn.removeAttribute( 'data-wptb-table-state-number-save' );
        }
        
        let wptbUndo = document.getElementsByClassName( 'wptb-undo' );
        if( wptbUndo.length > 0 ) {
            wptbUndo = wptbUndo[0];
            
            wptbUndo.classList.add( 'wptb-undoredo-disabled' );
        }
        
        let wptbRedo = document.getElementsByClassName( 'wptb-redo' );
        if( wptbRedo.length > 0 ) {
            wptbRedo = wptbRedo[0];

            wptbRedo.classList.add( 'wptb-undoredo-disabled' );
        }
    }
}