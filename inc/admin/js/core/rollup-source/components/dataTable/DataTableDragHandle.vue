<template>
	<div
		draggable="true"
		@mouseenter.prevent.capture="handleHover(true)"
		@mouseleave.prevent.capture="handleHover(false)"
		@dragstart="handleDragStart"
		@drag.capture.prevent="handleDrag"
		@dragend="handleDragEnd"
		class="wptb-data-table-generated-preview-height-handle"
		:style="calculatePosition"
	></div>
</template>

<script>
export default {
	props: {
		position: {
			type: String,
			default: 'top',
		},
	},
	data() {
		return {
			dragActive: false,
			startScreenX: 0,
			startScreenY: 0,
		};
	},
	computed: {
		calculatePosition() {
			const style = {};
			const positionVal = '-5px';

			switch (this.position) {
				case 'top': {
					style.top = positionVal;
					style.cursor = 'n-resize';
					style.width = '100%';
					style.height = '10px';
					break;
				}
				case 'bottom': {
					style.bottom = positionVal;
					style.cursor = 'n-resize';
					style.width = '100%';
					style.height = '10px';
					break;
				}
				case 'left': {
					style.left = positionVal;
					style.cursor = 'w-resize';
					style.height = '100%';
					style.width = '10px';
					break;
				}
				case 'right': {
					style.right = positionVal;
					style.cursor = 'e-resize';
					style.height = '100%';
					style.width = '10px';
					break;
				}
				default: {
					style.top = '-5px';
					style.cursor = 'n-resize';
					style.width = '100%';
					style.height = '10px';
					break;
				}
			}

			return style;
		},
	},
	methods: {
		handleHover(status) {
			this.$emit('handleHover', status);
		},
		handleDragStart(event) {
			this.dragActive = true;

			// hide element feedback image on drag operation
			const emptyElement = document.createElement('div');
			event.dataTransfer.setDragImage(emptyElement, 0, 0);

			this.startScreenX = event.clientX;
			this.startScreenY = event.clientY;

			this.$emit('draggingStart');
		},
		handleDrag(event) {
			if ((this.dragActive && event.clientY !== 0) || event.clientX !== 0) {
				this.$emit('dragging', { y: this.startScreenY - event.clientY, x: this.startScreenX - event.clientX });
			}
		},
		handleDragEnd() {
			this.dragActive = false;
			this.$emit('draggingEnd');
		},
	},
};
</script>

<style scoped></style>
