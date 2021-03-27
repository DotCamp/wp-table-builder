<template>
	<transition name="wptb-fade">
		<div class="wptb-data-usage-list-modal" v-if="visibility">
			<div class="wptb-data-usage-list-modal-window wptb-plugin-box-shadow-md">
				<div class="wptb-data-usage-list-modal-header">{{ title }}</div>
				<div class="wptb-data-usage-list-modal-buttons">
					<div class="wptb-data-usage-list-modal-close" @click.prevent="closeWindow">
						<span class="dashicons dashicons-no"></span>
					</div>
				</div>
				<div class="wptb-data-usage-list-content">
					<slot>
						<i>no content</i>
					</slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	props: {
		visibility: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
	},
	methods: {
		closeWindow() {
			this.$emit('close');
		},
	},
};
</script>
