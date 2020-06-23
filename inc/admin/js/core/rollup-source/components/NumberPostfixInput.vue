<template>
	<input
		type="text"
		:value="postFixIt"
		@input="handleInput"
		@keydown.prevent.up="handleKeyPress('up')"
		@keydown.prevent.down="handleKeyPress('down')"
		:style="dynamicWidth"
	/>
</template>
<script>
export default {
	inheritAttrs: false,
	props: {
		postFix: {
			type: String,
			default: '',
		},
		value: {
			type: Number,
			default: 0,
		},
		enableDynamicWidth: {
			type: Boolean,
			default: false,
		},
		dynamicWidthPadding: {
			type: Number,
			default: 3,
		},
	},
	model: {
		prop: 'value',
		event: 'valueChanged',
	},
	watch: {
		value(n) {
			this.innerValue = n;
		},
	},
	data() {
		return {
			innerValue: 0,
		};
	},
	mounted() {
		this.innerValue = this.value;
	},
	computed: {
		/**
		 * Add a post fix to the value.
		 *
		 * Value will be chosen from the component prop.
		 */
		postFixIt() {
			return `${this.innerValue}${this.postFix}`;
		},
		dynamicWidth() {
			if (this.enableDynamicWidth) {
				return {
					width: `calc(${
						this.innerValue.toString().length + this.postFix.length + this.dynamicWidthPadding
					}ch) !important`,
				};
			}
			return {};
		},
	},
	methods: {
		handleInput(e) {
			this.$emit('valueChanged', Number.parseInt(e.target.value, 10));
		},
		/**
		 * Handle key press event for input
		 *
		 * This callback will give up/down arrow key press incrementation to input
		 *
		 * @param {string} type type of key
		 */
		handleKeyPress(type = 'up') {
			let value = this.innerValue;

			switch (type) {
				case 'up':
					value += 1;
					break;
				case 'down':
					value -= 1;
					break;
				default:
					value += 1;
					break;
			}

			this.$emit('valueChanged', value);
		},
	},
};
</script>
