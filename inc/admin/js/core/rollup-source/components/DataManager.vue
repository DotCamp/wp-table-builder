<template>
	<div class="wptb-plugin-width-full wptb-plugin-height-full">
		<div class="wptb-data-manager-table" :data-select="isDataSelectionActive">
			<div class="wptb-data-manager-table-wrapper">
				<table>
					<thead>
						<tr class="wptb-data-manager-table-column-name-info">
							<th :colspan="infoRowSpan">{{ translationW('column names') }}</th>
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
							<th :colspan="infoRowSpan">{{ translationW('values') }}</th>
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
		useDefault: {
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
		// only add default data to data manager if no source setup is completed at that time because there won't be any data available at data manager
		if (this.useDefault) {
			this.addDataManagerTempData({
				data: this.generateDefaultRowData(2, 3),
				markAsImported: false,
			});
		}
	},
	mounted() {
		this.$nextTick(() => {
			// if there is already a data source is selected, it means there is already a data on data manager, so prepare our header and values at mount.
			if (!this.useDefault) {
				this.prepareTableValues(this.getDataManagerTempData);
			}
			this.calculateColumnNameRowIndex(this.getDataManagerControls.firstRowAsColumnName);

			// set up proxy for select click id
			this.setUpSelectionIdProxy();
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
		generateDefaultRowData(rows, cols) {
			const data = [];
			// eslint-disable-next-line no-plusplus
			for (let i = 0; i < rows; i++) {
				const tempArray = new Array(cols).fill(1);

				// eslint-disable-next-line array-callback-return
				tempArray.map((val, index) => {
					tempArray[index] = i * cols + index + 1;
				});

				data.push(tempArray);
			}

			return data;
		},
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
		async prepareTableValues(tableValue) {
			if (tableValue.length > 0) {
				const { firstRowAsColumnName, indexRow } = this.getDataManagerControls;

				// recalculate first row index for column names
				this.calculateColumnNameRowIndex(firstRowAsColumnName);

				let header = tableValue.find((row) => {
					return row.rowId === indexRow;
				});

				if (!header) {
					header = await this.generateRow(
						Array.from(new Array(this.getColCount)).map((_, i) => `${this.translationW('Column')} ${i + 1}`)
					);
					this.addRowObjectAsHeader(header);
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
		...mapActions([
			'addDataManagerTempData',
			'deleteDataTableRow',
			'deleteDataTableCol',
			'addRowObjectAsHeader',
			'generateRow',
			'setUpSelectionIdProxy',
		]),
		...mapMutations(['setSelectId', 'setHoverId', 'setDataManagerControl', 'setParsedData']),
	},
};
</script>
