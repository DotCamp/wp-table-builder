/**
 * Select2 control
 */
import Vue from 'vue';
import Select2Control from '../containers/Select2Control';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';

export default {
	name: 'Select2',
	handler: function select2ControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			components: { Select2Control },
		}).$mount(`#${uniqueId}`);
	},
};
