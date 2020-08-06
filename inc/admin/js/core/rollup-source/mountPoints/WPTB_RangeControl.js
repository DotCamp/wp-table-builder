/**
 * Range slider control.
 */
/* eslint-disable camelcase */
import Vue from 'vue';
import RangeControl from '../containers/RangeControl';
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';

export default {
	name: 'ControlRange',
	handler: function rangeControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);
		new Vue({
			data,
			components: { RangeControl },
		}).$mount(`#${uniqueId}`);
	},
};
