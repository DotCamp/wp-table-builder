import Vue from 'vue';
import ImageSizeControl from '../containers/ImageSizeControl';

export default {
	name: 'ImageSize',
	handler: function imageSizeControlJs(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			components: { ImageSizeControl },
		}).$mount(`#${uniqueId}`);
	},
};
