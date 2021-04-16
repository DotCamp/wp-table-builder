<template>
	<transition name="wptb-fade" mode="out-in">
		<component :is="currentScreen"> </component>
	</transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DataSourceSelection from './DataSourceSelection';
import CsvSetup from './CsvSetup';
import ExistingSetup from './dataTable/ExistingSetup';

export default {
	components: { DataSourceSelection, CsvSetup, ExistingSetup },
	mounted() {
		this.$nextTick(() => {
			// if no data source is selected on start, load up source selection screen
			if (this.getSelectedDataSource === null) {
				this.setCurrentScreen('DataSourceSelection');
			} else {
				// if current table have a saved data source, load its screen instead at start
				this.setCurrentScreenFromId(this.getSelectedDataSource);
			}
		});
	},
	computed: {
		...mapGetters(['currentScreen', 'getSelectedDataSource']),
	},
	methods: {
		...mapActions(['setCurrentScreen', 'setCurrentScreenFromId']),
	},
};
</script>
