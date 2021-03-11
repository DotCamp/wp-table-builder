/**
 * Table data store actions.
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Fetch data object properties.
	 *
	 * @param {Object} root store object
	 * @param {Object} root.getters store getters
	 * @param {Function} root.commit store commit function
	 * @param {number} id data object id
	 */
	fetchDataObject({ getters, commit }, id) {
		const { nonce, action } = getters.getSecurityProps('dataObjectContent');
		const url = getters.getSecurityProps('url');

		return new Promise((resolve, reject) => {
			const ajaxUrl = new URL(url);
			ajaxUrl.searchParams.append('nonce', nonce);
			ajaxUrl.searchParams.append('action', action);
			ajaxUrl.searchParams.append('data_object_id', id);

			commit('setBusy');
			let dataObject = null;
			fetch(ajaxUrl)
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
					dataObject = resp.data.dataObject;
				})
				.catch((error) => {})
				.finally(() => {
					commit('resetBusy');
					const resolveFunction = dataObject === null ? reject : resolve;
					resolveFunction(dataObject);
				});
		});
	},
};

/**
 * @module actions
 */
export default actions;
