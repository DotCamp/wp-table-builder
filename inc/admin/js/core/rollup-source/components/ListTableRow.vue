<template>
	<transition name="wptb-fade" mode="out-in">
		<tr class="wptb-list-table-row" :data-selected="selected" v-if="rowVisibility">
			<td>
				<input @input="setSelected" :id="row.ID" type="checkbox" v-model="modelBind[row.ID]" />
			</td>
			<td v-for="(data, index) in row.fieldDatas" :key="data">
				<label
					:class="index === 0 ? 'title-label' : ''"
					:for="row.ID"
					v-html="index === 0 ? searchClauseFilteredValue : data"
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
			default: () => {
				return {};
			},
		},
		row: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	mixins: [withSearchClause('rowTitle')],
	data: () => ({ selected: false }),
	computed: {
		rowTitle() {
			return this.row.fieldDatas[0];
		},
		rowVisibility() {
			const regExp = new RegExp(`(${this.searchClause})`, 'gi');
			let [value] = this.row.fieldDatas;

			if (typeof value !== 'string') {
				value = value.toString();
			}

			return value.match(regExp);
		},
	},
	methods: {
		setSelected(e) {
			this.selected = e.target.checked;
		},
	},
};
</script>
