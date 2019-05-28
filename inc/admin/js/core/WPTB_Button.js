var WPTB_Button = function( text, DOMElementProt ) {
    
    var DOMElement = document.createElement('div'),
        elButton2 = document.createElement('div'),
        el_B = document.createElement('a'),
        kindIndexProt = undefined,
        copy = false;

    DOMElement.classList.add('wptb-button-container', 'wptb-size-M', 'wptb-');
    elButton2.classList.add('wptb-button-wrapper');
    el_B.classList.add('wptb-button');
    //el_B.classList.add('editable');
    el_B.innerHTML = text != undefined ? text : 'Button Text';
    
    // Creation of a new button when copying to avoid errors when assigning new event handlers.
    if ( DOMElementProt ) {
        let wptbElementMutch = DOMElementProt.className.match( /wptb-element-((.+-)\d+)/i );
        if ( wptbElementMutch && Array.isArray( wptbElementMutch ) ) {
            kindIndexProt = wptbElementMutch[1];
            copy = true;
        }; 
        var attributesContainer = [...DOMElementProt.attributes];
        if ( attributesContainer.length > 0 ) {
            for( let i = 0; i < attributesContainer.length; i++ ) {
                DOMElement.setAttribute(attributesContainer[i].name, attributesContainer[i].value);
            } 
        }
        
        var wptbButtonWrapper = DOMElementProt.querySelector( '.wptb-button-wrapper' );
        if ( wptbButtonWrapper ) {
            var wptbButtonWrapAttributes = [...wptbButtonWrapper.attributes];
            if ( wptbButtonWrapAttributes.length > 0 ) {
                for( let i = 0; i < wptbButtonWrapAttributes.length; i++ ) {
                    if ( wptbButtonWrapAttributes[i].name == 'style') {
                        elButton2.setAttribute( wptbButtonWrapAttributes[i].name, wptbButtonWrapAttributes[i].value );
                    }
                } 
            }
        }
        
        var wptbButton = DOMElementProt.querySelector( '.wptb-button' );
        if ( wptbButton ) {
            var wptbButtonAttributes = [...wptbButton.attributes];
            if ( wptbButtonAttributes.length > 0 ) {
                for( let i = 0; i < wptbButtonAttributes.length; i++ ) {
                    if ( wptbButtonAttributes[i].name == 'style' || 
                            wptbButtonAttributes[i].name == 'href' || 
                            wptbButtonAttributes[i].name == 'target' ) {
                        el_B.setAttribute( wptbButtonAttributes[i].name, wptbButtonAttributes[i].value );
                    }
                } 
            }
        }
    }
    
    elButton2.appendChild(el_B);
    DOMElement.appendChild(elButton2);
    
    this.kind = 'button';

    this.getDOMElement = function () {
            return DOMElement;
    };

    applyGenericItemSettings( this, kindIndexProt, copy );

    return this;
};