<template>
	<fragment>
		<div
			@mouseenter="showIndicator = true"
			@mouseleave="showIndicator = false"
			ref="container"
			:style="calculatePosition"
			:type="type"
			class="wptb-data-manager-index-actions"
		>
			<div class="wptb-data-manager-index-delete" @click="indexDelete">
				<span class="dashicons dashicons-trash"></span>
			</div>
		</div>
		<div
			v-if="showIndicator"
			:style="indicatorStyle"
			class="wptb-data-manager-index-indicator wptb-repeating-linear-gradient-red"
		></div>
	</fragment>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	props: {
		type: {
			type: String,
			default: 'row',
		},
	},
	data() {
		return {
			showIndicator: false,
			indicatorStyle: {},
		};
	},
	computed: {
		calculatePosition() {
			const { rowId } = this.parseCellId(this.getHoverId);
			const tableWrapper = document.querySelector('.wptb-data-manager-table-wrapper');

			if (this.type === 'row') {
				const hoveredRow = document.getElementById(rowId);

				if (hoveredRow && tableWrapper) {
					const { width } = this.$refs.container.getBoundingClientRect();
					const { y, height } = hoveredRow.getBoundingClientRect();
					const { y: tableWrapperY } = tableWrapper.getBoundingClientRect();

					// eslint-disable-next-line vue/no-side-effects-in-computed-properties
					this.indicatorStyle = {
						left: 0,
						top: `${y - tableWrapperY}px`,
						width: '100%',
						height: `${height}px`,
					};

					return {
						left: `-${width}px`,
						top: `${y - tableWrapperY}px`,
						height: `${height}px`,
					};
				}
			} else {
				const hoveredCell = document.getElementById(this.getHoverId);

				if (hoveredCell && tableWrapper) {
					const { height } = this.$refs.container.getBoundingClientRect();
					const { x, width } = hoveredCell.getBoundingClientRect();
					const { x: tableWrapperX } = tableWrapper.getBoundingClientRect();

					// eslint-disable-next-line vue/no-side-effects-in-computed-properties
					this.indicatorStyle = {
						left: `${x - tableWrapperX}px`,
						top: 0,
						width: `${width}px`,
						bottom: 0,
					};

					return {
						top: `-${height}px`,
						left: `${x - tableWrapperX}px`,
						width: `${width}px`,
					};
				}
			}
			return {};
		},
		indexId() {
			return this.getHoverId;
		},
		...mapGetters(['getHoverId', 'parseCellId']),
	},
	methods: {
		indexDelete() {
			this.$emit('indexDelete', this.getHoverId);
		},
	},
};
</script>
