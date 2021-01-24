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
	 * This component will be responsible for adding and maintaining extra styles defined for tables.
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
		 * Current mode extra styles are operating on.
		 *
		 * @type {string}
		 */
		this.currentMode = this.modes.builder;

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
		 * Format styles.
		 *
		 * @param {string} styles styles
		 * @return {string} formatted styles
		 */
		const formatStyles = (styles) => {
			// remove all newlines from style string to make it a one liner
			return styles.replaceAll(/(\r?\n)/g, '');
		};

		/**
		 * Reform style rules so they will only affect given table id.
		 *
		 * @param {number} tableId table id
		 * @param {string} extraStyles extra styles
		 * @return {string} new style properties prefixed with table id class
		 */
		const affectOnlyTable = (tableId, extraStyles) => {
			// reformat styles into a suitable form for our regexp operations
			const formattedStyles = formatStyles(extraStyles);

			// instead of a raw class name, a css query styled class name (with a dot on start) is formed
			const tableUniqueClass = `.wptb-element-main-table_setting-${tableId}`;

			const splitStyles = formattedStyles.split('}');
			const prefixedStylesArray = [];

			// eslint-disable-next-line array-callback-return
			splitStyles.map((split) => {
				const regExp = new RegExp(/(.+?)\{/g);
				const matches = regExp.exec(split);

				if (matches) {
					prefixedStylesArray.push(split.replace(matches[1], `${tableUniqueClass} ${matches[1]}`));
				}
			});

			return prefixedStylesArray.join('}');
		};

		/**
		 * Apply defined extra styles for given table element.
		 *
		 * @param {Element} tableElement table element
		 */
		const applyExtraStyle = (tableElement) => {
			const extraStylesRaw = tableElement.dataset.wptbExtraStyles;
			const styleIdPrefix = 'wptb-extra-styles-';

			if (extraStylesRaw) {
				const extraStyles = atob(extraStylesRaw);
				const [, tableId] = tableElement
					.getAttribute('class')
					.match(/(?:wptb-element-main-table_setting-)(.+\d)/);

				const styleId = styleIdPrefix + tableId;

				// since stylesheets are created for frontend only once at startup, checking document head for any created style object will work even with theme disabled tables which at builder, they are not inside a shadow-root
				let styleElement = document.head.querySelector(`#${styleId}`);

				// if no style element is found, create one
				if (!styleElement) {
					styleElement = document.createElement('style');
					styleElement.type = 'text/css';
					styleElement.id = styleId;

					const isThemeStylesDisabled = tableElement.dataset.disableThemeStyles;

					// if theme styles are disabled, it means our table is residing inside a shadow-root, place style element inside shadow-root instead of document head
					if (isThemeStylesDisabled && this.currentMode === this.modes.frontEnd) {
						tableElement.insertAdjacentElement('beforebegin', styleElement);
					} else {
						document.head.appendChild(styleElement);
					}
				}

				// reform style rules so they will only affect the table they are assigned to
				const prefixedStyles = affectOnlyTable(tableId, extraStyles);

				// remove previous styles with updated ones
				styleElement.innerHTML = '';
				styleElement.appendChild(document.createTextNode(prefixedStyles));
			}
		};

		/**
		 * Apply extra styles to all available tables on DOM.
		 *
		 * @param {string} mode operation mode to apply styles
		 */
		this.applyStyles = (mode = this.modes.frontEnd) => {
			this.currentMode = mode;
			const allTables = Array.from(document.querySelectorAll(tableQueries[mode]));
			allTables.map(applyExtraStyle);
		};
	}

	// send a singleton instance of manager
	return new WPTB_ExtraStyles();
});
