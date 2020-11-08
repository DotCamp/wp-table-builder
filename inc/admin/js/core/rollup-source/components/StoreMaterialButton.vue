<template>
	<material-button
		:disabled="busyStatus"
		class="wptb-panel-button-material"
		@buttonClicked="buttonClicked"
		v-bind="$attrs"
		:click="() => {}"
	>
		<slot></slot>
	</material-button>
</template>

<script>
/**
 * A material button linked to 'busyStatus' of flux store
 */
import { mapGetters } from 'vuex';
import MaterialButton from './MaterialButton';

export default {
	components: { MaterialButton },
	methods: {
		buttonClicked() {
			this.$emit('buttonClicked');
		},
	},
	computed: {
		...mapGetters(['busyStatus']),
	},
};
</script>
