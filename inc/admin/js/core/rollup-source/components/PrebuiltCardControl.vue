<template>
	<div class="wptb-prebuilt-control" :data-orientation="orientation">
		<div
			class="wptb-prebuilt-control-increment-box wptb-unselectable"
			:disabled="disabled"
			@click.prevent="effectValue(-1)"
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
			:disabled="disabled"
			@click.prevent="effectValue(1)"
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
			if (n <= 0) {
				return 1;
			}
			return n;
		},
		effectValue(effect) {
			if (!this.disabled) {
				this.innerValue += effect;
			}
		},
	},
};
</script>
