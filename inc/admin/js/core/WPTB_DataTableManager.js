/**
 * Data table manager.
 *
 * A builder component that will display/handler all data table related functionality.
 *
 * @param {string} sectionName builder data table related section name
 * @param {string} wrapperId id for mounting our Vue component
 * @param {string} parentContainerQuery query for main container that our component wrapper will be hosted by
 * @class
 */

function DataTableManager(sectionName, wrapperId, parentContainerQuery) {
	this.sectionName = sectionName;
	this.wrapperId = wrapperId;
	this.parentContainerQuery = parentContainerQuery;
	this.loaded = false;

	/**
	 * Add necessary HTML elements to builder.
	 */
	this.addMountPointToDom = () => {
		const parentContainer = document.querySelector(parentContainerQuery);
		let wrapperContainer = document.querySelector(`#${wrapperId}`);

		if (!wrapperContainer) {
			const range = document.createRange();
			range.setStart(parentContainer, 0);

			const stringifiedWrapperContainer = `<div id="${wrapperId}">data table</div>`;

			[wrapperContainer] = range.createContextualFragment(stringifiedWrapperContainer).children;
		}

		parentContainer.appendChild(wrapperContainer);
	};

	/**
	 * Load data table manager.
	 */
	this.load = () => {
		if (!this.loaded) {
			this.addMountPointToDom();

			// calculate header height and add it to component as margin
			const header = document.querySelector('.wptb-builder-header');
			const headerHeight = header.getBoundingClientRect().height;

			WPTB_ControlsManager.setControlData('dataTableData', {
				headerHeight,
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
