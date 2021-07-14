<template>
	<section-group-collapse
		:label="strings.generalOptions"
		:start-collapsed="false"
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
</template>

<script>
import SectionGroupCollapse from '$LeftPanel/SectionGroupCollapse';
import SectionGroup from '$Mixins/SectionGroup';
import ControlTipWrapper from '$Components/ControlTipWrapper';
import RangeInput from '$Components/RangeInput';
import ColorPicker from '$Components/ColorPicker';

export default {
	components: {
		SectionGroupCollapse,
		ControlTipWrapper,
		RangeInput,
		ColorPicker,
	},
	mixins: [SectionGroup],
};
</script>
