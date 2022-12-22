const infArr = element.className.match(/wptb-element-((.+-)\d+)/i);
const controlKey = 'textarea';
const elementControlTargetUnicClass = `wptb-el-${infArr[1]}-${controlKey}`;

let tinyMceTarget = element.getElementsByTagName('div');
if (tinyMceTarget.length > 0) {
	tinyMceTarget = tinyMceTarget[0];

	const tinyMceInitStart = function () {
		tinyMCE.init({
			target: tinyMceTarget,
			inline: true,
			plugins: 'link',
			dialog_type: 'modal',
			theme: 'modern',
			menubar: false,
			force_br_newlines: false,
			force_p_newlines: false,
			forced_root_block: '',
			paste_as_text: true,
			toolbar: false,
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

					if (!window.shortcodeElemKeyDown) {
						window.shortcodeElemKeyDown = divText;
					}
				});

				ed.on('keyup', function (e) {
					const div = e.target;
					let divText = div.innerHTML.replace(/\s+/g, ' ').trim();
					divText = divText.replace(/&nbsp;/g, '').trim();
					if (divText !== window.shortcodeElemKeyDown) {
						e.target.onblur = function () {
							const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
							wptbTableStateSaveManager.tableStateSet();

							window.shortcodeElemKeyDown = '';
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

	element.addEventListener(
		`wptb-control:${elementControlTargetUnicClass}`,
		function (event) {
			let targetElm = element.getElementsByClassName('mce-content-body');
			if (targetElm.length > 0) {
				targetElm = targetElm[0];
				targetElm.innerText = event.detail.value;
			}
		},
		false
	);
}
