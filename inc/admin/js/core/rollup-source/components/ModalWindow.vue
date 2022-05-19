<template>
	<div ref="mainWrapper" class="wptb-plugin-modal-window" :data-is-fixed="isFixed" v-show="visible">
		<div class="wptb-plugin-modal-inner-window">
			<div class="wptb-plugin-modal-header" v-if="windowTitle">
				<div class="wptb-plugin-modal-header-title">{{ windowTitle | cap }}</div>
				<div class="wptb-plugin-modal-header-close" @click.prevent.capture.stop="closeCallback">
					<div class="wptb-plugin-modal-close-wrapper">X</div>
				</div>
			</div>
			<div class="wptb-plugin-modal-content-container">
				<div class="wptb-plugin-modal-icon">
					<icon
						class="wptb-plugin-modal-icon-parent-wrapper"
						:name="iconName"
						:extra-classes="iconFinalClasses"
					></icon>
				</div>
				<div class="wptb-plugin-modal-message" v-html="message"></div>
				<div class="wptb-plugin-modal-slot-container">
					<slot></slot>
				</div>
				<div class="wptb-plugin-modal-button-container">
					<material-button :class="buttonExtraClasses" size="full-size" :click="callback">{{
						buttonLabel | cap
					}}</material-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import MaterialButton from '$Components/MaterialButton';
import Icon from '$Components/Icon';

export default {
	props: {
		isFixed: {
			type: Boolean,
			default: false,
		},
		buttonExtraClasses: {
			type: Array,
			default: () => [],
		},
		windowTitle: {
			type: null,
			default: null,
		},
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
			default: () => [],
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
			required: false,
		},
		callback: {
			type: Function,
			default: () => {
				// eslint-disable-next-line no-console
				console.log('modal button clicked');
			},
		},
		closeCallback: {
			type: Function,
			default: () => {
				// eslint-disable-next-line no-console
				console.log('modal window close');
			},
		},
	},
	components: { Icon, MaterialButton },
	data() {
		return {
			iconFinalClasses: [],
		};
	},
	mounted() {
		this.$nextTick(() => {
			if (!this.isFixed) {
				this.relativeRef.appendChild(this.$refs.mainWrapper);
			}
			this.prepareFinalClasses(this.iconClasses);
		});
	},
	watch: {
		iconClasses() {
			this.prepareFinalClasses();
		},
	},
	methods: {
		prepareFinalClasses() {
			const defaultClasses = ['wptb-plugin-modal-icon-inner-wrapper'];

			this.iconFinalClasses = Array.from(new Set([...this.iconClasses, ...defaultClasses]));
		},
	},
	beforeDestroy() {
		if (!this.isFixed) {
			this.$refs.mainWrapper.parentNode.removeChild(this.$refs.mainWrapper);
		}
	},
};
</script>
