var WPTB_Parser = function (code) {
    let div = document.createElement( 'div' );
    div.innerHTML = code;
    
    let table = div.children[0];
    let columnTitleMobile = [...table.querySelectorAll( '.column-title-mobile-container' )];
    
    for( let i = 0; i < columnTitleMobile.length; i++ ) {
        let parent = columnTitleMobile[i].parentNode;
        parent.removeChild( columnTitleMobile[i] );
    }
    
    return table;
}