/**
 * Extra styles control.
 */
import Vue from 'vue';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import ExtraStylesControl from '../containers/ExtraStylesControl';

export default {
	name: 'ControlExtraStyles',
	handler: function extraStylesControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			components: { ExtraStylesControl },
		}).$mount(`#${uniqueId}`);
	},
};
