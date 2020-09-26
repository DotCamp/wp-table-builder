/**
 * Responsive menu and options class.
 *
 * This class will be called and instanced at table builder menu to add it the responsive menu and its controls.
 *
 * @param {string} sectionName section name
 * @param {string} responsiveWrapperId id for mount point
 * @param {string} mainContainerQuery query to find parent container for responsive menu
 * @throws {Error} will throw an error if mainContainerQuery failed to find any element
 * @constructor
 */
// eslint-disable-next-line no-unused-vars
function WptbResponsive(sectionName, responsiveWrapperId, mainContainerQuery) {
	this.sectionName = sectionName;
	this.responsiveWrapperId = responsiveWrapperId;
	this.responsiveTable = null;
	this.loaded = false;

	/**
	 * Add responsive container to dom.
	 */
	this.addContainerToDom = () => {
		const responsiveContainer = document.querySelector(`#${this.responsiveWrapperId}`);
		if (!responsiveContainer) {
			const mainContainer = document.querySelector(mainContainerQuery);

			// parent container not found, throw error
			if (!mainContainer) {
				throw new Error(
					`[WPTB_Responsive]: no parent container is found with the given query of [${mainContainerQuery}]`
				);
			}

			const range = document.createRange();
			range.setStart(mainContainer, 0);

			const responsiveElement = range.createContextualFragment(
				`<div class="wptb-responsive" id="${this.responsiveWrapperId}">responsive element</div>`
			);
			mainContainer.appendChild(responsiveElement);
			this.loaded = true;
		}

		this.responsiveTable = document.querySelector(`#${this.responsiveWrapperId}`);
	};

	/**
	 * Load and make necessary mount preparations for component.
	 */
	this.load = () => {
		if (!this.loaded) {
			this.addContainerToDom();

			WPTB_Helper.elementStartScript(this.responsiveTable, 'table_responsive_menu');
			WPTB_Helper.elementOptionsSet('table_responsive_menu', this.responsiveTable);
			WPTB_ControlsManager.callControlScript('ResponsiveTable', this.responsiveWrapperId);
		}
	};

	/**
	 * Startup hook for the component.
	 */
	this.startUp = () => {
		// event listener for section change events
		document.addEventListener('wptbSectionChanged', (e) => {
			const tablePreview = document.querySelector('.wptb-table-setup .wptb-preview-table');

			// check if activated section is related to responsive and there is a main table already in the view
			if (e.detail === this.sectionName && tablePreview) {
				this.load();
			}
		});

		// event listener for table ready signal
		document.addEventListener('wptb:table:generated', () => {
			// check current section to be sure that responsive menu is the active one before calling load related scripts
			if (WPTB_Helper.getCurrentSection() === 'table_responsive_menu') {
				this.load();
			}
		});
	};

	this.startUp();
}
