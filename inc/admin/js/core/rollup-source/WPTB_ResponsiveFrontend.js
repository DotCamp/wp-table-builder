// TODO [erdembircan] This function should be prepared in a way that can be both used in front end and table builder to cut out two headiness in the app. This way, any change/update/improvement that will be done to this script, will be reflected both to builder and frontend
/**
 * Responsive class assignment for frontend operations.
 */
(function assignToGlobal(key, context, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_ResponsiveFrontend', self || global, () => {
	// default options for responsive class
	const responsiveClassDefaultOptions = {
		query: '.wptb-preview-table',
		bindToResize: false,
	};

	/**
	 * Class for handling operations related to responsive functionalities of tables.
	 *
	 * @constructor
	 * @param {object} options options object
	 */
	function ResponsiveFront(options = {}) {
		// merge default options with user sent options
		this.options = { ...responsiveClassDefaultOptions, ...options };

		this.elements = Array.from(document.querySelectorAll(this.options.query));

		/**
		 * Get responsive directives of table element.
		 *
		 * @private
		 * @param {HTMLElement} table element
		 * @return {object|null} JSON representation of the directive element, if not available null will be returned
		 */
		this.getDirective = (el) => {
			const directiveString = el.dataset.wptbResponsiveDirectives;

			if (!directiveString) {
				return null;
			}

			return JSON.parse(atob(directiveString));
		};

		/**
		 * Rebuild table according to its responsive directives.
		 *
		 * @private
		 * @param {HTMLElement} el table element
		 */
		this.rebuildTable = (el) => {
			const directive = this.getDirective(el);

			// TODO [erdembircan] remove for production
			console.log(directive);
		};

		/**
		 * Batch rebuild tables.
		 */
		this.rebuildTables = () => {
			this.elements.map(this.rebuildTable);
		};

		return { rebuildTables: this.rebuildTables };
	}

	return ResponsiveFront;
});
