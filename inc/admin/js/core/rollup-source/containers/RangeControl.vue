<template>
	<div>
		<div class="wptb-settings-item-header">{{ label }}</div>
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
					v-model="elementMainValue"
				/>
			</div>
			<div class="wptb-settings-col-xs-4">
				<input
					type="number"
					v-model="elementMainValue"
					class="wptb-size-number wptb-number-input wptb-element-property"
					:min="min"
					:max="max"
					:step="step"
					:class="uniqueId"
					:data-element="elemContainer"
					data-type="range"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import ControlBase from '../mixins/ControlBase';

export default {
	props: {
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
		defaultValue: {
			type: Number,
			default: 1,
			required: false,
		},
		suffix: {
			type: String,
			default: '',
			required: false,
		},
	},
	mixins: [ControlBase],
	mounted() {
		this.assignDefaultValue();
	},
	watch: {
		elementMainValue(n) {
			if (this.suffix !== '') {
				const suffixTestRegex = new RegExp(`^(.+)${this.suffix}$`, 'g');
				const testResult = suffixTestRegex.exec(n);

				if (testResult) {
					this.elementMainValue = testResult[1];
					return;
				}
			}

			let clampedValue = this.clampValue(n);

			// add suffix to final value before applying it to selectors
			if (this.suffix !== '') {
				clampedValue += this.suffix;
			}

			this.setAllValues(clampedValue);
			// check to see if this update occurs from startup data retrieval, if it is, don't mark table as dirty
			this.generateChangeEvent(clampedValue);

			this.setTableDirty(true);
		},
	},
	methods: {
		/**
		 * Clamp the value between min/max range.
		 *
		 * @param {Number} val value
		 * @returns {number} clamped value
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
