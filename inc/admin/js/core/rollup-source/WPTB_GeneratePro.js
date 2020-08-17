import Vue from 'vue';
import GenerateMain from './containers/GenerateMain';

Vue.config.productionTip = false;

const proData = wptbGenerateMenuProData || {};

const data = { ...wptbGenerateMenuData, ...proData };

new Vue({
	components: { GenerateMain },
	template: '<generate-main :version="version"></generate-main>',
	data,
}).$mount(`#${data.mountId}`);
