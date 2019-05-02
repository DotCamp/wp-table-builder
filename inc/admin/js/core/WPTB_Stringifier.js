var WPTB_Stringifier = function ( node, start = false ) {

	if ( node == undefined ) {
		return '';
	} else if ( node.tagName == undefined && node.nodeType == 3 ) {
            return node.nodeValue;
        }
        
        let code = [],
            children,
            int_elem_arr = false,
            attributes = [...node.attributes],
            attributes_list = [],
            internal_elements = [];
            if ( ( node.parentNode.classList.contains( 'wptb-list-item-content' ) || 
                node.parentNode.classList.contains( 'mce-content-body' ) ) && 
            node.tagName.toLowerCase() == 'p' ) {
                children = node.childNodes;
                int_elem_arr = true;
            } else if( node.children.length > 0 ) {
                children = node.children;
            } else {
                children = node.childNodes;
            }
        if ( attributes.length > 0 ) {
            for ( let i = 0; i < attributes.length; i++ ) {
                attributes_list[i] = [attributes[i].name, attributes[i].value];
            }
        } else {
            attributes_list = '';
        }
        
        if ( children.length > 0 ) {
            for ( let i = 0; i < children.length; i++) {
                let inter_elem = WPTB_Stringifier(children[i]);
                    
                if ( Array.isArray( inter_elem ) || int_elem_arr ) {
                    internal_elements[i] = inter_elem;
                } else if ( typeof inter_elem === 'string' && inter_elem ) {
                    internal_elements = inter_elem;
                }
            }
        } else {
            internal_elements = '';
        }
        
        
        code.push(node.tagName.toLowerCase(), attributes_list , internal_elements);
        
        return code;
}