<template>
	<div class="wptb-settings-header">
		<div class="wptb-settings-brand">
			<img :src="logoSrc" :alt="logoAlt" />
			<span class="wptb-settings-header-name">
				{{ pluginName }}
			</span>
		</div>
		<div class="wptb-settings-links">
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {
	props: ['logoSrc', 'logoAlt', 'pluginName'],
};
</script>
