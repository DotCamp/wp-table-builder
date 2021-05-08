import WPTB_ExtraStyles from '../WPTB_ExtraStyles';

const shadowDocument = document.querySelector('#wptb-block-preview-base').shadowRoot;

WPTB_ExtraStyles.applyStyles(WPTB_ExtraStyles.modes.block, null, shadowDocument);
