<template>
	<div class="wptb-table-cell-select-wrapper" :key="repaint" :style="gridStyle">
		<table-cell
			v-for="cell in cells"
			:key="generateKey(5)"
			:cell="cell"
			@cellHover="handleCellHover"
			@cellClick="handleCellClick"
			:selected="innerSelectedCell === cell"
			:style="cellExtraStyling(cell)"
		>
		</table-cell>
	</div>
</template>

<script>
import TableCell from './TableCell';

export default {
	props: {
		table: {
			type: HTMLTableElement,
			default: null,
		},
		hoveredCell: {
			type: HTMLElement,
			default: null,
		},
		selectedCell: {
			type: HTMLElement,
			default: null,
		},
		cellExtraStyling: {
			type: Function,
			default: () => {},
		},
		repaint: {
			type: Number,
			default: 0,
		},
	},
	components: { TableCell },
	model: {
		prop: 'selectedCell',
		event: 'cellSelect',
	},
	data() {
		return {
			cells: [],
			rows: 1,
			columns: 1,
			innerHoveredCell: null,
			innerSelectedCell: null,
		};
	},
	watch: {
		selectedCell() {
			this.innerSelectedCell = this.selectedCell;
		},
		innerSelectedCell(n) {
			this.$emit('cellSelect', n);
		},
		hoveredCell() {
			this.innerHoveredCell = this.hoveredCell;
		},
		innerHoveredCell() {
			this.$emit('cellHover', this.innerHoveredCell);
		},
		table() {
			if (this.table) {
				this.cells = Array.from(this.table.querySelectorAll('td'));
				const rows = Array.from(this.table.querySelectorAll('tr'));
				this.rows = rows.length;

				this.columns = rows.reduce((carry, row) => {
					const currentCellCount = Array.from(row.querySelectorAll('td')).length;
					return currentCellCount > carry ? currentCellCount : carry;
				}, 0);
			}
		},
	},
	computed: {
		gridStyle() {
			return {
				gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
			};
		},
	},
	methods: {
		handleCellHover(cell) {
			this.innerHoveredCell = cell;
		},
		handleCellClick(cell) {
			this.innerSelectedCell = cell;
		},
		generateKey(length) {
			const letters = 'abcdef'.split('');
			const numbers = new Array(10).fill(1).map((_, i) => i);

			const all = [...letters, ...numbers];

			// eslint-disable-next-line no-unused-vars
			return new Array(length).fill(1).reduce((carry, _) => {
				// eslint-disable-next-line no-param-reassign
				carry += all[Math.floor(Math.random() * all.length)];
				return carry;
			}, '');
		},
	},
};
</script>
