<template>
	<div class="wptb-color-picker-wrapper wptb-settings-row wptb-settings-middle-xs wptb-element-property">
		<div class="wptb-settings-space-between">
			<p class="wptb-settings-item-title wptb-text-transform-cap" :data-wptb-text-disabled="disabled">
				{{ label }}
			</p>
			<div class="wptb-color-picker-input-wrapper">
				<input class="wptb-color-picker-input" v-model="innerColor" type="color" :disabled="disabled" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: 'label',
		},
		color: {
			type: String,
			default: '#000000',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	model: {
		prop: 'color',
		event: 'colorChanged',
	},
	data() {
		return {
			innerColor: null,
		};
	},
	watch: {
		color(n) {
			this.innerColor = n === '' ? '#000000' : n;
		},
		innerColor(n) {
			this.$emit('colorChanged', n);
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.innerColor = this.color;
		});
	},
};
</script>
