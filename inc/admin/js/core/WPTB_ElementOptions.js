var WPTB_ElementOptions = function ( element, index, kindIndexProt ) {

    var node = element.getDOMElement();

    node.onclick = function () {
        WPTB_Helper.elementOptionsSet( element.kind, this );
    };
};