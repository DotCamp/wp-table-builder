<template>
	<div class="wptb-nm-devtool-input">
		<div>{{ label }}</div>
		<select v-model="innerValue">
			<option v-for="(v, k) in options" :key="k" :value="v">{{ v }}</option>
		</select>
	</div>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: 'label',
		},
		value: {
			type: String,
			default: 'value',
		},
		options: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	model: {
		prop: 'value',
		event: 'valueChanged',
	},
	data() {
		return {
			innerValue: '',
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.innerValue = this.value;
		});
	},
	watch: {
		value(n) {
			this.innerValue = n;
		},
		innerValue(n) {
			this.$emit('valueChanged', n);
		},
	},
};
</script>
