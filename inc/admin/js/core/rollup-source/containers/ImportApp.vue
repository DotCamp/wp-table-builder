<template>
	<div>
		<portal to="childSections">
			<sections :child="true" :items="[strings.file, strings.plugins]" v-model="currentSection"> </sections>
		</portal>
		<menu-content :center="true">
			<component class="wptb-flex wptb-flex-col wptb-flex-align-center" :is="currentTemplate" :options="options">
			</component>
		</menu-content>
	</div>
</template>
<script>
import Sections from '../components/Sections.vue';
import SectionItem from '../components/SectionItem.vue';
import MenuContent from '../components/MenuContent.vue';
import CSVImportMenu from './CSVImportMenu.vue';
import PluginsImportMenu from './PluginsImportMenu.vue';

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
