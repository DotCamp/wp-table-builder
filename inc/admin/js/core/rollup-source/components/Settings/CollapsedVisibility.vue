<template>
	<div :style="style">
		<slot></slot>
	</div>
</template>

<script>
export default {
	props: {
		visible: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		style() {
			return {
				visibility: this.visible ? 'visible' : 'collapse',
			};
		},
	},
};
</script>
