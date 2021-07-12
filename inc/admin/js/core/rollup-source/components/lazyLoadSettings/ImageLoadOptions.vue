<template>
	<section-group-collapse :start-collapsed="false" :label="strings.imageLoadOptions">
		<panel-dropdown-control
			:label="strings.animation"
			:options="settings.imageLoadAnimationOptions"
			v-model="settings.imageLoadAnimation"
			:disabled="generalDisabledStatus"
		></panel-dropdown-control>
		<transition name="wptb-fade" appear>
			<color-picker
				:disabled="generalDisabledStatus"
				v-model="settings.flashColor"
				:label="strings.color"
				v-if="settings.imageLoadAnimation === 'flash'"
			></color-picker>
		</transition>
		<transition name="wptb-fade" appear>
			<panel-direction-control
				:disabled="generalDisabledStatus"
				:label="strings.direction"
				v-model="settings.imageLoadAnimationDirection"
				v-if="directionEnabledAnimations.includes(settings.imageLoadAnimation)"
				:enabled-axis="axisControlForAnimations"
			></panel-direction-control>
		</transition>
		<transition name="wptb-fade" appear>
			<range-input
				v-model="settings.imageLoadAnimationPerspective"
				:clamp="true"
				:min="1"
				:max="1000"
				:label="strings.perspective"
				post-fix="px"
				v-if="settings.imageLoadAnimation === 'flip'"
				:disabled="generalDisabledStatus || settings.imageLoadAnimation === 'none'"
			></range-input>
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
import ColorPicker from '$Components/ColorPicker';

export default {
	components: { SectionGroupCollapse, PanelDropdownControl, PanelDirectionControl, RangeInput, ColorPicker },
	mixins: [SectionGroup],
	data() {
		return {
			directionEnabledAnimations: ['slideIn', 'flip'],
		};
	},
	computed: {
		axisControlForAnimations() {
			const enabledAxis = [];

			const enabledAxisRules = {
				slideIn: ['x', 'y'],
				flip: ['x'],
			};

			if (enabledAxisRules[this.settings.imageLoadAnimation]) {
				enabledAxis.push(...enabledAxisRules[this.settings.imageLoadAnimation]);
			}

			return enabledAxis;
		},
	},
};
</script>
