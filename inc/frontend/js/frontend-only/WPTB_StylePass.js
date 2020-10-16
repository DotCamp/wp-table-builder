/**
 * Attach style pass component to global space.
 */
(function attachToGlobal(globalKey, context, factory) {
	context[globalKey] = factory();
})('WPTB_StylePass', self || global, function () {
	/**
	 * Style pass component
	 * This component will be used to either let or block theme related styling to affect table styles.
	 *
	 * @class
	 */
	function StylePass() {
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

			const stylesheets = {
				'wptb-builder-css':
					'//mysite.localhost:3000/wp-content/plugins/wp-table-builder/inc/admin/css/admin.css?ver=1.3.1',
				'wp-table-builder-css':
					'//mysite.localhost:3000/wp-content/plugins/wp-table-builder/inc/frontend/css/wp-table-builder-frontend.css?ver=1.3.1',
				'wp-table-builder-pro-css':
					'//mysite.localhost:3000/wp-content/plugins/wp-table-builder-pro/inc/frontend/css/wp-table-builder-pro-frontend.css?ver=1.1.5',
				'wp-table-builder-procommon-css':
					'//mysite.localhost:3000/wp-content/plugins/wp-table-builder-pro/inc/common/css/wp-table-builder-pro.css?ver=1.1.5',
			};

			this.prepareAllStylesheets(stylesheets, shadowRootContainer.shadowRoot);

			shadowRootContainer.shadowRoot.appendChild(tableContainer);

			if (upSibling) {
				upSibling.insertAdjacentElement('afterend', shadowRootContainer);
			} else if (downSibling) {
				upSibling.insertAdjacentElement('beforebegin', shadowRootContainer);
			} else {
				mainParent.appendChild(shadowRootContainer);
			}
		};

		/**
		 * Initialize and start style pass.
		 */
		this.init = () => {
			const tableContainers = Array.from(document.querySelectorAll('div .wptb-table-container'));

			if (tableContainers.length > 0) {
				tableContainers.map(this.setupStylePass);
			}
		};

		/**
		 * Prepare containers for necessary style pass operations.
		 *
		 * @param {HTMLElement} tableContainer table container
		 */
		this.setupStylePass = (tableContainer) => {
			const container = document.createElement('div');
			const maxWidth = tableContainer.querySelector('table').dataset.wptbTableContainerMaxWidth;
			if (maxWidth) {
				container.style.maxWidth = `${maxWidth}px`;
			}

			container.attachShadow({ mode: 'open' });

			this.insertShadowRoot(container, tableContainer);
		};

		this.prepareAllStylesheets = (stylesheetsObj, root) => {
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

			root.appendChild(linkElement);
		};
	}

	return new StylePass();
});
