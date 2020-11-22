<template>
	<div class="wptb-plugin-width-full wptb-plugin-height-full">
		<div class="wptb-data-manager-table" :data-select="isDataSelectionActive">
			<div class="wptb-data-manager-table-wrapper">
				<table>
					<thead>
						<tr class="wptb-data-manager-table-column-name-info">
							<th :colspan="infoRowSpan">{{ translationM('columnNames') }}</th>
						</tr>
						<tr v-for="headerRow in parsedData.header" :key="headerRow.rowId" :id="headerRow.rowId">
							<data-manager-cell
								:key="formCellId(headerRow.rowId, headerCell.colId)"
								v-for="headerCell in headerRow.values"
								:place-holder="translationM('columnName')"
								:value="headerCell.value"
								:row-id="headerRow.rowId"
								:col-id="headerCell.colId"
							></data-manager-cell>
						</tr>
						<tr class="wptb-data-manager-table-column-name-info wptb-data-manager-info-values">
							<th :colspan="infoRowSpan">{{ translationM('values') }}</th>
						</tr>
					</thead>
					<tbody>
						<data-manager-data-row
							v-for="row in parsedData.values"
							:key="row.rowId"
							:row-object="row"
							@cellClick="handleCellClick"
							@cellHover="handleCellHover"
							@cellHoverEnd="handleCellHoverEnd"
						></data-manager-data-row>
					</tbody>
				</table>
				<data-manager-index-actions @indexDelete="handleRowDelete" type="row"></data-manager-index-actions>
				<data-manager-index-actions type="col" @indexDelete="handleColDelete"></data-manager-index-actions>
				<data-manager-select></data-manager-select>
				<data-manager-table-add-controls></data-manager-table-add-controls>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import DataManagerCell from './DataManagerCell';
import DataManagerSelect from './DataManagerSelect';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import DataManagerTableAddControls from './DataManagerTableAddControls';
import DataManagerDataRow from './DataManagerDataRow';
import DataManagerIndexActions from './DataManagerIndexActions';

export default {
	props: {
		useTemp: {
			type: Boolean,
			default: true,
		},
	},
	components: {
		DataManagerDataRow,
		DataManagerTableAddControls,
		DataManagerCell,
		DataManagerSelect,
		DataManagerIndexActions,
	},
	mixins: [withNativeTranslationStore],
	data() {
		return {
			columnNameRowIndex: null,
		};
	},
	created() {
		// only add default data to data manager no source setup is completed at that time because there won't be any data available at data manager
		if (!this.getSelectedDataSource) {
			this.addDataManagerTempData({
				data: [
					['1', '2', '3'],
					['4', '5', '6'],
				],
				markAsImported: false,
			});
		}
	},
	mounted() {
		this.$nextTick(() => {
			// if there is already a data source is selected, it means there is already a data on data manager, so prepare our header and values at mount.
			if (this.getSelectedDataSource) {
				this.prepareTableValues(this.getDataManagerTempData);
			}
			this.calculateColumnNameRowIndex(this.getDataManagerControls.firstRowAsColumnName);
		});
	},
	watch: {
		getDataManagerTempData: {
			handler(n) {
				// TODO [erdembircan] remove for production
				console.log(n);
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
			'formCellId',
			'parseCellId',
			'getSelectedDataSource',
			'parsedData',
		]),
		infoRowSpan() {
			return this.getColCount === 0 ? this.parsedData.header[0]?.values?.length : this.getColCount;
		},
	},
	methods: {
		handleRowDelete(id) {
			const { rowId } = this.parseCellId(id);
			this.deleteDataTableRow(rowId);
		},
		handleColDelete(id) {
			const { colId } = this.parseCellId(id);
			this.deleteDataTableCol(colId);
		},
		handleCellClick(id) {
			this.setSelectId(id);
		},
		handleCellHover(id) {
			this.setHoverId(id);
		},
		handleCellHoverEnd() {
			// this.setHoverId(null);
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
				this.setParsedData({ key: 'header', value: [header] });

				// filter out column index row
				this.setParsedData({
					key: 'values',
					value: tableValue.filter((t) => {
						return t.rowId !== indexRow;
					}),
				});
			}
		},
		...mapGetters(['generateUniqueId']),
		...mapActions(['addDataManagerTempData', 'deleteDataTableRow', 'deleteDataTableCol']),
		...mapMutations(['setSelectId', 'setHoverId', 'setDataManagerControl', 'setParsedData']),
	},
};
</script>
