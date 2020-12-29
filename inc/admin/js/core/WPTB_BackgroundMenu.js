/**
 * UMD for background menu setup.
 */
(function umd(key, context, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_BackgroundMenu', self || global, function wptbBackgroundMenuSetup() {
	/**
	 * Background menu component.
	 *
	 * @class
	 */
	function BackgroundMenu() {
		// whether setup operation done or not
		this.initialized = false;

		/**
		 * Get current active table on builder.
		 *
		 * @return {HTMLElement | null} found active table
		 */
		const getCurrentTable = () => {
			return document.querySelector('.wptb-table-setup .wptb-preview-table');
		};

		/**
		 * Get background specific options from table attributes
		 */
		const parseOptionsFromTable = () => {
			const currentTable = getCurrentTable();

			const headerBg = currentTable.dataset.wptbHeaderBackgroundColor;
			const evenBg = currentTable.dataset.wptbEvenRowBackgroundColor;
			const oddBg = currentTable.dataset.wptbOddRowBackgroundColor;

			return {
				row: {
					headerBg,
					evenBg,
					oddBg,
				},
			};
		};

		/**
		 * Row specific operations.
		 *
		 * @param {Object} rowOptions row options object
		 * @param {string} rowOptions.headerBg header color
		 * @param {string} rowOptions.evenBg even row color
		 * @param {string} rowOptions.oddBg odd row color
		 */
		const rowOperations = ({ headerBg, evenBg, oddBg }) => {
			const currentTable = getCurrentTable();

			const [header, ...rest] = Array.from(currentTable.querySelectorAll('tr'));

			// apply header row color
			header.style.backgroundColor = headerBg;

			// apply even/odd row color
			// eslint-disable-next-line array-callback-return
			rest.map((row, index) => {
				// eslint-disable-next-line no-param-reassign
				row.style.backgroundColor = index % 2 === 0 ? evenBg : oddBg;
			});
		};

		/**
		 * Apply background options to table.
		 *
		 * @param {null | Object} suppliedOptions options object, if supplied, these options will be used instead of parsing from table itself
		 */
		this.applyOptions = (suppliedOptions = null) => {
			const { row: rowOptions } = suppliedOptions || parseOptionsFromTable();

			rowOperations(rowOptions);
		};

		/**
		 * Initialize hook for component.
		 */
		this.init = () => {
			// initialize background menu on correct section change
			document.addEventListener('wptbSectionChanged', ({ detail }) => {
				// only run setup once
				if (!this.initialized && detail === 'background_menu') {
					WPTB_ControlsManager.callControlScript('BackgroundMenu', 'wptb-background-menu');
					this.initialized = true;
				}
			});

			// reapply options after table changed events
			document.addEventListener('wp-table-builder/table-changed/after', () => {
				this.applyOptions();
			});
		};
	}

	const singletonInstance = new BackgroundMenu();

	// initialize background menu component
	singletonInstance.init();

	return singletonInstance;
});
