<template>
	<tr :id="rowObject.rowId">
		<data-manager-cell
			v-for="cell in rowObject.values"
			:key="formCellId(rowObject.rowId, cell.colId)"
			:place-holder="translationM('value')"
			:value="cell.value"
			:row-id="rowObject.rowId"
			:col-id="cell.colId"
			:selection-enabled="true"
			@cellClick="handleCellClick"
			@cellHover="handleCellHover"
			@cellHoverEnd="handleCellHoverEnd"
		></data-manager-cell>
	</tr>
</template>

<script>
import { mapGetters } from 'vuex';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import DataManagerCell from './DataManagerCell';

export default {
	props: {
		rowObject: {
			type: Object,
			required: true,
		},
	},
	components: { DataManagerCell },
	mixins: [withNativeTranslationStore],
	computed: {
		...mapGetters(['formCellId']),
	},
	methods: {
		handleCellHoverEnd(id) {
			this.$emit('cellHoverEnd', id);
		},
		handleCellClick(id) {
			this.$emit('cellClick', id);
		},
		handleCellHover(id) {
			this.$emit('cellHover', id);
		},
		rowOver() {
			console.log('over');
		},
	},
};
</script>
