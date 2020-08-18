/**
 * @deprecated
 */
import Vue from 'vue';
import GenerateMain from './containers/GenerateMain';
import filters from './plugins/filters';

Vue.config.productionTip = false;

// filter setup
Vue.use(filters);

const proData = wptbGenerateMenuProData || {};

const data = { ...wptbGenerateMenuData, ...proData };

new Vue({
	components: { GenerateMain },
	template: '<generate-main :version="version"></generate-main>',
	data,
}).$mount(`#${data.mountId}`);
