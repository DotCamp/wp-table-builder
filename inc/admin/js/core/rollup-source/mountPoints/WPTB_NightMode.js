import Vue from 'vue';
import NightMode from '$Containers/NightMode';
// import BuilderStore from '$Stores/builderStore';

/**
 * Night mode component.
 */
export default {
	name: 'NightMode',
	handler: function nightModeJS(uniqueId) {
		new Vue({
			store: WPTB_Store,
			components: { NightMode },
			template: '<night-mode></night-mode>',
		}).$mount(`#${uniqueId}`);
	},
};
