import deepmerge from 'deepmerge';
/**
 * Modal window store actions.
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Show message on modal window.
	 *
	 * If a string type is supplied as payload, then a quick message with a default ok button will be displayed.
	 *
	 * @param {Object} root store object
	 * @param {Function} root.commit store mutation function
	 * @param {string | Object} payload
	 */
	showMessage({ commit }, payload) {
		const allowedPayloadTypes = ['string', 'object'];

		/**
		 * Default options for modal window message show process
		 *
		 * These options will be merged with supplied options at process function.
		 *
		 * @type {Object}
		 */
		const defaultProcessOptions = {
			message: 'default modal window message',
			positive: 'ok',
			negative: null,
			callback: null,
		};

		/**
		 * Message show process.
		 *
		 * @param {Object} options
		 */
		function defaultMessageProcess(options) {
			const { message, positive, negative, callback } = deepmerge(defaultProcessOptions, options);
			commit('setMessage', message);
			commit('setVisibility', true);
			commit('setPositiveButton', positive);
			commit('setNegativeButton', negative);
			commit('setButtonCallback', callback);
		}

		if (allowedPayloadTypes.includes(typeof payload)) {
			// eslint-disable-next-line default-case
			switch (typeof payload) {
				case 'string':
					defaultMessageProcess({ message: payload });
					break;
				case 'object':
					defaultMessageProcess(payload);
			}
		}
	},
	/**
	 * Reset modal window to its startup options.
	 *
	 * @param {Object} root store object
	 * @param {Object} root.getters store state getters
	 * @param {Function} root.commit store mutation function
	 */
	resetModalWindow({ getters, commit }) {
		commit('mergeState', getters.stateBackup);
	},
	/**
	 * Button click process.
	 *
	 * @param {Object} root store object
	 * @param {Object} root.getters store state getters
	 * @param {Function} root.commit store mutation function
	 * @param {*} payload action payload
	 */
	buttonClick({ getters, commit }, payload) {
		const callbackFunction = getters.buttonCallback;
		if (typeof callbackFunction === 'function') {
			callbackFunction(payload);
		}

		commit('setVisibility', false);
	},
};

/**
 * @module actions
 */
export default actions;
