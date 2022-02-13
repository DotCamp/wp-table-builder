<template>
	<modal-window icon-name="clipboard" :visible="true" :relative-ref="relativeRef"></modal-window>
</template>

<script>
import ModalWindow from '$Components/ModalWindow';

export default {
	components: { ModalWindow },
	computed: {
		relativeRef() {
			return document.querySelector('.wptb-builder-panel');
		},
	},
};
</script>
