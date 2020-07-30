<template>
	<div class="wptb-side-control-input-wrapper">
		<div class="wptb-side-control-header">
			{{ label | cap }}
		</div>
		<div>
			<input class="wptb-side-control-main-input" type="number" v-model="innerValue" :disabled="disabled" />
		</div>
	</div>
</template>
<script>
export default {
	props: {
		label: {
			type: String,
			default: 'top',
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
	model: {
		prop: 'value',
		event: 'valueChanged',
	},
	mounted() {
		this.innerValue = this.value;
	},
	data() {
		return {
			innerValue: 0,
		};
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
