/**
 * Sides control.
 */
import Vue from 'vue';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import SidesControl from '../containers/SidesControl';
import filters from '../plugins/filters';

export default {
	name: 'ControlSides',
	handler: function sidesControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		// add filters for vue instance
		Vue.use(filters);

		new Vue({
			data,
			components: { SidesControl },
		}).$mount(`#${uniqueId}`);
	},
};
