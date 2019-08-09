var WPTB_Button = function( text, DOMElementProt ) {
    
    var DOMElement = document.createElement('div'),
        elButton = document.createElement('div'),
        el_B = document.createElement('a'),
        el_BDiv = document.createElement( 'div' ),
        el_BDivP = document.createElement( 'p' ),
        kindIndexProt = undefined,
        copy = false;

    DOMElement.classList.add('wptb-button-container', 'wptb-size-M', 'wptb-');
    elButton.classList.add('wptb-button-wrapper');
    el_BDiv.classList.add('wptb-button');
    el_BDivP.innerHTML = text != undefined ? text : 'Button Text';
    
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
                        elButton.setAttribute( wptbButtonWrapAttributes[i].name, wptbButtonWrapAttributes[i].value );
                    }
                } 
            }
        }
        
        var wptbButtonA = DOMElementProt.querySelector( 'a' );
        if ( wptbButtonA ) {
            var wptbButtonAttributes = [...wptbButtonA.attributes];
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
        
        var wptbButton = DOMElementProt.querySelector( '.wptb-button' );
        if ( wptbButton ) {
            var wptbButtonAttributes = [...wptbButton.attributes];
            if ( wptbButtonAttributes.length > 0 ) {
                for( let i = 0; i < wptbButtonAttributes.length; i++ ) {
                    if ( wptbButtonAttributes[i].name == 'style') {
                        el_BDiv.setAttribute( wptbButtonAttributes[i].name, wptbButtonAttributes[i].value );
                    }
                } 
            }
        }
    }
    
    elButton.appendChild(el_B);
    el_B.appendChild( el_BDiv );
    el_BDiv.appendChild( el_BDivP );
    DOMElement.appendChild(elButton);
    
    
    
    this.kind = 'button';

    this.getDOMElement = function () {
            return DOMElement;
    };

    applyGenericItemSettings( this, kindIndexProt, copy );

    return this;
};