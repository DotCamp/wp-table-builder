<template>
	<div class="wptb-element-option wptb-settings-items wptb-plugin-width-full">
		<div class="wptb-settings-row wptb-settings-middle-xs wptb-justify-content-center">
			<material-button :click="handleClick" class="wptb-panel-button-material"><slot></slot></material-button>
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
