<template>
	<td class="wptb-data-manager-table-data-value" :id="id">
		<div @mouseenter="handleHover" @click.prevent.capture="handleClick">
			<input
				:disabled="isBusy"
				class="wptb-data-manager-cell-input"
				:placeholder="placeHolder"
				type="text"
				:value="value"
			/>
		</div>
	</td>
</template>

<script>
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
	},
	methods: {
		handleHover() {
			if (this.selectionEnabled) {
				this.$emit('cellHover', this.rowId, this.colId);
			}
		},
		handleClick() {
			if (this.selectionEnabled) {
				this.$emit('cellClick', this.id);
			}
		},
	},
};
</script>
