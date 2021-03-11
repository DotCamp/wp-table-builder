<template>
	<div class="wptb-data-listing-row" :data-disabled="disabled" :data-active-row="isActive" @click="rowClick">
		{{ title }}
	</div>
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
	},
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
