import deepmerge from 'deepmerge';
import ValueUpdateQue from '$Functions/ValueUpdateQue';
import ProxyArray from '$Functions/ProxyArray';

/**
 * Controls manager for builder element's control options
 *
 * It is a singleton class that will always be sending the referenced object to all callers.
 *
 * @return {Object} controls manager
 * @class
 */
function ControlsManager() {
	const controlScripts = {};
	const controlData = {};
	let previousSettings = {};
	const tableSettings = { settings: {} };
	const subscribers = [];

	/**
	 * Registered control bases array.
	 * This array will hold all active controls available at the moment.
	 */
	const controlBases = new ProxyArray();

	/**
	 * ValueUpdateQue instance.
	 *
	 * @type {ValueUpdateQue}
	 */
	const valueUpdateQue = new ValueUpdateQue(controlBases);

	/**
	 * Subscribers for element controls.
	 *
	 * @type {Object}
	 */
	const elementControlSubscribers = {};

	/**
	 * Cached element control values.
	 *
	 * @type {Object}
	 */
	const cachedElementControls = {
		previous: {},
		current: {},
	};

	/**
	 * Subscribe to an element's controls.
	 *
	 * @param {string} subId unique id for subscriber identification
	 * @param {string} elementId id of element to subscribe to
	 * @param {string | Function} controlId if a string control id is supplied will be subscribed to that control of element, if a function is supplied, will be used as callback and subscribed to all element control updates
	 * @param {Function} callback callback function
	 * @class
	 */
	function ElementSubscriber(subId, elementId, controlId, callback) {
		/**
		 * Options for element subscriber instance
		 *
		 * @type {Object}
		 */
		this.options = {
			subId,
			elementId,
			controlId: typeof controlId === 'function' ? '' : controlId,
			callback: typeof controlId === 'function' ? controlId : callback,
		};

		/**
		 * Call subscriber.
		 *
		 * @param {string} id control id
		 * @param {string | number} newValue new value of control
		 */
		this.call = (id, newValue) => {
			this.options.callback(id, newValue);
		};
	}

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
		// eslint-disable-next-line no-shadow
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
				throw new Error(`an invalid type of callback property is defined for subscriber: ${controlId}`);
			}
		};
	}

	/**
	 * @deprecated
	 * Get current table settings.
	 *
	 * This function is being used in ControlBase for component visibility changes. That functionality will be updated in the future and this function will be removed. Do not use this, use subscribe operations instead.
	 *
	 * @return {Object} current table settings
	 */
	function getTableSettings() {
		// deprecated
		// return Object.keys(tableSettings.settings).reduce((carry, item) => {
		// 	const finalCarry = carry;
		//
		// 	if (Object.prototype.hasOwnProperty.call(tableSettings.settings, item)) {
		// 		const valueKey = useEventValue ? 'eventValue' : 'targetValue';
		//
		// 		finalCarry[item] = tableSettings.settings[item][valueKey];
		// 	}
		//
		// 	return finalCarry;
		// }, {});
		return tableSettings;
	}

	/**
	 * @deprecated
	 * Subscribe to table settings changes
	 *
	 * use `subscribeToTable` function instead
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
	 * Subscribe to table settings changes
	 *
	 * @param {string} id unique id for subscription
	 * @param {Function} callback callback when an update happens
	 * @param {boolean} useEventValue use event value instead of target element value
	 */
	function subscribeToTable(id, callback, useEventValue = false) {
		const subscriber = new Subscriber({ id, callback, useEventValue });
		subscribers.push(subscriber);
		subscriber.call(tableSettings.settings, previousSettings);
	}

	/**
	 * @deprecated
	 * Subscribe to a table setting control.
	 *
	 * Use `subscribeToTableControl` function instead.
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
	 * Subscribe to a table setting control.
	 *
	 * @param {string} id subscriber id
	 * @param {string} controlId id of the control being subscribed to
	 * @param {Function} callback callback function that will be executed on control value change
	 * @param {boolean} useEventValue whether to use event value instead of target value
	 */
	function subscribeToTableControl(id, controlId, callback, useEventValue = false) {
		const subscriber = new Subscriber({ id, controlId, callback, useEventValue });
		subscribers.push(subscriber);
		subscriber.call(tableSettings.settings, previousSettings);
	}

	/**
	 * Add element control subscriber to subscriber list.
	 *
	 * @param {ElementSubscriber} subscriber element subscriber instance
	 */
	function addElementControlSubscriber(subscriber) {
		const { elementId, controlId } = subscriber.options;

		if (!elementControlSubscribers[elementId]) {
			elementControlSubscribers[elementId] = {};
		}

		if (!elementControlSubscribers[elementId][controlId]) {
			elementControlSubscribers[elementId][controlId] = [];
		}
		elementControlSubscribers[elementId][controlId].push(subscriber);
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
	 * Get value of an element control.
	 *
	 * @param {string} elementId element id
	 * @param {string} controlId control id
	 * @param {boolean} previous whether to get previous value of given element control
	 *
	 * @return {string|number|null} previous element control value, null for no previous value
	 */
	function getElementControlValue(elementId, controlId, previous = false) {
		let value = null;
		const base = cachedElementControls[previous ? 'previous' : 'current'];

		if (base[elementId] && base[elementId][controlId] !== undefined) {
			value = base[elementId][controlId];
		}

		return value;
	}

	/**
	 * Subscribe to a control of an element.
	 *
	 * @param {string} subscriberId unique subscriber id
	 * @param {string} elementId id of element to be subscribed to
	 * @param {string} controlId id of element control
	 * @param {Function} callback callback function for update
	 */
	function subscribeToElementControl(subscriberId, elementId, controlId, callback) {
		const elementControlSub = new ElementSubscriber(subscriberId, elementId, controlId, callback);
		addElementControlSubscriber(elementControlSub);

		const controlValue = getElementControlValue(elementId, controlId);
		elementControlSub.call(controlId, controlValue);
	}

	/**
	 * Call element control subscribers based on updated element control.
	 *
	 * @param {string} elementId element id
	 * @param {string} controlId control id
	 */
	function callElementControlSubscribers(elementId, controlId) {
		const previousValue = getElementControlValue(elementId, controlId, true);
		const currentValue = getElementControlValue(elementId, controlId);

		if (previousValue !== currentValue) {
			const subBase = elementControlSubscribers[elementId];

			if (subBase) {
				const controlBase = subBase[controlId];

				if (controlBase && Array.isArray(controlBase)) {
					// eslint-disable-next-line array-callback-return
					controlBase.map((sub) => {
						sub.call(controlId, currentValue);
					});
				}
			}
		}
	}

	/**
	 * Update cached controls.
	 *
	 * @param {string} elementId element id
	 * @param {string} controlId control id
	 * @param {string|number} value control value
	 */
	function updateCachedControls(elementId, controlId, value) {
		cachedElementControls.previous = deepmerge({}, cachedElementControls.current);

		cachedElementControls.current = deepmerge(cachedElementControls.current, {
			[elementId]: { [controlId]: value },
		});

		callElementControlSubscribers(elementId, controlId);
	}

	/**
	 * Attach to table settings changes.
	 */
	function attachToSettingChanges() {
		document.addEventListener('wptb:table:generated', () => {
			const table = document.querySelector('.wptb-management_table_container .wptb-table-setup table');

			WPTB_Helper.controlsInclude(table, (input) => updateTableSettings(input), true);

			document.addEventListener('wptb-element-control:update', ({ detail }) => {
				const { controlId, value, elementId } = detail;

				if (!controlId || !value || !elementId) {
					// enable for debugging
					// throw new Error('invalid control update event data generated');
				}

				updateCachedControls(elementId, controlId, value);
			});
		});
	}

	/**
	 * Controls manager init.
	 */
	function init() {
		attachToSettingChanges();
		// eslint-disable-next-line no-use-before-define
		attachToElementChange();
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
	function callControlScript(key, ...args) {
		if (!controlScripts[key]) {
			throw new Error(`Called control element not found: [${key}]`);
		}

		controlScripts[key].apply(null, args);
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
	 * Retrieve data for a control item.
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

	/**
	 * Update value of an element's control.
	 *
	 * @param {string} elementId element control id
	 * @param {string} controlId element control id
	 * @param {any} value control value
	 * @param {string} property property name to update
	 */
	function updateControlValue(elementId, controlId, value, property) {
		valueUpdateQue.addToUpdateQue(elementId, controlId, value, property);
	}

	/**
	 * Update value of a table control.
	 *
	 * @param {string} controlId table control id
	 * @param {any} value control value
	 * @param {string} property property name to update
	 */
	function updateTableControlValue(controlId, value, property) {
		const targetTable = document.querySelector('.wptb-table-setup .wptb-preview-table');

		const regexp = new RegExp(/(?<elementId>wptb-element-main-table_setting-(\d+))/g);
		const match = regexp.exec(targetTable.getAttribute('class'));
		const [, elementId] = match;

		valueUpdateQue.addToUpdateQue(elementId, controlId, value, property);
	}

	/**
	 * Register a control base instance.
	 *
	 * @param {Object} controlBaseInstance control base instance
	 */
	function registerControlBase(controlBaseInstance) {
		// prevent already registered bases to end up in registered bases again
		if (
			!controlBases.some((base) => {
				return base.$props.uniqueId === controlBaseInstance.$props.uniqueId;
			})
		) {
			controlBases.push(controlBaseInstance);
		}
	}

	/**
	 * Destroy registered element control instances.
	 */
	function destroyControls() {
		let { length } = controlBases;

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < length; i++) {
			const base = controlBases[i];
			const { elemContainer } = base.$root.$data;

			if (!elemContainer.includes('wptb-element-main-table') && elemContainer !== '') {
				base.$root.$destroy();
				controlBases.splice(i, 1);

				// modify `for` loop variables
				i -= 1;
				length = controlBases.length;
			}
		}
	}

	/**
	 * Attach listeners to builder element change events.
	 */
	function attachToElementChange() {
		document.addEventListener('element:controls:prepare', () => {
			destroyControls();
		});
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
		subscribeToTable,
		subscribeToTableControl,
		subscribeToElementControl,
		getElementControlValue,
		updateControlValue,
		updateTableControlValue,
		registerControlBase,
	};
}

/**
 * @module ControlsManager module
 */
export default ControlsManager();
