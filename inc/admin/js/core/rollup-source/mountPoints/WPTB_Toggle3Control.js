/**
 * Toggle 3 control.
 */
import Vue from 'vue';
import Toggle3Control from '$Containers/Toggle3Control';
/* eslint-disable camelcase */
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';

export default {
	name: 'Toggle3',
	handler: function rangeControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);
		new Vue({
			data,
			components: { Toggle3Control },
		}).$mount(`#${uniqueId}`);
	},
};
