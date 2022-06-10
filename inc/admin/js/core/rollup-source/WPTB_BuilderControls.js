/* eslint-disable camelcase */
/**
 * Main builder controls register entry point.
 *
 * This file is used to register defined builder controls to specified controls manager and let them be called by individual control elements dynamically. Instead of import/register the components automatically, explicitly specify the components that will be registered to keep track of them more easily.
 */
import Vue from 'vue';
import WPTB_IconSelectControl from '$MountPoints/WPTB_IconSelectControl';
import WPTB_RangeControl from '$MountPoints/WPTB_RangeControl';
import WPTB_Select2Control from '$MountPoints/WPTB_Select2Control';
import WPTB_MediaSelectControl from '$MountPoints/WPTB_MediaSelectControl';
import WPTB_ControlsManager from '$Functions/WPTB_ControlsManager';
import WPTB_ResponsiveTable from '$MountPoints/WPTB_ResponsiveTable';
import WPTB_SidesControl from '$MountPoints/WPTB_SidesControl';
import WPTB_NamedToggleControl from '$MountPoints/WPTB_NamedToggleControl';
import WPTB_TagControl from '$MountPoints/WPTB_TagControl';
import WPTB_DifferentBorderControl from '$MountPoints/WPTB_DifferentBorderControl';
import WPTB_LocalDevFileControl from '$MountPoints/WPTB_LocalDevFileControl';
import WPTB_NotificationManagerView from '$MountPoints/WPTB_NotificationManagerView';
import WPTB_NotificationManagerDevTool from '$MountPoints/WPTB_NotificationManagerDevTool';
import WPTB_WhatIsNew from '$MountPoints/WPTB_WhatIsNew';
import WPTB_BackgroundMenu from '$MountPoints/WPTB_BackgroundMenu';
import WPTB_ExtraStylesControl from '$MountPoints/WPTB_ExtraStylesControl';
import WPTB_MultiCheckboxControl from '$MountPoints/WPTB_MultiCheckboxControl';
import WPTB_Size2Control from '$MountPoints/WPTB_Size2Control';
import WPTB_ColorPaletteControl from '$MountPoints/WPTB_ColorPaletteControl';
import WPTB_Embed from '$MountPoints/WPTB_Embed';
import WPTB_ProOverlay from '$MountPoints/WPTB_ProOverlay';
import WPTB_SaveButton from '$MountPoints/WPTB_SaveButton';
import WPTB_Toggle3Control from '$MountPoints/WPTB_Toggle3Control';
import WPTB_ManageCellsMoveUpsells from '$MountPoints/WPTB_ManageCellsMoveUpsells';
import { setupGlobalStore } from '$Functions/globalStore';
import filters from '$Plugins/filters';

// setup up global store for builder
setupGlobalStore();

// turn off Vue production message at console
Vue.config.productionTip = false;

// enable filters
Vue.use(filters);

// eslint-disable-next-line no-restricted-globals
const global = self || this;

// adding controls manager to global space
global.WPTB_ControlsManager = WPTB_ControlsManager;

WPTB_ControlsManager.init();

const controls = [
	WPTB_IconSelectControl,
	WPTB_RangeControl,
	WPTB_ControlsManager,
	WPTB_Select2Control,
	WPTB_MediaSelectControl,
	WPTB_ResponsiveTable,
	WPTB_SidesControl,
	WPTB_NamedToggleControl,
	WPTB_TagControl,
	WPTB_DifferentBorderControl,
	WPTB_LocalDevFileControl,
	WPTB_NotificationManagerView,
	WPTB_NotificationManagerDevTool,
	WPTB_WhatIsNew,
	WPTB_BackgroundMenu,
	WPTB_ExtraStylesControl,
	WPTB_MultiCheckboxControl,
	WPTB_Size2Control,
	WPTB_ColorPaletteControl,
	WPTB_Embed,
	WPTB_ProOverlay,
	WPTB_SaveButton,
	WPTB_Toggle3Control,
	WPTB_ManageCellsMoveUpsells,
];

/**
 * Register control element.
 *
 * @param {Object} controlObject control element object
 */
function registerControl(controlObject) {
	WPTB_ControlsManager.addControlScript(controlObject.name, controlObject.handler);
}

controls.map(registerControl);
