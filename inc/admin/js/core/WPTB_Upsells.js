/**
 * Add upsell related scripts.
 */
(function upsellsHooks() {
	if (!WPTB_Store.getters.proStatus) {
		const mountPointId = 'manageCellsMoveUpsells';
		const mountPoint = document.createElement('div');
		mountPoint.setAttribute('id', mountPointId);

		document.body.appendChild(mountPoint);

		WPTB_ControlsManager.callControlScript('ManageCellsMoveUpsells', mountPointId);
	}
})();
