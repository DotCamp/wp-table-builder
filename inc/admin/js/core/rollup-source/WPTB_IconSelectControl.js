import Vue from 'vue';
import IconSelectControl from './containers/IconSelectControl';

function iconControlSelectJS(uniqueId) {
	const data = WPTB_ControlsManager.getControlData(uniqueId);
	new Vue({
		data,
		components: { IconSelectControl },
	}).$mount('#iconSelectTest');
}

WPTB_ControlsManager.addControlScript('ControlIconSelect', iconControlSelectJS);
