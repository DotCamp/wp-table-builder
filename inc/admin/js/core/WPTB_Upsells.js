/**
 * Add upsell related scripts.
 */
(function upsellsHooks() {
	try {
		if (WPTB_Store.getters.proStatus) {
			return;
		}
	} catch (e) {
		return;
	}
	const mountPointId = 'manageCellsMoveUpsells';
	const mountPoint = document.createElement('div');
	mountPoint.setAttribute('id', mountPointId);

	document.body.appendChild(mountPoint);

	WPTB_ControlsManager.callControlScript('ManageCellsMoveUpsells', mountPointId);
})();
