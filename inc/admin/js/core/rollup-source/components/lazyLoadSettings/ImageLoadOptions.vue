<template>
	<section-group-collapse :start-collapsed="false" :label="strings.imageLoadOptions">
		<panel-dropdown-control
			:label="strings.animation"
			:options="settings.imageLoadAnimationOptions"
			v-model="settings.imageLoadAnimation"
			:disabled="generalDisabledStatus"
		></panel-dropdown-control>
		<transition name="wptb-fade" appear>
			<panel-direction-control
				:disabled="generalDisabledStatus"
				:label="strings.direction"
				v-model="settings.imageLoadAnimationDirection"
				v-if="directionEnabledAnimations.includes(settings.imageLoadAnimation)"
			></panel-direction-control>
		</transition>
		<range-input
			v-model="settings.imageLoadAnimationSpeed"
			:clamp="true"
			:min="1"
			:max="10"
			:label="strings.speed"
			:disabled="generalDisabledStatus || settings.imageLoadAnimation === 'none'"
		></range-input>
	</section-group-collapse>
</template>

<script>
import SectionGroupCollapse from '$LeftPanel/SectionGroupCollapse';
import PanelDropdownControl from '$Components/PanelDropdownControl';
import PanelDirectionControl from '$LeftPanel/PanelDirectionControl';
import RangeInput from '$Components/RangeInput';
import SectionGroup from '$Mixins/SectionGroup';

export default {
	components: { SectionGroupCollapse, PanelDropdownControl, PanelDirectionControl, RangeInput },
	mixins: [SectionGroup],
	data() {
		return {
			directionEnabledAnimations: ['slideIn', 'flip'],
		};
	},
};
</script>
