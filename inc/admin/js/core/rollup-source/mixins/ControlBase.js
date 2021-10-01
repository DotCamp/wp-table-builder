import selectorOperations from '../functions/selector';

/**
 * Base mixin for control items
 */
const ControlBase = {
	props: {
		label: String,
		selectors: {
			type: Array,
			required: false,
			default: () => {
				return [];
			},
		},
		defaultValue: null,
		uniqueId: {
			type: String,
			required: false,
			default: '',
		},
		elemContainer: {
			type: String,
			required: false,
			default: '',
		},
		appearDependOnControl: {
			type: Object,
			required: false,
			default: () => {
				return {};
			},
		},
	},
	data() {
		return {
			startupValue: null,
			targetElements: [],
			elementMainValue: '',
			mountedDataUpdate: false,
			tableSettings: { settings: {} },
			componentVisibility: true,
			cachedDependedValues: {},
			// change this value to true on expanded component to automatically assign default values at component mounted state
			assignDefaultValueAtMount: false,
		};
	},
	watch: {
		'tableSettings.settings': {
			handler() {
				this.updateComponentVisibility();
			},
			deep: true,
		},
		cachedDependedValues: {
			handler() {
				this.calculateComponentVisibility();
			},
			deep: true,
		},
	},
	mounted() {
		// find and retrieve selector elements
		if (this.selectors.length > 0) {
			// const operationObj = selectorOperations.getAllValues(this.selectors);
			// this.targetElements = operationObj.elements;
			const operationObj = this.getTargetElements();
			this.startupValue = operationObj.startupValue;
		}

		this.$nextTick(() => {
			this.tableSettings = WPTB_ControlsManager.getTableSettings();
			this.getInputLoadedValues();
			if (this.assignDefaultValueAtMount) {
				this.assignDefaultValue();
			}

			this.subscribeToDependentControls();
		});

		// register control base instance to controls manager
		WPTB_ControlsManager.registerControlBase(this);
	},
	methods: {
		calculateComponentVisibilityOnDependentControls(valueToExpect) {
			return (controlId, value) => {
				this.componentVisibility = valueToExpect === value;
			};
		},
		subscribeToDependentControls() {
			if (this.$root.$data.dependsOnElementControl) {
				const dependsData = this.$root.$data.dependsOnElementControl;
				// eslint-disable-next-line array-callback-return
				Object.keys(dependsData).map((controlId) => {
					if (Object.prototype.hasOwnProperty.call(dependsData, controlId)) {
						WPTB_ControlsManager.subscribeToElementControl(
							this.uniqueId,
							this.$root.$data.elemContainer,
							controlId,
							this.calculateComponentVisibilityOnDependentControls(dependsData[controlId])
						);
					}
				});
			}
		},
		calculateComponentVisibility() {
			this.componentVisibility = Object.keys(this.appearDependOnControl).every((controlName) => {
				if (Object.prototype.hasOwnProperty.call(this.appearDependOnControl, controlName)) {
					if (Object.keys(this.cachedDependedValues).includes(controlName)) {
						return this.cachedDependedValues[controlName] === this.appearDependOnControl[controlName];
					}
					return false;
				}

				return false;
			});
		},
		getInputLoadedValues() {
			const leftPanel = document.querySelector('.wptb-panel-left');
			const allInputs = Array.from(leftPanel.querySelectorAll('.wptb-element-property'));

			// eslint-disable-next-line array-callback-return
			allInputs.map((input) => {
				const classList = input.getAttribute('class');
				// eslint-disable-next-line array-callback-return
				Object.keys(this.appearDependOnControl).map((d) => {
					if (classList) {
						if (classList.includes(d)) {
							let val = input.value;
							if (input.type === 'checkbox') {
								val = input.checked ? 'checked' : 'unchecked';
							}
							this.$set(this.cachedDependedValues, d, val);
						}
					}
				});
			});
		},
		updateComponentVisibility() {
			if (this.tableSettings.settings) {
				// eslint-disable-next-line array-callback-return
				Object.keys(this.tableSettings.settings).map((s) => {
					if (Object.prototype.hasOwnProperty.call(this.tableSettings.settings, s)) {
						if (Object.keys(this.appearDependOnControl).includes(s)) {
							this.$set(this.cachedDependedValues, s, this.tableSettings.settings[s]);
						}
					}
				});
			}
		},
		/**
		 * Get target elements of the selector.
		 *
		 * @return {null|Object} null if no selector is defined or operation object
		 */
		getTargetElements() {
			if (this.selectors.length > 0) {
				const operationObj = selectorOperations.getAllValues(this.selectors);
				this.targetElements = operationObj.elements;
				return operationObj;
			}
			return null;
		},
		/**
		 * Generate a control value changed event.
		 *
		 * @param {any} value value to be emitted
		 */
		generateChangeEvent(value) {
			// eslint-disable-next-line array-callback-return
			this.targetElements.map((t) => {
				// eslint-disable-next-line array-callback-return
				t.elements.map((el) => {
					WPTB_Helper.wptbDocumentEventGenerate(`wptb-control:${this.uniqueId}`, el, {
						value,
					});
				});
			});

			if (this.uniqueId && this.$root.$data.elemContainer) {
				const parsedControlId = this.uniqueId.match(/^(?<elementId>.+)-(?<controlId>.+)$/);

				if (parsedControlId) {
					const { controlId } = parsedControlId.groups;
					if (controlId) {
						WPTB_Helper.wptbDocumentEventGenerate('wptb-element-control:update', document, {
							elementId: this.$root.$data.elemContainer,
							controlId,
							value,
						});
					}
				}
			}
		},
		/**
		 * Assign startup value of default selector to the main element value.
		 *
		 * This startup value will be fetched from the DOM element according to the default selector objects properties. If no startup value is found, then defaultValue prop will be used
		 */
		assignDefaultValue() {
			if (this.startupValue !== undefined && this.startupValue !== '' && this.startupValue !== null) {
				this.mountedDataUpdate = true;
				this.elementMainValue = this.startupValue;
			} else if (this.defaultValue !== null) {
				this.mountedDataUpdate = true;
				this.elementMainValue = this.defaultValue;
			}
		},
		/**
		 * Sets the value of the selector object.
		 *
		 * @param {Object} selectorObj selector object
		 * @param {any} value value to be set
		 */
		setTargetValue(selectorObj, value) {
			selectorOperations.setTargetValue(selectorObj, value);
		},

		/**
		 * Set the value to all selector objects.
		 *
		 * @param {any} value value to be assigned to all selector objects
		 */
		setAllValues(value) {
			selectorOperations.setAllValues(this.targetElements, value);
		},

		/**
		 * Sets the current table as modified.
		 *
		 * @param {boolean} checkMountedState whether to check if value is updated at mounted hook. This check can be done to make sure assigning default value or saved value that has been fetched from the target selector element will not set the table as dirty at mount.
		 */
		setTableDirty(checkMountedState = false) {
			if (checkMountedState) {
				if (!this.mountedDataUpdate) {
					new WPTB_TableStateSaveManager().tableStateSet();
				}
			} else {
				new WPTB_TableStateSaveManager().tableStateSet();
			}

			this.mountedDataUpdate = false;
		},
		/**
		 * Reset mounted state of component.
		 */
		resetMountedState() {
			this.mountedDataUpdate = true;
		},

		/**
		 * Basic value update that will handle setting selector values, generating change event and setting table dirty.
		 *
		 * @param {*} val value
		 * @param {boolean} checkMountedState check for mounted state of component
		 */
		basicValueUpdate(val, checkMountedState = false) {
			this.setAllValues(val);
			this.generateChangeEvent(val);
			this.setTableDirty(checkMountedState);
		},
	},
};

/**
 * @module ControlBase module
 */
export default ControlBase;
