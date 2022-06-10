<template>
	<div :style="calculatePosition" class="cell-move">
		<div class="pro-overlay-container">
			<pro-overlay :explicit-store="true" :target="proOverlayTypes.PARENT" :feature-name="feature"></pro-overlay>
			<move-vertical v-if="type === moveTypes.VERTICAL"></move-vertical>
			<move-horizontal v-else></move-horizontal>
		</div>
	</div>
</template>

<script>
import MoveVertical from '$Components/MoveVertical';
import MoveHorizontal from '$Components/MoveHorizontal';
import ProOverlay, { targetTypes } from '$Containers/ProOverlay';

export const moveTypes = {
	VERTICAL: 'vertical',
	HORIZONTAL: 'horizontal',
};

export default {
	components: { ProOverlay, MoveHorizontal, MoveVertical },
	props: {
		feature: {
			type: String,
			default: '',
		},
		width: {
			type: Number,
			default: null,
		},
		height: {
			type: Number,
			default: null,
		},
		x: {
			type: Number,
			default: 0,
		},
		y: {
			type: Number,
			default: 0,
		},
		type: {
			type: String,
			default: moveTypes.VERTICAL,
		},
	},
	computed: {
		calculatePosition() {
			const styles = {
				top: this.toPx(this.y),
				left: this.toPx(this.x),
				height: this.toPx(this.height),
				width: this.toPx(this.width),
			};

			return styles;
		},
		moveTypes: () => moveTypes,
		proOverlayTypes: () => targetTypes,
	},
	methods: {
		toPx(val) {
			return `${val}px`;
		},
	},
};
</script>
