var WPTB_Stringifier = function (node) {

	if (node == undefined || node.tagName == undefined) {
		return '';
	}

	var code = '', children = node.childNodes,
		padding, margin, bg1, bg2, bg3, border,
		colSpan, rowSpan, isHidden, // Table Attributes
		listClass, listStyleType, //list attributes
		buttonSize, buttonColor, buttonBorder, //button attributes
		fontSize, fontColor, fontFamily, //text attributes
		src, width, height, //image attributes
		additionalCSS, additionalClass, additionalID; // A few global attributes I wanted to add.

	switch (node.tagName.toLowerCase()) {
		case 'table':
			border = node.style.borderSize;
			margin = node.getElementsByTagName('td')[0].style.margin;
			padding = node.getElementsByTagName('td')[0].style.padding;
			innerBorder = node.getElementsByTagName('td')[0].style.borderSize;
			bg1 = node.rows[0].getElementsByTagName('td')[0].style.backgroundColor;

			if (node.rows.length > 1) {
				bg2 = node.rows[1].getElementsByTagName('td')[0].style.backgroundColor;
			}
			if (node.rows.length > 2) {
				bg3 = node.rows[2].getElementsByTagName('td')[0].style.backgroundColor;
			}
			console.log(innerBorder);
			code += '[table'
				+ (margin != undefined && margin != '' ? ' margin="' + margin + '"' : '')
				+ (padding != undefined && padding != '' ? ' padding="' + padding + '"' : '')
				+ (innerBorder != undefined ? ' inner-border="' + innerBorder + '"' : '')
				+ (bg1 != undefined ? ' data-bg1="' + bg1 + '"' : '')
				+ (bg2 != undefined ? ' data-bg2="' + bg2 + '"' : '')
				+ (bg3 != undefined ? ' data-bg3="' + bg3 + '"' : '')
				+ ']';

			for (var i = 0; i < children.length; i++) {
				code += WPTB_Stringifier(children[i]);
			}

			code += '[/table]';
			break;
		case 'tbody':
			for (var i = 0; i < children.length; i++) {
				code += WPTB_Stringifier(children[i]);
			}
			break;
		case 'tr':
			code += '[tr]';

			for (var i = 0; i < children.length; i++) {
				code += WPTB_Stringifier(children[i]);
			}

			code += '[/tr]';
			break;
		case 'td': colspan = node.colSpan;
			rowspan = node.rowSpan;
			isHidden = node.classList.contains(/^wptb-fused-cell-(\d+)$/);
			code += '[td'
				+ (colspan != undefined && colspan > 1 ? ' colspan="' + colspan + '"' : '')
				+ (rowspan != undefined && rowspan > 1 ? ' rowspan="' + rowspan + '"' : '')
				+ (isHidden ? ' hidden="true"' : '')
				+ ']';

			for (var i = 0; i < children.length; i++) {
				code += WPTB_Stringifier(children[i]);
			}

			code += '[/td]';
			break;
		case 'div':
			if (node.classList.contains('wptb-ph-element')) {

				var infArr = node.className.match(/wptb-element-(.+)-(\d+)/i),
					optionsClass, trueNode,
					nodeContent;
				if (infArr == undefined) {
					return;
				}
				switch (infArr[1]) {
					case 'list':
						trueNode = node.getElementsByTagName('ul')[0];
						if (!trueNode) {
							return ''; //We ignore the node in case of error
						}

						listStyleType = trueNode.getElementsByTagName('li')[0].style.listStyleType;
						listClass = listStyleType == 'decimal' ? 'numbered' : 'unordered';

						code += '[list'
							+ (listClass != undefined ? ' class="' + listClass + '"' : 'class="unordered"')
							+ (listStyleType != undefined ? ' style-type="' + listStyleType + '"' : '')
							+ ']';
						listitems = trueNode.getElementsByTagName('article');
						for (var i = 0; i < listitems.length; i++) {
							code += '[item]';
							code += listitems[i]
								.getElementsByClassName('wptb-list-item-content')[0]
								.innerHTML;
							code += '[/item]';
						}
						code += '[/list]';
						break;
					case 'image':

						trueNode = node.getElementsByTagName('img')[0];
						if (!trueNode) {
							return ''; //We ignore the node in case of error
						}
						src = trueNode.src;
						width = trueNode.width;
						height = trueNode.height;
						alt = trueNode.alt;
						code += '[img' +
							+(src != undefined ? ' src="' + src + '"' : '')
							+ (width != undefined ? ' width="' + width + '"' : '')
							+ (height != undefined ? ' height="' + height + '"' : '')
							+ ']';
						break;
					case 'text':
						trueNode = node.getElementsByClassName('editable')[0];
						if (!trueNode) {
							return ''; //We ignore the node in case of error
						}
						fontSize = trueNode.getElementsByTagName('p')[0].style.fontSize;
						fontColor = trueNode.getElementsByTagName('p')[0].style.color;
						code += '[text'
							+ (fontSize != undefined ? ' size="' + fontSize + '"' : '')
							+ (fontColor != undefined ? ' color="' + fontColor + '"' : '')
							+ ']';
						code += trueNode.innerHTML;
						code += '[/text]';
						break;
					case 'button':
						trueNode = node.getElementsByClassName('editable')[0];
						if (!trueNode) {
							return ''; //We ignore the node in case of error
						}

						buttonColor = trueNode.style.backgroundColor;
						console.log(node);
						buttonSize = node.className.match(/wptb-size-(.+)/i)[1];

						code += '[button'
							+ (buttonColor != undefined ? ' color="' + buttonColor + '"' : '')
							+ (buttonSize != undefined ? ' size="' + buttonSize + '"' : '')
							+ ']';
						code += trueNode.innerHTML;
						code += '[/button]';
						break;
				}
			}
			else {
				return '';
			}
			break;
		default:
			code += '';
			break;
	}

	if (node.nextSibling != undefined) {
		WPTB_Stringifier(node.nextSibling);
	}

	return code;

};