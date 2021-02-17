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
		// use data-button-type dataset property to call related section
		const headerButtons = Array.from(this.element.querySelectorAll('[data-button-type]'));

		// eslint-disable-next-line array-callback-return
		headerButtons.map((button) => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				WPTB_Helper.activateSection(e.target.dataset.buttonType);
			});
		});
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
			this.element.style.display = 'flex';
			const { width } = this.element.getBoundingClientRect();
			this.element.style.left = `calc( 50% - ${width / 2}px)`;

			const hideList = ['table_responsive_menu', 'manage_cells', 'cell_settings'];

			// hide toolbox at manage cells and responsive menus
			document.addEventListener('wptbSectionChanged', ({ detail }) => {
				toggleToolboxVisibility(!hideList.includes(detail));
			});

			// toggle visibility on startup
			// eslint-disable-next-line camelcase
			const { currentSection } = WPTB_Helper;
			toggleToolboxVisibility(!hideList.includes(currentSection));
		});
	};

	return { init };
};
