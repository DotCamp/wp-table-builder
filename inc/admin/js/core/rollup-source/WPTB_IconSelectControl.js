/**
 * Icon Selection Control
 */
import Vue from 'vue';
import IconSelectControl from './containers/IconSelectControl';

/**
 *	Icon control script implementation.
 *
 * @param {string} uniqueId unique id for control element
 */
function iconControlSelectJS(uniqueId) {
	const data = WPTB_ControlsManager.getControlData(uniqueId);
	new Vue({
		data,
		components: { IconSelectControl },
	}).$mount(`#${uniqueId}`);
}

// add required scripts to global control manager to be called by content template
WPTB_ControlsManager.addControlScript('ControlIconSelect', iconControlSelectJS);
