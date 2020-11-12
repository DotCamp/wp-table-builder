<template>
	<div
		ref="main"
		:style="style"
		v-show="visibility"
		class="wptb-data-manager-select wptb-repeating-linear-gradient"
	></div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			width: 0,
			height: 0,
			left: 0,
			top: 0,
		};
	},
	watch: {
		'getSelectOperationData.hoverId': {
			handler(n) {
				if (n !== null) {
					const { rowId, colId } = this.parseCellId(n);

					const targetRow = document.getElementById(`${rowId}`);
					if (targetRow) {
						const { width, height, x, y } = targetRow.getBoundingClientRect();
						this.width = width;
						this.height = height;
						this.left = x;
						this.top = y;
					}
				}
			},
		},
	},
	computed: {
		visibility() {
			const { active, hoverId } = this.getSelectOperationData;
			return active && hoverId !== null;
		},
		style() {
			return {
				left: `${this.left}px`,
				top: `${this.top}px`,
				width: `${this.width}px`,
				height: `${this.height}px`,
			};
		},
		...mapGetters(['getSelectOperationData', 'parseCellId']),
	},
};
</script>
