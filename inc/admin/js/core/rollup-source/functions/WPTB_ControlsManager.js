/**
 * Controls manager for builder element's control options
 *
 * It is a singleton class that will always be sending the referenced object to all callers.
 *
 * @return {{setControlData: setControlData, getControlData: (function(*): *), addControlScript: addControlScript, callControlScript: callControlScript}}
 * @class
 */
function ControlsManager() {
	const controlScripts = {};
	const controlData = {};
	let previousSettings = {};
	const tableSettings = { settings: {} };
	const subscribers = [];

	/**
	 * Subscriber object.
	 *
	 * By providing a control id, you can subscribe to a control instead of whole table settings.
	 *
	 * @param {Object} subOptions subscriber options
	 * @class
	 */
	function Subscriber(subOptions) {
		/**
		 * Default options for subscriber.
		 *
		 * @type {Object}
		 */
		const defaultOptions = {
			id: null,
			controlId: null,
			useEventValue: false,
			callback: () => {},
		};

		// merge default options with supplied ones
		this.options = { ...defaultOptions, ...subOptions };

		/**
		 * Parse and reform supplied default table settings.
		 *
		 * @param {Object} settings settings object
		 * @param {boolean} useEventValue whether to use event value instead of target value
		 * @return {Object} reformed settings object
		 */
		const parseSettings = (settings, useEventValue = false) => {
			return Object.keys(settings).reduce((carry, item) => {
				const finalCarry = carry;

				if (Object.prototype.hasOwnProperty.call(settings, item)) {
					const valueKey = useEventValue ? 'eventValue' : 'targetValue';

					finalCarry[item] = settings[item][valueKey];
				}

				return finalCarry;
			}, {});
		};

		/**
		 * Logic for calling control subscribers.
		 *
		 * @param {Object} setting settings object
		 * @param {Object} previousSetting previous version of settings object
		 */
		const controlSubscriberLogic = (setting, previousSetting) => {
			const { controlId, useEventValue, callback } = this.options;
			const currentValue = parseSettings(setting, useEventValue)[controlId];

			if (currentValue !== undefined) {
				const previousValue = parseSettings(previousSetting)[controlId];

				// only call callback if current and previous values are different from each other
				if (currentValue !== previousValue) {
					callback(currentValue);
				}
			}
		};

		/**
		 * Call subscriber.
		 *
		 * @param {Object} settings settings object
		 * @param {Object} previousSettings previous version of the settings object, this object will be used for control subscribers to decide whether to call them or not by comparing current and previous values of control item
		 */
		this.call = (settings, previousSettings) => {
			const { controlId, callback, useEventValue } = this.options;

			// if there is a control id, then it means subscriber is subscribed to a control instead of whole table settings
			if (callback && typeof callback === 'function') {
				if (controlId) {
					controlSubscriberLogic(settings, previousSettings);
				} else {
					callback(parseSettings(settings, useEventValue));
				}
			} else {
				throw new Error('an invalid type of callback property is defined for subscriber');
			}
		};
	}

	/**
	 * @deprecated
	 * Get current table settings.
	 *
	 * This function is being used in ControlBase for component visibility changes. That functionality will be updated in the future and this function will be removed. Do not use this, use subscribe operations instead.
	 *
	 * @param {boolean} useEventValue whether to use event value instead of element value
	 * @return {Object} current table settings
	 */
	function getTableSettings(useEventValue = false) {
		return Object.keys(tableSettings.settings).reduce((carry, item) => {
			const finalCarry = carry;

			if (Object.prototype.hasOwnProperty.call(tableSettings.settings, item)) {
				const valueKey = useEventValue ? 'eventValue' : 'targetValue';

				finalCarry[item] = tableSettings.settings[item][valueKey];
			}

			return finalCarry;
		}, {});
	}

	/**
	 * Subscribe to table settings changes
	 *
	 * @param {string} id unique id for subscription
	 * @param {Function} callback callback when an update happens
	 * @param {boolean} useEventValue use event value instead of target element value
	 */
	function subscribe(id, callback, useEventValue = false) {
		const subscriber = new Subscriber({ id, callback, useEventValue });
		subscribers.push(subscriber);
		subscriber.call(tableSettings.settings, previousSettings);
	}

	/**
	 *
	 * @param {string} id subscriber id
	 * @param {string} controlId id of the control being subscribed to
	 * @param {Function} callback callback function that will be executed on control value change
	 * @param {boolean} useEventValue whether to use event value instead of target value
	 */
	function subscribeToControl(id, controlId, callback, useEventValue = false) {
		const subscriber = new Subscriber({ id, controlId, callback, useEventValue });
		subscribers.push(subscriber);
		subscriber.call(tableSettings.settings, previousSettings);
	}

	/**
	 * Call subscribers on update.
	 */
	function callSubscribers() {
		subscribers.map((s) => s.call(tableSettings.settings, previousSettings));
	}

	/**
	 * Settings changed callback.
	 *
	 * @param {Object} input
	 */
	function updateTableSettings(input) {
		if (input) {
			// update previous settings
			previousSettings = tableSettings.settings;
			tableSettings.settings = { ...tableSettings.settings, ...input };
			callSubscribers();
		}
	}

	/**
	 * Attach to table settings changes.
	 */
	function attachToSettingChanges() {
		document.addEventListener('wptb:table:generated', () => {
			const table = document.querySelector('.wptb-management_table_container .wptb-table-setup table');

			WPTB_Helper.controlsInclude(table, (input) => updateTableSettings(input), true);
		});
	}

	/**
	 * Controls manager init.
	 */
	function init() {
		attachToSettingChanges();
	}

	/**
	 * Add a control element script to ControlsManager
	 *
	 * This is the register function for control items. Without registering the control items, you can not mount them from their inline underscore.js template. Keep the underscore.js template as clean as possible since all the work should be handled by the view element and not the business logic of the backend.
	 *
	 * @param {string} key control type key
	 * @param {Function} script function to mount the control to view
	 */
	function addControlScript(key, script) {
		controlScripts[key] = script;
	}

	/**
	 * Call a control element and mount it to view
	 *
	 * This is the place where items are mounted on to the view. In the background already defined control logic will be called and mounted to the unique id html element.
	 *
	 * @param {string} key control type key that was registered with addControlScript
	 * @param {any} args  arguments to call the script with
	 */
	function callControlScript(key, args) {
		if (!controlScripts[key]) {
			throw new Error(`Called control element not found: [${key}]`);
		}
		controlScripts[key](args);
	}

	/**
	 * Register data for a control item
	 *
	 * Currently, when control items are defined in background, a data object with a needed data items are mounted with this function.
	 *
	 * @param {string} id control item unique id
	 * @param {Object} data control item data
	 */
	function setControlData(id, data) {
		controlData[id] = data;
	}

	/**
	 * Retrieve data for a control item
	 *
	 * Data objects that are registered for specific control items can be fetched with the  correct id. With this way, components can reach their data with the correct unique keys.
	 *
	 * @param {string} id control item unique key
	 * @param {boolean} suppress suppress error message upon not founding data
	 * @return {Object} data associated with control item
	 */
	function getControlData(id, suppress = false) {
		if (!controlData[id] && !suppress) {
			throw new Error(`Control data for [${id}] not found.`);
		}
		return controlData[id];
	}

	return {
		getTableSettings,
		init,
		addControlScript,
		callControlScript,
		setControlData,
		getControlData,
		subscribe,
		subscribeToControl,
	};
}

/**
 * @module ControlsManager module
 */
export default ControlsManager();
