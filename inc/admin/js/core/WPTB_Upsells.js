/**
 * Add upsell related scripts.
 */
(function upsellsHooks() {
	// add pro upsells to dummy pro table elements container
	if (wptb_admin_object.upsells && !wptb_admin_object.upsells.pro) {
		const dummyWrapper = document.querySelector('.wptb-panel-toggle-group[id="pro"] .wptb-panel-toggle-target');

		const upsellContainer = document.createElement('div');
		upsellContainer.classList.add('wptb-upsells-pro-overlay');

		upsellContainer.innerHTML = wptb_admin_object.upsells.elements.leftPanel;

		dummyWrapper.style.position = 'relative';
		dummyWrapper.appendChild(upsellContainer);
	}
})();
