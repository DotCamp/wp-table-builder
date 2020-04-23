import Vue from 'vue';
import ImportApp from './containers/ImportApp.vue';
import withStrings from './plugins/strings';

const importData = {...wptbImportMenuData};

//remove global data
wptbImportMenuData = undefined;

// TODO [erdembircan] remove for production
console.log(importData);

Vue.config.productionTip = false;

Vue.use(withStrings, {
    strings: importData.strings
});

new Vue({
    components: {ImportApp},
    data: {
        pluginInfo: importData.pluginInfo
    }
}).$mount('#wptb-import-menu')

