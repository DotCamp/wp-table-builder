<template>
	<fragment>
		<portal to="childSections">
			<sections :child="true" :items="childSections" :current-section="currentChildSection"></sections>
		</portal>
		<component :is="sectionComponent"></component>
	</fragment>
</template>

<script>
import Sections from '../Sections';
import TableDataEditorSection from './TableDataEditorSection';

export default {
	components: { Sections, TableDataEditorSection },
	data() {
		return {
			childSections: {
				tableDataEditorSection: this.translationM('editor'),
			},
			currentChildSection: 'tableDataEditorSection',
		};
	},
	computed: {
		sectionComponent() {
			return this.currentChildSection[0].toUpperCase() + this.currentChildSection.slice(1);
		},
	},
};
</script>
