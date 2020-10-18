/**
 * Header toolbox button.
 *
 * @param {string} id button id
 * @param {string} label button label
 * @return {HTMLElement} button element
 */
// eslint-disable-next-line camelcase
const WPTB_HeaderButton = (id, label) => {
	const stringElement = `<div class="wptb-settings-section-item static-active wptb-header-toolbox-button">${label}</div>`;

	const range = document.createRange();
	const buttonElement = range.createContextualFragment(stringElement).children[0];

	// setup button action from header actions
	buttonElement.addEventListener('click', () => {
		WPTB_HeaderToolboxActions.callAction(id);
	});

	return buttonElement;
};

/**
 * WPTB_HeaderToolbox.
 *
 * @param {string} wrapperQuery wrapper query for toolbox items
 * @param {Object} data data for header toolbox
 * @return {Object} header toolbox object
 * @class
 */
// eslint-disable-next-line camelcase,no-unused-vars
const WPTB_HeaderToolbox = (wrapperQuery, data) => {
	this.wrapperQuery = wrapperQuery;
	this.element = document.querySelector(wrapperQuery);
	this.elementWrapper = this.element.parentNode;
	this.topMargin = 2;
	this.data = data;

	/**
	 * Add button to header toolbox.
	 */
	const assignButtons = () => {
		// eslint-disable-next-line array-callback-return
		this.data.buttons.map((b) => {
			this.element.appendChild(new WPTB_HeaderButton(b.id, b.label));
		});
	};

	/**
	 * Clear button of toolbox.
	 */
	const clearToolbox = () => {
		this.element.innerHTML = '';
	};

	// subscribe to set action of header toolbox actions
	WPTB_HeaderToolboxActions.subscribe('set', () => {
		clearToolbox();
		assignButtons();
	});

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
		// clear contents of toolbox before adding buttons
		clearToolbox();

		// create and assign buttons
		assignButtons();

		// bind toolbox to table generated event
		document.addEventListener('wptb:table:generated', () => {
			toggleToolboxVisibility(true);

			// main header part of the builder
			const mainHeader = document.querySelector('.wptb-header');

			// use main header height to position toolbox
			const headerHeight = mainHeader.getBoundingClientRect().height;
			this.elementWrapper.style.top = `${headerHeight}px`;
		});
	};

	return { init };
};
