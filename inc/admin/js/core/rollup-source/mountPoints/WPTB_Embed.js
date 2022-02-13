import Vue from 'vue';
import EmbedWindow from '$Containers/EmbedWindow';

export default {
	name: 'TableEmbed',
	handler: function embedJS(uniqueId) {
		new Vue({
			components: { EmbedWindow },
			template: '<embed-window></embed-window>',
		}).$mount(`#${uniqueId}`);
	},
};
