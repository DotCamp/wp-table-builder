/**
 * Local files for development
 */
import Vue from 'vue';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import LocalDevFileControl from '../containers/LocalDevFileControl';

export default {
	name: 'ControlLocalDevFile',
	handler: function localDevFileControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			components: { LocalDevFileControl },
		}).$mount(`#${uniqueId}`);
	},
};
