<template>
	<fragment>
		<lazy-load-pro-disabled-overlay
			:visibility="!sectionData.proStatus"
			grid-area="right"
			v-html="sectionData.upsellsElement"
		></lazy-load-pro-disabled-overlay>
		<div class="wptb-lazy-load-pro-options wptb-controls-for-settings">
			<lazy-load-general-options
				:general-disabled-status="generalDisabledStatus"
				:settings="settings"
			></lazy-load-general-options>
			<lazy-load-icon-options
				:settings="settings"
				:general-disabled-status="generalDisabledStatus"
			></lazy-load-icon-options>
			<image-load-options
				:general-disabled-status="generalDisabledStatus"
				:settings="settings"
			></image-load-options>
		</div>
	</fragment>
</template>

<script>
import SettingsMenuSection from '$Mixins/SettingsMenuSection';
import withMessage from '$Mixins/withMessage';
import LazyLoadProDisabledOverlay from '$LazyLoadSettings/LazyLoadProDisabledOverlay';
import ImageLoadOptions from '$LazyLoadSettings/ImageLoadOptions';
import LazyLoadGeneralOptions from '$LazyLoadSettings/LazyLoadGeneralOptions';
import LazyLoadIconOptions from '$LazyLoadSettings/LazyLoadIconOptions';

export default {
	props: {
		settings: {
			type: Object,
			required: true,
		},
	},
	components: {
		LazyLoadIconOptions,
		LazyLoadGeneralOptions,
		ImageLoadOptions,
		LazyLoadProDisabledOverlay,
	},
	mixins: [SettingsMenuSection, withMessage],
	computed: {
		generalDisabledStatus() {
			return this.isBusy() || !this.settings.enabled;
		},
	},
};
</script>
