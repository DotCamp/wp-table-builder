import Vue from 'vue';
import GenerateMain from './containers/GenerateMain';
import filters from './plugins/filters';
import strings from './plugins/strings';
import genericStore from './plugins/genericStore';
import BuilderStore from '$Stores/builderStore';

Vue.config.productionTip = false;

// setup filters
Vue.use(filters);

const proData = global.wptbGenerateMenuProData ?? {};

const data = { upsell: '', ...wptbGenerateMenuData, ...proData };

// setup app store
const store = {
	teamTablePrefix: data.teamBuildTablePrefix,
	icons: data.icons,
	env: process.env.NODE_ENV,
};

// store methods
const storeMethods = {
	isDevBuild() {
		return process.env.NODE_ENV !== 'production';
	},
};

Vue.use(genericStore, { data: { key: 'appData', data: store }, methods: storeMethods });

// setup translation strings
Vue.use(strings, data);

const vm = new Vue({
	components: { GenerateMain },
	template:
		'<generate-main :dummy-pro-css="dummyProCss" :version="version" :upsell="upsell" :prebuilt-tables="prebuiltTables"  :security="security"></generate-main>',
	data,
	store: BuilderStore,
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

				WPTB_Helper.wptbDocumentEventGenerate('wptb:table:visible', document);
			}
		});

		generateWrapper.classList.add('wptb-plugin-basic-disappear');
	}
});
