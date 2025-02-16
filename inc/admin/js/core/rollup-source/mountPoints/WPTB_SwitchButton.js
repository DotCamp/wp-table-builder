/* eslint-disable camelcase */
import Vue from 'vue';
import SwitchButton from '$Components/SwitchButton';
import BuilderStore from '$Stores/builderStore';

export default {
	name: 'SwitchButton',
	handler: function switchButtonJS(uniqueId) {
		new Vue({
			store: BuilderStore,
			components: { SwitchButton },
		}).$mount(`#${uniqueId}`);
	},
};
