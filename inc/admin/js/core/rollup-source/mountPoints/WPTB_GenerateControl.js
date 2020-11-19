/**
 * Data table menu.
 */

import Vue from 'vue';
import filters from '../plugins/filters';
import strings from '../plugins/strings';
import GenerateMain from '../containers/GenerateMain';
import createStore from '../stores/generate';

export default {
	name: 'Generate',
	handler: function dataTableJS(dataTableEnabled = true) {
		Vue.config.productionTip = false;

		// setup filters
		Vue.use(filters);

		const proData = global.wptbGenerateMenuProData ?? {};

		const data = { upsell: '', ...wptbGenerateMenuData, ...proData };

		// setup app store
		const state = {
			teamTablePrefix: data.teamBuildTablePrefix,
			icons: data.icons,
			env: process.env.NODE_ENV,
			dataTableCardEnabled: dataTableEnabled,
			strings: data.strings,
		};

		// create generate app store
		const store = createStore({ state });

		// @deprecated moved to flux store implementation
		// Vue.use(genericStore, { data: { key: 'appData', data: store }, methods: storeMethods });

		// @deprecated moved to flux store implementation
		// setup translation strings
		// Vue.use(strings, data);

		const vueMountPoint = document.querySelector(`#${data.mountId}`);

		if (!vueMountPoint) {
			const mainWrapper = document.querySelector('#generateMainWrapper');
			const mountPoint = document.createElement('div');
			mountPoint.setAttribute('id', data.mountId);
			mainWrapper.appendChild(mountPoint);
		}

		const vm = new Vue({
			components: { GenerateMain },
			template:
				'<generate-main :version="version" :upsell="upsell" :prebuilt-tables="prebuiltTables"  :security="security"></generate-main>',
			data,
			store,
		}).$mount(`#${data.mountId}`);

		const tableContainer = document.querySelector('.wptb-management_table_container');

		// hide table container
		tableContainer.style.opacity = 0;
		tableContainer.style.height = '0px';

		// destroy generate menu and activate a section from event detail
		document.addEventListener('wptb:generate:destroy', ({ detail }) => {
			const generateWrapper = document.querySelector('.wptb-generate-wrapper');

			if (generateWrapper) {
				generateWrapper.addEventListener('animationend', (e) => {
					if (e.animationName === 'wptb-basic-disappear') {
						vm.$destroy();
						generateWrapper.remove();

						WPTB_Helper.activateSection(detail);
					}
				});

				generateWrapper.classList.add('wptb-plugin-basic-disappear');
			}
		});

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
	},
};
