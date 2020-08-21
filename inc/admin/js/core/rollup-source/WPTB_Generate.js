import Vue from 'vue';
import GenerateMain from './containers/GenerateMain';
import filters from './plugins/filters';
import strings from './plugins/strings';

Vue.config.productionTip = false;

// setup filters
Vue.use(filters);

const proData = global.wptbGenerateMenuProData ?? {};

const data = { ...wptbGenerateMenuData, ...proData };

// setup translation strings
Vue.use(strings, data);

const vm = new Vue({
	components: { GenerateMain },
	template: '<generate-main :version="version" :ad-link="adLink" :prebuilt-tables="prebuiltTables"></generate-main>',
	data,
}).$mount(`#${data.mountId}`);

const tableContainer = document.querySelector('.wptb-management_table_container');

// hide table container
tableContainer.style.opacity = 0;
tableContainer.style.height = '0px';

document.addEventListener('wptb:table:generated', () => {
	const generateWrapper = document.querySelector('.wptb-generate-wrapper');

	if (generateWrapper) {
		generateWrapper.addEventListener('animationend', (e) => {
			if (e.animationName === 'wptb-basic-disappear') {
				vm.$destroy();
				generateWrapper.remove();
				// show table container
				tableContainer.style.opacity = 1;
				tableContainer.style.height = 'unset';
			}
		});

		generateWrapper.classList.add('wptb-plugin-basic-disappear');
	}
});
