<template>
	<div class="wptb-tag-control-cloud-wrapper">
		<p class="wptb-settings-item-title">{{ label }}</p>
		<div class="wptb-tag-control-cloud">
			<tag-ribbon
				@click="handleTagRibbonClick"
				v-for="tag in tags"
				:name="tag.name"
				:slug="tag.slug"
				:description="tag.description"
				:key="tag.slug"
				:button-operation-type="ribbonOperationType"
				:search-term="searchTerm"
			></tag-ribbon>
			<div v-if="tags.length === 0" class="wptb-tag-control-cloud-empty">
				{{ emptyDisplay }}
			</div>
		</div>
	</div>
</template>

<script>
import TagRibbon from './TagRibbon';
import withTranslation from '../mixins/withTranslation';

export default {
	props: {
		label: {
			type: String,
			default: 'Tag Cloud Label',
		},
		ribbonOperationType: {
			type: String,
			default: 'add',
		},
		tags: {
			type: Array,
			default: () => {
				return [];
			},
		},
		emptyDisplay: {
			type: String,
			default: 'empty',
		},
		searchTerm: {
			type: String,
			default: '',
		},
	},
	components: { TagRibbon },
	mixins: [withTranslation],
	methods: {
		handleTagRibbonClick(termSlug) {
			this.$emit('ribbonClick', termSlug);
		},
	},
};
</script>
