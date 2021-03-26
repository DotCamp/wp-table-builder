<template>
	<div ref="mainWrapper" class="wptb-plugin-modal-window" v-show="visible">
		<div class="wptb-plugin-modal-inner-window">
			<div class="wptb-plugin-modal-icon"><span class="dashicons dashicons-warning"></span></div>
			<div class="wptb-plugin-modal-message">{{ message }}</div>
			<div class="wptb-plugin-modal-button-container">
				<material-button v-if="okayString !== undefined" :click="innerCallback(true)">{{
					okayString
				}}</material-button>
				<material-button type="danger" v-if="negativeString !== undefined" :click="innerCallback(false)">{{
					negativeString
				}}</material-button>
			</div>
		</div>
	</div>
</template>
<script>
import MaterialButton from './MaterialButton';

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
		},
		callback: {
			type: Function,
			default: () => {
				// eslint-disable-next-line no-console
				console.log('modal button clicked');
			},
		},
		okayString: {
			type: String,
		},
		negativeString: {
			type: String,
		},
	},
	components: { MaterialButton },
	mounted() {
		this.$nextTick(() => {
			if (this.relativeRef) {
				this.relativeRef.appendChild(this.$refs.mainWrapper);
			}
		});
	},
	methods: {
		innerCallback(status) {
			return () => {
				this.callback(status);
			};
		},
	},
	beforeDestroy() {
		this.$refs.mainWrapper.remove();
	},
};
</script>
