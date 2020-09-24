<template>
	<div class="wptb-tag-ribbon-wrapper">
		<div class="wptb-tag-ribbon-name">{{ name }}</div>
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
	},
	methods: {
		handleClick() {
			this.$emit('click', this.slug);
		},
	},
};
</script>
