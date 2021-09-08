<!--Import/Export admin menu component-->
<template>
	<div class="wptb-settings-wrapper">
		<menu-header :logo-src="pluginInfo.logo" :logo-alt="strings.logoAlt" :plugin-name="pluginInfo.pluginName">
			<a :href="pluginInfo.pluginHomepage">{{ strings.homepage }}</a>
		</menu-header>
		<sections
			v-model="currentSection"
			:items="{
				Import: { label: strings.importSection },
				Export: { label: strings.exportSection },
			}"
		>
			<portal-target name="childSections"></portal-target>
		</sections>
		<menu-content :center="true">
			<component :options="options" :plugin-info="pluginInfo" :is="currentTemplate"></component>
		</menu-content>
		<menu-footer>
			<portal-target name="footerButtons"></portal-target>
		</menu-footer>
	</div>
</template>
<script>
import MenuHeader from '$Components/MenuHeader';
import Sections from '$Components/Sections';
import SectionItem from '$Components/SectionItem';
import MenuFooter from '$Components/MenuFooter';
import withMessage from '$Mixins/withMessage';
import ImportApp from '$Containers/ImportApp';
import ExportApp from '$Containers/ExportApp';
import MenuContent from '$Components/MenuContent';

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
		 * @return {string} current template component name
		 */
		currentTemplate() {
			return `${this.currentSection}App`;
		},
	},
};
</script>
