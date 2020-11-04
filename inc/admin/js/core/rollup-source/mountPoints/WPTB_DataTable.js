/**
 * Data table menu.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import DataTableApp from '../containers/DataTableApp';
import store from '../stores/dataTables';

export default {
	name: 'DataTable',
	handler: function dataTableJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData('dataTableData');

		new Vue({
			components: { DataTableApp },
			data,
			store,
			template: '<data-table-app section-name="data_table_menu" :header-height="headerHeight"></data-table-app>',
		}).$mount(`#${uniqueId}`);
	},
};
