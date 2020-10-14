<template>
	<div v-if="cell !== null" class="wptb-table-cell-indicator wptb-repeating-linear-gradient" :style="styles" />
</template>

<script>
export default {
	props: {
		cell: {
			type: HTMLElement,
			default: null,
		},
		repaint: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			styles: {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
			},
		};
	},
	watch: {
		cell() {
			this.calculatePos();
		},
		repaint() {
			this.calculatePos();
		},
	},
	methods: {
		calculatePos() {
			if (this.cell) {
				const { x, y, width, height } = this.cell.getBoundingClientRect();
				this.styles.top = `${y}px`;
				this.styles.left = `${x}px`;
				this.styles.width = `${width}px`;
				this.styles.height = `${height}px`;
			}
		},
	},
};
</script>
