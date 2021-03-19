<template>
	<fragment>
		<portal to="childSections">
			<sections :child="true" :items="childSections" v-model="currentChildSection"></sections>
		</portal>
		<component :is="sectionComponent"></component>
	</fragment>
</template>

<script>
import Sections from '../Sections';
import TableDataEditorSection from './TableDataEditorSection';
import TableDataCreateNewSection from './TableDataCreateNewSection';

export default {
	components: { Sections, TableDataEditorSection, TableDataCreateNewSection },
	data() {
		return {
			childSections: {
				tableDataEditorSection: this.translationM('editor'),
				tableDataCreateNewSection: this.translationM('new'),
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
