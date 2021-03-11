<template>
	<menu-content :center="true" class="wptb-table-data-section-wrapper">
		<div class="wptb-table-data-section">
			<data-listing></data-listing>
			<data-display></data-display>
		</div>
	</menu-content>
</template>

<script>
import MenuContent from '../MenuContent';
import DataListing from './DataListing';
import DataDisplay from './DataDisplay';

export default {
	components: { MenuContent, DataListing, DataDisplay },
};
</script>
