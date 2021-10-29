/**
 * Admin menu settings script
 */

import Vue from 'vue';
import PortalVue from 'portal-vue';
import Fragment from 'vue-fragment';
import SettingsApp from './containers/SettingsApp.vue';
import withStrings from './plugins/strings.js';
import filters from './plugins/filters';
import { setupGlobalStore } from '$Functions/globalStore';

// setup store for settings menu
setupGlobalStore();

const frontendData = { ...wptbAdminSettingsData };

// remove main data from global space
wptbAdminSettingsData = undefined;

Vue.config.productionTip = false;

// strings plugin install
Vue.use(withStrings, {
	strings: frontendData.strings,
});

// vue-portal initialization
Vue.use(PortalVue);

// general filters for components
Vue.use(filters);

// vue fragment initialization
Vue.use(Fragment.Plugin);

// Vue instance
new Vue({
	components: { SettingsApp },
	data: {
		sectionsData: frontendData.sectionsData,
		settings: frontendData.data,
		pluginInfo: frontendData.pluginInfo,
	},
}).$mount(frontendData.data.mountId);
