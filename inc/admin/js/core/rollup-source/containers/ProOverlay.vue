<template>
	<div
		v-if="!proStatus"
		ref="container"
		style="font-size: 15px"
		class="wptb-upsells-pro-overlay"
		@click="toggleModal"
	>
		<ModalWindow
			:is-fixed="true"
			:visible="showModal"
			icon-name="lock"
			:icon-classes="['pro-overlay-screen-popup-icon']"
			:close-callback="toggleModal"
			:window-title="getTranslation('proFeature')"
			:message="generatedMessage"
			:button-label="getTranslation('unlockNow')"
			:button-extra-classes="['pro-overlay-modal-button']"
			:callback="handleUnlock"
		>
			<div v-html="getTranslation('useCode')"></div>
		</ModalWindow>
	</div>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from 'vuex';
import ModalWindow from '$Components/ModalWindow';

const { mapGetters: mapUpsellsGetters } = createNamespacedHelpers('upsells');

export const targetTypes = {
	SECTIONCONTAINER: 'sectionContainer',
	TARGETELEMENT: 'targetelement',
};

export default {
	props: {
		featureName: {
			type: String,
			default: 'This is',
		},
		target: {
			type: String,
			default: targetTypes.SECTIONCONTAINER,
		},
	},
	components: { ModalWindow },
	data: () => {
		return {
			showModal: false,
		};
	},
	mounted() {
		this.$nextTick(() => {
			const { container } = this.$refs;

			if (container) {
				this.positionOverlay();
			}
		});
	},
	computed: {
		generatedMessage() {
			return `<span><span style="font-weight:bold">${
				this.featureName
			}</span> is not available on your free plan. ${this.getTranslation('upgradeToPro')}</span>`;
		},
		...mapGetters(['getTranslation', 'proStatus']),
		...mapUpsellsGetters(['getUpsellUrl']),
	},
	methods: {
		toggleModal() {
			this.showModal = !this.showModal;
		},
		handleUnlock() {
			window.open(this.getUpsellUrl);
		},
		positionSectionContainer(container) {
			const parentContainer = container.parentNode.parentNode.parentNode;
			parentContainer.style.position = 'relative';
		},
		positionOverlay() {
			const { container } = this.$refs;
			switch (this.target) {
				case targetTypes.SECTIONCONTAINER:
					this.positionSectionContainer(container);
					break;
			}
		},
	},
};
</script>
