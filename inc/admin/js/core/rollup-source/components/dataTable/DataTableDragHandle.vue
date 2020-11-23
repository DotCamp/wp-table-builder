<template>
	<div
		draggable="true"
		@mouseenter.prevent.capture="handleHover(true)"
		@mouseleave.prevent.capture="handleHover(false)"
		@dragstart="handleDragStart"
		@drag.capture.prevent="handleDrag"
		@dragend="handleDragEnd"
		class="wptb-data-table-generated-preview-height-handle"
	></div>
</template>

<script>
export default {
	data() {
		return {
			dragActive: false,
			startScreenY: 0,
		};
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
			this.startScreenY = event.clientY;

			this.$emit('draggingStart');
		},
		handleDrag(event) {
			if (this.dragActive && event.clientY !== 0) {
				this.$emit('dragging', this.startScreenY - event.clientY);
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
