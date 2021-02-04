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
				iconList: data.iconList,
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
					backToSelection: __('Back to source selection', 'wp-table-builder'),
					continue: __('Continue', 'wp-table-builder'),
					dragDropHint: __('Drag and drop file', 'wp-table-builder'),
					browse: __('browse', 'wp-table-builder'),
					clear: __('clear', 'wp-table-builder'),
					import: __('import', 'wp-table-builder'),
					firstRowHeader: __('first row as column names', 'wp-table-builder'),
					columnNames: __('column names', 'wp-table-builder'),
					columnName: __('column name', 'wp-table-builder'),
					column: __('Column', 'wp-table-builder'),
					color: __('Color', 'wp-table-builder'),
					values: __('values', 'wp-table-builder'),
					value: __('value', 'wp-table-builder'),
					selectRowForNames: __('select a row for column names', 'wp-table-builder'),
					cancel: __('cancel', 'wp-table-builder'),
					resetIndexRow: __('new column names row', 'wp-table-builder'),
					cancelNew: __('cancel new selection', 'wp-table-builder'),
					collapseSectionHeader: __('element data options', 'wp-table-builder'),
					rating: __('rating', 'wp-table-builder'),
					higher: __('higher than', 'wp-table-builder'),
					lower: __('lower than', 'wp-table-builder'),
					equal: __('equal', 'wp-table-builder'),
					valueColumn: __('value column', 'wp-table-builder'),
					matchValue: __('match value', 'wp-table-builder'),
					elementsMessage: __(
						'Finish your data source setup first to start working on table layout.',
						'wptb-table-builder'
					),
					dataTablePreview: __('Data table preview', 'wptb-table-builder'),
					bindings: __('bindings', 'wptb-table-builder'),
					element: __('element', 'wptb-table-builder'),
					row: __('row', 'wptb-table-builder'),
					rows: __('rows', 'wptb-table-builder'),
					auto: __('auto', 'wptb-table-builder'),
					none: __('none', 'wptb-table-builder'),
					operator: __('operator', 'wptb-table-builder'),
					text: __('text', 'wptb-table-builder'),
					link: __('link', 'wptb-table-builder'),
					icon: __('icon', 'wptb-table-builder'),
					mode: __('mode', 'wptb-table-builder'),
					type: __('type', 'wptb-table-builder'),
					amount: __('amount', 'wptb-table-builder'),
					all: __('all', 'wptb-table-builder'),
					custom: __('custom', 'wptb-table-builder'),
					compareColumn: __('compare column', 'wptb-table-builder'),
					highest: __('highest', 'wptb-table-builder'),
					lowest: __('lowest', 'wptb-table-builder'),
					not: __('not', 'wptb-table-builder'),
					target: __('target', 'wptb-table-builder'),
					direction: __('direction', 'wptb-table-builder'),
					alphabetical: __('alphabetical', 'wptb-table-builder'),
					numerical: __('numerical', 'wptb-table-builder'),
					ascending: __('ascending', 'wptb-table-builder'),
					descending: __('descending', 'wptb-table-builder'),
					selectGroupControls: __('select controls', 'wptb-table-builder'),
					sortControls: __('sort controls', 'wptb-table-builder'),
					selectControls: __('select controls', 'wptb-table-builder'),
					logicControls: __('logic controls', 'wptb-table-builder'),
					generateHeaderMessage: __('Create a layout for your data table.', 'wptb-table-builder'),
					elementNotSupported: __('This element is not supported with data tables.', 'wptb-table-builder'),
					percentage: __('percentage', 'wptb-table-builder'),
					elementColumnBasicBindingMessage: __(
						'Selected column data will be applied to table element.',
						'wptb-table-builder'
					),
					autoModeActiveMessage: __(
						'Auto row mode is active, element bindings are disabled.',
						'wptb-table-builder'
					),
					autoModeMessage: __(
						'Data will be applied to elements according to their cell order.',
						'wptb-table-builder'
					),
					emptyDataTablePreview: __(
						'No table found, generate one to preview data table',
						'wptb-table-builder'
					),
				},
				proUrl: data.proUrl,
				tableIsActive: false,
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

		// load saved data table options from table, if there is any
		const table = document.querySelector('.wptb-management_table_container .wptb-table-setup .wptb-preview-table');
		if (table && table.dataset.wptbDataTable === 'true') {
			const savedDataTableOptions = table.dataset.wptbDataTableOptions;

			if (savedDataTableOptions) {
				const decodedOptions = JSON.parse(atob(savedDataTableOptions));

				// update tableIsActive store state
				extraStoreOptions.state = { ...extraStoreOptions.state, ...decodedOptions, tableIsActive: true };
			}
		}

		new Vue({
			components: { DataTableApp },
			data,
			store: createStore(extraStoreOptions),
			template: '<data-table-app section-name="data_table_menu" :header-height="headerHeight"></data-table-app>',
		}).$mount(`#${uniqueId}`);
	},
};
