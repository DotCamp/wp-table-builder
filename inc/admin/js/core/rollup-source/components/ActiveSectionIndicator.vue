<!--Adds a visual dynamic indicator to sections to show their active status-->
<template>
	<div class="wptb-menu-active-section-indicator" :style="styleCalculations"></div>
</template>
<script>
export default {
	props: ['activeItem', 'relativeParent'],
	methods: {
		toPx(val) {
			return `${val}px`;
		},
	},
	computed: {
		/**
		 * Calculate position variables of section component
		 *
		 * @returns {{left: string, bottom: number, width: string, height: string}|{}}
		 */
		styleCalculations() {
			if (this.activeItem) {
				const posData = this.activeItem.getBoundingClientRect();
				const parentPosData = this.relativeParent.getBoundingClientRect();

				const relativeLeft = Math.abs(posData.left - parentPosData.left);

				return {
					width: this.toPx(posData.width),
					height: `2px`,
					bottom: 0,
					left: this.toPx(relativeLeft),
				};
			}

			return {};
		},
	},
};
</script>
