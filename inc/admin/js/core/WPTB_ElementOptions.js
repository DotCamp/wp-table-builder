var WPTB_ElementOptions = function ( element, index, kindIndexProt ) {

    var node = element.getDOMElement();
    node.addEventListener( 'click', function() {
        WPTB_Helper.elementOptionsSet( element.kind, this );
    }, {capture: true} );
};