import Vue from 'vue';
import EmbedWindow from '$Containers/EmbedWindow';
import withGlobalStoreVue from '$Mixins/withGlobalStoreVue';

export default {
	name: 'TableEmbed',
	handler: function embedJS(uniqueId) {
		new Vue(
			withGlobalStoreVue({
				components: { EmbedWindow },
				template: '<embed-window></embed-window>',
			})
		).$mount(`#${uniqueId}`);
	},
};
