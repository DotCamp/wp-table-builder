<template>
	<div v-if="visibility" class="wptb-data-manager-select wptb-repeating-linear-gradient"></div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: {
		visibility() {
			const { active, hoverId } = this.getSelectOperationData;
			return active && hoverId !== null;
		},
		...mapGetters(['getSelectOperationData']),
	},
};
</script>
