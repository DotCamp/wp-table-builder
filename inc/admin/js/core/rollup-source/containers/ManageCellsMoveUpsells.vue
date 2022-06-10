<template>
	<div v-if="visibility" class="wptb-manage-cells-move-upsells">
		<cell-move-upsell
			:type="moveTypes.VERTICAL"
			:x="posVals.containerX - defaultSizes"
			:y="posVals.y"
			:height="posVals.height"
			feature="move row"
		></cell-move-upsell>
		<cell-move-upsell
			:type="moveTypes.VERTICAL"
			:x="posVals.containerX + posVals.containerWidth"
			:y="posVals.y"
			:height="posVals.height"
			feature="move row"
		></cell-move-upsell>
		<cell-move-upsell
			:type="moveTypes.HORIZONTAL"
			:x="posVals.x"
			:y="posVals.containerY - defaultSizes"
			:width="posVals.width"
			feature="move column"
		></cell-move-upsell>
		<cell-move-upsell
			:type="moveTypes.HORIZONTAL"
			:x="posVals.x"
			:y="posVals.containerY + posVals.containerHeight"
			:width="posVals.width"
			feature="move column"
		></cell-move-upsell>
	</div>
</template>

<script>
import CellMoveUpsell, { moveTypes } from '$Components/CellMoveUpsell';

export default {
	components: { CellMoveUpsell },
	data: () => ({
		visibility: false,
		posVals: {
			x: 0,
			y: 0,
			width: null,
			height: null,
			containerX: 0,
			containerY: 0,
			containerWidth: 0,
			containerHeight: 0,
		},
		defaultSizes: 30,
	}),
	mounted() {
		this.$nextTick(() => {
			const allowedSections = ['cell_settings', 'manage_cells'];
			// eslint-disable-next-line @wordpress/no-global-event-listener
			document.addEventListener('wptbSectionChanged', (e) => {
				if (e.detail) {
					if (!allowedSections.includes(e.detail)) {
						this.visibility = false;
					}
				}
			});

			// eslint-disable-next-line @wordpress/no-global-event-listener
			document.addEventListener('wp-table-builder/cell/mark', (e) => {
				const { countMarkedCells } = e.detail;
				const cellsMarked = countMarkedCells > 0;

				this.visibility = cellsMarked;

				if (cellsMarked) {
					const targetCell = e.target;

					if (targetCell) {
						const container = document.querySelector('.wptb-preview-table-manage-cells');

						const { x, y, width, height } = targetCell.getBoundingClientRect();
						const {
							x: containerX,
							y: containerY,
							width: containerWidth,
							height: containerHeight,
						} = container.getBoundingClientRect();

						this.posVals.x = x;
						this.posVals.y = y;
						this.posVals.width = width;
						this.posVals.height = height;
						this.posVals.containerX = containerX;
						this.posVals.containerY = containerY;
						this.posVals.containerWidth = containerWidth;
						this.posVals.containerHeight = containerHeight;
					}
				}
			});
		});
	},
	computed: {
		moveTypes: () => moveTypes,
	},
};
</script>
