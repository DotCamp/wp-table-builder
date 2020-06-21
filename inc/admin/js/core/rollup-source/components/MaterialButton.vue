<template>
	<div @click.prevent="click" class="wptb-plugin-button-material" :class="buttonClass"><slot></slot></div>
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
	},
	computed: {
		buttonClass() {
			return [`wptb-plugin-button-material-${this.size}`];
		},
	},
};
</script>
