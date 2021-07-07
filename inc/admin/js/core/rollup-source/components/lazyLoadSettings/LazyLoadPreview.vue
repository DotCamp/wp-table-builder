<template>
	<div class="wptb-lazy-load-preview-container wptb-flex wptb-flex-justify-center wptb-flex-align-center">
		<div class="wptb-lazy-load-preview-header">{{ strings.preview }}</div>
		<lazy-load-pro-disabled-overlay
			grid-area="preview"
			:visibility="!sectionData.proStatus || !settings.enabled"
		></lazy-load-pro-disabled-overlay>
		<div ref="previewContainer" class="wptb-lazy-load-preview wptb-preview-table"></div>
		<div class="wptb-lazy-load-preview-button-container wptb-flex wptb-flex-justify-center wptb-flex-align-center">
			<material-button :disabled="buttonStatus" :click="reloadPreview">Reset</material-button>
			<material-button :disabled="buttonStatus" :click="loadImages">Load Image</material-button>
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
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.previewHtml = this.defaultHtml;
			this.reloadPreview();
		});
	},
	watch: {
		reviewHtml() {
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
			WPTB_LazyLoad.forceLoadImages();
		},
	},
};
</script>
