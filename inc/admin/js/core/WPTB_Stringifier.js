var WPTB_Stringifier = function ( codeMain ) {
    if ( codeMain ) {
        let code = codeMain.cloneNode( true );
        code.classList.add( 'wptb-table-preview-static-indic' );
        code.dataset.tableColumns = codeMain.columns;
        code.dataset.reconstraction = 1;
        
        let tds = code.getElementsByTagName( 'td' );
        if ( tds.length > 0 ) {
            for ( let i = 0; i < tds.length; i++ ) {
                
                for( let i = 0; i < tds.length; i++ ) {
                    if( code.dataset.reconstraction == 1 && tds[i].colSpan > 1 || tds[i].rowSpan > 1 ) {
                        code.dataset.reconstraction = 0;
                        break;
                    }
                }
                
                if ( codeMain.querySelector( 'wptb-table-preview-head' ) ) {
                    tds[i].removeAttribute( 'data-x-index' );
                }
                tds[i].removeAttribute( 'data-y-index' );
                tds[i].removeAttribute( 'draggable' );
                tds[i].classList.remove( 'wptb-droppable' );
                let innerElements = tds[i].getElementsByClassName( 'wptb-ph-element' );
                
                if ( innerElements.length > 0 ) {
                    for ( let j = 0; j < innerElements.length; j++ ) {
                        innerElements[j].classList.remove( 'wptb-directlyhovered' );
                        
                        let mceContentBodys = innerElements[j].querySelectorAll( '.mce-content-body' );
                        if( mceContentBodys.length > 0 ) {
                            for ( let k = 0; k < mceContentBodys.length; k++ ) {
                                mceContentBodys[k].classList.remove( 'mce-content-body' );
                            }
                        }
                        
                        let dataMceStyle = innerElements[j].querySelectorAll( '[data-mce-style]' );
                        if ( dataMceStyle.length > 0 ) {
                            for ( let k = 0; k < dataMceStyle.length; k++ ) {
                                dataMceStyle[k].removeAttribute( 'data-mce-style' );
                            }
                        }
                        
                        let contentEditable = innerElements[j].querySelectorAll( '[contenteditable]' );
                        if ( contentEditable.length > 0 ) {
                            for ( let k = 0; k < contentEditable.length; k++ ) {
                                contentEditable[k].removeAttribute( 'contenteditable' );
                            }
                        }
                        
                        let spellCheck = innerElements[j].querySelectorAll( '[spellcheck]' );
                        if ( spellCheck.length > 0 ) {
                            for ( let k = 0; k < spellCheck.length; k++ ) {
                                spellCheck[k].removeAttribute( 'spellcheck' );
                            }
                        }
                        
                        let mceIds = innerElements[j].querySelectorAll( '[id^=mce_]' );
                        if ( mceIds.length > 0 ) {
                            for ( let k = 0; k < mceIds.length; k++ ) {
                                mceIds[k].removeAttribute( 'id' );
                            }
                        }
                        
                        let wptbActions = innerElements[j].querySelectorAll( '.wptb-actions' );
                        let wptbActionsLength = wptbActions.length;
                        while ( wptbActionsLength > 0 ) {
                            wptbActions[0].parentNode.removeChild( wptbActions[0] );
                            wptbActionsLength--;
                        }  
                    }
                }
                
                if( tds[i].hasAttribute( 'data-title-column' ) ) {
                    let columnNameDivContainer = document.createElement( 'div' ),
                        columnNameDiv = document.createElement( 'div' ),
                        columnNameDivContainerCopy;
                    columnNameDivContainer.classList.add( 'column-title-mobile-container' );
                    columnNameDiv.classList.add( 'column-title-mobile' );
                    columnNameDiv.dataset.titleColumn = tds[i].dataset.titleColumn;
                    columnNameDiv.setAttribute( 'style', 'font-size:' + tds[i].dataset.titleColumnFontSize + '; \n\
                        color:' + tds[i].dataset.titleColumnColor + '; background-color:' + tds[i].dataset.titleBackgroundColor + '; text-align:' + tds[i].dataset.titleAlign + ';' );
                    columnNameDiv.style.padding = tds[i].style.padding;
                    if( tds[i].children.length == 0 ) {
                        tds[i].classList.add( 'column-title-mobile-not-elements' );
                    }
                    columnNameDivContainer.appendChild( columnNameDiv );
                    tds[i].insertBefore( columnNameDivContainer, tds[i].firstChild );
                }
            }
        }
        
        return code;
    }
}