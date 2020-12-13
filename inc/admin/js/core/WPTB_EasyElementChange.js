/**
 * UMD setup.
 */
(function umdSetup(context, key, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})(self || global, 'WPTB_EasyElementChange', () => {
	/**
	 * Easily change current table elements.
	 *
	 * @class
	 */
	// eslint-disable-next-line camelcase
	function WPTB_EasyElementChange() {
		/**
		 * State object for reactive properties of component.
		 *
		 * @type {Object}
		 */
		const innerState = {
			initialized: false,
			currentNode: null,
			controlBase: null,
			currentElementType: null,
			elementList: [],
		};

		/**
		 * Watchlist for state changes.
		 *
		 * @type {Object}
		 */
		const watchList = {
			currentNode: (newValue) => {
				// eslint-disable-next-line no-use-before-define
				controlBaseVisibility(newValue !== null);

				calculateBasePosition();

				// get table element type of current active node
				if (newValue && newValue.classList.contains('wptb-ph-element')) {
				}
			},
			currentElementType: (newValue) => {
				this.state.controlBase.querySelector('.wptb-all-table-element-list').value = 'button';
			},
		};

		/**
		 * State handler for proxy operations.
		 *
		 * @type {Object}
		 */
		const stateHandler = {
			set(obj, target, val) {
				Reflect.set(...arguments);

				// call watch list function if there is any
				if (watchList[target]) {
					watchList[target](val);
				}
			},
		};

		/**
		 * Reactive state.
		 *
		 * @type {Object}
		 */
		this.state = new Proxy(innerState, stateHandler);

		/**
		 * Add component related controls to builder.
		 */
		const addControlsToBuilder = () => {
			if (!this.state.controlBase) {
				this.state.controlBase = document.createElement('div');
				this.state.controlBase.classList.add('wptb-easy-element-change-base');

				// prepare dropdown control options
				const fullOptions = Object.keys(this.state.elementList)
					.filter((el) => {
						return Object.prototype.hasOwnProperty.call(this.state.elementList, el);
					})
					.map((el) => {
						return `<option value="${el}">${this.state.elementList[el]}</option>`;
					})
					.join(' ');

				const selectControlStringified = `<select class="wptb-all-table-element-list">${fullOptions}</select>`;
				const range = document.createRange();
				range.setStart(this.state.controlBase, 0);
				[elementSelectDropdown] = Array.from(
					range.createContextualFragment(selectControlStringified).childNodes
				);

				this.state.controlBase.appendChild(elementSelectDropdown);

				// on mouse leave, also hide hovered effects on current table element node
				this.state.controlBase.addEventListener('mouseleave', () => {
					if (this.state.currentNode) {
						this.state.currentNode.classList.remove('wptb-directlyhovered');
					}
					controlBaseVisibility(false);
				});

				document.body.appendChild(this.state.controlBase);
			}
		};

		/**
		 * Calculate position of hover control group.
		 */
		const calculateBasePosition = () => {
			if (this.state.controlBase && this.state.currentNode) {
				const { x, y, height } = this.state.currentNode.getBoundingClientRect();
				const nodeBorderWidth = Number.parseInt(getComputedStyle(this.state.currentNode).borderWidth, 10);

				this.state.controlBase.style.left = `${x - nodeBorderWidth}px`;
				this.state.controlBase.style.top = `${y + height}px`;
			}
		};

		/**
		 * Change visibility of control base.
		 *
		 * @param {boolean} status visibility status
		 */
		const controlBaseVisibility = (status) => {
			if (this.state.controlBase) {
				this.state.controlBase.style.display = status ? 'unset' : 'none';
			}
		};

		/**
		 * Change active node.
		 *
		 * @param {Node} node current node
		 * @param {HTMLElement} relatedTarget related target element to table element event
		 */
		this.changeNode = (node, relatedTarget) => {
			addControlsToBuilder();

			// still show component controls and table element hovered visuals when component controls or action controls are hovered
			if (relatedTarget && relatedTarget.parentNode.classList.contains('wptb-easy-element-change-base')) {
				this.state.currentNode.classList.add('wptb-directlyhovered');
			} else {
				this.state.currentNode = node;
			}
		};

		/**
		 * Component init hook.
		 */
		this.init = () => {
			this.state.elementList = Array.from(document.querySelectorAll('.wptb-element[data-wptb-element]')).reduce(
				(carry, el) => {
					// eslint-disable-next-line no-param-reassign
					carry[el.dataset.wptbElement] = el.querySelector('p.wptb-draggable').textContent;
					return carry;
				},
				{}
			);
		};
	}

	// create a singleton instance of the plugin
	const singletonInstance = new WPTB_EasyElementChange();
	singletonInstance.init();

	return singletonInstance;
});
