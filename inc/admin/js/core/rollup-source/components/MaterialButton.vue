<template>
	<div
		:disabled="disabled"
		@click.prevent.stop.capture="handleClick"
		class="wptb-plugin-button-material"
		:class="buttonClass"
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
			if (!this.disabled) {
				this.click();
			}
		},
	},
};
</script>
