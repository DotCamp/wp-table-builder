<template>
	<control-wrapper
		:compatibility-mode="true"
		:elem-container="elemContainer"
		:visibility="componentVisibility"
		:unique-id="uniqueId"
		:main-value="elementMainValue"
	>
		<size-control
			:originals="originals"
			:aspect-ratio="defaultAspectRatio"
			:size="size"
			:strings="strings"
			:label="label"
			@sizeUpdate="handleSizeUpdate"
		></size-control>
	</control-wrapper>
</template>
<script>
import ControlBase from '$Mixins/ControlBase';
import ControlWrapper from '$Components/ControlWrapper';
import SizeControl from '$Components/SizeControl';

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
			default: '100px:100px||100px:100px',
		},
		defaultUnit: {
			type: String,
			default: 'px',
		},
		target: {
			type: String,
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
			originals: {
				width: 0,
				height: 0,
			},
			targetElement: null,
			defaultAspectRatio: 0,
			observer: null,
		};
	},
	mounted() {
		this.assignDefaultValue();

		this.$nextTick(() => {
			this.calculateStartupProcessVariables();
		});
	},
	watch: {
		elementMainValue(n) {
			const match = n.match(/(?<width>\d+\.?\d*)(?<unit>.+)(?::)(?<height>\d+\.?\d*).+\|\|/);

			if (match) {
				const { width, height, unit } = match.groups;

				if (width && height && unit) {
					this.size.width = width;
					this.size.height = height;
					this.size.unit = unit;

					this.basicValueUpdate(this.elementMainValue, true);
				}
			}
		},
	},
	methods: {
		genericCalculationProcess(observe = false) {
			this.calculateAspectRatio();
			this.updateOriginals();
			if (observe) {
				this.observeTarget();
			}
		},
		calculateStartupProcessVariables() {
			this.findTargetElement();
			this.genericCalculationProcess(true);
		},
		imageSourceChanged() {
			this.updateNewSizeValues();
			this.genericCalculationProcess();
		},
		updateOriginals() {
			if (this.targetElement) {
				this.originals.width = this.targetElement.getAttribute('width');
				this.originals.height = this.targetElement.getAttribute('height');
			}
		},
		calculateAspectRatio() {
			if (this.targetElement) {
				this.defaultAspectRatio =
					this.targetElement.getAttribute('width') / this.targetElement.getAttribute('height');
			}
		},
		updateNewSizeValues() {
			if (this.targetElement) {
				this.size.width = this.targetElement.getAttribute('width');
				this.size.height = this.targetElement.getAttribute('height');
				this.size.unit = 'px';
			}
		},
		findTargetElement() {
			this.targetElement = document.querySelector(`.${this.elemContainer}`)?.querySelector(this.target);
		},
		observeTarget() {
			const config = { attributes: true, childList: false, subtree: false };

			this.observer = new MutationObserver((mutationList) => {
				// eslint-disable-next-line array-callback-return
				Array.from(mutationList).map(({ type, attributeName }) => {
					if (type === 'attributes' && attributeName === 'src') {
						this.imageSourceChanged();
					}
				});
			});

			if (this.targetElement) {
				this.observer.observe(this.targetElement, config);
			}
		},
		disconnectObserver() {
			if (this.observer) {
				this.observer.disconnect();
			}
		},
		handleSizeUpdate({ raw, precise }) {
			this.elementMainValue = `${raw.width}${raw.unit}:${raw.height}${raw.unit}||${precise.width}${precise.unit}:${precise.height}${precise.unit}`;
		},
	},
	beforeDestroy() {
		this.disconnectObserver();
	},
};
</script>
