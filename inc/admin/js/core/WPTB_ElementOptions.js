var WPTB_ElementOptions = function ( element, index, kindIndexProt ) {

    var node = element.getDOMElement();

    node.onclick = function () {
        WPTB_Helper.subjectOprionsSet( element.kind, this );
    };
};