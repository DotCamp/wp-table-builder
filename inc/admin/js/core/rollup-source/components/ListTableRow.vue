<template>
	<transition name="wptb-fade" mode="out-in">
		<tr class="wptb-list-table-row" :data-selected="modelBind[row.ID]" v-if="rowVisibility">
			<td>
				<input :id="row.ID" type="checkbox" v-model="modelBind[row.ID]" />
			</td>
			<td v-for="(data, index) in row.fieldDatas" :key="data">
				<label
					:class="index === searchIndex ? 'title-label' : ''"
					:for="row.ID"
					v-html="index === searchIndex ? searchClauseFilteredValue : data"
				></label>
			</td>
		</tr>
	</transition>
</template>

<script>
import withSearchClause from '../mixins/withSearchClause';

export default {
	props: {
		modelBind: {
			type: Object,
			default: () => ({}),
		},
		row: {
			type: Object,
			default: () => ({}),
		},
		searchIndex: {
			type: Number,
			default: 0,
		},
	},
	mixins: [withSearchClause('rowTitle')],
	data: () => ({ selected: false }),
	computed: {
		rowTitle() {
			return this.row.fieldDatas[this.searchIndex];
		},
		rowVisibility() {
			const regExp = new RegExp(`(${this.searchClause})`, 'gi');
			let value = this.row.fieldDatas[this.searchIndex];

			if (typeof value !== 'string') {
				value = value.toString();
			}

			return value.match(regExp);
		},
	},
};
</script>
