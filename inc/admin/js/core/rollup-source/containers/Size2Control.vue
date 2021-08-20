<template>
	<control-wrapper
		:compatibility-mode="true"
		:elem-container="elemContainer"
		:visibility="componentVisibility"
		:unique-id="uniqueId"
		:main-value="elementMainValue"
	>
		<size-control :size="size" :strings="strings" :label="label"></size-control>
	</control-wrapper>
</template>
<script>
import ControlBase from '../mixins/ControlBase';
import ControlWrapper from '../components/ControlWrapper';
import SizeControl from '../components/SizeControl';

export default {
	props: {
		strings: {
			type: Object,
			default: () => {
				return {};
			},
		},
		defaultValue: {
			type: String,
			default: '100px:100px',
		},
		defaultUnit: {
			type: String,
			default: 'px',
		},
	},
	components: { SizeControl, ControlWrapper },
	mixins: [ControlBase],
	data() {
		return {
			size: {
				width: 0,
				height: 0,
				unit: this.defaultUnit,
			},
		};
	},
	mounted() {
		this.assignDefaultValue();
	},
	watch: {
		size: {
			handler(n) {
				this.elementMainValue = `${n.width}${n.unit}:${n.height}${n.unit}`;
				this.basicValueUpdate(this.elementMainValue, true);
			},
			deep: true,
		},
		elementMainValue(n) {
			const match = n.match(/(?<width>\d+)(?<unit>.*)(?::)(?<height>\d+)/);

			if (match) {
				const { width, height, unit } = match.groups;

				if (width && height && unit) {
					this.size.width = width;
					this.size.height = height;
					this.size.unit = unit;
				}
			}
		},
	},
};
</script>
