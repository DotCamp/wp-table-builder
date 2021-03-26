<template>
	<transition name="wptb-fade" @after-leave="transitionAfterLeave">
		<div ref="mainWrapper" class="wptb-plugin-modal-window" v-show="visibility">
			<div class="wptb-plugin-modal-inner-window">
				<div class="wptb-plugin-modal-icon"><span class="dashicons dashicons-warning"></span></div>
				<div class="wptb-plugin-modal-message">{{ message }}</div>
				<div class="wptb-plugin-modal-button-container">
					<material-button v-if="positiveButton !== null" :click="innerCallback(true)"
						>{{ positiveButton }}
					</material-button>
					<material-button type="danger" v-if="negativeButton !== null" :click="innerCallback(false)"
						>{{ negativeButton }}
					</material-button>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import MaterialButton from '../MaterialButton';

export default {
	props: {
		relativeRef: {
			type: HTMLElement,
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
	computed: {
		...mapGetters('modalWindow', ['visibility', 'message', 'positiveButton', 'negativeButton']),
	},
	methods: {
		innerCallback(status) {
			return () => {
				this.buttonClick(status);
			};
		},
		transitionAfterLeave() {
			// after modal window is hidden with button click, reset modal state to defaults
			this.resetModalWindow();
		},
		...mapActions('modalWindow', ['buttonClick', 'resetModalWindow']),
	},
	beforeDestroy() {
		this.$refs.mainWrapper.remove();
	},
};
</script>
