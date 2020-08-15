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
	},
	data() {
		return {
			startupValue: null,
			targetElements: [],
			elementMainValue: '',
			mountedDataUpdate: false,
		};
	},
	mounted() {
		// find and retrieve selector elements
		if (this.selectors.length > 0) {
			const operationObj = selectorOperations.getAllValues(this.selectors);
			this.targetElements = operationObj.elements;
			this.startupValue = operationObj.startupValue;
		}
	},
	methods: {
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
		 * @param {object} selectorObj selector object
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
		 * @param checkMountedState whether to check if value is updated at mounted hook. This check can be done to make sure assigning default value or saved value that has been fetched from the target selector element will not set the table as dirty at mount.
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
	},
};

/**
 * @module ControlBase module
 */
export default ControlBase;
