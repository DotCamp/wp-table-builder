<template>
	<transition name="wptb-fade">
		<component :is="currentScreen"> </component>
	</transition>
</template>

<script>
import { mapGetters } from 'vuex';
import DataSourceSelection from './DataSourceSelection';
import CsvSetup from './CsvSetup';

export default {
	components: { DataSourceSelection, CsvSetup },
	computed: {
		...mapGetters(['currentScreen']),
	},
};
</script>

<style scoped></style>
