/**
 * Data table menu.
 */
import Vue from 'vue';
import Fragment from 'vue-fragment';
import { __ } from '@wordpress/i18n';
import VuePortal from 'portal-vue';
import DataTableApp from '../containers/DataTableApp';
import createStore from '../stores/dataTables';
import filters from '../plugins/filters';

export default {
	name: 'DataTable',
	handler: function dataTableJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData('dataTableData');

		// extra options for store
		const extraStoreOptions = {
			state: {
				icons: data.icons,
				strings: {
					dataSourceHeader: __('Select your data source', 'wp-table-builder'),
					csvTitle: __('CSV', 'wp-table-builder'),
					csvInfo: __('Upload a CSV file or create your own data on the go.', 'wp-table-builder'),
					databaseTitle: __('Database', 'wp-table-builder'),
					databaseInfo: __('Select a local database table for your data.', 'wp-table-builder'),
					wordpressPostTitle: __('WordPress Post', 'wp-table-builder'),
					wordpressPostInfo: __(
						'Query post data for your table including custom post types.',
						'wp-table-builder'
					),
					remoteTitle: __('remote', 'wp-table-builder'),
					remoteInfo: __('Select a remote database for your data', 'wp-table-builder'),
					sourceSelectLeftPanelInfo: __(
						'Select your data source that will populate your table.',
						'wp-table-builder'
					),
					csvSetupLeftPanelInfo: __(
						'Setup your CSV source, either from a file or start creating your own data with data editor.',
						'wp-table-builder'
					),
					dataManager: __('data manager', 'wp-table-builder'),
					csvControlHeader: __('csv source', 'wp-table-builder'),
					csvDelimiter: __('csv delimiter', 'wp-table-builder'),
					commaDelimiter: __(', (comma)', 'wp-table-builder'),
					createYourData: __('create your own data', 'wp-table-builder'),
					back: __('Back', 'wp-table-builder'),
					continue: __('Continue', 'wp-table-builder'),
					dragDropHint: __('Drag and drop file', 'wp-table-builder'),
					browse: __('browse', 'wp-table-builder'),
					clear: __('clear', 'wp-table-builder'),
					import: __('import', 'wp-table-builder'),
					firstRowHeader: __('first row as column name', 'wp-table-builder'),
				},
				proUrl: data.proUrl,
			},
			getters: {
				/**
				 * Get translated text from store.
				 *
				 * @param {Object} state store state
				 * @return {Function} function to get translation
				 */
				translation(state) {
					return (key) => {
						return state.strings[key];
					};
				},
				/**
				 * Get icon from store.
				 *
				 * @param {Object} state store state
				 * @return {Function} function to use to get icon from store
				 */
				getIcon: (state) => (iconId) => {
					return state.icons[iconId];
				},
			},
		};

		// portal initialization for vue instance
		Vue.use(VuePortal);

		// fragment initialization
		Vue.use(Fragment.Plugin);

		// use default filters
		Vue.use(filters);

		new Vue({
			components: { DataTableApp },
			data,
			store: createStore(extraStoreOptions),
			template: '<data-table-app section-name="data_table_menu" :header-height="headerHeight"></data-table-app>',
		}).$mount(`#${uniqueId}`);
	},
};
