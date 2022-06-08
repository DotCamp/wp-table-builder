<template>
	<div
		v-if="!proStatus"
		ref="container"
		style="font-size: 15px"
		class="wptb-upsells-pro-overlay"
		@click.prevent.stop.capture="toggleModal"
	>
		<ModalWindow
			ref="modalWindow"
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
import BuilderStore from '$Stores/builderStore';

const { mapGetters: mapUpsellsGetters } = createNamespacedHelpers('upsells');

export const targetTypes = {
	SECTIONCONTAINER: 'sectionContainer',
	PARENT: 'parent',
	APPEND: 'append',
};

export default {
	props: {
		featureName: {
			type: String,
			default: 'This',
		},
		target: {
			type: String,
			default: targetTypes.SECTIONCONTAINER,
		},
		explicitStore: {
			type: Boolean,
			default: false,
		},
		appendTarget: {
			type: Node,
			default: null,
		},
		appendTargetQuery: {
			type: String,
			default: null,
		},
	},
	components: { ModalWindow },
	data: () => {
		return {
			showModal: false,
		};
	},
	created() {
		// if enabled, use builder store explicitly
		if (this.explicitStore) {
			this.$store = BuilderStore;
		}
	},
	mounted() {
		this.$nextTick(() => {
			const { container, modalWindow } = this.$refs;

			if (container) {
				this.positionOverlay();

				this.positionModalWindow(modalWindow.$el);
			}
		});
	},
	computed: {
		generatedMessage() {
			return `<span><span style="font-weight:bold; text-transform: capitalize">${
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

		positionParent(container) {
			const parentContainer = container.parentNode;
			parentContainer.style.position = 'relative';
		},
		appendToTarget(container) {
			const finalTarget = this.appendTarget ?? document.querySelector(this.appendTargetQuery);
			if (finalTarget) {
				finalTarget.style.position = 'relative';
				finalTarget.appendChild(container);
			}
		},
		positionModalWindow(modalWindowElement) {
			document.body.appendChild(modalWindowElement);
		},
		positionOverlay() {
			const { container } = this.$refs;

			// eslint-disable-next-line default-case
			switch (this.target) {
				case targetTypes.SECTIONCONTAINER:
					this.positionSectionContainer(container);
					break;
				case targetTypes.PARENT:
					this.positionParent(container);
					break;
				case targetTypes.APPEND:
					this.appendToTarget(container);
					break;
			}
		},
	},
};
</script>
