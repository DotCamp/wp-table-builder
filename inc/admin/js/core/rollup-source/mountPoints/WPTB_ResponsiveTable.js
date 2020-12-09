/**
 * Responsive table component
 */
import Vue from 'vue';
import ResponsiveApp from '../containers/ResponsiveApp';
import ResponsiveControlsRow from '../components/ResponsiveControlsRow';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import filters from '../plugins/filters';
import ResponsivePanelGeneralControls from '../components/ResponsivePanelGeneralControls';
import ResponsivePanelModeControls from '../components/ResponsivePanelModeControls';
import createStore from '../stores/responsive';

export default {
	name: 'ResponsiveTable',
	handler: function responsiveTableJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData('responsiveMenuData');
		let mainTableQuery = '.wptb-preview-table';

		// query for target table where directives will be saved to
		const targetTableQuery = '.wptb-preview-table';

		const isDataTableEnabled = document.querySelector(mainTableQuery).dataset.wptbDataTable === 'true';

		if (isDataTableEnabled) {
			mainTableQuery = '.wptb-data-table-preview-content .wptb-preview-table';
		}

		/**
		 * Various options that will be used all around the app
		 *
		 * * identifyCells -> show visual unique identification for table cell elements
		 * * hasLegacyResponsive -> indicates current table has legacy responsive functionality enabled
		 * * currentBreakpoint -> id of the current breakpoint
		 * * currentSize -> current screen size value that is being used in responsive builder. this is not the actual screen size value of the current window but a mock up value to provide a display of table's layout at different sizes
		 *
		 */
		const appOptions = {
			identifyCells: false,
			hasLegacyResponsive: false,
			currentBreakpoint: 'desktop',
			currentSize: 0,
		};

		// directives for responsive features
		// add default options value at here instead of assigning them at app dynamically. this way, default options can be used for error checking and will prevent bugs/security concerns beforehand
		const directives = {
			responsiveEnabled: false,
			responsiveMode: 'auto',
			preserveRowColor: false,
			relativeWidth: 'window',
			modeOptions: {
				auto: {
					topRowAsHeader: {
						desktop: false,
						tablet: false,
						mobile: false,
					},
					staticTopRow: {
						desktop: false,
						tablet: false,
						mobile: false,
					},
					cellStackDirection: {
						desktop: 'row',
						tablet: 'row',
						mobile: 'row',
					},
					cellsPerRow: {
						desktop: 1,
						tablet: 1,
						mobile: 1,
					},
				},
			},
			breakpoints: data.screenSizes,
		};

		// singleton store object
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

		// @deprecated moved to vuex store
		// // translation strings setup
		// Vue.use(strings, data);

		const store = createStore({ state: { strings: data.strings } });

		// vue builder instance
		new Vue({
			components: { ResponsiveApp },
			data: { mainTableQuery, targetTableQuery, ...data },
			store,
			template:
				'<responsive-app :target-query="targetTableQuery" :clone-query="mainTableQuery" :screen-sizes="screenSizes" :compare-sizes="compareSizes"></responsive-app>',
		}).$mount(`#${uniqueId}`);

		// left panel general controls instance
		new Vue({
			components: { ResponsivePanelGeneralControls },
			store,
			template: '<responsive-panel-general-controls></responsive-panel-general-controls>',
		}).$mount('#responsiveBuilderLeftPanelGeneralControls');

		// left panel mode controls
		new Vue({
			components: { ResponsivePanelModeControls },
			data: { ...data },
			store,
			template: '<responsive-panel-mode-controls></responsive-panel-mode-controls>',
		}).$mount('#responsiveBuilderLeftPanelModeOptions');
	},
};
