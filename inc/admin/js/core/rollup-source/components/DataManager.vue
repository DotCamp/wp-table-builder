<template>
	<div class="wptb-plugin-width-full wptb-plugin-height-full">
		<div class="wptb-data-manager-table">
			<table>
				<thead>
					<tr class="wptb-data-manager-table-column-name-info">
						<th :colspan="infoRowSpan">{{ translationM('columnNames') }}</th>
					</tr>
					<tr>
						<th
							class="wptb-data-manager-table-data-value"
							v-for="headerCell in table.header"
							:key="columnNameRowIndex"
						>
							<data-manager-cell
								:place-holder="translationM('columnName')"
								:value="headerCell"
							></data-manager-cell>
						</th>
					</tr>
					<tr class="wptb-data-manager-table-column-name-info">
						<th :colspan="infoRowSpan">{{ translationM('values') }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="{ key, values } in table.values" :key="key">
						<td class="wptb-data-manager-table-data-value" v-for="cell in values">
							<data-manager-cell :place-holder="translationM('value')" :value="cell"></data-manager-cell>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DataManagerCell from './DataManagerCell';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';

export default {
	props: {
		useTemp: {
			type: Boolean,
			default: true,
		},
	},
	components: { DataManagerCell },
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
	mounted() {
		this.$nextTick(() => {
			this.addDataManagerTempData([
				['', '', ''],
				['', '', ''],
			]);
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
		...mapGetters(['getDataManagerTempData', 'getDataManagerControls', 'getDataManagerRowId']),
		infoRowSpan() {
			return this.table.header.length;
		},
	},
	methods: {
		calculateColumnNameRowIndex(n) {
			this.columnNameRowIndex = n ? this.getDataManagerRowId(0) : null;
		},
		prepareTableValues(tableValue) {
			// TODO [erdembircan] remove for production
			console.log('called');
		},
		...mapActions(['addDataManagerTempData']),
	},
};
</script>
