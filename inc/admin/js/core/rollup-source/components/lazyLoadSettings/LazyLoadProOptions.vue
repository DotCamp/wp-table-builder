<template>
	<fragment>
		<lazy-load-pro-disabled-overlay
			:visibility="!sectionData.proStatus"
			grid-area="right"
			v-html="sectionData.upsellsElement"
		></lazy-load-pro-disabled-overlay>
		<div class="wptb-lazy-load-pro-options wptb-controls-for-settings">
			<section-group-collapse
				:label="strings.generalOptions"
				:start-collapsed="true"
				sectionId="lazyLoadProGeneralOptions"
			>
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
			</section-group-collapse>
			<section-group-collapse :start-collapsed="true" :label="strings.iconOptions">
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
					:disabled="iconSubOptionsDisableStatus"
				></panel-dropdown-control>
			</section-group-collapse>
			<section-group-collapse :start-collapsed="false" :label="strings.imageLoadOptions">
				<panel-dropdown-control
					:label="strings.imageLoadOptions"
					:options="settings.imageLoadAnimationOptions"
					v-model="settings.imageLoadAnimation"
					:disabled="iconSubOptionsDisableStatus"
				></panel-dropdown-control>
			</section-group-collapse>
		</div>
	</fragment>
</template>

<script>
import ControlTipWrapper from '$Components/ControlTipWrapper';
import RangeInput from '$Components/RangeInput';
import ColorPicker from '$Components/ColorPicker';
import PanelIconSelect from '$LeftPanel/PanelIconSelect';
import PanelDropdownControl from '$Components/PanelDropdownControl';
import SettingsMenuSection from '$Mixins/SettingsMenuSection';
import SectionGroupCollapse from '$LeftPanel/SectionGroupCollapse';
import withMessage from '$Mixins/withMessage';
import LazyLoadProDisabledOverlay from '$LazyLoadSettings/LazyLoadProDisabledOverlay';

export default {
	props: {
		settings: {
			type: Object,
			required: true,
		},
	},
	components: {
		LazyLoadProDisabledOverlay,
		ControlTipWrapper,
		RangeInput,
		ColorPicker,
		PanelIconSelect,
		PanelDropdownControl,
		SectionGroupCollapse,
	},
	mixins: [SettingsMenuSection, withMessage],
	computed: {
		generalDisabledStatus() {
			return this.isBusy() || !this.settings.enabled;
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
};
</script>
