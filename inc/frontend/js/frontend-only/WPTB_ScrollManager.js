/* eslint-disable camelcase */
(function assignToGlobal(key, context, factory) {
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_ScrollManager', self || global, () => {
	/**
	 * Scroll manager for WPTB.
	 *
	 * @param {Object} scrollOptions options
	 * @class
	 */
	function WPTB_ScrollManager(scrollOptions) {
		const { frontendCalculationStatus } = scrollOptions;

		/**
		 * Prepare tables for scroll functionality.
		 *
		 * @param {Node} tableElement table element
		 */
		const prepareTableForScroll = (tableElement) => {
			const mainContainer = tableElement.parentNode.parentNode;
			const matrixContainer = tableElement.parentNode;

			mainContainer.dataset.wptbHorizontalScrollStatus = 'true';
			const storedMaxWidth = mainContainer.style.maxWidth;
			mainContainer.style.maxWidth = '';

			matrixContainer.style.width = storedMaxWidth;
		};

		/**
		 * Initialize scroll manager processes.
		 */
		this.init = () => {
			const tableElements = Array.from(
				document.querySelectorAll('table[data-wptb-horizontal-scroll-status=true]')
			);

			// only start preparing tables for scroll functionality if backend didn't
			// main factor for that is if server didn't implement `mb_convert_encoding` function
			if (frontendCalculationStatus) {
				tableElements.map(prepareTableForScroll);
			}
		};
	}

	/**
	 * @module WPTB_ScrollManager
	 */
	return WPTB_ScrollManager;
});
