<template>
	<div class="wptb-color-picker-wrapper wptb-settings-row wptb-settings-middle-xs wptb-element-property">
		<div class="wptb-settings-space-between">
			<p class="wptb-settings-item-title wptb-text-transform-cap" :data-wptb-text-disabled="disabled">
				{{ label }}
			</p>
			<div
				ref="inputWrapper"
				class="wptb-color-picker-input-wrapper"
				@click.capture.stop.prevent="setVisibility(true)"
			>
				<div class="wptb-color-picker-inner-indicator">
					<div
						class="wptb-color-picker-selected-color wptb-plugin-inner-shadow"
						:style="colorPickerStyle"
					></div>
				</div>
				<div class="wptb-color-picker-logo">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
						<path
							d="M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7 41.2-6.4 61.4-54.6 42.5-91.7-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C511.5 97.1 368.1-26.9 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"
						/>
					</svg>
				</div>
			</div>
			<div
				ref="tool"
				@click.stop="visibility ? setVisibility(true) : () => {}"
				class="wptb-color-picker-tool-wrapper"
				:style="keepToolInsideWindow"
			>
				<transition name="wptb-fade">
					<sketch class="wptb-color-picker-input" :style="toolVisibility" v-model="innerColor"></sketch>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import { Sketch } from 'vue-color';

export default {
	props: {
		label: {
			type: String,
			default: 'label',
		},
		color: {
			type: String,
			default: '#ffffffff',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	model: {
		prop: 'color',
		event: 'colorChanged',
	},
	components: { Sketch },
	data() {
		return {
			innerColor: {
				hex8: '#ffffffff',
			},
			visibility: false,
			toolPosition: {},
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.innerColor.hex8 = this.color;

			// event listeners to hide opened color picker on certain DOM events
			document.querySelector('.wptb-container').addEventListener('click', this.handleHide);
			document.addEventListener('wheel', this.handleHide, { capture: false, passive: true });
			document.addEventListener('keyup', this.handleHide);
		});
	},
	watch: {
		innerColor: {
			handler(n) {
				this.$emit('colorChanged', n.hex8);
			},
			deep: true,
		},
	},
	computed: {
		toolVisibility() {
			return {
				visibility: this.visibility ? 'visible' : 'hidden',
			};
		},
		colorPickerStyle() {
			return {
				backgroundColor: this.innerColor.hex8,
			};
		},
		keepToolInsideWindow() {
			if (this.visibility && this.$refs.inputWrapper) {
				const { x, y, height } = this.$refs.inputWrapper.getBoundingClientRect();
				const { width: toolWidth, height: toolHeight } = this.$refs.tool.getBoundingClientRect();

				let left = x;
				let top = y + height;

				// handle default position not visible when at right
				if (x + toolWidth > window.innerWidth) {
					left = window.innerWidth - toolWidth;
				}
				// handle default position not visible when at bottom
				if (top + toolHeight > window.innerHeight) {
					top = window.innerHeight - toolHeight;
				}

				return { left: this.toPx(left), top: this.toPx(top) };
			}
			// hide tool out of window bounds
			return { left: this.toPx(-200), top: this.toPx(-200) };
		},
	},
	methods: {
		toPx(val) {
			return `${val}px`;
		},
		setVisibility(state = false) {
			this.visibility = state;
		},
		handleHide(event) {
			const allowedDefaultEvents = ['wheel', 'click'];
			// handle keyup event if it is the current type
			if ((event && event.type && event.type === 'keyup', event.key === 'Escape')) {
				this.setVisibility(false);
			} else if (allowedDefaultEvents.includes(event.type)) {
				this.setVisibility(false);
			}
		},
	},
	beforeDestroy() {
		// remove assigned event listeners
		document.querySelector('.wptb-container').removeEventListener('click', this.handleHide);
		document.removeEventListener('wheel', this.handleHide, { capture: false, passive: true });
		document.removeEventListener('keyup', this.handleHide);
	},
};
</script>
