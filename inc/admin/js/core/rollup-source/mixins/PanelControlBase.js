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
		dependsValue: {
			type: null,
			default: null,
		},
		dependsCallback: {
			type: Function,
			default: (d, c) => {
				return c;
			},
		},
		uniqueId: {
			type: String,
			default: '',
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
		dependsValue(n) {
			if (n === null) {
				return;
			}
			this.innerValue = this.dependsCallback.call(this, n, this.innerValue);
		},
	},
	mounted() {
		this.innerValue = this.value;
	},
	methods: {
		setInnerValue(val) {
			this.innerValue = val;
		},
	},
};

export default PanelControlBase;
