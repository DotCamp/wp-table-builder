<template>
	<td
		ref="refCell"
		class="wptb-data-manager-table-data-value"
		@mouseenter="handleHover"
		@mouseleave="handleHoverEnd"
		:id="id"
		:style="cellStyle"
	>
		<div class="wptb-data-manager-table-data-value-inner-wrapper">
			<data-table-drag-handle
				position="bottom"
				@draggingStart="calculateCurrentDimensions"
				@dragging="handleHeightResize"
				@draggingEnd="calculateCurrentDimensions"
			>
			</data-table-drag-handle>
			<data-table-drag-handle
				position="right"
				@draggingStart="calculateCurrentDimensions"
				@draggingEnd="calculateCurrentDimensions"
				@dragging="handleWidthResize"
			>
			</data-table-drag-handle>
			<div class="wptb-data-manager-cell-input-wrapper" @click.prevent.capture="handleClick">
				<input
					:disabled="isBusy"
					class="wptb-data-manager-cell-input"
					:placeholder="placeHolder"
					type="text"
					v-model="innerValue"
				/>
			</div>
		</div>
	</td>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import withStoreBusy from '../mixins/withStoreBusy';
import DataTableDragHandle from './dataTable/DataTableDragHandle';

export default {
	props: {
		value: {
			type: null,
			default: 0,
		},
		placeHolder: {
			type: String,
			default: 'enter data',
		},
		selectionEnabled: {
			type: Boolean,
			default: false,
		},
		rowId: {
			type: String,
			default: '',
		},
		colId: {
			type: String,
			default: '',
		},
	},
	mixins: [withStoreBusy],
	components: { DataTableDragHandle },
	data() {
		return {
			saved: {
				width: 200,
				height: 200,
			},
			style: {
				width: 0,
				height: 0,
			},
		};
	},
	watch: {
		getCurrentSourceSetupTab() {
			this.calculateCurrentDimensions();
		},
		isVisible() {
			this.calculateCurrentDimensions();
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.calculateCurrentDimensions();
		});
	},
	computed: {
		cellStyle() {
			return {
				width: `${this.style.width}px`,
				height: `${this.style.height}px`,
			};
		},
		id() {
			return `${this.rowId}-${this.colId}`;
		},
		innerValue: {
			get() {
				return this.getDataCellObject(this.rowId, this.colId)?.value;
			},
			set(n) {
				this.setDataCellValue({ cellId: this.id, value: n });
			},
		},
		...mapGetters(['getDataCellObject', 'isVisible', 'getCurrentSourceSetupTab']),
	},
	methods: {
		handleHeightResize({ y }) {
			this.style.height = this.saved.height - y;
		},
		handleWidthResize({ x }) {
			this.style.width = this.saved.width - x;
		},
		calculateCurrentDimensions() {
			if (this.getCurrentSourceSetupTab === 'dataManager' && this.isVisible) {
				const { width, height } = this.$refs.refCell.getBoundingClientRect();

				this.saved.width = width;
				this.saved.height = height;

				this.style.width = width;
				this.style.height = height;
			}
		},
		handleHoverEnd() {
			if (this.selectionEnabled) {
				this.$emit('cellHoverEnd', this.rowId, this.colId);
			}
		},
		handleHover() {
			if (this.selectionEnabled) {
				this.$emit('cellHover', this.id);
			}
		},
		handleClick() {
			if (this.selectionEnabled) {
				this.$emit('cellClick', this.id);
			}
		},
		...mapActions(['setDataCellValue']),
	},
};
</script>
