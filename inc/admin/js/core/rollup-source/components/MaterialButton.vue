<template>
	<div
		@click.prevent="handleClick"
		class="wptb-plugin-button-material"
		:data-type="type"
		:class="buttonClass"
		:data-disabled="disabled"
	>
		<slot></slot>
	</div>
</template>
<script>
export default {
	props: {
		click: {
			type: Function,
			default: () => {
				// eslint-disable-next-line no-console
				console.log('Material button clicked');
			},
		},
		size: {
			type: String,
			default: 'fit-content',
		},
		type: {
			type: String,
			default: 'default',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		buttonClass() {
			return [`wptb-plugin-button-material-${this.size}`];
		},
	},
	methods: {
		handleClick() {
			this.$emit('buttonClicked');
			this.click();
		},
	},
};
</script>
