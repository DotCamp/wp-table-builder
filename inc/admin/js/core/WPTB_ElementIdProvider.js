/**
 * UMD module for element id provider component.
 *
 * @param {string} key context key
 * @param {Object} context container context
 * @param {Function} factory factory function
 */
(function umd(key, context, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_ElementIdProvider', self || global, () => {
	/**
	 * Element id provider.
	 *
	 * @class
	 */
	function ElementIdProvider() {
		// stored element ids per table element type
		const elementIds = {};

		/**
		 * First time id startup for given element type.
		 * This function will check all same element types and use highest id as starting point.
		 *
		 * @param {string} elementType element type
		 */
		const initializeElementIdForType = (elementType) => {
			const elements = Array.from(document.querySelectorAll('.wptb-ph-element'));

			const regex = new RegExp(`wptb-element-${elementType}-(\\d+)`, 'i');

			return elements.reduce((carry, current) => {
				const matchArray = regex.exec(current.className);

				return matchArray !== null && matchArray[1] !== undefined
					? Math.max(carry, Number.parseInt(matchArray[1], 10))
					: carry;
			}, 0);
		};

		/**
		 * Get a new id for given element type.
		 *
		 * @param {string} elementType element type
		 * @return {number} new if for element
		 */
		this.getNewId = (elementType) => {
			if (elementIds[elementType] === undefined) {
				elementIds[elementType] = initializeElementIdForType(elementType);
			}

			// eslint-disable-next-line no-plusplus
			return ++elementIds[elementType];
		};
	}

	// singleton component for element id provider
	return new ElementIdProvider();
});
