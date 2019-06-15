var WPTB_Stringifier = function ( codeMain ) {
    if ( codeMain ) {
        let code = codeMain.cloneNode( true );
        let tds = code.getElementsByTagName( 'td' );
        if ( tds.length > 0 ) {
            for ( let i = 0; i < tds.length; i++ ) {
                tds[i].removeAttribute( 'data-x-index' );
                tds[i].removeAttribute( 'data-y-index' );
                tds[i].removeAttribute( 'draggable' );
                let innerElements = tds[i].getElementsByClassName( 'wptb-ph-element' );
                
                if ( innerElements.length > 0 ) {
                    for ( let j = 0; j < innerElements.length; j++ ) {
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
                    }
                }
                
                if( tds[i].hasAttribute( 'data-title-column' ) ) {
                    let columnNameDiv = document.createElement( 'div' );
                    columnNameDiv.classList.add( 'column-title-mobile' );
                    columnNameDiv.dataset.titleColumn = tds[i].dataset.titleColumn;
                    tds[i].insertBefore( columnNameDiv, tds[i].firstChild );
                }
            }
        }
        
        return code;
    }
}