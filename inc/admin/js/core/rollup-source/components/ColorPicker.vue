<template>
	<div :id="id" class="wptb-color-picker-wrapper wptb-settings-row wptb-settings-middle-xs wptb-element-property">
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
					<div v-show="color === ''" class="wptb-color-picker-clear-color-indicator">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
							<path
								d="M633.82 458.1L494.97 350.78c.52-5.57 1.03-11.16 1.03-16.87 0-111.76-99.79-153.34-146.78-311.82-7.94-28.78-49.44-30.12-58.44 0-15.52 52.34-36.87 91.96-58.49 125.68L45.47 3.37C38.49-2.05 28.43-.8 23.01 6.18L3.37 31.45C-2.05 38.42-.8 48.47 6.18 53.9l588.36 454.73c6.98 5.43 17.03 4.17 22.46-2.81l19.64-25.27c5.41-6.97 4.16-17.02-2.82-22.45zM144 333.91C144 432.35 222.72 512 320 512c44.71 0 85.37-16.96 116.4-44.7L162.72 255.78c-11.41 23.5-18.72 48.35-18.72 78.13z"
							/>
						</svg>
					</div>
					<div
						class="wptb-color-picker-selected-color wptb-plugin-inner-shadow"
						:style="colorPickerStyle"
					></div>
					<div class="wptb-color-picker-alpha-checkerboard wptb-checkerboard-pattern"></div>
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
				<div class="wptb-color-picker-tool-inner-wrapper">
					<transition name="wptb-fade">
						<sketch
							class="wptb-color-picker-input"
							:style="toolVisibility"
							:value="color"
							@input="handleColorChange"
						></sketch>
					</transition>
					<div class="wptb-color-picker-clear-color-wrapper">
						<div @click.prevent="clearColor" class="wptb-color-picker-clear-color">
							Clear
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Sketch } from 'vue-color';
import { generateUniqueId } from '../functions';

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
			visibility: false,
			toolPosition: {},
			id: null,
		};
	},
	mounted() {
		this.$nextTick(() => {
			// event listeners to hide opened color picker on certain DOM events
			document.querySelector('.wptb-container').addEventListener('click', this.handleHide);
			document.addEventListener('wheel', this.handleHide, { capture: false, passive: true });
			document.addEventListener('keyup', this.handleHide);

			this.id = generateUniqueId();

			WPTB_Store.subscribe('setActiveColorPicker', (activeId) => {
				this.setVisibility(activeId === this.id);
			});
		});
	},
	computed: {
		toolVisibility() {
			return {
				visibility: this.visibility ? 'visible' : 'hidden',
			};
		},
		colorPickerStyle() {
			return {
				backgroundColor: this.color,
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
			if (this.visibility !== state) {
				this.visibility = state;

				if (state) {
					WPTB_Store.commit('setActiveColorPicker', this.id);
				}
			}
		},
		handleHide(event) {
			const allowedDefaultEvents = ['wheel', 'click'];
			// handle keyup event if it is the current type
			if (event && event.type && event.type === 'keyup' && event.key === 'Escape') {
				this.setVisibility(false);
			} else if (allowedDefaultEvents.includes(event.type)) {
				this.setVisibility(false);
			}
		},
		handleColorChange(colorObj) {
			this.$emit('colorChanged', colorObj.hex8);
		},
		clearColor() {
			this.$emit('colorChanged', '');
			this.setVisibility(false);
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
