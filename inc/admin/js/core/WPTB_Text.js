var WPTB_Text = function ( text , DOMElementProt ) {
            var DOMElement = document.createElement('div'),
                elText2 = document.createElement('div'),
                elP = document.createElement('p');

            elText2.classList.add('editable');
            elP.innerHTML = text != undefined ? text : 'Text';
            elText2.appendChild(elP);
            DOMElement.appendChild(elText2);
        if ( DOMElementProt ) {
            var attributes = [...DOMElementProt.attributes];
            for( let i = 0; i < attributes.length; i++ ) {
                DOMElement.setAttribute(attributes[i].name, attributes[i].value);
            }
        } 

	this.kind = 'text';
	this.getDOMElement = function () {
            return DOMElement;
	};
	applyGenericItemSettings( this );

	return this;
        
};