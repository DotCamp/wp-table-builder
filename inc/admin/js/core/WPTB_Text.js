var WPTB_Text = function (text) {

	var DOMElement = document.createElement('div'),
		elText2 = document.createElement('div'),
		elP = document.createElement('p');

	this.kind = 'text';

	elText2.classList.add('editable');
	elP.innerHTML = text != undefined ? text : 'Text';
	elText2.appendChild(elP);
	DOMElement.appendChild(elText2);

	this.getDOMElement = function () {
		return DOMElement;
	}
	applyGenericItemSettings(this);

	return this;

};