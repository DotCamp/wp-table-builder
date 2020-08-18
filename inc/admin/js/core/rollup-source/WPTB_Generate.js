import Vue from 'vue';
import GenerateMain from './containers/GenerateMain';
import filters from './plugins/filters';
import strings from './plugins/strings';

Vue.config.productionTip = false;

Vue.use(filters);

const proData = global.wptbGenerateMenuProData ?? {};

const data = { ...wptbGenerateMenuData, ...proData };

Vue.use(strings, data);

const vm = new Vue({
	components: { GenerateMain },
	template: '<generate-main :version="version"></generate-main>',
	data,
}).$mount(`#${data.mountId}`);

document.addEventListener('wptb:table:generated', () => {
	vm.$destroy();
	document.querySelector('.wptb-generate-wrapper').remove();
});
