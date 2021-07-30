<template>
	<transition name="wptb-fade" mode="out-in">
		<tr v-if="rowVisibility">
			<td>
				<input :id="row.ID" type="checkbox" v-model="modelBind[row.ID]" />
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
	computed: {
		rowTitle() {
			return this.row.fieldDatas[0];
		},
		rowVisibility() {
			const regExp = new RegExp(`(${this.searchClause})`, 'gi');
			return this.row.fieldDatas[0].match(regExp);
		},
	},
};
</script>
