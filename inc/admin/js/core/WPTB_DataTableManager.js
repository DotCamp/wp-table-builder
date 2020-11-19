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
			this.elementsMessageComtainer.remove();
		};

		/**
		 * Add an informative message to main section indicating data setup hasn't finished yet.
		 */
		this.addMessageToElementsSection = () => {
			const wrapper = document.querySelector('.wptb-builder-panel');

			if (wrapper) {
				const range = document.createRange();
				range.setStart(document, 0);
				const elementSectionMessageString = `<div class="wptb-flex wptb-plugin-height-full wptb-plugin-width-full wptb-justify-content-center wptb-flex-align-center wptb-data-table-elements-message"><i>${componentData.elementsMessage}</i></div>`;
				[this.elementsMessageComtainer] = range.createContextualFragment(
					elementSectionMessageString
				).childNodes;

				wrapper.appendChild(this.elementsMessageComtainer);
			}
		};

		/**
		 * Load data table manager.
		 */
		this.load = () => {
			if (!this.loaded) {
				this.addMountPointToDom();

				// show data table left panel section button
				leftPanelSectionButton.style.display = 'unset';

				// calculate header height and add it to component as margin
				const header = document.querySelector('.wptb-builder-header');
				const headerHeight = header.getBoundingClientRect().height;

				// merge component data with prepared data and set it to controls manager for component instance to use
				WPTB_ControlsManager.setControlData('dataTableData', {
					headerHeight,
					...componentData,
				});

				WPTB_ControlsManager.callControlScript('DataTable', this.wrapperId);
				this.loaded = true;
			}
		};

		// initialize and start up manager.
		this.init = () => {
			document.addEventListener('wptbSectionChanged', (e) => {
				if (e.detail === this.sectionName) {
					this.load();
				}
			});

			document.addEventListener('wptb:table:generated', () => {
				if (WPTB_Helper.getCurrentSection() === this.sectionName) {
					this.load();
				}
			});
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
