<template>
	<div class="wptb-table-data-listings">
		<div class="wptb-table-data-listings-header">
			{{ translationM('data') }}
		</div>
		<data-listing-row
			v-for="data in simpleDataObjects"
			:key="data.ID"
			:id="data.ID"
			:title="data.post_title"
			v-model="activeId"
			:disabled="getBusyState"
		></data-listing-row>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import DataListingRow from './DataListingRow';

export default {
	components: { DataListingRow },
	computed: {
		activeId: {
			get() {
				return this.$store.getters.getEditorActiveId;
			},
			set(dataObjectId) {
				this.$store.dispatch('mutationBusyPass', { name: 'setEditorActiveId', value: dataObjectId });
			},
		},
		...mapGetters(['simpleDataObjects', 'getBusyState']),
	},
};
</script>
