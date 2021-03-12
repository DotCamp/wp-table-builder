<template>
	<div class="wptb-table-data-listings">
		<div class="wptb-table-data-listings-header">
			{{ translationM('data') }}
		</div>
		<div class="wptb-table-data-listing-search">
			<search-input
				class="wptb-table-data-listing-search-input"
				:placeholder="translationM('search')"
				v-model="searchClause"
				:disabled="getBusyState"
			></search-input>
		</div>
		<transition-group name="wptb-fade">
			<data-listing-row
				v-for="data in filteredDataObject"
				:key="data.ID"
				:id="data.ID"
				:title="data.post_title"
				v-model="activeId"
				:disabled="getBusyState"
				:search-clause="searchClause"
			></data-listing-row>
		</transition-group>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import DataListingRow from './DataListingRow';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import SearchInput from '../SearchInput';

export default {
	mixins: [withNativeTranslationStore],
	components: { SearchInput, DataListingRow },
	data() {
		return {
			searchClause: '',
		};
	},
	computed: {
		activeId: {
			get() {
				return this.$store.getters.getEditorActiveId;
			},
			set(dataObjectId) {
				this.$store.dispatch('mutationBusyPass', { name: 'setEditorActiveId', value: dataObjectId });
			},
		},
		filteredDataObject() {
			return this.simpleDataObjects.filter((dataObject) => {
				const regExp = new RegExp(`(${this.searchClause})`, 'gi');
				return dataObject.post_title.match(regExp);
			});
		},
		...mapGetters(['simpleDataObjects', 'getBusyState']),
	},
};
</script>
