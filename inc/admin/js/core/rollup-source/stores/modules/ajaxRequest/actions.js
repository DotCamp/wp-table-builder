/**
 * Ajax request module actions.
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Generic fetch function.
	 *
	 * @param {Object} actionObject store object
	 * @param {Object} payload action payload
	 * @param {string} payload.url fetch url
	 * @param {Object} payload.options fetch operation options
	 * @param {Object} payload.callbackFunctions fetch callback functions
	 * @return {Promise} promise object
	 */
	genericFetch(
		actionObject,
		{
			url,
			options = { method: 'GET' },
			callbackFunctions = {
				busyFunction: () => {},
				resetBusyFunction: () => {},
				errorFunction: () => {},
			},
		}
	) {
		return new Promise((resolve, reject) => {
			const defaultCallbacks = {
				busyFunction: () => {},
				resetBusyFunction: () => {},
				errorFunction: () => {},
			};

			const { busyFunction, resetBusyFunction, errorFunction } = { ...defaultCallbacks, ...callbackFunctions };

			let responseObject = null;
			busyFunction();
			fetch(url, options)
				.then((res) => {
					if (!res.ok) {
						throw new Error('an error occurred, please try again later');
					}

					return res.json();
				})
				.then((resp) => {
					if (resp.error) {
						throw new Error(resp.error);
					}

					responseObject = resp;
				})
				.catch((err) => {
					errorFunction(err.message);
				})
				.finally(() => {
					resetBusyFunction();
					const resolveFunction = responseObject === null ? reject : resolve;
					resolveFunction(responseObject);
				});
		});
	},
};

/**
 * @module actions
 */
export default actions;
