<template>
	<div class="wptb-tag-ribbon-wrapper" :title="description">
		<div class="wptb-tag-ribbon-name" v-html="searchIndicatedName"></div>
		<div
			@click.prevent="handleClick"
			class="wptb-tag-operation-button"
			:class="buttonClass"
			v-html="buttonIcon"
		></div>
	</div>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			default: 'tag name',
		},
		slug: {
			type: String,
			default: 'tagSlug',
		},
		description: {
			type: String,
			default: '',
		},
		addIcon: {
			type: String,
			default: '+',
		},
		removeIcon: {
			type: String,
			default: '-',
		},
		buttonOperationType: {
			type: String,
			default: 'add',
		},
		searchTerm: {
			type: String,
			default: '',
		},
	},
	computed: {
		buttonIcon() {
			return this.buttonOperationType === 'add' ? this.addIcon : this.removeIcon;
		},
		buttonClass() {
			return {
				'wptb-tag-operation-add-button': this.buttonOperationType === 'add',
				'wptb-tag-operation-remove-button': this.buttonOperationType !== 'add',
			};
		},
		searchIndicatedName() {
			const regex = new RegExp(`${this.searchTerm}`, 'gi');
			return this.name.replaceAll(regex, '<span class="wptb-tag-control-search-indicator">$&</span>');
		},
	},
	methods: {
		handleClick() {
			this.$emit('click', this.slug);
		},
	},
};
</script>
