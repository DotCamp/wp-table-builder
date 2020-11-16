<template>
	<td class="wptb-data-manager-table-data-value" @mouseenter="handleHover" @mouseleave="handleHoverEnd" :id="id">
		<div @click.prevent.capture="handleClick">
			<input
				:disabled="isBusy"
				class="wptb-data-manager-cell-input"
				:placeholder="placeHolder"
				type="text"
				v-model="innerValue"
			/>
		</div>
	</td>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import withStoreBusy from '../mixins/withStoreBusy';

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
	computed: {
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
		...mapGetters(['getDataCellObject']),
	},
	methods: {
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
