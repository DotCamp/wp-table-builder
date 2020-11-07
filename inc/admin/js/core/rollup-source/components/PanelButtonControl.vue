<template>
	<div class="wptb-element-option wptb-settings-items wptb-plugin-width-full">
		<div class="wptb-settings-row wptb-settings-middle-xs wptb-justify-content-center">
			<material-button :click="handleClick" :style="{ padding: '10px' }"><slot></slot></material-button>
		</div>
	</div>
</template>

<script>
import MaterialButton from './MaterialButton';

export default {
	components: { MaterialButton },
	methods: {
		handleClick() {
			this.$emit('buttonClick');
		},
	},
};
</script>

<style scoped></style>
