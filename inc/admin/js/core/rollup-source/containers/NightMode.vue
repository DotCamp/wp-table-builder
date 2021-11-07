<template>
	<div ref="wrapper" :data-wptb-mode="currentMode" @click.prevent="setNightMode(!isActive)">
		<icon
			:name="currentIcon"
			:extra-classes="['wptb-svg-inherit-color', 'wptb-panel-night-mode-icon-container']"
		></icon>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Icon from '$Components/Icon';

const {
	mapState: mapStateNamespaced,
	mapGetters: mapGettersNamespaced,
	mapMutations: mapMutationsNamespaced,
} = createNamespacedHelpers('nightMode');

export default {
	components: { Icon },
	watch: {
		isActive() {
			this.startModeProcess();
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.startModeProcess();
		});
	},
	computed: {
		currentMode() {
			return this.isActive ? 'light' : 'dark';
		},
		currentIcon() {
			return this.isActive ? 'sun' : 'cloud-moon';
		},
		...mapGettersNamespaced(['isActive']),
		...mapStateNamespaced(['cssVariableMaps']),
	},
	methods: {
		startModeProcess() {
			const { ownerDocument } = this.$refs.wrapper;
			ownerDocument.documentElement.dataset.wptbNightMode = this.isActive;

			// eslint-disable-next-line array-callback-return
			Object.keys(this.cssVariableMaps).map((key) => {
				if (Object.prototype.hasOwnProperty.call(this.cssVariableMaps, key)) {
					const styleOperation = this.isActive ? 'setProperty' : 'removeProperty';
					ownerDocument.documentElement.style[styleOperation](key, this.cssVariableMaps[key]);
				}
			});
		},
		...mapMutationsNamespaced(['setNightMode']),
	},
};
</script>
