<template>
	<div class="wptb-lazy-load-basic-options">
		<label>
			<input type="checkbox" v-model="settings.enabled" />
			{{ strings.enableLazyLoad }}
		</label>
	</div>
</template>

<script>
import SettingsMenuSection from '$Mixins/SettingsMenuSection';

export default {
	props: {
		settings: {
			type: Object,
			required: true,
		},
	},
	mixins: [SettingsMenuSection],
};
</script>
