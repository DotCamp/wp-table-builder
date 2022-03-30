const tinyMceInitStart = function () {
	tinyMCE.init({
		target: element.childNodes[0],
		inline: true,
		plugins: 'link, paste',
		dialog_type: 'modal',
		theme: 'modern',
		menubar: false,
		force_br_newlines: false,
		force_p_newlines: false,
		forced_root_block: 'p',
		fixed_toolbar_container: '#wpcd_fixed_toolbar',
		paste_as_text: true,
		toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
		convert_urls: false,
		setup(ed) {
			ed.on('change', function () {
				const row = WPTB_Helper.findAncestor(element, 'wptb-row');
				if (WPTB_Helper.rowIsTop(row)) {
					const table = WPTB_Helper.findAncestor(row, 'wptb-preview-table');

					if (table.classList.contains('wptb-table-preview-head')) {
						WPTB_Helper.dataTitleColumnSet(table);
					}
				}
			});

			/**
			 * Find and transform all text content inside target element.
			 *
			 * @param {Node} targetElement target element
			 */
			function poolTextContent(targetElement) {
				const pEls = Array.from(targetElement.querySelectorAll('p'));

				return pEls.reduce((carry, p) => {
					let pText = p.innerHTML.replace(/\s+/g, ' ').trim();
					pText = pText.replace(/&nbsp;/g, '').trim();

					return carry + pText;
				}, '');
			}

			ed.on('keydown', function (e) {
				const finalText = poolTextContent(e.target);

				if (!window.textElemPTextKeyDown) {
					window.textElemPTextKeyDown = finalText;
				}
			});

			ed.on('keyup', function (e) {
				const finalText = poolTextContent(e.target);

				if (finalText !== window.textElemPTextKeyDown) {
					e.target.onblur = function () {
						const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
						wptbTableStateSaveManager.tableStateSet();

						window.textElemPTextKeyDown = '';
						e.target.onblur = '';
					};
				} else {
					e.target.onblur = '';
				}
			});

			const mutationOptions = {
				attributes: true,
				childList: true,
				subtree: true,
			};

			// observe link href changes to set table as dirty
			const observer = new MutationObserver((mList) => {
				// eslint-disable-next-line array-callback-return
				mList.map((mutation) => {
					if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
						new WPTB_TableStateSaveManager().tableStateSet();
					}
				});
			});

			observer.observe(element, mutationOptions);
		},
		init_instance_callback(editor) {
			window.currentEditor = editor;

			editor.on('NodeChange', (e) => {
				let multipleRelControlVisibility = false;
				if (
					e.element.nodeName.toLowerCase() === 'a' ||
					e.parents.some((parent) => {
						return parent.nodeName.toLowerCase() === 'a';
					})
				) {
					multipleRelControlVisibility = true;
				}

				// update rel control visibility based on if there is an anchor element present inside text element
				WPTB_ControlsManager.updateControlValue(
					elementId,
					'linkRel',
					multipleRelControlVisibility,
					'componentVisibility'
				);
			});

			editor.on('focus', function (e) {
				const totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;
				if (
					window.currentEditor &&
					document.getElementById('wptb_builder').scrollTop >= 55 &&
					window.currentEditor.bodyElement.style.display != 'none'
				) {
					document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
					document.getElementById('wpcd_fixed_toolbar').style.right = `${
						totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2
					}px`;
					document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
				} else {
					document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
					delete document.getElementById('wpcd_fixed_toolbar').style.right;
					delete document.getElementById('wpcd_fixed_toolbar').style.top;
				}
			});
		},
	});

	element.removeEventListener('mouseover', tinyMceInitStart, false);
};

element.addEventListener('mouseover', tinyMceInitStart, false);

const observer = new MutationObserver(function (mutations) {
	const row = WPTB_Helper.findAncestor(element, 'wptb-row');
	if (row.classList.contains('wptb-table-head')) {
		const table = WPTB_Helper.findAncestor(row, 'wptb-preview-table');
		WPTB_Helper.dataTitleColumnSet(table);
	}
});
const config = { attributes: true, attributeFilter: ['style'] };
observer.observe(element, config);

function controlsChange(inputs, element) {
	if (inputs && typeof inputs === 'object') {
		// eslint-disable-next-line no-prototype-builtins
		if (inputs.hasOwnProperty('color')) {
			const row = WPTB_Helper.findAncestor(element, 'wptb-row');
			const table = WPTB_Helper.findAncestor(row, 'wptb-preview-table');
			if (WPTB_Helper.rowIsTop(row) && table.classList.contains('wptb-table-preview-head')) {
				WPTB_Helper.dataTitleColumnSet(table);
			}
		}
	}
}

// start linkRel component as hidden
WPTB_ControlsManager.updateControlValue(elementId, 'linkRel', false, 'componentVisibility');

WPTB_Helper.controlsInclude(element, controlsChange);
