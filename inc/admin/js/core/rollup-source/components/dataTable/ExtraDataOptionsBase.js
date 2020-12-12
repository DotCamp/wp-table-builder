export default {
	props: {
		columnBindings: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	methods: {
		getColumnBinding(subIndex, defaultBinding = '') {
			let binding = defaultBinding;
			if (this.columnBindings[subIndex]) {
				binding = this.columnBindings[subIndex];
			}
			return binding;
		},
		valueChanged(eventObject) {
			this.$emit('valueChanged', eventObject);
		},
	},
};
