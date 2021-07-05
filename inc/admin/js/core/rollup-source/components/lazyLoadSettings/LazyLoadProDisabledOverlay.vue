<template>
	<div v-if="visibility" class="wptb-lazy-load-pro-disabled-overlay" :style="style"><slot></slot></div>
</template>

<script>
export default {
	props: {
		gridArea: {
			type: String,
			required: true,
		},
		visibility: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		style() {
			return {
				gridArea: this.gridArea,
			};
		},
	},
};
</script>
