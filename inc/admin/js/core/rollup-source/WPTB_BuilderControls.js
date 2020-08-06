/* eslint-disable camelcase */
/**
 * Main builder controls register entry point.
 *
 * This file is used to register defined builder controls to specified controls manager and let them be called by individual control elements dynamically. Instead of import/register the components automatically, explicitly specify the components that will be registered to keep track of them more easily.
 */
import Vue from 'vue';
import WPTB_IconSelectControl from './mountPoints/WPTB_IconSelectControl';
import WPTB_RangeControl from './mountPoints/WPTB_RangeControl';
import WPTB_Select2Control from './mountPoints/WPTB_Select2Control';
import WPTB_MediaSelectControl from './mountPoints/WPTB_MediaSelectControl';
import WPTB_ControlsManager from './functions/WPTB_ControlsManager';
import WPTB_ResponsiveTable from './mountPoints/WPTB_ResponsiveTable';
import WPTB_SidesControl from './mountPoints/WPTB_SidesControl';
import WPTB_NamedToggleControl from './mountPoints/WPTB_NamedToggleControl';

// turn off Vue production message at console
Vue.config.productionTip = false;

// eslint-disable-next-line no-restricted-globals
const global = self || this;

// adding controls manager to global space
global.WPTB_ControlsManager = WPTB_ControlsManager;

const controls = [
	WPTB_IconSelectControl,
	WPTB_RangeControl,
	WPTB_ControlsManager,
	WPTB_Select2Control,
	WPTB_MediaSelectControl,
	WPTB_ResponsiveTable,
	WPTB_SidesControl,
	WPTB_NamedToggleControl,
];

/**
 * Register control element.
 *
 * @param {object} controlObject control element object
 */
function registerControl(controlObject) {
	WPTB_ControlsManager.addControlScript(controlObject.name, controlObject.handler);
}

controls.map(registerControl);
