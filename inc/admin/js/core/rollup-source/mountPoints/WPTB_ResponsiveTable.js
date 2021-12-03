/**
 * Responsive table component
 */
import Vue from 'vue';
import ResponsiveApp from '$Containers/ResponsiveApp';
import ResponsiveControlsRow from '$Components/ResponsiveControlsRow';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '$Functions/WPTB_ControlsManager';
import filters from '$Plugins/filters';
import strings from '$Plugins/strings';
import ResponsivePanelGeneralControls from '$Components/ResponsivePanelGeneralControls';
import ResponsivePanelModeControls from '$Components/ResponsivePanelModeControls';

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
		 * * currentBreakpoint -> id of the current breakpoint
		 * * currentSize -> current screen size value that is being used in responsive builder. this is not the actual screen size value of the current window but a mock-up value to provide a display of table's layout at different sizes
		 */
		const appOptions = {
			identifyCells: false,
			hasLegacyResponsive: false,
			currentBreakpoint: 'tablet',
			currentSize: 0,
			breakpointCustomization: data.enableBreakpointCustomization,
			isPro: data.isPro,
		};

		// directives for responsive features
		// add default options value at here instead of assigning them at app dynamically. this way, default options can be used for error checking and will prevent bugs/security concerns beforehand
		const directives = {
			responsiveEnabled: false,
			responsiveMode: 'auto',
			preserveRowColor: false,
			relativeWidth: 'window',
			headerFullyMerged: false,
			modeOptions: {
				auto: {
					disabled: {
						desktop: false,
						tablet: false,
						mobile: false,
					},
					topRowAsHeader: {
						desktop: false,
						tablet: true,
						mobile: true,
					},
					repeatMergedHeader: {
						desktop: true,
						tablet: true,
						mobile: true,
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

		// translation strings setup
		Vue.use(strings, data);

		// vue builder instance
		new Vue({
			components: { ResponsiveApp },
			data: { mainTableQuery, ...data },
			template:
				'<responsive-app :clone-query="mainTableQuery" :screen-sizes="screenSizes" :compare-sizes="compareSizes"></responsive-app>',
		}).$mount(`#${uniqueId}`);

		// left panel general controls instance
		new Vue({
			components: { ResponsivePanelGeneralControls },
			template: '<responsive-panel-general-controls></responsive-panel-general-controls>',
		}).$mount('#responsiveBuilderLeftPanelGeneralControls');

		// left panel mode controls
		new Vue({
			components: { ResponsivePanelModeControls },
			data: { ...data },
			template: '<responsive-panel-mode-controls></responsive-panel-mode-controls>',
		}).$mount('#responsiveBuilderLeftPanelModeOptions');
	},
};
