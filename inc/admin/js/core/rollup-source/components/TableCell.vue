<template>
	<div
		class="wptb-table-cell-select-cell"
		:data-cell-selected="selected"
		@click="handleClick"
		@mouseenter="handleHover"
		@mouseleave="handleExit"
		:style="cellStyle"
	></div>
</template>

<script>
export default {
	props: {
		cell: {
			type: HTMLElement,
		},
		selected: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		cellStyle() {
			return {
				gridColumn: `span ${this.cell.getAttribute('colspan') || 1}`,
			};
		},
	},
	methods: {
		handleHover() {
			this.$emit('cellHover', this.cell);
		},
		handleExit() {
			this.$emit('cellHover', null);
		},
		handleClick() {
			this.$emit('cellClick', this.cell);
		},
	},
};
</script>
