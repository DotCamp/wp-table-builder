/**
 * Add upsell related scripts.
 */
(function upsellsHooks() {
	// make left panel upsells visible when table is generated
	document.addEventListener('wptb:table:generated', () => {
		const leftPanelUpsells = Array.from(document.querySelectorAll('.wptb-left-panel .wptb-upsells-anchor'));
		// eslint-disable-next-line array-callback-return
		leftPanelUpsells.map((u) => {
			if (u) {
				// eslint-disable-next-line no-param-reassign
				u.style.display = 'unset';
			}
		});
	});
})();
