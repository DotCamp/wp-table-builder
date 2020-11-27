<template>
	<div class="wptb-element-option wptb-settings-items wptb-plugin-width-full">
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<div
				class="wptb-control-row wptb-flex wptb-flex-row wptb-flex-align-center wptb-flex-justify-space-between wptb-panel-message"
			>
				{{ message }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		message: {
			type: String,
			default: 'Message',
		},
	},
};
</script>

<style scoped></style>
