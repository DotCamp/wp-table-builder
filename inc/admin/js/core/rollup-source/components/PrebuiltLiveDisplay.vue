<template>
	<div class="wptb-prebuilt-live-display wptb-unselectable">
		<div class="wptb-prebuilt-live-table" :style="calculateStyle">
			<div class="wptb-prebuilt-live-cell" v-for="(v, k) in itemsNumber" :key="k" :style="cellSpan(k)"></div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		rows: {
			type: Number,
			default: 1,
		},
		cols: {
			type: Number,
			default: 1,
		},
		table: {
			type: HTMLElement,
		},
	},
	data() {
		return {
			mergeDirectives: [],
			cells: [],
			initial: {
				rows: 1,
			},
		};
	},
	mounted() {
		if (this.table) {
			this.cells = Array.from(this.table.querySelectorAll('td'));
			this.initial.rows = this.table.querySelectorAll('tr').length;
			// eslint-disable-next-line array-callback-return
			this.cells.map((c) => {
				const { colSpan } = c;
				this.mergeDirectives.push(colSpan);
			});
		}
	},
	computed: {
		calculateStyle() {
			return {
				gridTemplateColumns: `repeat(${this.cols}, 1fr)`,
				gridTemplateRows: `repeat(${this.rows}, 1fr)`,
			};
		},
		itemsNumber() {
			if (!this.table) {
				return Array(this.rows * this.cols);
			}

			const extraCells = (this.rows - this.initial.rows) * this.cols;
			return this.cells.length + extraCells;
		},
	},
	methods: {
		cellSpan(index) {
			const spanAmount = this.mergeDirectives[index];
			return { gridColumn: `span ${spanAmount || 1}` };
		},
	},
};
</script>
