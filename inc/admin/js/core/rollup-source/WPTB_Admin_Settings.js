/**
 * Admin menu settings script
 */

import Vue from 'vue';
import SettingsApp from './containers/SettingsApp.vue';
import withStrings from './plugins/strings.js';

const frontendData = { ...wptbAdminSettingsData };

// remove main data from global space
wptbAdminSettingsData = undefined;

Vue.config.productionTip = false;

// strings plugin install
Vue.use(withStrings, {
	strings: frontendData.strings,
});

// Vue instance
new Vue({
	components: { SettingsApp },
	data: {
		fieldsData: frontendData.fields,
		settings: frontendData.data,
		pluginInfo: frontendData.pluginInfo,
	},
}).$mount(frontendData.data.mountId);
