var WPTB_Image = function (src) {

	var DOMElement = document.createElement('div'),
		anchor = document.createElement('a'),
		img = document.createElement('img');

	this.kind = 'image';

	anchor.appendChild(img);
	DOMElement.appendChild(anchor);

	this.getDOMElement = function () {
		return DOMElement;
	}
	applyGenericItemSettings(this);

	file_frame = wp.media.frames.file_frame = wp.media({
		title: 'Select a image to upload',
		button: {
			text: 'Use this image',
		},
		multiple: false
	});
	// When an image is selected, run a callback.
	file_frame.on('select', function () {
		attachment = file_frame.state().get('selection').first().toJSON();
		img.src = attachment.url;
	});
	// Finally, open the modal
	if (src == undefined) {
		file_frame.open();
	}
	else {
		img.src = src;
	}

	return this;

};