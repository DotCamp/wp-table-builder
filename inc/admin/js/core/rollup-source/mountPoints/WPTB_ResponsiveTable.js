/**
 * Responsive table component
 */
import Vue from 'vue';
import ResponsiveApp from '../containers/ResponsiveApp';
import ResponsiveControlsRow from '../components/ResponsiveControlsRow';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import filters from '../plugins/filters';
import strings from '../plugins/strings';

export default {
	name: 'ResponsiveTable',
	handler: function responsiveTableJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData('responsiveMenuData');
		const mainTableQuery = '.wptb-preview-table';

		/**
		 * Various options that will be used all around the app
		 *
		 * * identifyCells -> show visual unique identification for table cell elements
		 * * hasLegacyResponsive -> indicates current table has legacy responsive functionality enabled
		 *
		 */
		const appOptions = {
			identifyCells: false,
			hasLegacyResponsive: false,
		};

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

		// flux store object
		// this object implementation will give us the ability to persist the state of certain data properties across all app
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

		// app wide components that will be available for every component
		const appWideComponents = {
			// eslint-disable-next-line no-shadow
			install(Vue, { components }) {
				Vue.mixin({
					components,
				});
			},
		};

		// app wide components setup
		Vue.use(appWideComponents, { components: { ResponsiveControlsRow } });

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
