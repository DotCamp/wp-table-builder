var WPTB_Settings = function () {

	var elems = document.getElementsByClassName('wptb-element');

	for (var i = 0; i < elems.length; i++) {
		elems[i].ondragstart = function (event) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
		}
	};

	document.getElementsByClassName('wptb-save-btn')[0].onclick = function () {
		var http = new XMLHttpRequest(),
			url = ajaxurl + "?action=save_table",
			t = document.getElementById('wptb-setup-name').value.trim(),
			messagingArea,
			code = WPTB_Stringifier(document.getElementsByClassName('wptb-preview-table')[0]);

		if (t === '') {
			messagingArea = document.getElementById('wptb-messaging-area');
			messagingArea.innerHTML = '<div class="error message">Error: You must assign a name to the table before saving it.</div>';
			messagingArea.classList.add('warning');
			setTimeout(function () {
				messagingArea.classList.remove('warning');
			}, 5000);
			return;
		}
		var params = 'title=' + t + '&content=' + code;
		http.open('POST', url, true);
		http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		http.onreadystatechange = function (d) {
			if (this.readyState == 4 && this.status == 200) {
				messagingArea = document.getElementById('wptb-messaging-area');
				messagingArea.innerHTML = '<div class="success message">Success: table "' + t + '" was successfully saved.</div>';
				messagingArea.classList.add('success');
				setTimeout(function () {
					messagingArea.classList.remove('success');
				}, 5000);
			}
		}
		http.send(params);
	}
};
