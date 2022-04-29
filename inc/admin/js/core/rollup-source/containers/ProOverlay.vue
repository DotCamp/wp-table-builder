<template>
	<div ref="container" class="wptb-upsells-pro-overlay" @click="toggleModal">
		<ModalWindow
			:is-fixed="true"
			:visible="showModal"
			icon-name="lock"
			:icon-classes="['pro-overlay-screen-popup-icon']"
			:close-callback="toggleModal"
		></ModalWindow>
	</div>
</template>

<script>
import ModalWindow from '$Components/ModalWindow';

export default {
	components: { ModalWindow },
	data: () => ({ showModal: false }),
	mounted() {
		this.$nextTick(() => {
			const { container } = this.$refs;

			if (container) {
				const parentContainer = container.parentNode.parentNode.parentNode;
				parentContainer.style.position = 'relative';
			}
		});
	},
	methods: {
		toggleModal() {
			this.showModal = !this.showModal;
		},
	},
};
</script>
