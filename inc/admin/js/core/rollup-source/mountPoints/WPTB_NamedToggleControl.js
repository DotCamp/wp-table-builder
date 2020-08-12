/**
 * Named toggle control.
 */
import Vue from 'vue';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import NamedToggleControl from '../containers/NamedToggleControl';

export default {
	name: 'ControlNamedToggle',
	handler: function namedToggleControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			components: { NamedToggleControl },
		}).$mount(`#${uniqueId}`);
	},
};
