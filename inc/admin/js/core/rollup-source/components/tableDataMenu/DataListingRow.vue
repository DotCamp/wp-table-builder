<template>
	<div
		class="wptb-data-listing-row"
		:data-disabled="disabled"
		:data-active-row="isActive"
		@click="rowClick"
		v-html="searchClauseFilteredValue"
	></div>
</template>

<script>
import withSearchClause from '../../mixins/withSearchClause';

export default {
	props: {
		id: {
			type: Number,
			required: true,
		},
		activeId: {
			type: null,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	mixins: [withSearchClause('title')],
	model: {
		prop: 'activeId',
		event: 'rowClicked',
	},
	computed: {
		isActive() {
			return this.activeId === this.id;
		},
	},
	methods: {
		rowClick(e) {
			e.preventDefault();
			this.$emit('rowClicked', this.id);
		},
	},
};
</script>
