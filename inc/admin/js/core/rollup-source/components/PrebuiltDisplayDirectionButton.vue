<template>
	<div class="wptb-prebuilt-live-control" :data-type="side" :style="calculateTransform" @click.prevent="handleClick">
		⬇️
	</div>
</template>
<script>
export default {
	props: {
		side: {
			type: String,
			default: 'up',
		},
	},
	computed: {
		calculateTransform() {
			const transformDegrees = {
				up: 0,
				right: 90,
				down: 180,
				left: 270,
			};

			return { transform: `rotateZ(${transformDegrees[this.side]}deg)` };
		},
	},
	methods: {
		handleClick() {
			this.$emit('click', this.side);
		},
	},
};
</script>
