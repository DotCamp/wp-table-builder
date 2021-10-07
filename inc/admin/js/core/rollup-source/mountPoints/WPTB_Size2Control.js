/**
 * Size2 control.
 */
import Vue from 'vue';
import Size2Control from '../containers/Size2Control';
import filters from '../plugins/filters';

export default {
	name: 'ControlSize2',
	handler: function size2ControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		// use filters
		Vue.use(filters);

		new Vue({
			components: { Size2Control },
			data,
		}).$mount(`#${uniqueId}`);
	},
};
