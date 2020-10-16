<template>
	<div class="wptb-range-input-wrapper">
		<div class="wptb-settings-item-header wptb-text-transform-cap" :data-wptb-text-disabled="disabled">
			{{ label }}
		</div>
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<div class="wptb-settings-col-xs-8">
				<input
					class="wptb-element-property wptb-size-slider"
					type="range"
					:class="uniqueId"
					:data-element="elemContainer"
					data-type="range"
					:min="min"
					:max="max"
					:step="step"
					v-model="innerElementMainValue"
					:disabled="disabled"
				/>
			</div>
			<div class="wptb-settings-col-xs-4">
				<number-postfix-input
					:disabled="disabled"
					v-model="innerElementMainValue"
					:post-fix="postFix"
					:only-enter="true"
					class="wptb-size-number wptb-number-input wptb-element-property"
					style="text-align: center;"
					:min="min"
					:max="max"
					:class="uniqueId"
					:data-element="elemContainer"
					:step="step"
					:enable-limit="clamp"
					data-type="range"
				>
				</number-postfix-input>
			</div>
		</div>
	</div>
</template>

<script>
import NumberPostfixInput from './NumberPostfixInput';

export default {
	components: { NumberPostfixInput },
	props: {
		label: {
			type: String,
			default: '',
		},
		uniqueId: {
			type: String,
			default: '',
		},
		elemContainer: {
			type: String,
			default: '',
		},
		min: {
			type: Number,
			default: 1,
			required: false,
		},
		max: {
			type: Number,
			default: 10,
			required: false,
		},
		step: {
			type: Number,
			default: 1,
			required: false,
		},
		elementMainValue: {
			type: null,
		},
		postFix: {
			type: String,
			default: '',
		},
		clamp: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	model: {
		prop: 'elementMainValue',
		event: 'valueChanged',
	},
	data() {
		return {
			innerElementMainValue: 0,
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.innerElementMainValue = this.elementMainValue;
		});
	},
	watch: {
		elementMainValue() {
			this.innerElementMainValue = this.elementMainValue;
		},
		innerElementMainValue(n) {
			this.$emit('valueChanged', this.clamp ? this.clampValue(n) : n);
		},
	},
	methods: {
		/**
		 * Clamp the value between min/max range.
		 *
		 * @param {number} val value
		 * @return {number} clamped value
		 */
		clampValue(val) {
			if (val < this.min) {
				return this.min;
			}
			if (val > this.max) {
				return this.max;
			}
			return val;
		},
	},
};
</script>
