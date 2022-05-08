<template>
	<div class="main-save-button-wrapper" :data-disabled="!dirtyStatus">
		<a href="#" class="save-btn wptb-save-disabled wptb-settings-section-item static-active"> Save </a>
		<div class="wptb-busy">
			<div class="wptb-busy-circle"></div>
			<div class="wptb-busy-circle"></div>
			<div class="wptb-busy-circle"></div>
		</div>
		<div class="wptb-save-button-down">
			<icon name="caret-down"></icon>
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
		}),
	},
};
</script>
