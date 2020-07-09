<template>
	<div class="wptb-screen-size-slider-fill" :style="calculateStyle"></div>
</template>
<script>
export default {
	props: {
		amount: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		calculateStyle() {
			return { width: `${this.amount}%` };
		},
	},
};
</script>
