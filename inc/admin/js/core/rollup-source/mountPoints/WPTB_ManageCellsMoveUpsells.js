/**
 * Tag control.
 */
import Vue from 'vue';
import ManageCellsMoveUpsells from '$Containers/ManageCellsMoveUpsells';

export default {
	name: 'ManageCellsMoveUpsells',
	handler: function manageCellsMoveUpsellsJS(uniqueId) {
		new Vue({
			components: { ManageCellsMoveUpsells },
			template: '<manage-cells-move-upsells></manage-cells-move-upsells>',
		}).$mount(`#${uniqueId}`);
	},
};
