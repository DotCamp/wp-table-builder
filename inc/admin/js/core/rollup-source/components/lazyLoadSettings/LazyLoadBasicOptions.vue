<template>
	<label>
		<input type="checkbox" v-model="settings.enabled" />
		{{ strings.enableLazyLoad }}
	</label>
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
