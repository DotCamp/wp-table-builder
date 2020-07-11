<template>
	<div
		ref="arrowWrapper"
		class="wptb-screen-size-slider-arrow"
		:style="style"
		draggable="true"
		@drag.prevent="handleDrag"
		@dragover.prevent=""
		@dragend.prevent="$emit('arrowDragEnd')"
		@drop.prevent=""
		@dragexit.prevent=""
		@dragleave.prevent=""
	>
		<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8.5 16L0 0H17L8.5 16Z" fill="var(--wptb-plugin-logo-color)" />
		</svg>
	</div>
</template>
<script>
export default {
	props: {
		positionPercentage: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			style: {
				left: 0,
			},
		};
	},
	watch: {
		positionPercentage: {
			handler() {
				this.calculateStyle();
			},
			deep: true,
		},
	},
	mounted() {
		this.calculateStyle();
	},
	methods: {
		calculateStyle() {
			const arrowWrapperElement = this.$refs.arrowWrapper;

			const { width } = arrowWrapperElement.getBoundingClientRect();

			this.style.left = `calc(${this.positionPercentage}% - ${width / 2}px)`;
		},
		handleDrag(e) {
			const { screenX, screenY } = e;

			// drag is interrupted/canceled prematurely
			if (screenX === 0 && screenY === 0) {
				return;
			}

			this.$emit('arrowDrag', e);
		},
	},
};
</script>
