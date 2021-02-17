<template>
	<div :id="id" class="wptb-color-picker-wrapper wptb-settings-row wptb-settings-middle-xs wptb-element-property">
		<div class="wptb-settings-space-between">
			<p class="wptb-settings-item-title wptb-text-transform-cap" :data-wptb-text-disabled="disabled">
				{{ label }}
			</p>
			<div
				ref="inputWrapper"
				class="wptb-color-picker-input-wrapper"
				@click.capture.stop.prevent="toggleVisibility"
			>
				<div class="wptb-color-picker-inner-indicator">
					<div
						v-show="color === ''"
						class="wptb-color-picker-clear-color-indicator wptb-color-picker-icon-standards"
						v-html="icons.noColor"
					></div>
					<div
						class="wptb-color-picker-selected-color wptb-plugin-inner-shadow"
						:style="colorPickerStyle"
					></div>
					<div class="wptb-color-picker-alpha-checkerboard wptb-checkerboard-pattern"></div>
				</div>
				<div class="wptb-color-picker-logo wptb-color-picker-icon-standards" v-html="icons.palette"></div>
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
							<div class="wptb-color-picker-icon-standards" v-html="icons.noColor"></div>
							<div>Clear</div>
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
			icons: {
				noColor: null,
				palette: null,
			},
		};
	},
	mounted() {
		this.$nextTick(() => {
			// event listeners to hide opened color picker on certain DOM events
			document.querySelector('.wptb-container').addEventListener('click', this.handleHide);
			document.addEventListener('wheel', this.handleHide, { capture: false, passive: true });
			document.addEventListener('keyup', this.handleHide);

			this.id = generateUniqueId();

			WPTB_IconManager.getIcon('tint-slash', null, true).then((resp) => {
				this.icons.noColor = resp;
			});

			WPTB_IconManager.getIcon('palette', null, true).then((resp) => {
				this.icons.palette = resp;
			});

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
		toggleVisibility() {
			this.setVisibility(!this.visibility);
		},
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
