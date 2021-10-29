<template>
	<div :data-wptb-mode="currentMode" @click.prevent="setNightMode(!isActive)">
		<icon
			:name="currentIcon"
			:extra-classes="['wptb-svg-inherit-color', 'wptb-panel-night-mode-icon-container']"
		></icon>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Icon from '$Components/Icon';

const { mapGetters, mapMutations } = createNamespacedHelpers('nightMode');

export default {
	components: { Icon },
	mounted() {},
	computed: {
		currentMode() {
			return this.isActive ? 'light' : 'dark';
		},
		currentIcon() {
			return this.isActive ? 'sun' : 'cloud-moon';
		},
		...mapGetters(['isActive']),
	},
	methods: {
		...mapMutations(['setNightMode']),
	},
};
</script>
