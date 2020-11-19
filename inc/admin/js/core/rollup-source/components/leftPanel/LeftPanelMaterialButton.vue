<template>
	<material-button v-bind="$attrs" class="wptb-plugin-box-shadow-md wptb-panel-button-material">
		<slot></slot>
	</material-button>
</template>
<script>
import MaterialButton from '../MaterialButton';

export default {
	name: 'left-panel-material-button',
	components: { MaterialButton },
	inheritAttrs: false,
	props: {
		label: {
			type: String,
			default: 'button',
		},
	},
};
</script>
