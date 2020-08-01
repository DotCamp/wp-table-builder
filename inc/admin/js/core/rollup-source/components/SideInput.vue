<template>
	<div class="wptb-side-control-input-wrapper wptb-side-control-number-input">
		<div class="wptb-side-control-header">
			{{ label | cap }}
		</div>
		<div>
			<input
				class="wptb-side-control-main-input"
				type="number"
				:value="innerValue"
				@input="inputChange"
				:disabled="disabled"
			/>
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
			this.$emit('valueChanged', Number.parseInt(n, 10));
		},
	},
	methods: {
		inputChange(e) {
			this.$emit('changedFromFront', this.$vnode.key, e.target.value);
			this.innerValue = e.target.value;
		},
	},
};
</script>
