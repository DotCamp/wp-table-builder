<template>
	<div @click.prevent.stop.capture="handleCardClick" class="wptb-local-dev-image-card" :data-active="isSelectedCard">
		<div class="wptb-local-dev-image-holder">
			<img :src="url" />
		</div>
		<div class="wptb-local-dev-image-name">
			{{ name }}
		</div>
	</div>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			default: 'image name',
		},
		url: {
			type: String,
			default: '',
		},
		activeCard: {
			type: String,
			default: null,
		},
	},
	computed: {
		isSelectedCard() {
			return this.name === this.activeCard;
		},
	},
	methods: {
		handleCardClick() {
			this.$emit('cardSelected', this.name, this.url);
		},
	},
};
</script>
