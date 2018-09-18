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
			value = pair[1].substring(1, pair[1].length - 1);
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
				console.log('Attributes', attr);
				getExpectedToken('[text]');
				html = parseAllHTML();
				node = new WPTB_Text(html);
				console.log(html);
				getToken();
				getExpectedToken('[/text]');
				break;
			case '[button]': attr = getAttributesFromToken();
				console.log('Attributes', attr);
				getExpectedToken('[button]');
				html = parseAllHTML();
				node = new WPTB_Button(html);
				getToken();
				getExpectedToken('[/button]');
				break;
			case '[img]': attr = getAttributesFromToken();
				console.log('Attributes', attr);
				node = new WPTB_Image(attr['src']);
				getExpectedToken('[img]');
				break;
		}

		return node.getDOMElement();
	}

	function analizeElements(td) {
		do {
			td.appendChild(analizeElement());
		} while (getCurrentToken() == '[image]'
		|| getCurrentToken() == '[text]'
		|| getCurrentToken() == '[list]'
			|| getCurrentToken() == '[button]');
	}

	function analizeRows(tableNode) {
		console.log('Tr', tr);
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
		getExpectedToken('[td]');
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
		console.log('Tr', header);
		getExpectedToken('[tr]');
		analizeTds(header);
		getExpectedToken('[/tr]');
	}

	function analizeRoot() {
		getToken();
		var n = document.createElement('table');
		n.classList.add('wptb-preview-table');
		getExpectedToken('[table]');
		analizeHeader(n);
		analizeRows(n);
		getExpectedToken('[/table]');
		return n;
	}

	node = analizeRoot();

	return node;

};