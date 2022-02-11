<template>
	<div ref="mainWrapper" class="wptb-plugin-modal-window" v-show="visible">
		<div class="wptb-plugin-modal-inner-window">
			<div class="wptb-plugin-modal-icon">
				<icon
					class="wptb-plugin-modal-icon-parent-wrapper"
					:name="iconName"
					:extra-classes="iconClasses"
				></icon>
			</div>
			<div class="wptb-plugin-modal-message">{{ message }}</div>
			<div class="wptb-plugin-modal-button-container">
				<material-button size="full-size" :click="callback">{{ buttonLabel }}</material-button>
			</div>
		</div>
	</div>
</template>
<script>
import MaterialButton from '$Components/MaterialButton';
import Icon from './Icon';

export default {
	props: {
		message: {
			type: String,
			default: 'This is a default message for modal window.',
		},
		iconName: {
			type: String,
			default: 'exclamation-circle',
		},
		iconClasses: {
			type: Array,
			default: () => ['wptb-plugin-modal-icon-inner-wrapper', 'wptb-svg-inherit-color'],
		},
		buttonLabel: {
			type: String,
			default: 'Okay',
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
	components: { Icon, MaterialButton },
	mounted() {
		this.relativeRef.appendChild(this.$refs.mainWrapper);
	},
	beforeDestroy() {
		this.$refs.mainWrapper.remove();
	},
};
</script>
