import Vue from 'vue';
import GenerateMain from './containers/GenerateMain';

Vue.config.productionTip = false;

const data = wptbGenerateMenuData;

new Vue({
	components: { GenerateMain },
	template: '<generate-main :version="version"></generate-main>',
	data,
}).$mount(`#${data.mountId}`);
