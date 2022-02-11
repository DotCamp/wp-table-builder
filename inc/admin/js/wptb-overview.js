document.addEventListener('DOMContentLoaded', function () {
	function wptbModalPopupWindowCreate() {
		const wptbPopupWindowModal = document.createElement('div');
		wptbPopupWindowModal.classList.add('wptb-popup-window-modal', 'wptb-popup-window-delete-confirm');

		wptbPopupWindowModal.innerHTML =
			// eslint-disable-next-line no-multi-str
			'<div class="wptb-popup-box">\n\
            <div class="wptb-popup-sing-picture-container">\n\
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n\
                    x="0px" y="0px" viewBox="0 0 27.963 27.963" style="enable-background:new 0 0 27.963 27.963;" \n\
                    xml:space="preserve" width="50" height="50" class="">\n\
                    <g>\n\
                    <g>\n\
                    <g id="c129_exclamation">\n\
                    <path d="M13.983,0C6.261,0,0.001,6.259,0.001,13.979c0,7.724,6.26,13.984,13.982,13.984s13.98-6.261,13.98-13.984    \n\
                        C27.963,6.259,21.705,0,13.983,0z M13.983,26.531c-6.933,0-12.55-5.62-12.55-12.553c0-6.93,5.617-12.548,12.55-12.548    \n\
                        c6.931,0,12.549,5.618,12.549,12.548C26.531,20.911,20.913,26.531,13.983,26.531z" data-original="#000000" \n\
                        class="active-path" style="fill:#3B7EC0" data-old_color="#000000">\n\
                    </path>\n\
                    <polygon points="15.579,17.158 16.191,4.579 11.804,4.579 12.414,17.158   \n\
                        " data-original="#000000" class="active-path" style="fill:#3B7EC0" \n\
                        data-old_color="#000000">\n\
                    </polygon>\n\
                    <path d="M13.998,18.546c-1.471,0-2.5,1.029-2.5,2.526c0,1.443,0.999,2.528,2.444,2.528h0.056c1.499,0,2.469-1.085,2.469-2.528    \n\
                        C16.441,19.575,15.468,18.546,13.998,18.546z" data-original="#000000" class="active-path" style="fill:#3B7EC0" \n\
                        data-old_color="#000000">\n\
                    </path>\n\
                    </g>\n\
                    <g id="Capa_1_207_"></g>\n\
                    </g></g> \n\
                </svg>\n\
            </div>\n\
            <div class="wptb-popup-content">\n\
                <p>Are you sure you want to delete this table?</p>\n\
            </div>\n\
            <div class="wptb-popup-window-buttons">\n\
                <button class="wptb-confirm-btn">OK</button>\n\
                <button class="wptb-cancel-btn">CANCEL</button>\n\
            </div>\n\
        </div>';

		const wptbPopupDarkArea = document.createElement('div');
		wptbPopupDarkArea.classList.add('wptb-popup-dark-area');

		let body = document.getElementsByTagName('body');
		if (body.length > 0) {
			body = body[0];
			body.appendChild(wptbPopupWindowModal);
			body.appendChild(wptbPopupDarkArea);
		}

		wptbPopupDarkArea.onclick = function () {
			wptbPopupWindowModal.classList.add('hilight');

			setTimeout(function () {
				wptbPopupWindowModal.classList.remove('hilight');
			}, 1000);
		};

		let wptbCancelButton = wptbPopupWindowModal.getElementsByClassName('wptb-cancel-btn');
		if (wptbCancelButton.length > 0) {
			wptbCancelButton = wptbCancelButton[0];
			wptbCancelButton.onclick = function () {
				wptbPopupWindowModal.classList.remove('wptb-popup-show');
			};
		}

		let wptbConfirmButton = wptbPopupWindowModal.getElementsByClassName('wptb-confirm-btn');
		if (wptbConfirmButton.length > 0) {
			wptbConfirmButton = wptbConfirmButton[0];
			wptbConfirmButton.onclick = function () {
				window.location.href = this.dataset.urlForTableConfirm;
			};
		}
	}

	wptbModalPopupWindowCreate();

	function eachItemsAddHandler(attributeClass) {
		const htmlCollection = document.getElementsByClassName(attributeClass);
		const wptbPopupWindowModal = document.getElementsByClassName('wptb-popup-window-modal')[0];

		for (let i = 0; i < htmlCollection.length; i++) {
			const a = htmlCollection[i].getElementsByTagName('a');
			if (a.length > 0) {
				a[0].onclick = function (e) {
					e.preventDefault();
					wptbPopupWindowModal.classList.add('wptb-popup-show');

					let wptbPopupContent = wptbPopupWindowModal.getElementsByClassName('wptb-popup-content');
					if (wptbPopupContent.length > 0) {
						wptbPopupContent = wptbPopupContent[0];
						let p = wptbPopupContent.getElementsByTagName('p');
						if (p.length > 0) {
							p = p[0];
							if (attributeClass == 'delete') {
								p.innerHTML = 'Are you sure you want to delete this table?';
							} else if (attributeClass == 'duplicate') {
								p.innerHTML = 'Are you sure you want to duplicate this table?';
							}
						}
					}

					let wptbConfirmButton = wptbPopupWindowModal.getElementsByClassName('wptb-confirm-btn');
					if (wptbConfirmButton.length > 0) {
						wptbConfirmButton = wptbConfirmButton[0];
						wptbConfirmButton.dataset.urlForTableConfirm = e.target.href;
					}
				};
			}
		}
	}

	eachItemsAddHandler('delete');

	eachItemsAddHandler('duplicate');
});

/**
 * Copy selected table shortcode to clipboard.
 *
 * @param {string} shortcode shortcode
 */
function wptbCopyShortcode(shortcode) {
	if (!navigator.clipboard) {
		// create a dummy text input element for copy operation
		const dummyTextInputString = '<input type="text" class="wptb-dummy-text-input">';
		const range = document.createRange();
		range.setStart(document.body, 0);
		const dummyTextElement = range.createContextualFragment(dummyTextInputString).childNodes[0];
		document.body.appendChild(dummyTextElement);

		// copy shortcode to clipboard
		dummyTextElement.value = shortcode.trim();
		dummyTextElement.select();
		document.execCommand('copy');

		// remove dummy input element
		dummyTextElement.parentNode.removeChild(dummyTextElement);
	} else {
		navigator.clipboard.writeText(shortcode);
	}
}

/**
 * Assign shortcode copy functionality to HTML elements.
 */
function assignCopyShortcodeFunctionality() {
	// eslint-disable-next-line array-callback-return
	Array.from(document.querySelectorAll('.wptb-listing-shortcode-inner-wrap')).map((wrapper) => {
		const shortCodeRawWrapper = wrapper.querySelector('.wptb-listing-shortcode-raw');
		if (shortCodeRawWrapper) {
			const shortcode = shortCodeRawWrapper.textContent;

			const copyIconWrapper = wrapper.querySelector('.wptb-listing-shortcode-icon-wrapper');

			if (copyIconWrapper) {
				copyIconWrapper.addEventListener('click', (e) => {
					e.preventDefault();
					wptbCopyShortcode(shortcode);
					copyIconWrapper.dataset.wptbCopyStatus = true;
				});

				wrapper.addEventListener('mouseleave', (e) => {
					e.preventDefault();
					copyIconWrapper.dataset.wptbCopyStatus = false;
				});
			}
		}
	});
}

// shortcode clipboard functionality initialization
assignCopyShortcodeFunctionality();
