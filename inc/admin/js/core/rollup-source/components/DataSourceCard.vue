<template>
	<div class="wptb-data-source-card">
		<div class="wptb-data-source-card-icon"></div>
		<div class="wptb-data-source-card-message">
			<div class="wptb-data-source-card-header">{{ dataSourceObject.title }}</div>
			<div class="wptb-data-source-card-info">{{ dataSourceObject.info }}</div>
		</div>
	</div>
</template>

<script>
import DataSourceObject from '../functions/DataSourceObject';

export default {
	props: {
		dataSourceObject: {
			type: DataSourceObject,
			required: true,
		},
	},
};
</script>

<style scoped></style>
