<template>
	<modal-window
		icon-name="clipboard"
		:visible="visibility"
		:relative-ref="relativeRef"
		:message="embedMessage"
		:button-label="buttonLabel"
		:window-title="windowTitle"
	>
		<code>{{ generatedShortcode }}</code>
	</modal-window>
</template>

<script>
import ModalWindow from '$Components/ModalWindow';

export default {
	components: { ModalWindow },
	data: () => ({ visibility: true }),
	computed: {
		relativeRef() {
			return document.querySelector('.wptb-builder-panel');
		},
		embedMessage() {
			return WPTB_Store.getTranslation('embedMessage');
		},
		buttonLabel() {
			return WPTB_Store.getTranslation('copyToClipboard');
		},
		windowTitle() {
			return WPTB_Store.getTranslation('shortcode');
		},
		generatedShortcode() {
			return '[wptb id=]';
		},
	},
};
</script>
