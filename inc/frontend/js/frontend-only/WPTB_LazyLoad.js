(function assignToGlobal(key, context, factory) {
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_LazyLoad', self || global, () => {
	/**
	 * WPTB Lazy load functionality module.
	 *
	 * @class
	 */
	// eslint-disable-next-line camelcase
	function WPTB_LazyLoad() {
		/**
		 * Lazy load instance options.
		 *
		 * @type {Object}
		 */
		let options = {};

		/**
		 * Scroll related cached data.
		 *
		 * @type {Object}
		 */
		const cachedScrollData = {
			lastYPosition: 0,
		};

		const bufferElementClass = 'wptb-lazy-load-buffer-element';
		const bufferElementContainerClass = 'wptb-lazy-load-buffer-element-container';

		/**
		 * Whether user scrolling down or up.
		 *
		 * @return {boolean} scrolling down or up
		 */
		const isGoingDown = () => {
			return window.scrollY - cachedScrollData.lastYPosition >= 0;
		};

		/**
		 * Calculate visibility of image element depending on current position of page.
		 *
		 * @param {HTMLElement} imgElement image element
		 * @param {number} currentYPos current position of page
		 *
		 * @return {boolean} is element visible or not
		 */
		const isElementVisible = (imgElement, currentYPos) => {
			const { top, height, bottom } = imgElement.getBoundingClientRect();
			const { visibilityPercentage } = options;

			const visibilityRangeTop = top + height * (visibilityPercentage / 100);
			const visibilityRangeBottom = bottom - height * (visibilityPercentage / 100);

			const visibilityVariable = isGoingDown() ? visibilityRangeTop : visibilityRangeBottom;

			return visibilityVariable >= 0 && visibilityVariable <= currentYPos;
		};

		/**
		 * Add a buffer element and associated options to image container.
		 *
		 * @param {HTMLElement} imgElement image element
		 */
		const addBufferElement = (imgElement) => {
			const bufferElement = document.createElement('div');
			bufferElement.classList.add(bufferElementClass);

			// assign color to buffer element
			bufferElement.style.backgroundColor = options.backgroundColor;

			if (options.iconSvg) {
				bufferElement.innerHTML = `<div class="wptb-lazy-load-buffer-icon-wrapper">${options.iconSvg}</div>`;
			}

			// add buffer element adjacent to image element
			imgElement.insertAdjacentElement('afterend', bufferElement);

			imgElement.parentNode.classList.add(bufferElementContainerClass);
		};

		/**
		 * Remove buffer element and associated options.
		 *
		 * @param {HTMLElement} imgElement image element
		 */
		const removeBufferElement = (imgElement) => {
			const { parentNode } = imgElement;
			const bufferElement = parentNode.querySelector(`.${bufferElementClass}`);
			if (bufferElement) {
				parentNode.removeChild(bufferElement);
				parentNode.classList.remove(bufferElementContainerClass);
			}
		};

		const imageElementLoadCallback = (e) => {
			e.target.dataset.wptbLazyLoadStatus = 'true';

			// remove buffer element and associated options
			removeBufferElement(e.target);

			e.target.removeEventListener('load', imageElementLoadCallback);
		};

		/**
		 * Process image element for visibility.
		 *
		 * @param {HTMLElement} imgElement image element
		 * @param {number} currentYPos current position of page
		 */
		const processIndividualImageElement = (imgElement, currentYPos) => {
			if (isElementVisible(imgElement, currentYPos)) {
				imgElement.addEventListener('load', imageElementLoadCallback);

				// eslint-disable-next-line no-param-reassign
				imgElement.src = imgElement.dataset.wptbLazyLoadTarget;
			}
		};

		/**
		 * Update cached last scroll position.
		 *
		 * @param {number} position y position
		 */
		const updateLastScrollY = (position) => {
			cachedScrollData.lastYPosition = position;
		};

		/**
		 * Process array of image elements for visibility.
		 *
		 * @param {Array} imgElements image elements array
		 * @param {number} currentYPos current position of page
		 * @param {boolean} firstTimeProcess whether process is run for the first time or not
		 */
		const processImageElements = (imgElements, currentYPos, firstTimeProcess = false) => {
			// eslint-disable-next-line array-callback-return
			imgElements
				.filter((element) => {
					return element.dataset.wptbLazyLoadStatus === 'false';
				})
				// eslint-disable-next-line array-callback-return
				.map((img) => {
					// updateBackgroundColor(img);

					if (firstTimeProcess) {
						addBufferElement(img);
					}

					// TODO [erdembircan] uncomment for production
					// processIndividualImageElement(img, currentYPos);
				});

			updateLastScrollY(window.scrollY);
		};

		/**
		 * Get window current y position.
		 *
		 * @return {number} y position
		 */
		const windowCurrentYPosition = () => {
			return window.innerHeight;
		};

		/**
		 * Get all image elements inside table.
		 *
		 * @param {Array} allTables table array
		 * @return {Array} table image elements
		 */
		const getAllTableImages = (allTables) => {
			return allTables.reduce((carry, tableElement) => {
				const images = Array.from(tableElement.querySelectorAll('.wptb-lazy-load-img'));
				carry.push(...images);
				return carry;
			}, []);
		};

		/**
		 * Assign lazy load functionality to table elements.
		 */
		const assignLazyLoadToElements = () => {
			const tables = Array.from(document.querySelectorAll('.wptb-preview-table'));

			// tables under shadow roots
			const shadowTables = Array.from(document.querySelectorAll('.wptb-shadow-root-container')).reduce(
				(carry, shadowRootContainer) => {
					const table = shadowRootContainer.shadowRoot.querySelector('.wptb-preview-table');
					if (table) {
						carry.push(table);
					}
					return carry;
				},
				[]
			);

			const allTables = [...tables, ...shadowTables];
			const allImages = getAllTableImages(allTables);

			// process image elements on window load
			processImageElements(allImages, windowCurrentYPosition(), true);

			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.addEventListener(
				'scroll',
				() => {
					processImageElements(allImages, windowCurrentYPosition());
				},
				{ passive: true }
			);
		};

		/**
		 * Initialize lazy load.
		 *
		 * @param {Object} initOptions options object
		 */
		this.init = (initOptions) => {
			if (initOptions && typeof initOptions === 'object') {
				options = { ...options, ...initOptions };

				if (options.enabled) {
					assignLazyLoadToElements();
				}
			}
		};
	}

	// eslint-disable-next-line camelcase
	return new WPTB_LazyLoad();
});
