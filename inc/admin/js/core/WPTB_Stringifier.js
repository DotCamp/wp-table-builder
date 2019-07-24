var WPTB_Stringifier = function ( codeMain ) {
    if ( codeMain ) {
        let code = codeMain.cloneNode( true );
        code.classList.add( 'wptb-table-preview-static-indic' );
        code.dataset.tableColumns = codeMain.columns;
        code.style.width = null;
        code.style.minWidth = null;
        code.style.maxWidth = null;
        
        let tds = code.getElementsByTagName( 'td' );
        if ( tds.length > 0 ) {
            for ( let i = 0; i < tds.length; i++ ) {
                
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
                
                if( tds[i].hasAttribute( 'data-wptb-title-column' ) ) {
                    let columnNameDivContainer = document.createElement( 'div' ),
                        columnNameDiv = document.createElement( 'div' );
                    columnNameDivContainer.classList.add( 'wptb-column-title-mobile-container' );
                    columnNameDiv.classList.add( 'wptb-column-title-mobile' );
                    columnNameDiv.dataset.wptbTitleColumn = tds[i].dataset.wptbTitleColumn;
                    columnNameDiv.setAttribute( 'style', 'font-size:' + tds[i].dataset.wptbTitleColumnFontSize + '; \n\
                        color:' + tds[i].dataset.wptbTitleColumnColor + '; background-color:' + tds[i].dataset.wptbTitleBackgroundColor + '; text-align:' + tds[i].dataset.wptbTitleAlign + ';' );
                    columnNameDiv.style.padding = tds[i].style.padding;
                    if( tds[i].children.length == 0 ) {
                        tds[i].classList.add( 'wptb-column-title-mobile-not-elements' );
                    }
                    columnNameDivContainer.appendChild( columnNameDiv );
                    tds[i].insertBefore( columnNameDivContainer, tds[i].firstChild );
                }
            }
        }
        
        return code;
    }
}