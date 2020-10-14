/**
 * Sides control
 */
import Vue from 'vue';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import DifferentBorderControl from '../containers/DifferentBorderControl';

export default {
	name: 'ControlDifferentBorder',
	handler: function differentBorderControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			components: { DifferentBorderControl },
		}).$mount(`#${uniqueId}`);
	},
};
