<template>
	<tr @click.prevent="handleRowSelect">
		<td class="wptb-existing-table-column">{{ id }}</td>
		<td class="wptb-existing-table-column">{{ title }}</td>
		<td class="wptb-existing-table-column">{{ type }}</td>
	</tr>
</template>

<script>
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
	},
	methods: {
		handleRowSelect() {
			this.$emit('rowSelect', this.id);
		},
	},
};
</script>
