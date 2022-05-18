<template>
	<div class="main-save-button-wrapper" :data-disabled="!dirtyStatus">
		<div class="save-btn wptb-settings-section-item static-active">
			<span>Save</span>
			<div class="save-button-down">
				<icon name="caret-down"></icon>
			</div>
		</div>
		<div class="save-button-extra-options-wrapper">
			<div class="extra-save-button">{{ getTranslation('table') }}</div>
			<div class="extra-save-button">{{ getTranslation('template') }}</div>
		</div>
		<div class="wptb-busy">
			<div class="wptb-busy-circle"></div>
			<div class="wptb-busy-circle"></div>
			<div class="wptb-busy-circle"></div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Icon from '$Components/Icon';

export default {
	components: { Icon },
	computed: {
		...mapGetters({
			dirtyStatus: 'getTableDirtyStatus',
			getTranslation: 'getTranslation',
		}),
	},
};
</script>
