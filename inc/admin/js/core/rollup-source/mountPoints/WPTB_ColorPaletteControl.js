/**
 * Color Palette control.
 */
/* eslint-disable camelcase */
import Vue from 'vue';
import ColorPaletteControl from '$Containers/ColorPaletteControl';
import WPTB_ControlsManager from '$Functions/WPTB_ControlsManager';

export default {
	name: 'ControlColorPalette',
	handler: function colorPaletteControlJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			components: { ColorPaletteControl },
		}).$mount(`#${uniqueId}`);
	},
};
