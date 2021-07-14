<template>
	<fragment>
		<menu-content :center="true">
			<div class="wptb-lazy-load-wrapper">
				<div class="wptb-lazy-load-left-column">
					<lazy-load-basic-options
						:template-data="templateData"
						:settings="settings"
					></lazy-load-basic-options>
					<lazy-load-preview
						:template-data="templateData"
						:default-html="sectionData.previewTable"
						:settings="settings"
					></lazy-load-preview>
					<collapsed-visibility :visible="settings.enabled">
						<disclaimer :title="strings.important" :message="strings.importantMessage"></disclaimer>
					</collapsed-visibility>
				</div>
				<lazy-load-pro-options :settings="settings" :template-data="templateData"></lazy-load-pro-options>
			</div>
		</menu-content>
		<footer-buttons>
			<menu-button type="danger" :disabled="!settingsDirtyStatus" @click="revertLazyLoadSettings"
				>{{ strings.revert }}
			</menu-button>
			<menu-button :disabled="!settingsDirtyStatus" @click="updateLazyLoadSettings"
				>{{ strings.submit }}
			</menu-button>
		</footer-buttons>
	</fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import deepmerge from 'deepmerge';
import MenuContent from '$Components/MenuContent';
import SettingsMenuSection from '$Mixins/SettingsMenuSection';
import FooterButtons from '$Components/Settings/FooterButtons';
import MenuButton from '$Components/MenuButton';
import withMessage from '$Mixins/withMessage';
import LazyLoadPreview from '$LazyLoadSettings/LazyLoadPreview';
import LazyLoadProOptions from '$LazyLoadSettings/LazyLoadProOptions';
import LazyLoadBasicOptions from '$LazyLoadSettings/LazyLoadBasicOptions';
import Disclaimer from '$Settings/Disclaimer';
import CollapsedVisibility from '$Settings/CollapsedVisibility';

export default {
	components: {
		CollapsedVisibility,
		Disclaimer,
		LazyLoadBasicOptions,
		LazyLoadProOptions,
		LazyLoadPreview,
		MenuButton,
		FooterButtons,
		MenuContent,
		Fragment,
	},
	mixins: [SettingsMenuSection, withMessage],
	mounted() {
		this.settings = deepmerge({}, this.sectionData.settings);

		this.settings.iconName.url = WPTB_IconManager.getIconUrl(this.settings.iconName.name);

		this.updateInitialSettings();
	},
	data() {
		return {
			settings: {},
			initialSettings: {},
		};
	},
	computed: {
		settingsDirtyStatus() {
			return JSON.stringify(this.settings) !== JSON.stringify(this.initialSettings);
		},
	},
	methods: {
		revertLazyLoadSettings() {
			this.$set(this, 'settings', deepmerge({}, this.initialSettings));
			this.$set(this.templateData, 'settings', deepmerge({}, this.initialSettings));
		},
		updateInitialSettings() {
			this.initialSettings = deepmerge({}, this.settings);
		},
		updateLazyLoadSettings() {
			if (this.settingsDirtyStatus) {
				const { action, nonce, ajaxUrl } = this.sectionData.security;

				const formData = new FormData();

				const settingsToUpload = deepmerge({}, this.settings);
				settingsToUpload.iconSvg = null;

				formData.append('settings', JSON.stringify(settingsToUpload));
				formData.append('action', action);
				formData.append('nonce', nonce);

				this.setBusy(true);

				fetch(ajaxUrl, {
					method: 'POST',
					body: formData,
				})
					// eslint-disable-next-line consistent-return
					.then((res) => {
						if (res.ok) {
							return res.json();
						}

						throw new Error(res.statusText);
					})
					.then((resp) => {
						this.setMessage({
							message: resp.message,
						});

						this.updateInitialSettings();
					})
					.catch((err) => {
						this.setMessage({
							message: err.message,
							type: 'error',
						});
					})
					.finally(() => {
						this.setBusy(false);
					});
			}
		},
	},
};
</script>
