<template>
	<transition name="wptb-fade">
		<component :is="currentScreen"> </component>
	</transition>
</template>

<script>
import { mapGetters } from 'vuex';
import DataSourceSelection from './DataSourceSelection';

export default {
	components: { DataSourceSelection },
	computed: {
		...mapGetters(['currentScreen']),
	},
};
</script>

<style scoped></style>
