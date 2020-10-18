/**
 * Assign header toolbox actions to global space.
 */
(function assignToGlobal(context, key, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})(self || global, 'WPTB_HeaderToolboxActions', () => {
	/**
	 * Header toolbox actions.
	 *
	 * This class will be used to handle header toolbox button actions.
	 *
	 * @param {Object} defaultActions out of the box actions
	 * @class
	 */
	// eslint-disable-next-line camelcase
	function WPTB_HeaderToolboxActions(defaultActions) {
		const rawActions = defaultActions;

		// subscribers for actions
		const subscribers = {
			set: [],
			get: [],
		};

		// logic for proxy object
		const proxyLogic = {
			set(obj, prop, val) {
				// eslint-disable-next-line no-param-reassign
				obj[prop] = val;
				subscribers.set.map((f) => f(prop));
			},
			get(obj, prop) {
				subscribers.get.map((f) => f(prop));
				return obj[prop];
			},
		};

		const actions = new Proxy(rawActions, proxyLogic);

		/**
		 * Add action to header toolbox.
		 *
		 * @param {string} key action key
		 * @param {Function} callable function to call
		 */
		this.addAction = (key, callable) => {
			actions[key] = callable;
		};

		/**
		 * Call an header toolbox action.
		 *
		 * @param {string} key action key
		 */
		this.callAction = (key) => {
			if (actions[key] && typeof actions[key] === 'function') {
				actions[key]();
			} else {
				throw new Error(`no action found with the given id of ${key}`);
			}
		};

		/**
		 * Subscribe to toolbox actions.
		 *
		 * @param {string} type type of subscription, current available values get,set
		 * @param {Function} callback callback function for action type
		 */
		this.subscribe = (type, callback) => {
			if (Object.prototype.hasOwnProperty.call(subscribers, type)) {
				subscribers[type].push(callback);
			} else {
				throw new Error(`no action type is found with the given value of ${type}`);
			}
		};
	}

	// default actions
	const defaultActions = {
		manageCells: () => WPTB_Helper.activateSection('manage_cells'),
	};

	return new WPTB_HeaderToolboxActions(defaultActions);
});
