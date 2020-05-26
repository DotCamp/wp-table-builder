/* eslint-disable camelcase */
/**
 * Main builder controls register entry point.
 *
 * This file is used to register defined builder controls to specified controls manager and let them be called by individual control elements dynamically. Instead of import/register the components automatically, explicitly specify the components that will be registered to keep track of them more easily.
 */
import Vue from 'vue';
import WPTB_IconSelectControl from './mountPoints/WPTB_IconSelectControl';
import WPTB_RangeControl from './mountPoints/WPTB_RangeControl';
import WPTB_ControlsManager from './functions/WPTB_ControlsManager';

// turn off Vue production message at console
Vue.config.productionTip = false;

// eslint-disable-next-line no-restricted-globals
const global = self || this;

// adding controls manager to global space
global.WPTB_ControlsManager = WPTB_ControlsManager;

// icon select
WPTB_ControlsManager.addControlScript(WPTB_IconSelectControl.name, WPTB_IconSelectControl.handler);

// range slider
WPTB_ControlsManager.addControlScript(WPTB_RangeControl.name, WPTB_RangeControl.handler);
