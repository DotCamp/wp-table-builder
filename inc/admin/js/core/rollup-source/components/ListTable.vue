<!--ListTable component for rendering data in a table format-->
<template>
	<div>
		<table class="wptb-menu-list-table">
			<thead>
				<tr>
					<td>
						<input type="checkbox" />
					</td>
					<column-sort
						v-for="(label, i) in rowLabels"
						:label="label"
						:index="i"
						:key="label"
						@sort="sort"
					></column-sort>
				</tr>
			</thead>
			<!--			<transition-group tag="tbody" name="wptb-fade" mode="out-in">-->
			<tbody>
				<list-table-row
					v-for="row in innerRowData"
					:model-bind="modelBind"
					:row="row"
					:key="row.ID"
					:search-clause="searchClause"
					:search-index="searchDataIndex"
				></list-table-row>
			</tbody>
			<!--			</transition-group>-->
		</table>
	</div>
</template>
<script>
import ColumnSort from '$Components/ColumnSort';
import ListTableRow from '$Components/ListTableRow';

export default {
	props: {
		rowLabels: Array,
		rowData: Array,
		modelBind: Object,
		sortType: Object,
		searchClause: String,
		searchDataIndex: {
			type: Number,
			default: 0,
		},
	},
	components: { ListTableRow, ColumnSort },
	data() {
		return {
			innerRowData: [],
			sortOptions: {
				index: null,
				direction: null,
			},
		};
	},
	watch: {
		/**
		 * Watching row data to update component specific data for mainly sort operations since props should not be mutated
		 *
		 * @param {any} n new value
		 */
		rowData(n) {
			// updates component state data to be in sync with parent sent rowData
			this.innerRowData = n;
			if (this.sortOptions && this.sortOptions.index && this.sortOptions.direction) {
				this.sort(this.sortOptions.index, this.sortOptions.direction);
			}
		},
	},
	methods: {
		/**
		 * Sort column data
		 *
		 * @param {number} index index of fieldData array of element
		 * @param {number} direction negative/positive integer to depict the direction of sort (ascending/descending)
		 */
		sort(index, direction) {
			// store latest sort data to use it at reactive updates of component data (field selection/deselection)
			this.sortOptions.index = index;
			this.sortOptions.direction = direction;

			const sortAlgs = {
				// date sorting
				dateSort(a, b) {
					let status = 0;
					const aData = new Date(a.fieldDatas[index].toLowerCase()).getTime();
					const bData = new Date(b.fieldDatas[index].toLowerCase()).getTime();

					if (aData < bData) {
						status = 1;
					}
					if (aData > bData) {
						status = -1;
					}

					return status * direction;
				},
				numberSort(a, b) {
					return (
						(Number.parseInt(a.fieldDatas[index], 10) - Number.parseInt(b.fieldDatas[index], 10)) *
						direction
					);
				},
				// default sort based on alphabetical/number sorting
				defaultSort(a, b) {
					let status = 0;
					const aData = a.fieldDatas[index].toLowerCase();
					const bData = b.fieldDatas[index].toLowerCase();

					if (aData < bData) {
						status = 1;
					}
					if (aData > bData) {
						status = -1;
					}

					return status * direction;
				},
			};

			let currentAlg;
			const requestedType = this.sortType[index];

			if (!requestedType || !sortAlgs[`${requestedType}Sort`]) {
				currentAlg = sortAlgs.defaultSort;
			} else {
				currentAlg = sortAlgs[`${requestedType}Sort`];
			}

			this.innerRowData.sort(currentAlg);
		},
	},
};
</script>
