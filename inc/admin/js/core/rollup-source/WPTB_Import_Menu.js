/**
 * Import/Export menu script
 */
import Vue from 'vue';
import PortalVue from 'portal-vue';
import ImportExportApp from './containers/ImportExportApp';
import withStrings from './plugins/strings';
import Translations from './plugins/translations';

const importData = { ...wptbImportMenuData };

// remove global data
wptbImportMenuData = undefined;

Vue.config.productionTip = false;

Vue.use(withStrings, {
	strings: importData.strings,
});

Vue.use(Translations, {
	textDomain: importData.options.textDomain,
});

Vue.use(PortalVue);

new Vue({
	components: { ImportExportApp },
	data: {
		pluginInfo: importData.pluginInfo,
		options: importData.options,
	},
}).$mount('#wptb-import-menu');
