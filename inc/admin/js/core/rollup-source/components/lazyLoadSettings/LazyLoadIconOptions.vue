<template>
	<section-group-collapse :start-collapsed="false" :label="strings.iconOptions">
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
</template>

<script>
import SectionGroup from '$Mixins/SectionGroup';
import SectionGroupCollapse from '$LeftPanel/SectionGroupCollapse';
import PanelIconSelect from '$LeftPanel/PanelIconSelect';
import ColorPicker from '$Components/ColorPicker';
import RangeInput from '$Components/RangeInput';
import PanelDropdownControl from '$Components/PanelDropdownControl';

export default {
	components: { SectionGroupCollapse, PanelIconSelect, ColorPicker, RangeInput, PanelDropdownControl },
	mixins: [SectionGroup],
	computed: {
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
