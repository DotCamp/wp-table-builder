let a = element.getElementsByTagName('a');
if (a.length > 0) {
	a = a[0];
}
a.onclick = function (e) {
	e.preventDefault();
};

const addMedia = function (element, imageChange = false) {
	const img = element.querySelector('img');

	let src;
	if (img && img.src) {
		src = img.src;
	}

	file_frame = wp.media.frames.file_frame = wp.media({
		title: 'Select a image to upload',
		button: {
			text: 'Use this image',
		},
		multiple: false,
		frame: 'post',
	});

	const imageSetting = function (img, attachment) {
		if (!img) {
			img = document.createElement('img');

			let a = element.getElementsByTagName('a');
			if (a.length > 0) {
				a = a[0];
				a.innerHTML = '';

				a.appendChild(img);
			}
		}

		const imageButton = a.querySelector('.wptb-icon-image-button');

		// remove image button that is present when image element is empty
		if (imageButton) {
			a.removeChild(imageButton);
		}

		// make img tag visible
		img.classList.remove('wptb-image-element-dummy');

		const imgSrc = attachment.url;
		const linkArr = imgSrc.split(':');
		let linkClean;
		if (Array.isArray(linkArr) && linkArr.length > 0) {
			linkClean = linkArr[linkArr.length - 1];
		}

		img.height = attachment.height;
		img.width = attachment.width;
		img.style.width = '100%';
		img.src = linkClean;

		element.classList.remove('wptb-elem-placeholder');

		const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
		wptbTableStateSaveManager.tableStateSet();
	};

	file_frame.on('select', function () {
		attachment = file_frame.state().props.toJSON();
		imageSetting(img, attachment);
	});

	file_frame.on('insert', function () {
		attachment = file_frame.state().get('selection').first().toJSON();
		imageSetting(img, attachment);
	});

	if (src == undefined || imageChange == true) {
		file_frame.open();
		file_frame.menuItemVisibility('gallery', 'hide');
		file_frame.menuItemVisibility('playlist', 'hide'),
			file_frame.menuItemVisibility('video-playlist', 'hide'),
			file_frame.menuItemVisibility('audio-playlist', 'hide');
	} else {
		img.src = src;
	}
};

const iconImageButton = element.querySelector('.wptb-icon-image-button');
if (iconImageButton) {
	iconImageButton.onclick = function () {
		addMedia(element, true);
	};
}

if (iconImageButton && !element.classList.contains('wptb-elem-placeholder')) {
	element.classList.add('wptb-elem-placeholder');
	addMedia(element);
}

function controlsChange(inputs, element) {
	if (inputs && typeof inputs === 'object') {
		if (inputs.hasOwnProperty('imageReplaceButton')) {
			addMedia(element, true);
		}
	}
}

function imageElementBackwardCompatibility() {
	const imageAnchor = element.querySelector('a');

	if (imageAnchor) {
		const floatVal = imageAnchor.style.float;

		// TODO [erdembircan] remove for production
		console.log(floatVal);
	}
}

imageElementBackwardCompatibility();

WPTB_Helper.controlsInclude(element, controlsChange);
