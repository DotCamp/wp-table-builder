/**
 * Data table menu.
 */
import Vue from 'vue';
import DataTableApp from '../containers/DataTableApp';

export default {
	name: 'DataTable',
	handler: function dataTableJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData('dataTableData');
		new Vue({
			components: { DataTableApp },
			data,
			template: '<data-table-app section-name="data_table_menu" :header-height="headerHeight"></data-table-app>',
		}).$mount(`#${uniqueId}`);
	},
};
