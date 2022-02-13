<template>
	<modal-window
		icon-name="clipboard"
		:visible="visibility"
		:relative-ref="relativeRef"
		:message="embedMessage"
		:button-label="buttonLabel"
		:window-title="windowTitle"
		:callback="copyToClipboard"
		:close-callback="hideModal"
		:button-extra-classes="buttonClass"
	>
		<code style="font-size: 150%">{{ generatedShortcode }}</code>
	</modal-window>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import ModalWindow from '$Components/ModalWindow';

export default {
	components: { ModalWindow },
	data: () => ({
		copyStatus: false,
	}),
	watch: {
		visibility(n) {
			// reset copy status to default at visibility change
			this.copyStatus = !n ? false : this.copyStatus;
		},
	},
	computed: {
		buttonClass() {
			const defaultClasses = [];
			if (this.copyStatus) {
				defaultClasses.push('wptb-embed-button-success');
			}

			return defaultClasses;
		},
		relativeRef() {
			return document.querySelector('.wptb-builder-panel');
		},
		embedMessage() {
			return WPTB_Store.getTranslation('embedMessage');
		},
		buttonLabel() {
			const titleId = this.copyStatus ? 'copied' : 'copyToClipboard';
			return WPTB_Store.getTranslation(titleId);
		},
		windowTitle() {
			return WPTB_Store.getTranslation('shortcode');
		},
		generatedShortcode() {
			return `[wptb id=${this.tableId}]`;
		},
		...mapGetters({ tableId: 'tableId', visibility: 'embed/visibility' }),
	},
	methods: {
		copyToClipboard() {
			if (navigator.clipboard) {
				navigator.clipboard.writeText(this.generatedShortcode);
			}

			this.copyStatus = true;
		},
		...mapMutations({
			hideModal: 'embed/hideModal',
		}),
	},
};
</script>
