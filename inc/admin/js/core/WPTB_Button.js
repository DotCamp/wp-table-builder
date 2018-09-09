var WPTB_Button = function (text) {

	var DOMElement = document.createElement('div'),
		elButton2 = document.createElement('div'),
		el_B = document.createElement('p');

	this.kind = 'button';

	DOMElement.classList.add('wptb-button-container');
	elButton2.classList.add('wptb-button-wrapper');
	el_B.classList.add('wptb-button');
	el_B.classList.add('editable');
	el_B.innerHTML = text != undefined ? text : 'Button Text';
	elButton2.appendChild(el_B);
	DOMElement.appendChild(elButton2);

	this.getDOMElement = function () {
		return DOMElement;
	}

	applyGenericItemSettings(this);

	return this;
};