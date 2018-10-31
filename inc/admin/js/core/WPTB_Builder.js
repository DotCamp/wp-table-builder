(function () {

	function detectMode() {
		var url = window.location.href,
			regex = new RegExp('[?&]table(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return false;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	var WPTB_Builder = function () {
		var table_id = detectMode();
		if (table_id) {
			var http = new XMLHttpRequest(),
				url = ajaxurl + "?action=get_table" + '&id=' + table_id;
			http.open('GET', url, true);
			http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			http.onreadystatechange = function (d) {
				var ans = JSON.parse(http.responseText);
				if (this.readyState == 4 && this.status == 200) {
					document.getElementById('wptb-setup-name').value = ans[0];
					document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
					document.getElementsByClassName('wptb-table-setup')[0].appendChild(WPTB_Parser(ans[1]));
				}
			}
			http.send(null);
		}
		document.counter = new ElementCounters();
		document.select = new MultipleSelect();

		var initializer = WPTB_Initializer();
		settings = WPTB_Settings();
	};

	document.addEventListener('DOMContentLoaded', WPTB_Builder);

})();