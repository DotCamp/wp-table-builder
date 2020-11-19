var WPTB_ElementObject = function ( data ) {
    let DOMElement, kindIndexProt, copy;
    if( ! data.elemProt ) {
        DOMElement = document.createElement('div'),
        kindIndexProt = undefined,
        copy = false;
        DOMElement.classList.add( 'wptb-' + data.kind + '-container', 'wptb-ph-element' );
    
        let wpTemplateId = 'wptb-' + data.kind + '-content';
        let template = wp.template( wpTemplateId );
        data.node = DOMElement;

        let itemHtml = template( data );
        
        itemHtml = itemHtml.replace(/\r|\n|\t/g, '').trim();
        DOMElement.innerHTML = itemHtml;
    } else {
        DOMElement = data.elemProt.cloneNode( true );
        DOMElement.classList.remove( 'wptb-directlyhovered' );
        let wptbElementMutch = data.elemProt.className.match( /wptb-element-((.+-)\d+)/i );
        if ( wptbElementMutch && Array.isArray( wptbElementMutch ) ) {
            kindIndexProt = wptbElementMutch[1];
        };
        copy = true;
        
        if( data.tinyMceClear ) {
            DOMElement = WPTB_Helper.elementClearFromTinyMce( DOMElement );
        }
    }
    
    let inElems = DOMElement.querySelectorAll( '.wptb-in-element' );
    if( inElems.length > 0 ) {
        for ( let i = 0; i < inElems.length; i++ ) {
            let inElemObj = {};
            inElemObj.getDOMElement = function() {
                return inElems[i];
            }
            
            applyGenericItemSettings( inElemObj );
        }
    }
     
    window.addEventListener( 'item:onmouseenter', function( event ) {
        //console.log( event );
    }, false);
    
    
    this.kind = data.kind;
    this.getDOMElement = function () {
        return DOMElement;
    };
    
    applyGenericItemSettings( this, kindIndexProt, copy );
    return this;
}
