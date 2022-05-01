<template>
	<div ref="container" style="font-size: 15px" class="wptb-upsells-pro-overlay" @click="toggleModal">
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

export default {
	props: {
		featureName: {
			type: String,
			default: 'This is',
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
				const parentContainer = container.parentNode.parentNode.parentNode;
				parentContainer.style.position = 'relative';
			}
		});
	},
	computed: {
		generatedMessage() {
			return `${this.featureName} is not available on your free plan. ${this.getTranslation('upgradeToPro')}`;
		},
		...mapGetters(['getTranslation']),
		...mapUpsellsGetters(['getUpsellUrl']),
	},
	methods: {
		toggleModal() {
			this.showModal = !this.showModal;
		},
		handleUnlock() {
			window.open(this.getUpsellUrl);
		},
	},
};
</script>
