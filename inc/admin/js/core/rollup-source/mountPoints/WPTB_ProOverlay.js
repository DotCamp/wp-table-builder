/**
 * Range slider control.
 */
/* eslint-disable camelcase */
import Vue from 'vue';
import ProOverlay from '$Containers/ProOverlay';
import WPTB_ControlsManager from '$Functions/WPTB_ControlsManager';

export default {
	name: 'ProOverlay',
	handler: function proOverlayControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			store: WPTB_Store,
			components: { ProOverlay },
		}).$mount(`#${uniqueId}`);
	},
};
