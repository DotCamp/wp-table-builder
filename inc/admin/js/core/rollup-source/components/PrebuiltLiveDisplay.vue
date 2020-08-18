<template>
	<div class="wptb-prebuilt-live-display wptb-unselectable">
		<div class="wptb-prebuilt-live-table" :style="calculateStyle">
			<div class="wptb-prebuilt-live-cell" v-for="(v, k) in itemsNumber" :key="k"></div>
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
	},
	computed: {
		calculateStyle() {
			return {
				gridTemplateColumns: `repeat(${this.cols}, 1fr)`,
				gridTemplateRows: `repeat(${this.rows}, 1fr)`,
			};
		},
		itemsNumber() {
			return Array(this.rows * this.cols);
		},
	},
};
</script>
