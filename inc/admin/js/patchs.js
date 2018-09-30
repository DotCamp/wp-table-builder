(function () {
	document.onready = function () {
		document.querySelector('.toplevel_page_wptb-overview .wp-submenu .wp-first-item a').href = ajaxurl.substring(0, 17) + '/edit.php?post_type=wptb-tables';
		if (window.location.href.search('wptb-tables') !== -1) {
			document.querySelector('.toplevel_page_wptb-overview .wp-submenu .wp-first-item a').classList.add('current');
		}
	};
})()