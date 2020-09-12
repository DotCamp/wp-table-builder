<template>
	<div class="wptb-prebuilt-control" :data-orientation="orientation">
		<div
			class="wptb-prebuilt-control-increment-box wptb-unselectable"
			:disabled="disabled || hitToMin()"
			@click.prevent="effectValue(-1 * step)"
		>
			-
		</div>
		<input
			class="wptb-prebuilt-control-input"
			:value="innerValue"
			@input="valueChanged"
			:disabled="disabled === true"
		/>
		<div
			class="wptb-prebuilt-control-increment-box wptb-unselectable"
			:disabled="disabled || hitToMax()"
			@click.prevent="effectValue(step)"
		>
			+
		</div>
	</div>
</template>
<script>
export default {
	props: {
		orientation: {
			type: String,
			default: 'row',
		},
		value: {
			type: Number,
			default: 0,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		min: {
			type: Number,
			default: 1,
		},
		max: {
			type: Number,
			default: 30,
		},
		step: {
			type: Number,
			default: 1,
		},
	},
	data() {
		return {
			innerValue: 0,
		};
	},
	mounted() {
		this.innerValue = this.toNumber(this.value);
	},
	watch: {
		value(n) {
			this.innerValue = n;
		},
		innerValue(n) {
			this.$emit('input', this.limitVal(n));
			this.innerValue = this.limitVal(n);
		},
	},
	methods: {
		valueChanged(e) {
			this.innerValue = this.toNumber(e.target.value);
		},
		toNumber(n) {
			return Number.parseInt(n, 10);
		},
		limitVal(n) {
			if (n > this.max) {
				return this.max;
			}
			if (n < this.min) {
				return this.min;
			}
			return n;
		},
		hitToMax() {
			return this.innerValue === this.max;
		},
		hitToMin() {
			return this.innerValue === this.min;
		},
		effectValue(effect) {
			if (!this.disabled) {
				this.innerValue += effect;
			}
		},
	},
};
</script>
