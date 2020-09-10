<template>
	<div class="wptb-prebuilt-card-delete-module">
		<div
			class="wptb-prebuilt-card-icon wptb-prebuilt-card-delete-icon wptb-plugin-filter-box-shadow-md-close"
			v-html="deleteIcon"
			@click.prevent.capture="toggleConfirmOverlay"
		></div>
		<transition name="wptb-fade">
			<div v-if="confirmActive" class="wptb-prebuilt-delete-module-confirmation-overlay">
				<div>
					{{ message }}
				</div>
				<div class="wptb-prebuilt-delete-button-container">
					<div
						v-html="yesIcon"
						data-wptb-button-type="positive"
						class="wptb-prebuilt-card-circle-icon-button"
						@click.prevent="confirm"
					></div>
					<div
						v-html="noIcon"
						data-wptb-button-type="negative"
						class="wptb-prebuilt-card-circle-icon-button"
						@click.prevent="toggleConfirmOverlay"
					></div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	props: {
		deleteIcon: {
			type: String,
			default: '',
		},
		message: {
			type: String,
			default: 'Delete?',
		},
		yesIcon: {
			type: String,
			default: 'Y',
		},
		noIcon: {
			type: String,
			default: 'N',
		},
	},
	data() {
		return {
			confirmActive: false,
		};
	},
	methods: {
		toggleConfirmOverlay() {
			this.confirmActive = !this.confirmActive;
		},
		confirm() {
			this.$emit('confirm');
		},
	},
};
</script>
