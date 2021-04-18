<template>
	<tr @click.prevent="handleRowSelect" class="wptb-existing-table-data-row">
		<td class="wptb-existing-table-column">{{ id }}</td>
		<td class="wptb-existing-table-column" v-html="searchClauseFilteredValue"></td>
		<td class="wptb-existing-table-column">{{ type }}</td>
		<td class="wptb-existing-table-column">{{ associatedTableCount }}</td>
	</tr>
</template>

<script>
import withSearchClause from '../../mixins/withSearchClause';

export default {
	props: {
		id: {
			type: Number,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		associatedTableCount: {
			type: Number,
			required: true,
		},
	},
	mixins: [withSearchClause('title')],
	methods: {
		handleRowSelect() {
			this.$emit('rowSelect', this.id);
		},
	},
};
</script>
