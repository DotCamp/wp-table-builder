import Vue from 'vue';
import PortalVue from 'portal-vue';
import VueFragment from 'vue-fragment';
import TableDataMenuApp from './containers/TableDataMenuApp';
import createStore from './stores/tableDataMenu';
import withNativeTranslationStore from './mixins/withNativeTranslationStore';
import { defaultStoreOptions as dataManager } from './stores/modules/dataManager';

// disable production tips
Vue.config.productionTip = false;

// use portals
Vue.use(PortalVue);

// translation mixin for all vue components
Vue.mixin(withNativeTranslationStore);

// use fragment
Vue.use(VueFragment.Plugin);

const menuData = { ...wptbTableDataMenu };

// clear client data
wptbTableDataMenu = undefined;

/**
 * Extra store options for table data menu.
 *
 * @type {Object}
 */
const extraStoreOptions = {
	state: {
		strings: menuData.strings,
		dataSimple: menuData.dataObjectsSimple,
		security: menuData.security,
	},
	modules: {
		dataManager,
	},
};

new Vue({
	template: '<table-data-menu-app :plugin-info="pluginInfo"></table-data-menu-app>',
	components: { TableDataMenuApp },
	store: createStore(extraStoreOptions),
	data: {
		pluginInfo: menuData.pluginInfo,
	},
}).$mount('#wptbTableDataMenuMount');
