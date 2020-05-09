<template>
	<div>
		<div ref="wrapper" class="wptb-menu-popup-wrapper" @mouseover="calculatePopupPosition">
			<slot></slot>
		</div>
		<div ref="popup" class="wptb-menu-popup-message" :style="{ top, left }">
			<div class="wptb-menu-popup-inner-holder">
				<div ref="arrow" class="wptb-menu-popup-arrow"></div>
				<span v-html="message"></span>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ['message'],
	data() {
		return {
			top: 0,
			left: 0,
		};
	},
	mounted() {
		this.calculatePopupPosition();
	},
	methods: {
		toPx(val) {
			return `${val}px`;
		},
		calculatePopupPosition() {
			const wrapRect = this.$refs.wrapper.getBoundingClientRect();
			const popupRect = this.$refs.popup.getBoundingClientRect();
			const arrow = this.$refs.arrow.getBoundingClientRect();
			this.left = this.toPx(wrapRect.left - popupRect.width / 2 + wrapRect.width / 2);
			this.top = this.toPx(wrapRect.top - (popupRect.height + arrow.height / 2));
		},
	},
};
</script>
