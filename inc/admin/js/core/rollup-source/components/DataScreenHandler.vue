<template>
	<transition name="wptb-fade" mode="out-in">
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
