/**
 * Range slider control.
 */
/* eslint-disable camelcase */
import Vue from 'vue';
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import MultiCheckboxControl from '../containers/MultiCheckboxControl';

export default {
	name: 'ControlMultiCheckbox',
	handler: function rangeControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);
		new Vue({
			data,
			components: { MultiCheckboxControl },
		}).$mount(`#${uniqueId}`);
	},
};
