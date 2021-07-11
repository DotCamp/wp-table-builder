<template>
	<panel2-column-template :disabled="disabled" :label="label">
		<div class="wptb-panel-direction-control-indicators-container">
			<div class="wptb-panel-direction-static"></div>
			<panel-direction-cadet
				:active-direction="value"
				v-for="direction in directions"
				:direction="direction"
				:key="direction"
				@directionClick="$emit('valueChanged', direction)"
			></panel-direction-cadet>
		</div>
	</panel2-column-template>
</template>

<script>
import PanelControlBase from '$Mixins/PanelControlBase';
import Panel2ColumnTemplate from '$LeftPanel/Panel2ColumnTemplate';
import PanelDirectionCadet from '$LeftPanel/PanelDirectionCadet';

export default {
	props: {
		value: {
			type: String,
			default: 'left',
		},
		enabledAxis: {
			type: Array,
			default: () => {
				return ['X', 'Y'];
			},
		},
	},
	components: { PanelDirectionCadet, Panel2ColumnTemplate },
	mixins: [PanelControlBase],
	data() {
		return {
			directionsObject: { X: ['left', 'right'], Y: ['up', 'down'] },
		};
	},
	computed: {
		directions() {},
	},
};
</script>
