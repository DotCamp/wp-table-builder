/**
 * IIFE for background menu setup.
 */
(function wptbBackgroundMenuSetup() {
	/**
	 * Background menu component.
	 *
	 * @class
	 */
	function BackgroundMenu() {
		// whether setup operation done or not
		this.initialized = false;

		/**
		 * Get background specific options from table attributes
		 */
		const parseOptionsFromTable = () => {
			const currentTable = document.querySelector('.wptb-table-setup .wptb-preview-table');

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
		const rowOperations = ({ headerBg, evenBg, oddBg }) => {};

		/**
		 * Apply background options to table.
		 *
		 * @param {null | Object} suppliedOptions options object, if supplied, these options will be used instead of parsing from table itself
		 */
		this.applyOptions = (suppliedOptions = null) => {
			const { row: rowOptions } = suppliedOptions || parseOptionsFromTable();

			// TODO [erdembircan] remove for production
			console.log(rowOptions);

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

	// initialize background menu component
	new BackgroundMenu().init();
})();
