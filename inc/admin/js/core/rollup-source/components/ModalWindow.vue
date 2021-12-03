<template>
	<div ref="mainWrapper" class="wptb-plugin-modal-window" v-show="visible">
		<div class="wptb-plugin-modal-inner-window">
			<div class="wptb-plugin-modal-icon"><span class="dashicons dashicons-warning"></span></div>
			<div class="wptb-plugin-modal-message">{{ message }}</div>
			<div class="wptb-plugin-modal-button-container">
				<material-button size="full-size" :click="callback">{{ strings.okay }}</material-button>
			</div>
		</div>
	</div>
</template>
<script>
import MaterialButton from '$Components/MaterialButton';

export default {
	props: {
		message: {
			type: String,
			default: 'This is a default message for modal window.',
		},
		visible: {
			type: Boolean,
			default: false,
		},
		relativeRef: {
			type: HTMLElement,
			required: true,
		},
		callback: {
			type: Function,
			default: () => {
				// eslint-disable-next-line no-console
				console.log('modal button clicked');
			},
		},
	},
	components: { MaterialButton },
	mounted() {
		this.relativeRef.appendChild(this.$refs.mainWrapper);
	},
	beforeDestroy() {
		this.$refs.mainWrapper.remove();
	},
};
</script>
