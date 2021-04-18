import DeBouncer from '../../functions/DeBouncer';

/**
 * Data table store actions.
 *
 * @type {Object}
 */
const actions = {
	/**
	 * Change DOM visibility of app.
	 *
	 * @param {Function} commit mutation commit function
	 * @param {boolean} value visibility value
	 */
	setComponentVisibility({ commit }, value) {
		commit('appVisibility', value);
	},
	/**
	 * Change current screen.
	 *
	 * @param {Function} commit mutation commit function
	 * @param {string} screenName screen name to assign as current
	 */
	setCurrentScreen({ commit }, screenName) {
		commit('setScreen', screenName);
	},
	/**
	 * Change current screen.
	 *
	 * @param {Function} commit mutation commit function
	 */
	setCurrentScreenToDataSourceSelection({ commit }) {
		commit('setScreen', `DataSourceSelection`);
		// commit('resetToDefaults', 'dataSource.setup');
	},
	/**
	 * Soft select a source card.
	 *
	 * @param {{commit}} mutation commit function
	 * @param {string} sourceId selected source id
	 */
	softSelectCard({ commit }, sourceId) {
		commit('setSoftSelected', sourceId);
	},
	/**
	 * Start setup process for selected source type.
	 *
	 * For source setup to work, name your setup components as `SourceName`Setup where
	 *`SourceName` being the id for that source.
	 *
	 * @param {{commit, dispatch}} mutation commit function
	 * @param {string} sourceId selected source id
	 */
	async startSourceSetup({ commit, dispatch }, sourceId) {
		commit('setSetupActive');

		let innerSourceId = sourceId;
		let clear = true;

		if (typeof sourceId === 'object') {
			innerSourceId = sourceId.sourceId;
			clear = sourceId.clear !== undefined ? sourceId.clear : true;
		}

		// set source id
		commit('setSetupSourceId', innerSourceId);

		if (clear) {
			// reset selected data source
			// @deprecated
			// commit('setSelectedDataSource', null);
			await dispatch('dataSourceChangeOperation', null);

			// clear temp data manager
			commit('clearTempDataManager');
		}

		// clear setup
		commit('resetToDefaults', 'dataSource.setup');

		// set screen
		dispatch('setCurrentScreenFromId', innerSourceId);
	},
	/**
	 * Change data source type operation.
	 * This action will reset data object to default first.
	 *
	 * @param {Object} root store action object
	 * @param {Function} root.commit store mutation commit function
	 * @param {string} sourceId data source type
	 */
	dataSourceChangeOperation({ commit }, sourceId) {
		// commit('resetToDefaults', 'dataSource.dataObject');
		commit('setSelectedDataSource', sourceId);
	},
	/**
	 * Set current setup screen from id.
	 *
	 * @param {{dispatch}} vuex store object
	 * @param {string} sourceId source id
	 */
	setCurrentScreenFromId({ dispatch }, sourceId) {
		const screenName = `${sourceId[0].toUpperCase() + sourceId.slice(1)}Setup`;

		dispatch('setCurrentScreen', screenName);
	},
	/**
	 * Set tab of current active source setup.
	 *
	 * @param {{state,commit}} vuex store object
	 * @param {string} tabId tab id to change to
	 */
	setActiveTabGroupForCurrentSource({ state, commit }, tabId) {
		commit('setActiveControlTabGroup', { sourceId: state.dataSource.setup.sourceId, tabId });
	},
	/**
	 * Set current source in setup as selected.
	 *
	 * @param {{commit, getters, commit}} vuex store object
	 */
	async setCurrentSourceAsSelected({ dispatch, getters, commit }) {
		const currentSourceInSetup = getters.getCurrentSourceSetupId;

		// @deprecated
		// commit('setSelectedDataSource', currentSourceInSetup);
		await dispatch('dataSourceChangeOperation', currentSourceInSetup);

		commit('resetSetupStatus');
	},
	/**
	 * Mark certain properties of data table for save process.
	 *
	 * @param {{state}} vuex store object
	 */
	async addOptionsAndDataToSave({ state, getters, dispatch }) {
		document.addEventListener('wptb:save:before', ({ detail }) => {
			const { dataManager } = state;

			// select data manager properties that will be saved to table
			const { controls, select, tempData, ...dataManagerRest } = dataManager;

			// break object reference with store
			const dataManagerToSave = { ...dataManagerRest };
			const { bindings } = dataManagerToSave;

			const table = document.querySelector(
				'.wptb-management_table_container .wptb-table-setup .wptb-preview-table'
			);

			// validate bindings and remove invalid ones
			if (bindings && table) {
				const { column: columnBindings, row: rowBindings } = bindings;

				/**
				 * Validate bindings.
				 *
				 * @param {Object} binding binding object
				 * @param {Function} queryCall function to form a query to check for elements inside table. If query returns an element, it means binding is valid. Function takes binding element id as its only argument
				 * @param {HTMLElement} tableElement table element
				 */
				// eslint-disable-next-line no-inner-declarations
				function validateBinding(binding, queryCall, tableElement) {
					// validate column bindings
					const elementIds = Object.keys(binding).filter((key) => {
						return Object.prototype.hasOwnProperty.call(binding, key);
					});

					// eslint-disable-next-line array-callback-return
					elementIds.map((elementId) => {
						const formedElementUniqueClassQuery = queryCall(elementId);
						if (!tableElement.querySelector(formedElementUniqueClassQuery)) {
							// eslint-disable-next-line no-param-reassign
							delete binding[elementId];
						}
					});
				}

				// validate column bindings
				validateBinding(
					columnBindings,
					(bindingId) => {
						return `.wptb-element-${bindingId}`;
					},
					table
				);

				// validate row bindings
				validateBinding(
					rowBindings,
					(bindingId) => {
						return `tr[data-data-table-row-id='${bindingId}']`;
					},
					table
				);
			}

			const dataToSave = { dataManager: dataManagerToSave };
			const stringified = JSON.stringify(dataToSave);
			const encoded = btoa(stringified);

			if (table) {
				table.dataset.wptbDataTableOptions = encoded;
			}

			if (typeof detail === 'object') {
				/* eslint-disable no-param-reassign */
				detail.wptbDataTable = true;

				dispatch('syncDataObject');

				const dataObject = { ...getters.getDataObject };
				// because of a object bug, add data object content here, this is just a workaround, will work for possible fix for this in the future updates
				dataObject.content = getters.getTempDataObject;

				detail.wptbDataObject = btoa(JSON.stringify(dataObject));
				/* eslint-enable no-param-reassign */
			}
		});
	},
	/**
	 * Find main table of the builder.
	 *
	 * @param {{commit}} vuex store object
	 * @param {string} query element query
	 * @return {HTMLElement|null} found table
	 */
	findMainTable({ commit }, query) {
		const mainTable = document.querySelector(query);
		commit('setTargetTable', mainTable);
		commit('setTableActiveStatus', mainTable !== null);

		return mainTable;
	},
	async handleMainTableDiscoveryProcess({ dispatch }, query) {
		const mainTable = await dispatch('findMainTable', query);

		// if main table is not available at the time this action is called, add an event listener to table generated event to find it again
		if (!mainTable) {
			document.addEventListener('wptb:table:generated', async () => {
				const foundMainTable = await dispatch('findMainTable', query);

				// set up a mutation observer for main table
				dispatch('setUpTableMutationObserver', foundMainTable);
			});
		} else {
			// set up a mutation observer for main table
			dispatch('setUpTableMutationObserver', mainTable);
		}
	},
	/**
	 * Set up a mutation observer for the main table element.
	 * This observer will watch changes on main table and trigger reactivity for components that are dependant on main table.
	 *
	 * @param {{commit}} vuex store object
	 * @param {HTMLElement} tableElement main table element
	 */
	setUpTableMutationObserver({ commit }, tableElement) {
		// observer config object
		const config = { attributes: true, childList: true, subtree: true };

		// observer callback function
		const callback = () => {
			DeBouncer(
				'tableMutationObserver',
				() => {
					commit('setTargetTable', null);
					commit('setTargetTable', tableElement);
				},
				500
			);
		};

		const observer = new MutationObserver(callback);

		observer.observe(tableElement, config);
	},
	/**
	 * Watch table for save events.
	 *
	 * @param {Object} root store action object
	 * @param {Function} root.commit commit function for mutations
	 */
	watchSavedResponse({ commit }) {
		document.addEventListener('wptb:saved:response:data', ({ detail }) => {
			if (detail.dataTable) {
				if (detail.dataTable.dataObject) {
					const { ...rest } = detail.dataTable.dataObject;
					commit('setDataObject', rest);
				}
			}
		});
	},
	/**
	 * Sync data source setup according to store properties.
	 *
	 * @param {Object} root store action object
	 * @param {Function} root.commit commit function for mutations
	 * @param {Function} root.getters getters store state getters
	 */
	syncDataSourceSetup({ commit, getters }) {
		const { type, controls, content, title } = getters.getDataObject;

		commit('setSetupSourceId', type);
		commit('setSetupSourceDataCreatedStatus', type !== null);
		commit('setDataManagerControlObject', controls);
		commit('mergeTempData', { ...content });
		commit('setDataObjectTitle', title);
	},
	/**
	 * Sync data object with certain store properties.
	 *
	 * @param {Object} root store action object
	 * @param {Function} root.commit commit function for mutations
	 * @param {Function} root.getters getters store state getters
	 * @param {Object} root.state store state object
	 */
	syncDataObject({ commit, getters, state }) {
		const currentDataObject = getters.getDataObject;

		// update data object with various fields from store state
		const mergeData = {
			controls: state.dataManager.controls,
			title: getters.getDataObjectTitle,
		};

		const mergedData = { ...currentDataObject, ...mergeData };

		commit('setDataObject', mergedData);
	},
	/**
	 * Get simple versions of data objects for information purposes.
	 *
	 * @param {Object} root store action object
	 * @param {Function} root.getters store state getters
	 * @param {Function} root.dispatch dispatch function for store actions
	 * @param {Function} root.commit commit function for store mutations
	 */
	getSimpleDataObjects({ getters, dispatch, commit }) {
		return new Promise((res, rej) => {
			const url = new URL(getters.getAjaxUrl);
			const { action, nonce } = getters.getSecurityData('simpleDataObjects');
			url.searchParams.append('action', action);
			url.searchParams.append('nonce', nonce);

			dispatch('genericFetch', {
				url: url.toString(),
				options: {
					method: 'GET',
				},
				callbackFunctions: {
					busyFunction: () => {
						commit('setBusy', true);
					},
					resetBusyFunction: () => {
						commit('setBusy', false);
					},
					errorFunction: (err) => {
						// TODO [erdembircan] remove for production
						console.log(err);
					},
				},
			})
				.then((resp) => {
					res(resp.data.simpleDataObjects);
				})
				.catch((err) => {
					rej(err);
				});
		});
	},
	/**
	 * Fetch properties of data object with the given id.
	 *
	 * @param {Object} root store action object
	 * @param {Function} root.dispatch store action dispatch function
	 * @param {Object} root.getters store state getters
	 * @param {Function} root.commit store mutation commit function
	 * @param {number | string} dataObjectId data object id
	 */
	fetchDataObject({ dispatch, getters, commit }, dataObjectId) {
		return new Promise((res, rej) => {
			const url = new URL(getters.getAjaxUrl);
			const { nonce, action } = getters.getSecurityData('dataObjectContent');

			url.searchParams.append('nonce', nonce);
			url.searchParams.append('action', action);
			url.searchParams.append('data_object_id', dataObjectId);

			dispatch('genericFetch', {
				url: url.toString(),
				options: {
					method: 'GET',
				},
				callbackFunctions: {
					busyFunction: () => {
						commit('setBusy', true);
					},
					resetBusyFunction: () => {
						commit('setBusy', false);
					},
					errorFunction: (err) => {
						// TODO [erdembircan] remove for production
						console.log(err);
					},
				},
			})
				.then((resp) => {
					res(resp.data.dataObject);
				})
				.catch((err) => {
					rej(err);
				});
		});
	},
	/**
	 * Call a function depending on the app busy state.
	 *
	 * @param {Object} root store action object
	 * @param {Function} root.getters store state getters
	 * @param {Function} callback function to call
	 */
	busyStatePass({ getters }, callback) {
		if (!getters.busyStatus) {
			callback();
		}
	},
	/**
	 * Start source setup operation from given data object.
	 *
	 * @param {Object} root store action object
	 * @param {Function} root.commit store mutation commit function
	 * @param {Function} root.dispatch store action dispatch function
	 * @param {Object} root.getters store state getters
	 * @param {Object} dataObject data object
	 */
	async startSourceSetupFromDataObject({ commit, dispatch, getters }, dataObject) {
		commit('setDataObject', dataObject);

		await dispatch('syncDataSourceSetup');

		await dispatch('startSourceSetup', { sourceId: getters.getCurrentSourceSetupId, clear: false });
	},
};

/** @module actions */
export default actions;
