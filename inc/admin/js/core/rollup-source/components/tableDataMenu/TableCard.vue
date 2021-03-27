<template>
	<a class="wptb-table-data-usage-anchor" :href="link" target="_blank">
		<div class="wptb-table-data-usage-table-card">
			<div class="wptb-table-data-usage-card-title">{{ title }}</div>
			<div class="wptb-table-data-usage-card-id">#{{ id }}</div>
		</div>
	</a>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: 'default title',
		},
		id: {
			type: Number,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
	},
};
</script>
