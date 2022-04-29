/**
 * Range slider control.
 */
/* eslint-disable camelcase */
import Vue from 'vue';
import ProOverlay from '$Containers/ProOverlay';

export default {
	name: 'ProOverlay',
	handler: function rangeControlJS(uniqueId) {
		new Vue({
			components: { ProOverlay },
		}).$mount(`#${uniqueId}`);
	},
};
