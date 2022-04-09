/**
 * Builder notification manager.
 */
(function assignToGlobal(key, context, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_NotificationManager', self || global, () => {
	// key for making sure notification manager is initialized only once
	let initialized = false;

	// store will be populated with flux store implementation by ui components
	this.store = null;

	// mount id to mount our dev tool
	const devToolMountId = 'wptbNotificationManagerDevTool';

	/**
	 * Builder notification manager class.
	 *
	 * @class
	 */
	// eslint-disable-next-line camelcase
	function WPTB_NotificationManager() {
		/**
		 * Valid notification types.
		 *
		 * It will be populated on initialization with the values from notification manager flux store.
		 *
		 * @type {Object} notification types
		 */
		this.types = {};

		// eslint-disable-next-line no-restricted-globals
		const context = self || global;

		// eslint-disable-next-line no-undef
		const managerData = context.wptb_admin_object?.notificationManager;

		/**
		 * Create single notification object.
		 *
		 * @param {Object} options notification options
		 * @return {Object} notification object
		 */
		const createNotificationObject = (options) => {
			const { defaults } = this.store.getters;

			// merge only keys that is available in defaults to prevent non notification related properties to be sent to component
			const parsedOptions = Object.keys(options).reduce((carry, key) => {
				if (Object.prototype.hasOwnProperty.call(options, key)) {
					if (defaults[key]) {
						// eslint-disable-next-line no-param-reassign
						carry[key] = options[key];
					}
				}
				return carry;
			}, {});

			return { ...defaults, ...parsedOptions };
		};

		/**
		 * Send a notification to builder ui.
		 *
		 * Use a valid type that is defined inside types property of notification manager.
		 *
		 * @param {Object} notificationOptions notification options, available properties are message, type, queue, reveal,dismiss
		 *
		 */
		this.sendNotification = (notificationOptions) => {
			// send action to store
			this.store.dispatch('addNotification', createNotificationObject(notificationOptions));
		};

		// prepare mount point for dev tool
		// eslint-disable-next-line no-unused-vars
		const addDevToolsToDOM = () => {
			const builderElement = document.querySelector('.wptb-builder-panel');

			if (builderElement) {
				const devToolMountPoint = document.createElement('div');
				devToolMountPoint.setAttribute('id', devToolMountId);
				builderElement.appendChild(devToolMountPoint);
			}
		};

		/**
		 * Initialize and setup notification manager.
		 */
		this.init = () => {
			if (!initialized) {
				// assign server sent notification data to control manager so that our compiled vue code can read it
				WPTB_ControlsManager.setControlData('NotificationManager', managerData);

				// call notification related components
				WPTB_ControlsManager.callControlScript('NotificationManager', 'NotificationManager');

				// assign notification types from store
				this.notificationTypes = this.store.getters.notificationTypes;
				// assign queue types from store
				this.queueTypes = this.store.getters.queueTypes;
				// assign reveal types from store
				this.revealTypes = this.store.getters.revealTypes;
				// assign dismiss types from store
				this.dismissTypes = this.store.getters.dismissTypes;

				// // add dev tool mount point to DOM
				// addDevToolsToDOM();
				//
				// // data for dev tool
				// const devToolsData = {
				// 	types: this.notificationTypes,
				// 	queue: this.queueTypes,
				// 	reveal: this.revealTypes,
				// 	dismiss: this.dismissTypes,
				// 	sendNotification: this.sendNotification.bind(this),
				// 	mountId: devToolMountId,
				// };
				//
				// // assign dev tool data
				// WPTB_ControlsManager.setControlData('NotificationManagerDevTool', devToolsData);
				//
				// // call dev tool related components
				// WPTB_ControlsManager.callControlScript('NotificationManagerDevTool', 'NotificationManagerDevTool');

				// initialization process completed
				initialized = true;
			}
		};
	}

	// return singleton manager instance to global context to assign
	return new WPTB_NotificationManager();
});
