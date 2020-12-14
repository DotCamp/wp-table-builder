/**
 * WPTB_HeaderToolbox
 *
 * @param {string} wrapperQuery wrapper query for toolbox items
 * @return {Object} header toolbox object
 * @class
 */
// eslint-disable-next-line camelcase,no-unused-vars
const WPTB_HeaderToolbox = function (wrapperQuery) {
	this.wrapperQuery = wrapperQuery;
	this.element = document.querySelector(wrapperQuery);
	this.topMargin = 2;

	/**
	 * Assign events to toolbox buttons.
	 */
	const assignButtons = () => {
		const manageCellsButton = this.element.querySelector('[data-button-type="table_settings_menu"]');

		if (manageCellsButton) {
			manageCellsButton.addEventListener(
				'click',
				() => {
					WPTB_Helper.activateSection('manage_cells');
				},
				true
			);
		}
	};

	/**
	 * Toggle visibility of toolbox with the given argument.
	 *
	 * @param {boolean} show show toolbox
	 */
	const toggleToolboxVisibility = (show = false) => {
		let { height } = this.element.getBoundingClientRect();

		if (show) {
			height = 0;
		}

		this.element.style.top = `calc( 100% - ${height + this.topMargin}px)`;
	};

	/**
	 * Initialize header toolbox.
	 */
	const init = () => {
		assignButtons();
		// bind toolbox to table generated event
		document.addEventListener('wptb:table:generated', () => {
			this.element.style.display = 'unset';
			const { width } = this.element.getBoundingClientRect();
			this.element.style.left = `calc( 50% - ${width / 2}px)`;

			// hide toolbox at manage cells and responsive menus
			document.addEventListener('wptbSectionChanged', ({ detail }) => {
				toggleToolboxVisibility(
					detail !== 'manage_cells' && detail !== 'table_responsive_menu' && detail !== 'cell_settings'
				);
			});

			// toggle visibility on startup
			const { currentSection } = WPTB_Helper;
			toggleToolboxVisibility(
				currentSection !== 'manage_cells' &&
					currentSection !== 'table_responsive_menu' &&
					currentSection !== 'cell_settings'
			);
		});
	};

	return { init };
};
