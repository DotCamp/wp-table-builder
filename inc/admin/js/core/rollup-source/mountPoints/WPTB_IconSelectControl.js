/**
 * Icon Selection Control
 */
import Vue from 'vue';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import IconSelectControl from '../containers/IconSelectControl';

export default {
	name: 'ControlIconSelect',
	/**
	 *	Icon control script implementation.
	 *
	 * @param {string} uniqueId unique id for control element
	 */
	handler: function iconControlSelectJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);
		new Vue({
			data,
			components: { IconSelectControl },
		}).$mount(`#${uniqueId}`);
	},
};
