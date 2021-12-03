<template>
	<div class="wptb-number-postfix-buttons-wrapper">
		<div
			class="wptb-number-postfix-button wptb-plugin-box-shadow-xl wptb-unselectable"
			data-type="decrement"
			@click.prevent="affectValue"
		>
			-
		</div>
		<number-postfix-input
			:class="$attrs['input-class']"
			v-bind="$attrs"
			v-model="innerValue"
			:min="min"
			:max="max"
		></number-postfix-input>
		<div
			class="wptb-number-postfix-button wptb-plugin-box-shadow-xl wptb-unselectable"
			data-type="increment"
			@click.prevent="affectValue"
		>
			+
		</div>
	</div>
</template>

<script>
import NumberPostfixInput from '$Components/NumberPostfixInput';

export default {
	props: {
		value: {
			type: Number,
			default: 0,
		},
		buttonStep: {
			type: Number,
			default: 10,
		},
		min: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 100,
		},
	},
	model: {
		prop: 'value',
		event: 'modelChanged',
	},
	inheritAttrs: false,
	components: { NumberPostfixInput },
	mounted() {
		this.$nextTick(() => {
			this.innerValue = this.value;
		});
	},
	data() {
		return {
			innerValue: 0,
		};
	},
	watch: {
		value(n) {
			this.innerValue = this.limitValue(n, this.min, this.max);
		},
		innerValue(n) {
			this.innerValue = this.limitValue(n, this.min, this.max);
			this.$emit('modelChanged', this.innerValue);
		},
	},
	methods: {
		affectValue(e) {
			const operation = e.target.dataset.type === 'increment' ? 1 : -1;

			let rangeValues = [...new Array(Math.floor(this.max / this.buttonStep))].map((_, i) => {
				return (i + 1) * this.buttonStep;
			});

			rangeValues.push(this.innerValue);
			rangeValues.sort((a, b) => {
				return a - b;
			});
			rangeValues = Array.from(new Set(rangeValues));

			const indexOfValue = rangeValues.indexOf(this.innerValue);
			this.innerValue = rangeValues[this.limitValue(indexOfValue + operation, 0, rangeValues.length - 1)];
		},
		limitValue(val, min, max) {
			if (val < min) {
				return min;
			}
			if (val > max) {
				return max;
			}

			return val;
		},
	},
};
</script>
