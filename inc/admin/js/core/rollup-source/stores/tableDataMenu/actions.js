import deepmerge from 'deepmerge';

/**
 * Table data store actions.
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Commit a mutation based on busy state.
	 *
	 * @param {Object} root store object
	 * @param {Function} root.commit store commit function
	 * @param {Object} root.getters store getters
	 * @param {Object} mutationPayload mutation payload object
	 * @param {string} mutationPayload.name mutation name
	 * @param {*} mutationPayload.value mutation value
	 */
	mutationBusyPass({ commit, getters }, { name, value }) {
		if (!getters.getBusyState) {
			commit(name, value);
		}
	},
	/**
	 * Ajax request for update/creating data object.
	 *
	 * @param {Object} root store object
	 * @param {Object} root.getters store getters
	 * @param {Function} root.dispatch store action function
	 * @param {Object} dataObject data object to be saved/updated
	 *
	 * @return {Promise} Promise
	 */
	updateDataObjectAjax({ getters, dispatch }, dataObject) {
		const { nonce, action } = getters.getSecurityProps('dataObjectUpdate');
		const url = getters.getSecurityProps('url');

		const formData = new FormData();
		formData.append('nonce', nonce);
		formData.append('action', action);
		formData.append('dataObject', btoa(JSON.stringify(dataObject)));

		return dispatch('genericFetch', { url, options: { method: 'POST', body: formData } });
	},
	/**
	 * Fetch data object properties.
	 *
	 * @param {Object} root store object
	 * @param {Object} root.getters store getters
	 * @param {Function} root.dispatch store action function
	 * @param {number} id data object id
	 */
	fetchDataObject({ getters, dispatch }, id) {
		const { nonce, action } = getters.getSecurityProps('dataObjectContent');
		const url = getters.getSecurityProps('url');

		const ajaxUrl = new URL(url);
		ajaxUrl.searchParams.append('nonce', nonce);
		ajaxUrl.searchParams.append('action', action);
		ajaxUrl.searchParams.append('data_object_id', id);

		return dispatch('genericFetch', { url: ajaxUrl });
	},
	/**
	 * Generic fetch function.
	 *
	 * @param {Object} root store object
	 * @param {Function} root.commit store commit function
	 * @param {Object} payload action payload
	 * @param {string} payload.url fetch url
	 * @param {Object} payload.options fetch operation options
	 */
	genericFetch({ commit }, { url, options = { method: 'GET' } }) {
		return new Promise((resolve, reject) => {
			let responseObject = null;
			commit('setBusy');
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
					commit('setErrorMessage', err.message);
				})
				.finally(() => {
					commit('resetBusy');
					const resolveFunction = responseObject === null ? reject : resolve;
					resolveFunction(responseObject);
				});
		});
	},
	/**
	 * Fetch simple data object properties.
	 *
	 * @param {Object} root store object
	 * @param {Object} root.getters store getters
	 * @param {Function} root.dispatch store action function
	 */
	fetchSimpleDataObjects({ getters, dispatch }) {
		const { nonce, action } = getters.getSecurityProps('simpleDataObjects');
		const url = getters.getSecurityProps('url');

		const ajaxUrl = new URL(url);
		ajaxUrl.searchParams.append('nonce', nonce);
		ajaxUrl.searchParams.append('action', action);

		return dispatch('genericFetch', { url: ajaxUrl });
	},
	/**
	 * Merge data object with data manager.
	 *
	 * @param {Object} root store object
	 * @param {Function} root.commit store mutation function
	 * @param {Object} dataObject data object
	 */
	mergeDataObject({ commit }, dataObject) {
		const { controls, content } = deepmerge({}, dataObject);

		commit('setDataManagerControlObject', { ...controls });
		commit('mergeTempData', { ...content });
		commit('setDataBackup', dataObject);
	},
	/**
	 * Revert table data to current data object which will strip all changes made.
	 *
	 * @param {Object} root store object
	 * @param {Function} root.dispatch store action function
	 * @param {Function} root.commit store mutation function
	 * @param {Object} dataObject data object
	 */
	revertTableData({ dispatch, commit }, dataObject) {
		dispatch('mergeDataObject', dataObject);
		commit('resetAppDirtyStatus');
	},
	/**
	 * Revert table data to its backup state.
	 *
	 * @param {Object} root store object
	 * @param {Object} root.getters store state getters
	 * @param {Function} root.dispatch store action function
	 * @param {Function} root.commit store mutation function
	 */
	revertTableDataFromBackup({ getters, dispatch, commit }) {
		const dataObjectBackup = getters.getDataBackup;

		dispatch('mergeDataObject', dataObjectBackup);
		commit('resetAppDirtyStatus');
	},
};

/**
 * @module actions
 */
export default actions;
