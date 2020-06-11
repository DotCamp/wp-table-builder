<template>
	<div ref="wrapper" class="wptb-slider-stop" :style="wrapperStyle" @click.prevent.capture="clickEvent" :class="{'wptb-slider-stop-active': active}">
		<div ref="knob" class="wptb-slider-stop-knob"></div>
		<div class="wptb-slider-stop-label"><slot></slot></div>
	</div>
</template>
<script>
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
	},
	data() {
		return {
			wrapperStyle: { left: 0, top: 0 },
		};
	},
	mounted() {
		this.calculateStyle();
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
