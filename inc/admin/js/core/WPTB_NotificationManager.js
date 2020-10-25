/**
 * Builder notification manager.
 */
(function assignToGlobal(key, context, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_NotificationManager', self || global, () => {
	/**
	 * Builder notification manager class.
	 *
	 * @class
	 */
	// eslint-disable-next-line camelcase
	function WPTB_NotificationManager() {
		// eslint-disable-next-line no-undef
		const managerData = wptb_admin_object.notificationManager;

		/**
		 * Initialize and setup notification manager.
		 */
		const init = () => {
			WPTB_ControlsManager.setControlData('NotificationManager', managerData);
			WPTB_ControlsManager.callControlScript('NotificationManager', 'NotificationManager');
		};

		init();
	}

	return new WPTB_NotificationManager();
});
