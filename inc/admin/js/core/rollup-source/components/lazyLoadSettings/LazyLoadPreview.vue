<template>
	<div class="wptb-lazy-load-preview-container wptb-flex wptb-flex-justify-center wptb-flex-align-center">
		<div class="wptb-lazy-load-preview-header">{{ strings.preview }}</div>
		<lazy-load-pro-disabled-overlay
			grid-area="preview"
			:visibility="!sectionData.proStatus || !settings.enabled"
		></lazy-load-pro-disabled-overlay>
		<div ref="previewContainer" class="wptb-lazy-load-preview wptb-preview-table"></div>
		<div class="wptb-lazy-load-preview-button-container wptb-flex wptb-flex-justify-center wptb-flex-align-center">
			<material-button :disabled="resetButtonStatus" :click="reloadPreview">Reset</material-button>
			<material-button :disabled="loadButtonStatus" :click="loadImages">Load Image</material-button>
		</div>
	</div>
</template>

<script>
// eslint-disable-next-line camelcase
import WPTB_LazyLoad from '$FrontEndOnly/WPTB_LazyLoad';
import MaterialButton from '$Components/MaterialButton';
import SettingsMenuSection from '$Mixins/SettingsMenuSection';
import LazyLoadProDisabledOverlay from './LazyLoadProDisabledOverlay';

export default {
	components: { LazyLoadProDisabledOverlay, MaterialButton },
	props: {
		defaultHtml: {
			type: String,
			required: true,
		},
		settings: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	mixins: [SettingsMenuSection],
	data() {
		return {
			previewHtml: '',
			imageLoaded: true,
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.previewHtml = this.defaultHtml;
			this.reloadPreview();
		});
	},
	watch: {
		previewHtml() {
			this.reloadPreview();
		},
		settings: {
			handler() {
				this.reloadPreview();
			},
			deep: true,
		},
		'settings.enabled': {
			handler(n) {
				if (!n) {
					this.clearPreview();
				}
			},
		},
	},
	computed: {
		buttonStatus() {
			return !this.sectionData.proStatus || !this.settings.enabled;
		},
		loadButtonStatus() {
			return this.imageLoaded || this.buttonStatus;
		},
		resetButtonStatus() {
			return !this.imageLoaded || this.buttonStatus;
		},
	},
	methods: {
		clearPreview() {
			// clear contents of container
			if (this.$refs.previewContainer.childNodes[0]) {
				this.$refs.previewContainer.innerHTML = '';
			}
		},
		generatePreviewTable() {
			const range = document.createRange();
			range.setStart(this.$refs.previewContainer, 0);

			const previewTable = range.createContextualFragment(this.previewHtml);

			this.clearPreview();

			this.$refs.previewContainer.appendChild(previewTable);
		},
		reloadPreview() {
			this.imageLoaded = false;
			// // sync current selected icon svg
			WPTB_IconManager.getIcon(this.settings.iconName.name, null, true)
				.then((iconSvg) => {
					this.settings.iconSvg = iconSvg;
				})
				.catch(() => {
					this.settings.iconSvg = null;
				})
				.finally(() => {
					this.generatePreviewTable();

					WPTB_LazyLoad.init({ forceMode: true, ...this.settings });
				});
		},
		loadImages() {
			this.imageLoaded = true;
			WPTB_LazyLoad.forceLoadImages();
		},
	},
};
</script>
