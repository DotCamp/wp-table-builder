<!--
Number input component that add a string value to the end of input while keeping the value non post fixed.
Has a functionality to enable updating data on enter keydown instead of value input.

* @v-model
* Events emitted:
**	- valueChanged
-->

<template>
	<input
		type="text"
		:value="postFixIt"
		@input="handleOnInput"
		@keydown.prevent.up="handleKeyPress('up')"
		@keydown.prevent.down="handleKeyPress('down')"
		@keydown.prevent.enter="handleEnterInput"
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
		// with this prop is enabled, width of the component will be calculated according to its contents
		enableDynamicWidth: {
			type: Boolean,
			default: false,
		},
		// extra padding value that will be applied to input element
		dynamicWidthPadding: {
			type: Number,
			default: 3,
		},
		// only enable data update with enter key down
		onlyEnter: {
			type: Boolean,
			default: false,
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
		/**
		 * Calculate width of input element according to its contents.
		 */
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
		/**
		 * Handle input value change.
		 *
		 * @param {Event} e input event
		 */
		handleOnInput(e) {
			// don't update prop data if only enter key update is enabled
			if (!this.onlyEnter) {
				this.$emit('valueChanged', Number.parseInt(e.target.value, 10));
			}
		},
		/**
		 * Handle enter value change.
		 *
		 * @param {Event} e input event
		 */
		handleEnterInput(e) {
			// only update prop data if enter key update is enabled
			if (this.onlyEnter) {
				this.$emit('valueChanged', Number.parseInt(e.target.value, 10));
			}
		},
		/**
		 * Handle key press event for input
		 *
		 * This callback will give up/down arrow key press incrementation to input.
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
