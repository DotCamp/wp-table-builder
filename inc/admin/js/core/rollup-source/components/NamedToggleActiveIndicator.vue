<template>
	<div ref="main" class="wptb-named-toggle-active-indicator" :style="style"></div>
</template>
<script>
export default {
	props: {
		refElement: {
			type: Node,
			default: null,
		},
	},
	data() {
		return {
			style: {
				left: 0,
				top: 0,
				width: 0,
			},
		};
	},
	watch: {
		refElement(n) {
			if (n === null || n === undefined) {
				return;
			}
			this.calculatePosition();
		},
	},
	methods: {
		calculatePosition() {
			const mainWrapperPosObj = this.$refs.main.parentNode.getBoundingClientRect();
			const targetPosObj = this.refElement.getBoundingClientRect();

			const relativeX = targetPosObj.x - mainWrapperPosObj.x;
			this.style.left = `${Math.floor(relativeX - 1)}px`;
			this.style.width = `${targetPosObj.width + 1}px`;
		},
	},
};
</script>
