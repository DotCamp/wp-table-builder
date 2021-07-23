// eslint-disable-next-line no-undef
const infArr = element.className.match(/wptb-element-((.+-)\d+)/i);
const controlKey = 'textarea';
const elementControlTargetUnicClass = `wptb-el-${infArr[1]}-${controlKey}`;

const allowedChildrenTags = [
	'div',
	'a',
	'p',
	'ul',
	'li',
	'ol',
	'span',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'center',
	'iframe',
	'img',
	'button',
	'form',
	'input',
];

const innerChildTextArray = Array.from(allowedChildrenTags);
innerChildTextArray.push('#text');
const innerChildText = innerChildTextArray.join('|');

const greatTextWallOfValidChildren = allowedChildrenTags.reduce((p, c) => {
	const formedValidChildren = `${c}[${innerChildText}]`;
	p.push(formedValidChildren);
	return p;
}, []);

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
		valid_elements: '*[*]',
		valid_children: greatTextWallOfValidChildren.join(','),
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
