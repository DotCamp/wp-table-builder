<!--
Number input component that add a string value to the end of input while keeping the value non post fixed.
Has a functionality to enable updating data on enter keydown instead of value input.

* @v-model
* Events emitted:
**	- valueChanged
-->

<template>
	<input
		:data-wptb-text-disabled="$attrs.disabled"
		type="text"
		:value="postFixIt"
		@input="handleOnInput"
		@keydown.prevent.up="handleKeyPress('up')"
		@keydown.prevent.down="handleKeyPress('down')"
		@keydown.prevent.enter="handleEnterInput"
		:style="dynamicWidth"
		:disabled="$attrs.disabled"
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
			type: null,
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
		min: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 1000,
		},
		step: {
			type: Number,
			default: 1,
		},
		enableLimit: {
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
		 * Retrieve integer from a string in the base of 10 and limit it between min/max values of the component.
		 *
		 * @param {number|string} val value
		 * @return {number} retrieved integer
		 */
		getValue(val) {
			let parsedValue = Number.parseFloat(val);

			// get rid of unnecessary decimal points by fixing the number based on step value
			const regex = new RegExp(/^([0-9]+)\.([0-9]+)/, 'g');
			const match = regex.exec(this.step.toString());
			if (match) {
				const decimalPoint = match[2].length;
				parsedValue = Number.parseFloat(parsedValue.toFixed(decimalPoint));
			}

			// eslint-disable-next-line no-restricted-globals
			parsedValue = isNaN(parsedValue) ? 0 : parsedValue;

			return this.enableLimit ? this.limitValue(parsedValue) : parsedValue;
		},
		/**
		 * Limit given value between min/max properties of the component.
		 *
		 * @param {number} val value to be limited
		 */
		limitValue(val) {
			if (val < this.min) {
				return this.min;
			}
			if (val > this.max) {
				return this.max;
			}
			return val;
		},
		/**
		 * Handle input value change.
		 *
		 * @param {Event} e input event
		 */
		handleOnInput(e) {
			// don't update prop data if only enter key update is enabled
			if (!this.onlyEnter) {
				this.$emit('valueChanged', this.getValue(e.target.value));
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
				this.$emit('valueChanged', this.getValue(e.target.value));
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
			let value = this.getValue(this.innerValue);

			switch (type) {
				case 'up':
					value += this.step;
					break;
				case 'down':
					value -= this.step;
					break;
				default:
					value += this.step;
					break;
			}

			value = this.getValue(value);

			this.$emit('valueChanged', value);
		},
	},
};
</script>
