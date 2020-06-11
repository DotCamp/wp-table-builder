/**
 * Responsive table component
 */
import Vue from 'vue';
import ResponsiveApp from '../containers/ResponsiveApp';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import filters from '../plugins/filters';
import strings from '../plugins/strings';

export default {
	name: 'ResponsiveTable',
	handler: function responsiveTableJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData('responsiveMenuData');
		const mainTableQuery = '.wptb-preview-table';

		// various app options that affects the functionality
		const appOptions = {};

		// directives for responsive features
		const directives = {
			responsiveEnabled: false,
			responsiveMode: 'auto',
			modeOptions: {
				auto: {
					topRowAsHeader: false,
					cellStackDirection: 'row',
				},
			},
		};

		const optionsStore = {
			// eslint-disable-next-line no-shadow
			install(Vue, options) {
				Vue.mixin({
					data() {
						return options.data;
					},
				});
			},
		};

		// options store setup
		Vue.use(optionsStore, { data: { appOptions, directives } });

		// filters setup
		Vue.use(filters);

		// translation strings setup
		Vue.use(strings, data);

		// vue instance
		new Vue({
			components: { ResponsiveApp },
			data: { mainTableQuery, ...data },
			template:
				'<responsive-app :clone-query="mainTableQuery" :screen-sizes="screenSizes" :compare-sizes="compareSizes"></responsive-app>',
		}).$mount(`#${uniqueId}`);
	},
};
