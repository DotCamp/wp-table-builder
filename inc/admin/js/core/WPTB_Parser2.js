var WPTB_Parser2 = function (code) {
    if( Array.isArray( code ) ) {
        let elementHtml;
        
        if ( code.length == 1) {
            return elementHtml.appendChild( document.createTextNode( code[0] ) );
        }
        if( 0 in code ) {
            let tagName = code[0];
            elementHtml =  document.createElement( tagName );
            
            if ( 1 in code ) {
                if( Array.isArray( code[1] ) ) {
                    let attributes = code[1];
                    
                    for( let i = 0; i < attributes.length; i++ ) {
                        if( Array.isArray( attributes[i] ) ) {
                            elementHtml.setAttribute(attributes[i][0], attributes[i][1]);
                        }
                    }
                }
            }
            
            if ( 2 in code ) {
                if ( Array.isArray( code[2] ) ) {
                    for ( let i = 0; i < code[2].length; i++ ) {
                        if ( typeof code[2][i] === 'string' && tagName.toLowerCase() == 'p' ) {
                            elementHtml.appendChild( document.createTextNode( code[2][i] ) );
                            continue;
                        }
                        if ( ! WPTB_Parser( code[2][i] ) ) continue;
                        elementHtml.appendChild( WPTB_Parser( code[2][i] ) );
                    }
                } else if( typeof code[2] === 'string' ) {
                    elementHtml.appendChild( document.createTextNode( code[2] ) );
                }
                
            }
        }
        
        return elementHtml;
    } else {
        return false;
    }
    
}