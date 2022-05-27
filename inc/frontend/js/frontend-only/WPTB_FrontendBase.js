// eslint-disable-next-line @wordpress/no-global-event-listener
document.addEventListener('DOMContentLoaded', () => {
	(function assignToContext(key, factory) {
		// eslint-disable-next-line no-restricted-globals
		const context = self || global;

		context[key] = factory();
	})('WptbFrontendBase', () => {
		/**
		 * Table object.
		 *
		 * @param {Node} containerElement table top level container element.
		 * @class
		 */
		function WptbTableObject(containerElement) {
			/**
			 * Top level wrapper for table element.
			 *
			 * @type {null | Node}
			 */
			this.parentContainer = null;

			/**
			 * Container with matrix properties.
			 *
			 * @type {null | Node}
			 */
			this.matrixContainer = null;

			/**
			 * Main table element.
			 *
			 * @type {null | HTMLTableElement}
			 */
			this.mainTable = null;

			/**
			 * Table id.
			 *
			 * @type {null | number}
			 */
			this.id = null;

			/**
			 * Parse table id.
			 *
			 * @param {HTMLTableElement} tableElement table element
			 * @return {null | number} table id
			 */
			const parseId = (tableElement) => {
				const tableId = tableElement.getAttribute('id');
				if (tableId) {
					const { id } = tableId.match(/^wptb-table-id-(?<id>\d+)$/)?.groups;
					return parseInt(id, 10);
				}

				return null;
			};

			/**
			 * Parse extra info from table.
			 */
			const parseExtra = () => {
				if (this.mainTable) {
					this.id = parseId(this.matrixContainer);
				}
			};

			/**
			 * Initialize frontend base.
			 */
			const init = () => {
				if (containerElement.classList.contains('wptb-table-container')) {
					this.parentContainer = containerElement;
					const matrixContainer = containerElement.querySelector('.wptb-table-container-matrix');

					if (matrixContainer) {
						this.matrixContainer = matrixContainer;

						const mainTable = this.matrixContainer.querySelector('table.wptb-preview-table');

						if (mainTable) {
							this.mainTable = mainTable;
							parseExtra();
						} else {
							throw new Error('invalid table element');
						}
					} else {
						throw new Error('invalid matrix container');
					}
				} else {
					throw new Error('invalid table top level container');
				}
			};

			init();
		}

		/**
		 * Wptb frontend base operations and helpers.
		 *
		 * @class
		 */
		function WptbFrontendBase() {
			/**
			 * Available table objects.
			 *
			 * @type {Array}
			 */
			const tableObjects = [];

			/**
			 * Find available tables and generate table objects.
			 */
			const prepareTableObjects = () => {
				// eslint-disable-next-line array-callback-return
				Array.from(document.querySelectorAll('.wptb-table-container')).map((container) => {
					tableObjects.push(new WptbTableObject(container));
				});
			};

			/**
			 * Get available table objects.
			 *
			 * @return {Array} table objects array
			 */
			this.getTableObjects = () => {
				return tableObjects;
			};

			this.init = () => {
				prepareTableObjects();
			};
		}

		const frontendBaseSingletonInstance = new WptbFrontendBase();
		frontendBaseSingletonInstance.init();

		return frontendBaseSingletonInstance;
	});
});
