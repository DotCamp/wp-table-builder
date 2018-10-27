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

	function analizeElement() {
		var t = getWordFromToken(getCurrentToken()), html, node;

		switch (t) {
			case '[text]': attr = getAttributesFromToken();
				getExpectedToken('[text]');
				html = parseAllHTML();
				node = new WPTB_Text(html);
				getToken();
				getExpectedToken('[/text]');
				break;
			case '[button]': attr = getAttributesFromToken();
				getExpectedToken('[button]');
				html = parseAllHTML();
				node = new WPTB_Button(html);
				getToken();
				getExpectedToken('[/button]');
				break;
			case '[img]': attr = getAttributesFromToken();
				node = new WPTB_Image(attr['src']);
				getExpectedToken('[img]');
				break;
		}

		return node.getDOMElement();
	}

	function analizeElements(td) {
		while (getCurrentToken() == '[image]'
			|| getCurrentToken() == '[text]'
			|| getCurrentToken() == '[list]'
			|| getCurrentToken() == '[button]') {
			td.appendChild(analizeElement());
		}
	}

	function analizeRows(tableNode) {
		do {
			var tr = tableNode.insertRow();
			tr.classList.add('wptb-row');
			getExpectedToken('[tr]');
			analizeTds(tr);
			getExpectedToken('[/tr]');
		} while (getWordFromToken(getCurrentToken()) === '[tr]');
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
			tableCells[i].style.border = attributes['inner-border'] + ' solid black';
		}
		n.style.border = attributes['outer-border'] + ' solid black';
		return n;
	}

	node = analizeRoot();

	return node;

};