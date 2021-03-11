<template>
	<div class="wptb-menu-page-wrapper">
		<div class="wptb-settings-wrapper">
			<menu-header
				:logo-src="pluginInfo.logo"
				:logo-alt="translationM('homepage')"
				:plugin-name="pluginInfo.pluginName"
			>
				<a :href="pluginInfo.pluginHomepage">{{ translationM('homepage') }}</a>
			</menu-header>
			<sections :items="sections" v-model="currentSection">
				<portal-target name="childSections"></portal-target>
			</sections>
			<component :is="currentSectionComponent"></component>
			<menu-footer>
				<portal-target name="footerButtons"></portal-target>
			</menu-footer>
		</div>
		<message-listener></message-listener>
	</div>
</template>
<script>
import MenuHeader from '../components/MenuHeader';
import MenuFooter from '../components/MenuFooter';
import Sections from '../components/Sections';
import TableDataSection from '../components/tableDataMenu/TableDataSection';
import MessageListener from '../components/tableDataMenu/MessageListener';

export default {
	props: {
		message: {
			type: String,
			default: 'message',
		},
		pluginInfo: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	components: { MessageListener, MenuHeader, MenuFooter, Sections, TableDataSection },
	data() {
		return {
			sections: {
				tableDataSection: this.translationM('tableData'),
			},
			currentSection: 'tableDataSection',
		};
	},
	computed: {
		currentSectionComponent() {
			return 'TableDataSection';
		},
	},
};
</script>
