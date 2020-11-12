<template>
	<div class="wptb-plugin-width-full wptb-plugin-height-full">
		<div class="wptb-data-manager-table" :data-select="isDataSelectionActive">
			<table>
				<thead>
					<tr class="wptb-data-manager-table-column-name-info">
						<th :colspan="infoRowSpan">{{ translationM('columnNames') }}</th>
					</tr>
					<tr v-for="headerRow in table.header" :key="headerRow.rowId" :id="headerRow.rowId">
						<data-manager-cell
							:key="cellKey(headerRow.rowId, headerCell.colId)"
							v-for="headerCell in headerRow.values"
							:place-holder="translationM('columnName')"
							:value="headerCell.value"
							:row-id="headerRow.rowId"
							:col-id="headerCell.colId"
						></data-manager-cell>
					</tr>
					<tr class="wptb-data-manager-table-column-name-info">
						<th :colspan="infoRowSpan">{{ translationM('values') }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="valueRows in table.values" :key="valueRows.rowId" :id="valueRows.rowId">
						<data-manager-cell
							v-for="cell in valueRows.values"
							:key="cellKey(valueRows.rowId, cell.colId)"
							:place-holder="translationM('value')"
							:value="cell.value"
							:row-id="valueRows.rowId"
							:col-id="cell.colId"
							:selection-enabled="true"
							@cellClick="handleCellClick"
							@cellHover="handleCellHover"
						></data-manager-cell>
					</tr>
				</tbody>
			</table>
			<data-manager-select></data-manager-select>
			<div class="wptb-repeating-linear-gradient"></div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DataManagerCell from './DataManagerCell';
import DataManagerSelect from './DataManagerSelect';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';

export default {
	props: {
		useTemp: {
			type: Boolean,
			default: true,
		},
	},
	components: { DataManagerCell, DataManagerSelect },
	mixins: [withNativeTranslationStore],
	data() {
		return {
			table: {
				header: [],
				values: [],
			},
			columnNameRowIndex: null,
		};
	},
	created() {
		this.addDataManagerTempData([
			['', '', ''],
			['', '', ''],
		]);
	},
	mounted() {
		this.$nextTick(() => {
			this.calculateColumnNameRowIndex(this.getDataManagerControls.firstRowAsColumnName);
		});
	},
	watch: {
		getDataManagerTempData: {
			handler(n) {
				this.prepareTableValues(n);
			},
			deep: true,
		},
		'getDataManagerControls.firstRowAsColumnName': {
			handler(n) {
				this.calculateColumnNameRowIndex(n);
			},
		},
		getDataManagerControls: {
			handler() {
				this.prepareTableValues(this.getDataManagerTempData);
			},
			deep: true,
		},
	},
	computed: {
		...mapGetters([
			'getDataManagerTempData',
			'getDataManagerControls',
			'getDataManagerRowId',
			'getColCount',
			'isDataSelectionActive',
			'getSelectOperationData',
		]),
		infoRowSpan() {
			return this.getColCount === 0 ? this.table.header[0]?.values?.length : this.getColCount;
		},
	},
	methods: {
		handleCellClick(id) {
			if (this.getSelectOperationData.active) {
				this.setSelectId(id);
			}
		},
		handleCellHover(id) {
			if (this.getSelectOperationData.active) {
				this.setHoverId(id);
			}
		},
		calculateColumnNameRowIndex(n) {
			if (n) {
				this.setDataManagerControl({ key: 'indexRow', value: this.getDataManagerRowId(0) });
			}
	},
		generateEmptyRow(colCount) {
			const rowId = this.generateUniqueId()();

			const rowObject = { rowId, values: [] };

			for (let i = 0; i < colCount; i += 1) {
				rowObject.values.push({ colId: this.generateUniqueId()(), value: '' });
			}

			return rowObject;
		},
		prepareTableValues(tableValue) {
			if (tableValue.length > 0) {
				const { firstRowAsColumnName, indexRow } = this.getDataManagerControls;

				// recalculate first row index for column names
				this.calculateColumnNameRowIndex(firstRowAsColumnName);

				let header = tableValue.find((row) => {
					return row.rowId === indexRow;
				});

				if (!header) {
					header = this.generateEmptyRow(this.getColCount);
				}

				// find column index row
				this.table.header = [header];

				// filter out column index row
				this.table.values = tableValue.filter((t) => {
					return t.rowId !== indexRow;
				});
			}
		},
		cellKey(rowId, colId) {
			return `${rowId}-${colId}`;
		},
		...mapGetters(['generateUniqueId']),
		...mapActions(['addDataManagerTempData']),
		...mapMutations(['setSelectId', 'setHoverId', 'setDataManagerControl']),
	},
};
</script>
