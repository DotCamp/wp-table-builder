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
			default: [],
		},
	},
	data() {
		return {
			startupValue: null,
			targetElements: [],
		};
	},
	mounted() {
		// find and retrieve selector elements
		if (this.selectors) {
			const operationObj = selectorOperations.getAllValues(this.selectors);
			this.targetElements = operationObj.elements;
			this.startupValue = operationObj.startupValue;
		}
	},
	methods: {
		/**
		 * Sets the value of the selector object
		 *
		 * @param {object} selectorObj selector object
		 * @param {any} value value to be set
		 */
		setTargetValue(selectorObj, value) {
			selectorOperations.setTargetValue(selectorObj, value);
		},
		/**
		 * Sets the current table as modified
		 */
		setTableDirty() {
			new WPTB_TableStateSaveManager().tableStateSet();
		},
	},
};

/**
 * @module ControlBase module
 */
export default ControlBase;
