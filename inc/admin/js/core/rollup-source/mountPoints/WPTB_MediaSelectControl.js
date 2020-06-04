/**
 * Media select control
 */
/* eslint-disable camelcase */
import Vue from 'vue';
import MediaSelectControl from '../containers/MediaSelectControl';
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';

export default {
	name: 'ControlMediaSelect',
	handler: function rangeControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);
		new Vue({
			data,
			components: { MediaSelectControl },
		}).$mount(`#${uniqueId}`);
	},
};
