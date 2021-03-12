<template>
	<div
		class="wptb-data-listing-row"
		:data-disabled="disabled"
		:data-active-row="isActive"
		@click="rowClick"
		v-html="finalTitle"
	></div>
</template>

<script>
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
		searchClause: {
			type: String,
			default: '',
		},
	},
	model: {
		prop: 'activeId',
		event: 'rowClicked',
	},
	computed: {
		isActive() {
			return this.activeId === this.id;
		},
		finalTitle() {
			if (this.searchClause === '') {
				return this.title;
			}

			const regexp = new RegExp(`(${this.searchClause})`, 'gi');
			return `<span class="wptb-data-listing-row-search-clause-wrap">${this.title.replaceAll(
				regexp,
				'<span class="wptb-data-listing-row-search-clause">$&</span>'
			)}</spanc>`;
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
