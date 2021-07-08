(function assignToGlobal(key, context, factory) {
	if (typeof exports === 'object' && typeof module !== 'undefined') {
		module.exports = factory();
	} else {
		context[key] = factory();
	}
	// eslint-disable-next-line no-restricted-globals
})('WPTB_LazyLoad', self || global, () => {
	/**
	 * Lazy load animation.
	 *
	 * @param {Object} options options
	 * @class
	 */
	function LazyLoadAnimation(options) {
		/**
		 * Default options.
		 *
		 * @type {Object}
		 */
		const defaults = {
			name: '',
			speed: 8,
			step: 10,
			hooks: {},
			direction: 'left',
		};

		const instanceOptions = { ...defaults, ...options };

		/**
		 * Get instance related options.
		 *
		 * @return {Object} options
		 */
		this.getOptions = () => {
			return { ...instanceOptions };
		};

		/**
		 * Calculate animation duration relative to its supplied speed.
		 *
		 * @param {number} min minimum seconds
		 * @param {number} max maximum seconds
		 * @return {number} animation duration
		 */
		this.calculateDuration = (min = 0.1, max = 1) => {
			return Math.max(min, max) - (Math.abs(max - min) / instanceOptions.step) * instanceOptions.speed;
		};

		/**
		 * Calculate animation direction axis.
		 *
		 * @return {string} axis name
		 */
		this.calculateAnimationDirection = () => {
			const xAxis = ['left', 'right'];

			return xAxis.includes(instanceOptions.direction) ? 'X' : 'Y';
		};

		/**
		 * Get supplied user hook.
		 *
		 * @param {string} key hook name
		 * @return {null | Function} user hook function
		 */
		const getHook = (key) => {
			if (Object.prototype.hasOwnProperty.call(instanceOptions.hooks, key)) {
				const userHook = instanceOptions.hooks[key];
				if (typeof userHook === 'function') {
					return userHook;
				}
			}

			return null;
		};

		/**
		 * Call supplied user hook.
		 *
		 * @param {string} hookName hook name
		 * @param {any} args arguments to call hook
		 */
		const callHook = (hookName, ...args) => {
			const userHook = getHook(hookName);
			if (userHook) {
				userHook.apply(this, args);
			}
		};

		/**
		 * Delete instance.
		 */
		const cleanUp = () => {
			delete this;
		};

		/**
		 * Before animation base lifecycle hook.
		 *
		 * @param {HTMLElement} imgElement image element
		 */
		this.beforeAnimation = (imgElement) => {
			callHook('beforeAnimation', imgElement);
		};

		/**
		 * Animate element.
		 *
		 * @param {HTMLElement} imgElement image element
		 */
		this.animate = (imgElement) => {
			callHook('animate', imgElement);
		};

		/**
		 * After animation processes and cleanup.
		 *
		 * @param {HTMLElement} imgElement image element
		 */
		this.afterAnimation = (imgElement) => {
			callHook('afterAnimation', imgElement);
			cleanUp();
		};
	}

	/**
	 * Factory for lazy load animations.
	 *
	 * @param {Object} options factory options
	 * @class
	 */
	function LazyLoadAnimationFactory(options) {
		this.getAnimation = (animationName, extraOptions = {}) => {
			if (options[animationName]) {
				return new LazyLoadAnimation({ ...options[animationName], ...extraOptions });
			}

			return new LazyLoadAnimation({});
		};
	}

	/**
	 * Options for animation factory
	 *
	 * @type {Object}
	 */
	const factoryOptions = {
		slideIn: {
			hooks: {
				beforeAnimation(imageElement) {
					imageElement.parentNode.style.overflow = 'hidden';

					const positiveConstant = ['left', 'up'];
					const directionConstant = positiveConstant.includes(this.getOptions().direction) ? 1 : -1;

					imageElement.style.transform = `translate${this.calculateAnimationDirection()}(${
						directionConstant * 100
					}%)`;
				},
				animate(imageElement) {
					imageElement.style.transition = `transform ${this.calculateDuration()}s ease-out`;
					imageElement.style.transform = `translate${this.calculateAnimationDirection()}(0)`;
				},
			},
		},
	};

	/**
	 * WPTB Lazy load functionality module.
	 *
	 * @class
	 */
	// eslint-disable-next-line camelcase
	function WPTB_LazyLoad() {
		/**
		 * Lazy load default options.
		 *
		 * @type {Object}
		 */
		const defaultOptions = {
			// this mode will be used to manually load image elements
			forceMode: false,
		};

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

		/**
		 * All available table image elements.
		 *
		 * @type {Array}
		 */
		const allImages = [];

		const bufferElementClass = 'wptb-lazy-load-buffer-element';
		const bufferElementContainerClass = 'wptb-lazy-load-buffer-element-container';

		const animationFactory = new LazyLoadAnimationFactory(factoryOptions);

		/**
		 * Whether user scrolling down or up.
		 *
		 * @return {boolean} scrolling down or up
		 */
		const isGoingDown = () => {
			return window.scrollY - cachedScrollData.lastYPosition >= 0;
		};

		let animation = null;

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
				bufferElement.innerHTML = `<div class="wptb-lazy-load-buffer-icon-wrapper wptb-plugin-filter-box-shadow-md">${options.iconSvg}</div>`;

				const svgIcon = bufferElement.querySelector('svg');
				const iconWrapper = bufferElement.querySelector('.wptb-lazy-load-buffer-icon-wrapper');

				// assign icon size
				iconWrapper.style.width = `${options.iconSize}px`;
				iconWrapper.style.height = `${options.iconSize}px`;

				// assign icon animation related settings
				iconWrapper.dataset.wptbLazyLoadIconAnimation = options.iconAnimation;

				if (svgIcon) {
					// assign icon color
					svgIcon.style.fill = options.iconColor;
				}
			}

			// insert buffer element adjacent to image element
			imgElement.insertAdjacentElement('afterend', bufferElement);

			imgElement.parentNode.classList.add(bufferElementContainerClass);

			animation.beforeAnimation(imgElement);
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

		/**
		 * Function to call when image element is loaded.
		 *
		 * @param {Object} e event
		 */
		const imageElementLoadCallback = (e) => {
			const imageElement = e.target;

			imageElement.dataset.wptbLazyLoadStatus = 'true';

			// remove buffer element and associated options
			removeBufferElement(imageElement);

			animation.animate(imageElement);

			imageElement.removeEventListener('load', imageElementLoadCallback);

			animation.afterAnimation(imageElement);
		};

		/**
		 * Process image element for visibility.
		 *
		 * @param {HTMLElement} imgElement image element
		 * @param {number} currentYPos current position of page
		 */
		const processIndividualImageElement = (imgElement, currentYPos) => {
			if (options.forceMode || isElementVisible(imgElement, currentYPos)) {
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
		 * @param {boolean} forceLoad whether to force load images or not with force mode enabled
		 */
		const processImageElements = (imgElements, currentYPos, firstTimeProcess = false, forceLoad = false) => {
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

					if (!options.forceMode || forceLoad) {
						processIndividualImageElement(img, currentYPos);
					}
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
			allImages.push(...getAllTableImages(allTables));

			// process image elements on window load
			processImageElements(allImages, windowCurrentYPosition(), true);

			// only bind to scroll event if force mode is not enabled
			if (!options.forceMode) {
				// eslint-disable-next-line @wordpress/no-global-event-listener
				window.addEventListener(
					'scroll',
					() => {
						processImageElements(allImages, windowCurrentYPosition());
					},
					{ passive: true }
				);
			}
		};

		/**
		 * Force load all images.
		 */
		this.forceLoadImages = () => {
			processImageElements(allImages, null, false, true);
		};

		/**
		 * Initialize lazy load.
		 *
		 * @param {Object} initOptions options object
		 */
		this.init = (initOptions) => {
			if (initOptions && typeof initOptions === 'object') {
				options = { ...defaultOptions, ...initOptions };

				if (options.enabled) {
					animation = animationFactory.getAnimation(options.imageLoadAnimation, {
						speed: options.imageLoadAnimationSpeed,
						direction: options.imageLoadAnimationDirection,
					});
					assignLazyLoadToElements();
				}
			}
		};
	}

	// eslint-disable-next-line camelcase
	return new WPTB_LazyLoad();
});
