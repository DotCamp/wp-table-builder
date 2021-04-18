<template>
	<div
		class="wptb-sort-component-wrapper"
		v-html="upIcon"
		@click.prevent="handleClick"
		:data-sort-direction="direction"
	></div>
</template>

<script>
export default {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		id: {
			type: String,
			required: true,
		},
		upIcon: {
			type: String,
			required: true,
		},
		startupDirection: {
			type: String,
			default: 'descending',
		},
	},
	data() {
		return {
			direction: 'descending',
			directionList: ['ascending', 'descending'],
			firstCall: false,
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.direction = this.startupDirection;
		});
	},
	methods: {
		handleClick() {
			if (!this.disabled) {
				if (this.firstCall) {
					this.direction = this.directionList[
						(this.directionList.indexOf(this.direction) + 1) % this.directionList.length
					];
				}
				this.firstCall = true;

				this.$emit('sort', this.id, this.direction);
			}
		},
	},
};
</script>
