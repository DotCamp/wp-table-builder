<!--Import/Export admin menu component-->
<template>
	<div class="wptb-settings-wrapper">
		<menu-header :logo-src="pluginInfo.logo" :logo-alt="strings.logoAlt" :plugin-name="pluginInfo.pluginName">
			<a :href="pluginInfo.pluginHomepage">{{ strings.homepage }}</a>
		</menu-header>
		<sections v-model="currentSection" :items="[strings.importSection, strings.exportSection]">
			<portal-target name="childSections"></portal-target>
		</sections>
		<menu-content :center="true">
			<component :options="options" :plugin-info="pluginInfo" :is="currentTemplate"> </component>
		</menu-content>
		<menu-footer>
			<portal-target name="footerButtons"></portal-target>
		</menu-footer>
	</div>
</template>
<script>
import MenuHeader from '../components/MenuHeader';
import Sections from '../components/Sections';
import SectionItem from '../components/SectionItem';
import MenuFooter from '../components/MenuFooter';
import withMessage from '../mixins/withMessage';
import ImportApp from './ImportApp';
import ExportApp from './ExportApp';
import MenuContent from '../components/MenuContent';

export default {
	props: ['pluginInfo', 'options'],
	mixins: [withMessage],
	components: { ExportApp, MenuContent, ImportApp, MenuHeader, SectionItem, Sections, MenuFooter },
	data() {
		return {
			currentSection: 'Import',
		};
	},
	computed: {
		/**
		 * Get current template component name
		 *
		 * @returns {string} current template component name
		 */
		currentTemplate() {
			return `${this.currentSection}App`;
		},
	},
};
</script>
