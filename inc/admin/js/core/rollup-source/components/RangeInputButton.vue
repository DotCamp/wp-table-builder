<template>
	<icon
		class="wptb-range-input-operation-button"
		:extra-classes="['wptb-svg-inherit-color', 'wptb-settings-generic-icon']"
		:name="iconName"
		:data-wptb-button-position="position"
		@click.native.prevent="handleIncrementDecrement"
	></icon>
</template>

<script>
import Icon from '$Components/Icon';

export default {
	props: {
		position: {
			type: String,
			default: 'up',
		},
	},
	components: { Icon },
	data() {
		return {
			positionMap: {
				up: 'caret-up',
				down: 'caret-down',
			},
		};
	},
	computed: {
		iconName() {
			return this.positionMap[this.position];
		},
	},
	methods: {
		handleIncrementDecrement() {
			this.$emit('click', this.position);
		},
	},
};
</script>
