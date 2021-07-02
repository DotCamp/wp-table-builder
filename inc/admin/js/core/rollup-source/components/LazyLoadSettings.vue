<template>
	<fragment>
		<menu-content :center="true">
			<div class="wptb-lazy-load-wrapper">
				<div class="wptb-lazy-load-basic-options">
					<label>
						<input type="checkbox" v-model="settings.enabled" />
						{{ strings.enableLazyLoad }}
					</label>
				</div>
				<div class="wptb-lazy-load-pro-options wptb-controls-for-settings">
					<div
						v-if="!sectionData.proStatus"
						class="wptb-responsive-disabled-table-overlay"
						style="opacity: 0.5"
					></div>
					<control-tip-wrapper :disabled="generalDisabledStatus" :message="strings.visibilityPercentageTip">
						<range-input
							:disabled="generalDisabledStatus"
							v-model="settings.visibilityPercentage"
							post-fix="%"
							:clamp="true"
							:min="1"
							:max="100"
							:label="strings.visibilityPercentage"
						></range-input>
					</control-tip-wrapper>
					<color-picker
						:disabled="generalDisabledStatus"
						v-model="settings.backgroundColor"
						:label="strings.backgroundColor"
					></color-picker>
					<panel-icon-select
						v-model="settings.iconName"
						:label="strings.icon"
						:icons="iconList"
						:disabled="generalDisabledStatus"
					></panel-icon-select>
					<color-picker
						:disabled="iconSubOptionsDisableStatus"
						v-model="settings.iconColor"
						:label="strings.iconColor"
					></color-picker>
					<range-input
						v-model="settings.iconSize"
						post-fix="px"
						:clamp="true"
						:min="1"
						:max="100"
						:label="strings.iconSize"
						:disabled="iconSubOptionsDisableStatus"
					></range-input>
					<panel-dropdown-control
						:label="strings.iconAnimation"
						:options="settings.iconAnimationOptions"
						v-model="settings.iconAnimation"
						:disabled="generalDisabledStatus"
					></panel-dropdown-control>
				</div>
			</div>
		</menu-content>
		<footer-buttons>
			<menu-button :disabled="!settingsDirtyStatus" @click="updateLazyLoadSettings"
				>{{ strings.submit }}
			</menu-button>
		</footer-buttons>
	</fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import deepmerge from 'deepmerge';
import MenuContent from './MenuContent';
import SettingsMenuSection from '../mixins/SettingsMenuSection';
import FooterButtons from './Settings/FooterButtons';
import MenuButton from './MenuButton';
import withMessage from '../mixins/withMessage';
import RangeInput from './RangeInput';
import ControlTipWrapper from './ControlTipWrapper';
import ColorPicker from './ColorPicker';
import PanelIconSelect from './leftPanel/PanelIconSelect';
import PanelDropdownControl from './PanelDropdownControl';

export default {
	components: {
		PanelDropdownControl,
		PanelIconSelect,
		ColorPicker,
		ControlTipWrapper,
		MenuButton,
		FooterButtons,
		MenuContent,
		Fragment,
		RangeInput,
	},
	mixins: [SettingsMenuSection, withMessage],
	mounted() {
		this.settings = this.sectionData.settings;
		this.updateInitialSettings();
	},
	data() {
		return {
			settings: {},
			initialSettings: {},
		};
	},
	computed: {
		generalDisabledStatus() {
			return this.isBusy() || !this.settings.enabled;
		},
		settingsDirtyStatus() {
			return JSON.stringify(this.settings) !== JSON.stringify(this.initialSettings);
		},
		iconList() {
			return WPTB_IconManager.getIconList();
		},
		iconSubOptionsDisableStatus() {
			return (
				this.generalDisabledStatus ||
				!this.settings.iconName ||
				this.settings.iconName.name === null ||
				this.settings.iconName.name === ''
			);
		},
	},
	methods: {
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
