/**
 * Range slider control.
 */
/* eslint-disable camelcase */
import Vue from 'vue';
import SaveButton from '$Components/SaveButton';
import BuilderStore from '$Stores/builderStore';

export default {
	name: 'SaveButton',
	handler: function saveButtonJS(uniqueId) {
		new Vue({
			store: BuilderStore,
			components: { SaveButton },
		}).$mount(`#${uniqueId}`);
	},
};
