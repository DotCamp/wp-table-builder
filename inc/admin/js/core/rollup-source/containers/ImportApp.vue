<template>
	<div>
		<portal to="childSections">
			<sections
				:child="true"
				:items="{ file: { label: strings.file }, plugin: { label: strings.plugins } }"
				v-model="currentSection"
			></sections>
		</portal>
		<menu-content :center="true">
			<component class="wptb-flex wptb-flex-col wptb-flex-align-center" :is="currentTemplate" :options="options">
			</component>
		</menu-content>
	</div>
</template>
<script>
import Sections from '$Components/Sections.vue';
import SectionItem from '$Components/SectionItem.vue';
import MenuContent from '$Components/MenuContent.vue';
import CSVImportMenu from '$Containers/CSVImportMenu.vue';
import PluginsImportMenu from '$Containers/PluginsImportMenu.vue';

export default {
	props: ['options'],
	components: { Sections, SectionItem, MenuContent },
	data() {
		return {
			currentSection: 'file',
		};
	},
	methods: {
		setSection(name) {
			if (this.currentSection === name) {
				return;
			}
			this.currentSection = name;
		},
	},
	computed: {
		currentTemplate() {
			return this.currentSection === 'file' ? CSVImportMenu : PluginsImportMenu;
		},
	},
};
</script>
