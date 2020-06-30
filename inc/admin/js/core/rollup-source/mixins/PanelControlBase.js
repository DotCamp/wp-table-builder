/**
 * Base for left panel controls that will be hooked directly to Vue instances.
 */
const PanelControlBase = {
	props: {
		label: String,
		value: {
			type: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			innerValue: '',
		};
	},
	model: {
		prop: 'value',
		event: 'valueChanged',
	},
	watch: {
		value(n) {
			this.innerValue = n;
		},
		innerValue(n) {
			this.$emit('valueChanged', n);
		},
	},
};

export default PanelControlBase;
