/**
 * Extra styles module to add custom css rules defined for individual tables.
 */
(function UMD(key, context, factory) {
	if (typeof module !== 'undefined' && typeof exports === 'object') {
		module.exports = factory();
	} else {
		// eslint-disable-next-line no-param-reassign
		context[key] = factory();
	}
	// eslint-disable-next-line no-restricted-globals
})('WPTB_ExtraStyles', self || global, () => {
	/**
	 * Extra styles frontend manager.
	 *
	 * @class
	 */
	// eslint-disable-next-line camelcase
	function WPTB_ExtraStyles() {
		/**
		 * Extra styles operation modes
		 *
		 * @type {Object}
		 */
		this.modes = {
			builder: 'builder',
			frontEnd: 'frontEnd',
		};
		/**
		 * HTML queries for table element in different plugin modes
		 *
		 * @type {Object}
		 */
		const tableQueries = {
			[this.modes.builder]: '.wptb-table-setup .wptb-preview-table',
			[this.modes.frontEnd]: '.wptb-table-container .wptb-preview-table',
		};

		/**
		 * Apply extra styles to all available tables on DOM.
		 *
		 * @param {string} mode operation mode to apply styles
		 */
		this.applyStyles = (mode = this.modes.frontEnd) => {
			const allTables = Array.from(document.querySelectorAll(tableQueries[mode]));
		};
	}

	// send a singleton instance of manager
	return new WPTB_ExtraStyles();
});
