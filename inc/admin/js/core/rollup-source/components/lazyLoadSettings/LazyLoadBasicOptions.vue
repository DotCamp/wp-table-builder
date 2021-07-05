<template>
	<div class="wptb-lazy-load-basic-options wptb-controls-for-settings">
		<section-group-collapse :label="strings.basicOptions" :start-collapsed="false">
			<panel-toggle-control :label="strings.enableLazyLoad" v-model="settings.enabled"> </panel-toggle-control>
		</section-group-collapse>
	</div>
</template>

<script>
import SettingsMenuSection from '$Mixins/SettingsMenuSection';
import PanelToggleControl from '$Components/PanelToggleControl';
import SectionGroupCollapse from '$LeftPanel/SectionGroupCollapse';

export default {
	components: { SectionGroupCollapse, PanelToggleControl },
	props: {
		settings: {
			type: Object,
			required: true,
		},
	},
	mixins: [SettingsMenuSection],
};
</script>
