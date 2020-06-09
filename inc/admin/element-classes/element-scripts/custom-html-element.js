const infArr = element.className.match(/wptb-element-((.+-)\d+)/i);
const controlKey = 'textarea';
const elementControlTargetUnicClass = `wptb-el-${infArr[1]}-${controlKey}`;

const tinyMceInitStart = function () {
	tinyMCE.init({
		target: element.childNodes[0],
		inline: true,
		plugins: 'code',
		// dialog_type: "modal",
		// theme: 'modern',
		menubar: false,
		force_br_newlines: false,
		force_p_newlines: false,
		forced_root_block: '',
		paste_as_text: false,
		toolbar: false,
		extended_valid_elements:
			'ul[*],ol[*],p[*],span[*],div[*],ul[*],a[*],svg[*],defs[*],pattern[*],desc[*],metadata[*],g[*],\n\
                            mask[*],path[*],line[*],marker[*],rect[*],circle[*],\n\
                            ellipse[*],polygon[*],polyline[*],linearGradient[*],\n\
                            radialGradient[*],stop[*],image[*],view[*],text[*],\n\
                            textPath[*],title[*],tspan[*],glyph[*],symbol[*],switch[*],use[*]',
		valid_children:
			'div[div|a|p|ul|li|ol|span|#text],' +
			'a[div|a|p|ul|li|ol|span|#text],' +
			'p[div|a|p|ul|li|ol|span|#text],' +
			'ul[div|a|p|ul|li|ol|span|#text],' +
			'li[div|a|p|ul|li|ol|span|#text],' +
			'ol[div|a|p|ul|li|ol|span|#text],' +
			'span[div|a|p|ul|li|ol|span|#text]' +
			'',
		allow_script_urls: true,
		verify_html: false,
		setup(ed) {
			ed.on('input', function (e) {
				let elementControlTextarea = document.getElementsByClassName(elementControlTargetUnicClass);
				if (elementControlTextarea.length > 0) {
					elementControlTextarea = elementControlTextarea[0];
					elementControlTextarea.value = ed.targetElm.textContent;
				}
			});

			ed.on('focus', function () {
				ed.targetElm.innerText = ed.targetElm.innerHTML;

				WPTB_Helper.wptbDocumentEventGenerate('click', ed.targetElm);
				WPTB_Helper.wptbDocumentEventGenerate('input', ed.targetElm);
			});

			ed.on('blur', function () {
				ed.targetElm.innerHTML = ed.targetElm.innerText;
			});

			ed.on('click', function () {
				WPTB_Helper.wptbDocumentEventGenerate('input', ed.targetElm);
			});

			ed.on('keydown', function (e) {
				const div = e.target;
				let divText = div.innerHTML.replace(/\s+/g, ' ').trim();
				divText = divText.replace(/&nbsp;/g, '').trim();

				if (!window.htmlElemKeyDown) {
					window.htmlElemKeyDown = divText;
				}
			});

			ed.on('keyup', function (e) {
				const div = e.target;
				let divText = div.innerHTML.replace(/\s+/g, ' ').trim();
				divText = divText.replace(/&nbsp;/g, '').trim();
				if (divText !== window.htmlElemKeyDown) {
					e.target.onblur = function () {
						const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
						wptbTableStateSaveManager.tableStateSet();

						window.htmlElemKeyDown = '';
						e.target.onblur = '';
					};
				} else {
					e.target.onblur = '';
				}
			});
		},
	});

	element.removeEventListener('mouseover', tinyMceInitStart, false);
};

element.addEventListener('mouseover', tinyMceInitStart, false);
