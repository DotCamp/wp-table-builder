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
			perspective: 1000,
			flashColor: '#FFFFFF',
		};

		// merged instance options
		const instanceOptions = { ...defaults, ...options };

		/**
		 * Style tag id for custom stylesheet rules.
		 *
		 * @type {string}
		 */
		const styleId = 'wptb-lazy-load-styles';

		const bufferElementClass = 'wptb-lazy-load-buffer-element';
		const bufferElementContainerClass = 'wptb-lazy-load-buffer-element-container';

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
		 * @param {boolean} invert whether to invert axis
		 *
		 * @return {string} axis name
		 */
		this.calculateAnimationDirection = (invert = false) => {
			const xAxis = ['left', 'right'];
			const names = ['X', 'Y'];
			const indexConstant = invert ? 1 : 0;

			return xAxis.includes(instanceOptions.direction)
				? names[(0 + indexConstant) % 2]
				: names[(1 + indexConstant) % 2];
		};

		/**
		 * Calculate a direction constant.
		 *
		 * @param {boolean} invert whether to invert constant
		 *
		 * @return {number} direction constant
		 */
		this.calculateDirectionConstant = (invert = false) => {
			const positiveConstant = ['left', 'up'];
			return (invert ? -1 : 1) * (positiveConstant.includes(this.getOptions().direction) ? 1 : -1);
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
		 * Get buffer element.
		 *
		 * @param {HTMLElement} imgElement image element
		 * @return {null | HTMLElement} buffer element
		 */
		this.getBufferElement = (imgElement) => {
			const { parentNode } = imgElement;
			return parentNode.querySelector(`.${bufferElementClass}`);
		};

		/**
		 * Remove buffer element and associated options.
		 *
		 * @param {HTMLElement} imgElement image element
		 */
		this.removeBufferElement = (imgElement) => {
			const bufferElement = this.getBufferElement(imgElement);
			if (bufferElement) {
				const { parentNode } = bufferElement;
				parentNode.removeChild(bufferElement);
				parentNode.classList.remove(bufferElementContainerClass);
			}
		};

		/**
		 * Add style element to document head.
		 *
		 * @param {string} content style content
		 * @param {HTMLDocument} contentRoot content root
		 */
		this.addStylesheet = (content, contentRoot) => {
			let lazyloadStyleSheet = contentRoot.querySelector(`style[id="${styleId}"]`);

			if (!lazyloadStyleSheet) {
				lazyloadStyleSheet = contentRoot.createElement('style');
				lazyloadStyleSheet.id = styleId;
				lazyloadStyleSheet.type = 'text/css';

				contentRoot.head.appendChild(lazyloadStyleSheet);
			}

			const styleRules = document.createTextNode(content);
			lazyloadStyleSheet.innerHTML = '';
			lazyloadStyleSheet.appendChild(styleRules);
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
		/* eslint-disable no-param-reassign */
		none: {
			hooks: {
				animate(imageElement) {
					this.removeBufferElement(imageElement);
				},
			},
		},
		slideIn: {
			hooks: {
				beforeAnimation(imageElement) {
					imageElement.parentNode.style.overflow = 'hidden';

					imageElement.style.transform = `translate${this.calculateAnimationDirection()}(${
						this.calculateDirectionConstant() * 100
					}%)`;
				},
				animate(imageElement) {
					this.removeBufferElement(imageElement);
					imageElement.style.transition = `transform ${this.calculateDuration()}s ease-out`;
					imageElement.style.transform = `translate${this.calculateAnimationDirection()}(0)`;
				},
			},
		},
		growSling: {
			hooks: {
				beforeAnimation(imageElement) {
					imageElement.style.transform = 'scale(0.1)';
				},
				animate(imageElement) {
					this.removeBufferElement(imageElement);
					imageElement.style.transition = `transform ${this.calculateDuration()}s cubic-bezier(0.68, -0.55, 0.27, 1.55)`;
					imageElement.style.transform = 'scale(1)';
				},
			},
		},
		flash: {
			hooks: {
				beforeAnimation(imageElement) {
					const flashElement = document.createElement('div');
					flashElement.classList.add('wptb-flash-element');

					imageElement.parentNode.classList.add('wptb-lazy-load-buffer-element-container');
					imageElement.insertAdjacentElement('afterend', flashElement);

					const flashStyle = `@keyframes wptb-flash {0% {opacity:1;}100% {opacity: 0;}}  .wptb-flash-element {position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; background-color: ${
						this.getOptions().flashColor
					}}.wptb-flash-animation {animation: wptb-flash ${this.calculateDuration()}s  forwards ease-out}`;
					this.addStylesheet(flashStyle, imageElement.ownerDocument);
				},
				animate(imageElement) {
					this.removeBufferElement(imageElement);
					const flashElement = imageElement.parentNode.querySelector('.wptb-flash-element');
					if (flashElement) {
						imageElement.parentNode.classList.add('wptb-lazy-load-buffer-element-container');

						flashElement.addEventListener('animationend', (e) => {
							if (e.animationName === 'wptb-flash') {
								imageElement.parentNode.classList.remove('wptb-lazy-load-buffer-element-container');
								flashElement.remove();
							}
						});

						flashElement.classList.add('wptb-flash-animation');
					}
				},
			},
		},
		flip: {
			hooks: {
				beforeAnimation(imageElement) {
					const parentWrapper = imageElement.parentNode;
					parentWrapper.classList.add('wptb-lazy-load-card-container');
					// eslint-disable-next-line no-unused-expressions
					parentWrapper.parentNode?.classList.add('wptb-lazy-load-perspective-base');

					imageElement.classList.add('wptb-lazy-load-card-back', 'wptb-lazy-load-hidden-backface');

					this.getBufferElement(imageElement).classList.add(
						'wptb-lazy-load-hidden-backface',
						'wptb-lazy-load-card-front'
					);

					const animationDirection = this.calculateAnimationDirection(true);
					const rotationAmount = `${this.calculateDirectionConstant(true) * 180}deg`;

					const styles = `.wptb-lazy-load-perspective-base{perspective: ${
						this.getOptions().perspective
					}px;} .wptb-lazy-load-card-container{ transform-style: preserve-3d; transition: transform ${this.calculateDuration()}s ease-out;  } .wptb-lazy-load-card-container[data-wptb-card-flip='true']{transform: rotate${animationDirection}(${rotationAmount})} [data-wptb-card-flip='true'] .wptb-lazy-load-card-front svg{ animation: none !important;  opacity: 0.2;} .wptb-lazy-load-card-back { transform: rotate${animationDirection}(${rotationAmount})} .wptb-lazy-load-hidden-backface{backface-visibility: hidden;}`;
					this.addStylesheet(styles, imageElement.ownerDocument);
				},
				animate(imageElement) {
					const parentWrapper = imageElement.parentNode;
					parentWrapper.addEventListener('transitionend', (e) => {
						if (e.propertyName === 'transform') {
							this.removeBufferElement(imageElement);
						}
						parentWrapper.classList.remove('wptb-lazy-load-card-container', 'wptb-lazy-load-flip');

						// eslint-disable-next-line no-unused-expressions
						parentWrapper.parentNode.classList.remove('wptb-lazy-load-perspective-base');

						imageElement.classList.remove('wptb-lazy-load-card-back', 'wptb-lazy-load-hidden-backface');
					});

					parentWrapper.dataset.wptbCardFlip = 'true';
				},
			},
		},
		/* eslint-enable no-param-reassign */
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
			// check position data of parent node instead of image element since a transformation affecting Y position of element might occurred
			const { top, height, bottom } = imgElement.parentNode.getBoundingClientRect();
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
		 * Function to call when image element is loaded.
		 *
		 * @param {Object} e event
		 */
		const imageElementLoadCallback = (e) => {
			const imageElement = e.target;

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
				const delayCallback = () => {
					setTimeout(() => {
						imageElementLoadCallback({ target: imgElement });
					}, options.delay * 1000);
				};

				// eslint-disable-next-line no-param-reassign
				imgElement.dataset.wptbLazyLoadStatus = 'true';

				imgElement.addEventListener('load', options.delay ? delayCallback : imageElementLoadCallback);

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
						perspective: options.imageLoadAnimationPerspective,
						...options,
					});
					assignLazyLoadToElements();
				}
			}
		};
	}

	// eslint-disable-next-line camelcase
	return new WPTB_LazyLoad();
});
