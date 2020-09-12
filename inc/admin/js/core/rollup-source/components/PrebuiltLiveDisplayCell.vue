<template>
	<div
		class="wptb-prebuilt-live-cell"
		:class="{ 'wptb-prebuilt-live-control-hide': !original, 'wptb-prebuilt-live-control-active': selected }"
		@mouseover="handleHover"
		@mouseleave="handleLeave"
	>
		<prebuilt-display-direction-button
			v-for="side in enabledControls"
			:side="side"
			:key="side"
			@click="handleControlClick"
		></prebuilt-display-direction-button>
	</div>
</template>
<script>
/* eslint-disable no-param-reassign */

import PrebuiltDisplayDirectionButton from './PrebuiltDisplayDirectionButton';

export default {
	props: {
		row: {
			type: Number,
			default: 1,
		},
		col: {
			type: Number,
			default: 1,
		},
		maxCol: {
			type: Number,
			default: 1,
		},
		maxRow: {
			type: Number,
			default: 1,
		},
		original: {
			type: Boolean,
			default: true,
		},
		selected: {
			type: Boolean,
			default: false,
		},
		controlsEnabled: {
			type: Boolean,
			default: true,
		},
	},
	components: { PrebuiltDisplayDirectionButton },
	data() {
		return {
			enabledControls: [],
		};
	},
	mounted() {
		if (this.controlsEnabled) {
			if (this.row === 0) {
				this.enabledControls.push('up');
			}
			if (this.col === 0) {
				this.enabledControls.push('left');
			}
			if (this.row === this.maxRow - 1) {
				this.enabledControls.push('down');
			}
			if (this.col === this.maxCol - 1) {
				this.enabledControls.push('right');
			}
		}
	},
	methods: {
		getIndex() {
			return {
				row: this.row,
				col: this.col,
			};
		},
		handleLeave(e) {
			e.target.classList.remove('wptb-prebuilt-live-cell-hover');
		},
		handleHover(e) {
			const controls = Array.from(e.target.querySelectorAll('[data-type]'));

			if (controls.length > 0) {
				e.target.classList.add('wptb-prebuilt-live-cell-hover');
			}

			// eslint-disable-next-line array-callback-return
			controls.map((c) => {
				const { width, height } = c.getBoundingClientRect();
				const { type } = c.dataset;
				switch (type) {
					case 'up':
						c.style.top = `${-height}px`;
						break;
					case 'left':
						c.style.left = `${-width}px`;
						break;
					case 'down':
						c.style.bottom = `${-height}px`;
						break;
					case 'right':
						c.style.right = `${-width}px`;
						break;
					default:
						c.style.top = `${-height}px`;
				}
			});
		},
		handleControlClick(side) {
			this.$emit('cellControlSelected', side, this.row, this.col);
		},
	},
};
</script>
