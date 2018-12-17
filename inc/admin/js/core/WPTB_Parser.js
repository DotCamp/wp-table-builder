var WPTB_Parser = function (code) {

	var node, pos = 0;

	function getChar() {
		if (pos >= code.length) {
			return -1;
		}
		return code[pos++];
	}

	function getToken() {
		var char = getChar(),
			token = char;

		if (char !== '[') {
			return;
		}

		do {
			char = getChar();
			if (char === -1) {
				return -1;
			}
			token += char;
		} while (char != ']');

		ctoken = token;

		return true;
	}

	function getCurrentToken() {
		return ctoken;
	}

	function getExpectedToken(expected) {
		if (getWordFromToken(ctoken) !== expected) {
			throw 'There was an error with the file and therefore the table could not be rendered';
		}
		getToken();
	}

	function getWordFromToken(token) {
		var p = token.indexOf(' '),
			word = token.substring(1, p);
		if (p == -1) { //This is, if token tag has no attributes 
			return token;
		}
		return '[' + word + ']';
	}

	function getAttributesFromToken() {
		var elems = ctoken.split(' '),
			pair,
			key,
			value,
			attr = [];
		for (var i = 1; i < elems.length; i++) {
			pair = elems[i].trim().split('=');
			key = pair[0];
			value = pair[1].substring(1, pair[1].length - 1).split('\"').join('');
			attr[key] = value;
		}

		return attr;
	}

	function parseAllHTML() {
		var html = '';
		pos--;

		do {
			char = getChar();
			if (char === -1) {
				return -1;
			}
			html += char;
		} while (char != '[');

		html = html.substring(0, html.length - 1);

		pos--;

		return html;

	}

	function analizeImage(attributes) {
		var node;
		node = new WPTB_Image(attr['src']);
		getExpectedToken('[img]');
		node.getDOMElement().getElementsByTagName('img')[0].style.width = attr['width'];
		node.getDOMElement().getElementsByTagName('img')[0].alt = attr['alt'];
		node.getDOMElement().getElementsByTagName('a')[0].href = attr['link'];
		node.getDOMElement().getElementsByTagName('a')[0].target = attr['newtab'];

		if (attr['alignment'] != 'center') {
			node.getDOMElement().getElementsByTagName('img')[0].style.display = 'inline';
			node.getDOMElement().getElementsByTagName('img')[0].style.float = this.value;
			node.getDOMElement().getElementsByTagName('img')[0].style.margin = 'inherit';
		} else {
			node.getDOMElement().getElementsByTagName('img')[0].style.float = 'none';
			node.getDOMElement().getElementsByTagName('img')[0].style.display = 'block';
			node.getDOMElement().getElementsByTagName('img')[0].style.margin = '0 auto';
		}

		node.getDOMElement().getElementsByTagName('img')[0]

		return node;

	}

	function analizeText(attributes) {
		var node;
		getExpectedToken('[text]');
		html = parseAllHTML();
		node = new WPTB_Text(html);
		node.getDOMElement().style.fontSize = attributes.size;
		node.getDOMElement().style.color = attributes.color;
		getToken();
		getExpectedToken('[/text]');
		return node;
	}

	function analizeButton(attributes) {
		var node;
		getExpectedToken('[button]');
		html = parseAllHTML();
		node = new WPTB_Button(html);
		node.getDOMElement().classList.add('wptb-size-' + attributes['size']);
		node.getDOMElement().getElementsByClassName('wptb-button-wrapper')[0].style.justifyContent = attributes['alignment'];
		node.getDOMElement().getElementsByClassName('wptb-button')[0].style.backgroundColor = attributes.color;
		node.getDOMElement().getElementsByClassName('wptb-button')[0].style.color = attributes.textcolor;
		node.getDOMElement().querySelector('.wptb-button-wrapper a').href = attributes['link'];
		node.getDOMElement().querySelector('.wptb-button-wrapper a').target = attributes['newtab'];
		getToken();
		getExpectedToken('[/button]');
		return node;
	}

	function analizeListItem() {
		var node;
		getExpectedToken('[item]');
		html = parseAllHTML();
		node = new WPTB_ListItem(html);
		getToken();
		getExpectedToken('[/item]');
		return node;
	}

	function analizeList(attributes) {
		var node = new WPTB_List(''), stylety;
		getExpectedToken('[list]');
		if (attributes['class'] == 'numbered') {
			stylety = 'decimal';
		} else {
			stylety = attributes['style-type'];
		}
		do {
			node.getDOMElement().getElementsByTagName('ul')[0]
				.appendChild(analizeListItem().getDOMElement());
		} while (getWordFromToken(ctoken) == '[item]');

		getExpectedToken('[/list]');

		var articles = node.getDOMElement().querySelectorAll('article');
		for (var i = 0; i < articles.length; i++) {
			articles[i].style.justifyContent = attributes['align'];
		}

		var bullets = node.getDOMElement().querySelectorAll('article .wptb-list-item-style-dot li');
		for (var i = 0; i < bullets.length; i++) {
			bullets[i].style.listStyleType = stylety;
		}
		return node;
	}

	function analizeElement() {
		var t = getWordFromToken(getCurrentToken()), html, node;

		switch (t) {
			case '[text]': attr = getAttributesFromToken();
				node = analizeText(attr);
				break;
			case '[list]': attr = getAttributesFromToken();
				node = analizeList(attr);
				break;
			case '[button]': attr = getAttributesFromToken();
				node = analizeButton(attr);
				break;
			case '[img]': attr = getAttributesFromToken();
				node = analizeImage();
				break;
		}

		return node.getDOMElement();
	}

	function analizeElements(td) {
		var space;
		if (getWordFromToken(ctoken) == '[img]'
			|| getWordFromToken(ctoken) == '[text]'
			|| getWordFromToken(ctoken) == '[list]'
			|| getWordFromToken(ctoken) == '[button]') {
			space = new WPTB_Space();
			td.appendChild(space);
			while (getWordFromToken(ctoken) == '[img]'
				|| getWordFromToken(ctoken) == '[text]'
				|| getWordFromToken(ctoken) == '[list]'
				|| getWordFromToken(ctoken) == '[button]') {
				td.appendChild(analizeElement());
				space = new WPTB_Space();
				td.appendChild(space);
			}
		}
	}

	function analizeRows(tableNode) {
		while (getWordFromToken(getCurrentToken()) === '[tr]') {
			var tr = tableNode.insertRow();
			tr.classList.add('wptb-row');
			getExpectedToken('[tr]');
			analizeTds(tr);
			getExpectedToken('[/tr]');
		}
	}

	function analizeTd() {
		var td = new WPTB_Cell();
		var attrs = getAttributesFromToken();
		getExpectedToken('[td]');
		if (attrs['colspan'] != undefined)
			td.getDOMElement().colSpan = parseInt(attrs['colspan']);
		if (attrs['rowspan'] != undefined)
			td.getDOMElement().rowSpan = parseInt(attrs['rowspan']);
		analizeElements(td.getDOMElement());
		getExpectedToken('[/td]');
		return td.getDOMElement();
	}

	function analizeTds(row) {
		do {
			row.appendChild(analizeTd());
		} while (getCurrentToken() == '[td]');
	}

	function analizeHeader(tableNode) {
		var header = tableNode.insertRow();
		header.classList.add('wptb-row', 'wptb-table-head');
		getExpectedToken('[tr]');
		analizeTds(header);
		getExpectedToken('[/tr]');
	}

	function analizeRoot() {
		getToken();
		var n = document.createElement('table');
		n.classList.add('wptb-preview-table');
		var attributes = getAttributesFromToken();
		getExpectedToken('[table]');
		analizeHeader(n);
		analizeRows(n);
		getExpectedToken('[/table]');
		var tableHeader = n.getElementsByTagName('tr')[0],
			tds = tableHeader.getElementsByTagName('td');
		for (var j = 0; j < tds.length; j++) {
			tds[j].style.backgroundColor = attributes['data-bg1'];
		}
		var tableRows = n.getElementsByTagName('tr');
		for (var i = 1; i < tableRows.length; i += 2) {
			tds = tableRows[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {
				tds[j].style.backgroundColor = attributes['data-bg2'];
			}
		}
		for (var i = 2; i < tableRows.length; i += 2) {
			tds = tableRows[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {
				tds[j].style.backgroundColor = attributes['data-bg3'];
			}
		}

		var tableCells = n.getElementsByTagName('td');
		for (var i = 0; i < tableCells.length; i++) {
			tableCells[i].style.padding = attributes['padding'];
			tableCells[i].style.border = attributes['inner-border'] + ' solid ' + attributes['border-color'];
			n.style.border = attributes['outer-border'] + ' solid ' + attributes['border-color'];
		}

		jQuery('#wptb-table-header-bg').val(attributes['data-bg1']);
		jQuery('#wptb-even-row-bg').val(attributes['data-bg2']);
		jQuery('#wptb-odd-row-bg').val(attributes['data-bg3']);
		jQuery('#wptb-table-border-color').val(attributes['border-color']);
		jQuery('#wptb-table-inner-border-number,#wptb-table-inner-border-slider').val(attributes['inner-border']);
		jQuery('#wptb-table-border-number,#wptb-table-border-slider').val(attributes['outer-border']);

		return n;
	}

	node = analizeRoot();

	return node;

};