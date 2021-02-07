/**
 * Static data table manager object.
 *
 * @type {Object}
 */
// eslint-disable-next-line no-unused-vars
const DataTableManagerStatic = (() => {
	let instance = null;

	/**
	 * Data table manager.
	 *
	 * A builder component that will display/handler all data table related functionality.
	 *
	 * @param {string} sectionName builder data table related section name
	 * @param {string} wrapperId id for mounting our Vue component
	 * @param {string} parentContainerQuery query for main container that our component wrapper will be hosted by
	 * @param {Object} componentData component related data
	 * @class
	 */
	// eslint-disable-next-line no-unused-vars
	function DataTableManager(sectionName, wrapperId, parentContainerQuery, componentData) {
		this.sectionName = sectionName;
		this.wrapperId = wrapperId;
		this.parentContainerQuery = parentContainerQuery;
		this.loaded = false;

		this.dataTableElement = null;
		this.elementsMessageComtainer = null;

		const leftPanelSectionButton = document.querySelector('div[data-wptb-section-button="data_table_menu"]');

		/**
		 * Add necessary HTML elements to builder.
		 */
		this.addMountPointToDom = () => {
			const parentContainer = document.querySelector(parentContainerQuery);
			let wrapperContainer = document.querySelector(`#${wrapperId}`);

			if (!wrapperContainer) {
				const range = document.createRange();
				range.setStart(parentContainer, 0);

				const stringifiedWrapperContainer = `<div class="wptb-datatable" id="${wrapperId}">data table</div>`;

				[wrapperContainer] = range.createContextualFragment(stringifiedWrapperContainer).children;
			}

			this.dataTableElement = wrapperContainer;
			parentContainer.appendChild(this.dataTableElement);
		};

		/**
		 * Clean up certain aspects of the data table manager.
		 */
		this.cleanUp = () => {
			if (this.elementsMessageComtainer) {
				this.elementsMessageComtainer.remove();
			}
		};

		/**
		 * Add an informative message to main section indicating data setup hasn't finished yet.
		 */
		this.addMessageWrapperToElementsSection = () => {
			const wrapper = document.querySelector('.wptb-builder-panel');

			if (wrapper) {
				const range = document.createRange();
				range.setStart(document, 0);
				const elementSectionMessageString = `<div id="wptbDataTableElementsTarget" ></div>`;
				[this.elementsMessageContainer] = range.createContextualFragment(
					elementSectionMessageString
				).childNodes;

				wrapper.appendChild(this.elementsMessageContainer);
			}
		};

		/**
		 * Get table element.
		 *
		 * @return {Element|null} table element
		 */
		const getTable = () => {
			return document.querySelector('.wptb-management_table_container .wptb-table-setup .wptb-preview-table');
		};

		/**
		 * Get any saved data table options from main table element.
		 *
		 * @return {null|Object} data table options
		 */
		const savedDataTableOptions = () => {
			const table = getTable();

			let options = null;
			if (table) {
				options = table.dataset.wptbDataTableOptions;
				if (options) {
					options = JSON.parse(atob(options));
				}
			}
			return options;
		};

		/**
		 * Activate left panel section button for tables activated the data table functionality.
		 */
		const activateLeftPanelSectionButton = () => {
			leftPanelSectionButton.style.display = 'unset';
		};

		/**
		 * Load data table manager.
		 */
		this.load = () => {
			if (!this.loaded) {
				this.addMountPointToDom();
				activateLeftPanelSectionButton();
				this.addMessageWrapperToElementsSection();

				// calculate header height and add it to component as margin
				const header = document.querySelector('.wptb-builder-header');
				const headerHeight = header.getBoundingClientRect().height;

				// merge component data with prepared data and set it to controls manager for component instance to use
				WPTB_ControlsManager.setControlData('dataTableData', {
					headerHeight,
					...componentData,
					dataTableOptions: savedDataTableOptions(),
				});

				WPTB_ControlsManager.callControlScript('DataTable', this.wrapperId);
				this.loaded = true;
			}
		};

		/**
		 * Check whether current table enabled data tables.
		 */
		const isDataTableEnabled = () => {
			const table = getTable();
			if (table) {
				return table.dataset.wptbDataTable;
			}

			return false;
		};

		/**
		 * Initialize and start up manager.
		 */
		this.init = () => {
			document.addEventListener('wptb:table:generated', () => {
				if (isDataTableEnabled()) {
					this.load();
				}
			});
		};

		/**
		 * Force load data table manager.
		 *
		 * This function will mainly be used for data table card to start the process of data setup.
		 */
		this.forceLoad = () => {
			this.load();
		};

		/**
		 * Mark to be generated table as data table.
		 */
		this.markTableAsDataTable = () => {
			// add data table specific data set to indicate that table implemented data table functionality
			document.addEventListener('wptb:table:generated', () => {
				const table = document.querySelector(
					'.wptb-management_table_container .wptb-table-setup .wptb-preview-table'
				);
				if (table) {
					table.dataset.wptbDataTable = true;
				}
			});

			// @deprecated
			// document.addEventListener('wptb:save:before', ({ detail }) => {
			// 	// eslint-disable-next-line no-param-reassign
			// 	detail.wptbDataTable = true;
			// });
		};

		this.init();
	}

	/**
	 * If called with arguments, if there is no instance available, will create the static instance.
	 *
	 *
	 * @param {string} sectionName builder data table related section name
	 * @param {string} wrapperId id for mounting our Vue component
	 * @param {string} parentContainerQuery query for main container that our component wrapper will be hosted by
	 * @param {Object} componentData component related data
	 *
	 * @return {Object} data manager instance
	 */
	const getInstance = (sectionName, wrapperId, parentContainerQuery, componentData) => {
		if (!instance) {
			instance = new DataTableManager(sectionName, wrapperId, parentContainerQuery, componentData);
		}
		return instance;
	};

	return { getInstance };
})();
