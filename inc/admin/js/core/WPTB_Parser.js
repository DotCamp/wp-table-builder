var WPTB_Parser = function ( code ) {
    let div = document.createElement( 'div' );
    div.innerHTML = code;
    
    let table = div.children[0];
    let columnTitleMobile = [...table.querySelectorAll( '.wptb-column-title-mobile-container' )];
    
    for( let i = 0; i < columnTitleMobile.length; i++ ) {
        let parent = columnTitleMobile[i].parentNode;
        parent.removeChild( columnTitleMobile[i] );
    }
    
    let tds = table.querySelectorAll( 'td' );
    for ( let i = 0; i < tds.length; i++ ) {
        tds[i].classList.add( 'wptb-droppable' );
        tds[i].classList.remove( 'wptb-column-title-mobile-not-elements' );
    }
    
    return table;
}