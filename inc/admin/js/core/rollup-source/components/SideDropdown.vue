<template>
	<div class="wptb-side-control-input-wrapper wptb-side-control-dropdown-wrapper">
		<select class="wptb-side-control-main-input wptb-side-control-dropdown" v-model="innerValue">
			<option v-for="option in options" :key="option" :value="option" :selected="isSelected(option)">
				{{ option }}
			</option>
		</select>
	</div>
</template>
<script>
export default {
	props: {
		value: {
			type: String,
			default: 'px',
		},
	},
	model: {
		prop: 'value',
		event: 'valueChanged',
	},
	data() {
		return {
			options: ['px', '%'],
			innerValue: '',
		};
	},
	mounted() {
		this.innerValue = this.value;
	},
	watch: {
		value(n) {
			this.innerValue = n;
		},
		innerValue(n) {
			this.$emit('valueChanged', n);
		},
	},
	methods: {
		isSelected(k) {
			return this.innerValue === k;
		},
	},
};
</script>
