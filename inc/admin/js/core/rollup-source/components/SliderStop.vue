<template>
	<div
		ref="wrapper"
		class="wptb-slider-stop"
		:style="wrapperStyle"
		@click.prevent.capture="clickEvent"
		:class="{ 'wptb-slider-stop-active': active }"
	>
		<div ref="knob" class="wptb-slider-stop-knob"></div>
		<div class="wptb-slider-stop-label"><slot></slot></div>
		<div v-show="enableBreakpointCustomization">
			<number-postfix-input
				class="wptb-size-input"
				style="font-size: 90%;"
				:enable-dynamic-width="true"
				v-model="innerRawValue"
				:only-enter="true"
				post-fix="px"
			></number-postfix-input>
		</div>
	</div>
</template>
<script>
import NumberPostfixInput from './NumberPostfixInput';

export default {
	props: {
		value: {
			type: Number,
			default: 0,
		},
		rawValue: {
			type: Number,
			default: 0,
		},
		active: {
			type: Boolean,
			default: false,
		},
		stopId: String,
		enableBreakpointCustomization: {
			type: Boolean,
			default: false,
		},
	},
	components: { NumberPostfixInput },
	data() {
		return {
			wrapperStyle: { left: 0, top: 0 },
			innerRawValue: this.rawValue,
		};
	},
	watch: {
		rawValue(n) {
			this.innerRawValue = n;
		},
		value() {
			this.calculateStyle();
		},
		innerRawValue(n) {
			this.$emit('breakpointChange', n, this.stopId);
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.calculateStyle();
		});
	},
	methods: {
		clickEvent() {
			this.$emit('click', this.rawValue);
		},
		calculateStyle() {
			const wrapperElement = this.$refs.wrapper;
			const knobElement = this.$refs.knob;

			if (wrapperElement) {
				const { width } = wrapperElement.getBoundingClientRect();
				this.wrapperStyle.left = `calc(${this.value}% - ${width / 2}px)`;
			}

			if (knobElement) {
				const { height } = knobElement.getBoundingClientRect();
				this.wrapperStyle.top = `-${height / 2}px`;
			}
		},
	},
};
</script>
