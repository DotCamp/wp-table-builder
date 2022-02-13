import Vue from 'vue';
import EmbedWindow from '$Containers/EmbedWindow';

export default {
	name: 'Embed',
	handler: function embedJD(uniqueId) {
		new Vue({
			components: { EmbedWindow },
			template: '<embed-window></embed-window>',
		}).$mount(`#${uniqueId}`);
	},
};
