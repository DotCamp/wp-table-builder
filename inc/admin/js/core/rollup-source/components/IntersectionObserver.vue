<template>
	<div ref="observerElement">
		<slot v-show="!forceHide"></slot>
	</div>
</template>
<script>
export default {
	props: ['relativeElement', 'forceHide'],
	data() {
		return {
			listening: false,
		};
	},
	watch: {
		relativeElement() {
			if (this.relativeElement && !this.listening) {
				this.relativeElement.addEventListener('scroll', this.handleScroll);
				this.handleScroll();
				this.listening = true;
			}
		},
	},
	methods: {
		handleScroll() {
			if (this.forceHide) {
				return;
			}
			const scrollAmount = this.relativeElement.scrollTop;
			const posY = this.$refs.observerElement.offsetTop;
			const relativeHeight = this.relativeElement.clientHeight;
			if (scrollAmount + relativeHeight >= posY) {
				this.$emit('visible');
			}
		},
	},
};
</script>
