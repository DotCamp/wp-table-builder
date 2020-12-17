/**
 * Table background options menu.
 */
import Vue from 'vue';
import TableBackgroundMenu from '../containers/TableBackgroundMenu';

export default {
	name: 'BackgroundMenu',
	handler: (uniqueId) => {
		new Vue({
			components: { TableBackgroundMenu },
			template: '<table-background-menu></table-background-menu>',
		}).$mount(`#${uniqueId}`);
	},
};
