/**
 * Tag control.
 */
import Vue from 'vue';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import TagControl from '../containers/TagControl';

export default {
	name: 'ControlTag',
	handler: function tagControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			components: { TagControl },
		}).$mount(`#${uniqueId}`);
	},
};
