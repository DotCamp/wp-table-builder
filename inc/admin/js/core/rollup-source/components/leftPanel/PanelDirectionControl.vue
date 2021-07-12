<template>
	<panel2-column-template :disabled="disabled" :label="label">
		<div class="wptb-panel-direction-control-indicators-container">
			<div class="wptb-panel-direction-static"></div>
			<panel-direction-cadet
				:active-direction="value"
				v-for="direction in directions"
				:direction="direction"
				:key="direction"
				@directionClick="updateDirection(direction)"
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
			normalizedEnabledAxis: [],
		};
	},
	watch: {
		enabledAxis: {
			handler(n) {
				this.normalizeAxis(n);
				this.assignDefaultDirection();
			},
			deep: true,
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.normalizeAxis(this.enabledAxis);
		});
	},
	computed: {
		directions() {
			return this.normalizedEnabledAxis.reduce((carry, current) => {
				if (this.directionsObject[current]) {
					carry.push(...this.directionsObject[current]);
				}

				return carry;
			}, []);
		},
	},
	methods: {
		assignDefaultDirection() {
			if (
				!this.normalizedEnabledAxis.some((axis) => {
					return this.directionsObject[axis].includes(this.value);
				})
			) {
				this.updateDirection(this.directionsObject[this.normalizedEnabledAxis[0]][0]);
			}
		},
		updateDirection(direction) {
			this.$emit('valueChanged', direction);
		},
		normalizeAxis(axisArray) {
			if (!Array.isArray(axisArray)) {
				// eslint-disable-next-line no-param-reassign
				axisArray = [axisArray];
			}
			this.normalizedEnabledAxis = axisArray.map((axis) => axis.toUpperCase());
		},
	},
};
</script>
