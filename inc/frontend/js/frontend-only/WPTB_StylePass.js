/**
 * Attach style pass component to global space.
 */
(function attachToGlobal(globalKey, context, factory) {
	// eslint-disable-next-line no-param-reassign
	context[globalKey] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_StylePass', self || global, function factory() {
	/**
	 * Style pass component
	 * This component will be used to either let or block theme related styling to affect table styles.
	 *
	 * @class
	 */
	function StylePass() {
		this.options = { stylesheets: {} };

		/**
		 * Maintain the same position of table container and insert shadow root container to exact same index.
		 *
		 * @param {HTMLElement} shadowRootContainer
		 * @param {HTMLElement} tableContainer
		 *
		 */
		this.insertShadowRoot = (shadowRootContainer, tableContainer) => {
			const mainParent = tableContainer.parentNode;
			const parentChildren = Array.from(mainParent.children);
			const tableIndex = parentChildren.indexOf(tableContainer);
			const upSibling = tableIndex - 1 > 0 ? null : parentChildren[tableIndex - 1];
			const downSibling = tableIndex + 1 >= parentChildren.length ? null : parentChildren[tableIndex + 1];

			this.prepareAllStylesheets(this.options.stylesheets, shadowRootContainer.shadowRoot);
			this.borrowFromTheme(tableContainer);

			shadowRootContainer.shadowRoot.appendChild(tableContainer);

			if (upSibling) {
				upSibling.insertAdjacentElement('afterend', shadowRootContainer);
			} else if (downSibling) {
				downSibling.insertAdjacentElement('beforebegin', shadowRootContainer);
			} else {
				mainParent.appendChild(shadowRootContainer);
			}
		};

		/**
		 * Borrow some theme styles and reflect them to table.
		 *
		 * @param {HTMLElement} tableContainer table container element
		 */
		this.borrowFromTheme = (tableContainer) => {
			const table = tableContainer.querySelector('table');
			const { fontFamily } = getComputedStyle(table);
			table.style.fontFamily = fontFamily;
		};

		/**
		 * Initialize and start style pass.
		 *
		 * @param {Object} options style pass options
		 */
		this.init = (options) => {
			this.options = { ...this.options, ...options };
			const tableContainers = Array.from(document.querySelectorAll('div .wptb-table-container'));

			if (tableContainers.length > 0) {
				tableContainers.map(this.setupStylePass);
			}
		};

		/**
		 * Check if style pass is enabled for current table.
		 *
		 * @param {HTMLElement} tableContainer table container
		 * @return {string} status null for disabled, true for enabled
		 */
		this.checkTableEligibility = (tableContainer) => {
			const table = tableContainer.querySelector('table');
			return table ? table.dataset.disableThemeStyles : false;
		};

		/**
		 * Prepare containers for necessary style pass operations.
		 *
		 * @param {HTMLElement} tableContainer table container
		 */
		this.setupStylePass = (tableContainer) => {
			// abort if style pass is not enabled for table
			if (!this.checkTableEligibility(tableContainer)) {
				return;
			}
			const container = document.createElement('div');
			container.classList.add('wptb-shadow-root-container');
			const maxWidth = tableContainer.querySelector('table').dataset.wptbTableContainerMaxWidth;
			if (maxWidth) {
				container.style.maxWidth = `${maxWidth}px`;
			}

			container.attachShadow({ mode: 'open' });

			this.insertShadowRoot(container, tableContainer);
		};

		this.prepareAllStylesheets = (stylesheetsObj, root) => {
			// eslint-disable-next-line array-callback-return
			Object.keys(stylesheetsObj).map((s) => {
				if (Object.prototype.hasOwnProperty.call(stylesheetsObj, s)) {
					this.prepareStylesheet(s, stylesheetsObj[s], root);
				}
			});
		};

		this.prepareStylesheet = (handler, url, root) => {
			const linkElement = document.createElement('link');
			linkElement.setAttribute('id', handler);
			linkElement.setAttribute('href', url);
			linkElement.setAttribute('rel', 'stylesheet');
			linkElement.setAttribute('media', 'all');

			root.appendChild(linkElement);
		};
	}

	return new StylePass();
});
