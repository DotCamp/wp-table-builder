<template>
	<div class="wptb-prebuilt-live-display wptb-unselectable">
		<div class="wptb-prebuilt-live-table" :style="calculateStyle">
			<template v-for="(r, i) in innerParsedCells">
				<prebuilt-live-display-cell
					v-for="(c, k) in r"
					:key="`${i}-${k}`"
					:row="i"
					:col="k"
					:class="calculateClass(i, k)"
					:max-col="initial.cols"
					:max-row="initial.rows"
					:original="isOriginalCell(i, k)"
					@cellControlSelected="handleCellControlSelect"
					:selected="isCellSelected(i, k)"
					:controls-enabled="enableNewCellIndicator"
				></prebuilt-live-display-cell>
			</template>
		</div>
	</div>
</template>
<script>
import PrebuiltLiveDisplayCell from './PrebuiltLiveDisplayCell';

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
		selectedCells: {
			type: Object,
			default: () => {
				return {
					rowOperation: [],
					colOperation: [],
				};
			},
		},
		enableNewCellIndicator: {
			type: Boolean,
			default: true,
		},
	},
	components: { PrebuiltLiveDisplayCell },
	data() {
		return {
			parsedCells: [],
			parsedMergeDirectives: [],
			initial: {
				rows: 1,
				cols: 1,
			},
			innerParsedCells: [],
		};
	},
	mounted() {
		if (this.table) {
			this.initial.rows = this.table.querySelectorAll('tr').length;
			this.initial.cols = Array.from(this.table.querySelectorAll('tr')).reduce((carry, current) => {
				const cellLength = current.querySelectorAll('td').length;

				return cellLength > carry ? cellLength : carry;
			}, 1);

			// eslint-disable-next-line array-callback-return
			Array.from(this.table.querySelectorAll('tr')).map((tr, i) => {
				if (!Array.isArray(this.parsedCells[i])) {
					this.parsedCells[i] = [];
				}
				// eslint-disable-next-line array-callback-return
				Array.from(tr.querySelectorAll('td')).map((td) => {
					this.parsedCells[i].push(td);
				});
			});

			// this.innerParsedCells = this.parsedCells.slice(0);

			this.prepareTable();
		}
	},
	watch: {
		rows() {
			this.prepareTable();
		},
		cols() {
			this.prepareTable();
		},
		selectedCells: {
			handler() {
				this.$emit('cellsSelected', this.selectedCells);
			},
			deep: true,
		},
	},
	computed: {
		calculateStyle() {
			return {
				gridTemplateColumns: `repeat(${this.cols}, 1fr)`,
				gridTemplateRows: `repeat(${this.rows}, 1fr)`,
			};
		},
	},
	methods: {
		prepareTable() {
			this.innerParsedCells = this.parsedCells.map((r) => {
				return r.slice(0);
			});

			const extraRows = this.rows - this.initial.rows;
			const extraCols = this.cols - this.initial.cols;

			// eslint-disable-next-line array-callback-return
			Array.from(Array(this.innerParsedCells.length)).map((a, r) => {
				// eslint-disable-next-line array-callback-return
				Array.from(Array(extraCols)).map(() => {
					this.innerParsedCells[r].push(a);
				});
			});

			// eslint-disable-next-line array-callback-return
			Array.from(Array(extraRows)).map((a, r) => {
				// eslint-disable-next-line array-callback-return
				Array.from(Array(this.cols)).map(() => {
					const rowIndex = this.initial.rows + r;
					if (!Array.isArray(this.innerParsedCells[rowIndex])) {
						this.innerParsedCells[rowIndex] = [];
					}

					this.innerParsedCells[rowIndex].push(a);
				});
			});
		},
		getParsedCellElement(r, c) {
			return this.parsedCells[r][c];
		},
		cellSpan(index) {
			const spanAmount = this.mergeDirectives[index];
			return { gridColumn: `span ${spanAmount || 1}` };
		},
		isOriginalCell(r, c) {
			if (!this.enableNewCellIndicator) {
				return true;
			}

			return r < this.initial.rows && c < this.initial.cols;
		},
		calculateClass(r, c) {
			return { 'wptb-prebuilt-added-cell': !this.isOriginalCell(r, c) };
		},
		isCellSelected(row, col) {
			return (
				this.selectedCells.colOperation.includes(this.encodeSelectedCell(row, col)) ||
				this.selectedCells.rowOperation.includes(this.encodeSelectedCell(row, col))
			);
		},
		encodeSelectedCell(row, col) {
			return `${row}-${col}`;
		},
		handleCellControlSelect(side, row, col) {
			if (side === 'up' || side === 'down') {
				const direction = side === 'up' ? 1 : -1;

				for (let i = 0; i < this.initial.rows; i += 1) {
					this.toggleSelection('colOperation', this.encodeSelectedCell(row + i * direction, col));
				}
			} else {
				for (let i = 0; i < this.initial.cols; i += 1) {
					const direction = side === 'left' ? 1 : -1;
					this.toggleSelection('rowOperation', this.encodeSelectedCell(row, col + i * direction));
				}
			}
		},
		toggleSelection(operation, encodedCellPosition) {
			this.selectedCells[operation === 'colOperation' ? 'rowOperation' : 'colOperation'] = [];

			const index = this.selectedCells[operation].indexOf(encodedCellPosition);

			if (index >= 0) {
				this.selectedCells[operation].splice(index, 1);
			} else {
				this.selectedCells[operation].push(encodedCellPosition);
			}
		},
	},
};
</script>
