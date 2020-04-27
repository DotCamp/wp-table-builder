import Vue from 'vue';
import PortalVue from 'portal-vue';
import ImportApp from './containers/ImportApp.vue';
import withStrings from './plugins/strings';

const importData = {...wptbImportMenuData};

//remove global data
wptbImportMenuData = undefined;

Vue.config.productionTip = false;

Vue.use(withStrings, {
    strings: importData.strings
});

Vue.use(PortalVue);

new Vue({
    components: {ImportApp},
    data: {
        pluginInfo: importData.pluginInfo,
        options: importData.options
    }
}).$mount('#wptb-import-menu')

