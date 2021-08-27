<template>
	<control-wrapper
		:compatibility-mode="true"
		:elem-container="elemContainer"
		:visibility="componentVisibility"
		:unique-id="uniqueId"
		:main-value="elementMainValue"
	>
		<size-control :aspect-ratio="defaultAspectRatio" :size="size" :strings="strings" :label="label"></size-control>
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
	methods: {
		calculateStartupProcessVariables() {
			this.findTargetElement();
			this.calculateAspectRatio();
			this.observeTarget();
		},
		calculateAspectRatio() {
			if (this.targetElement) {
				this.defaultAspectRatio = +(
					this.targetElement.getAttribute('width') / this.targetElement.getAttribute('height')
				).toFixed(2);
			}
		},
		imageSourceChanged() {
			this.updateNewSizeValues();
			this.calculateAspectRatio();
			this.observeTarget();
		},
		updateNewSizeValues() {
			if (this.targetElement) {
				this.size.width = this.targetElement.getAttribute('width');
				this.size.height = this.targetElement.getAttribute('height');
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
	},
	beforeDestroy() {
		this.disconnectObserver();
	},
};
</script>
