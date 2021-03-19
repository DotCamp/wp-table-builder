<template>
	<menu-content :center="true" class="wptb-table-data-section-wrapper">
		<div class="wptb-table-data-section">
			<data-listing></data-listing>
			<data-display @dataSaved="handleDataSaved"></data-display>
		</div>
	</menu-content>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import MenuContent from '../MenuContent';
import DataListing from './DataListing';
import DataDisplay from './DataDisplay';

export default {
	components: { MenuContent, DataListing, DataDisplay },
	methods: {
		handleDataSaved() {
			this.fetchSimpleDataObjects()
				.then((resp) => {
					this.setSimpleDataObjects(resp.data.simpleDataObjects);
				})
				.catch(() => {
					// do nothing
				});
		},
		...mapActions(['fetchSimpleDataObjects']),
		...mapMutations(['setSimpleDataObjects']),
	},
};
</script>
