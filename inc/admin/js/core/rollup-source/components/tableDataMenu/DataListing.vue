<template>
	<div :style="mainWrapperStyle" class="wptb-table-data-listings" :data-collapse="collapseStatus">
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
		<transition-group name="wptb-fade" tag="div" style="grid-area: listing; overflow: auto;">
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
		<transition name="wptb-fade">
			<div class="wptb-table-data-listings-collapsed-cover-icon" v-if="collapseStatus">
				<span class="dashicons dashicons-list-view"></span>
			</div>
		</transition>
		<div class="wptb-table-data-listings-footer">
			<div
				ref="menuCollapseButton"
				class="wptb-data-listings-footer-collapse-button"
				@click.prevent="handleMenuCollapse"
			></div>
		</div>
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
			collapseStatus: false,
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
		mainWrapperStyle() {
			const collapseButtonWidth = this.$refs.menuCollapseButton?.getBoundingClientRect().width;
			return {
				width: `${this.collapseStatus ? collapseButtonWidth : 200}px`,
			};
		},
		...mapGetters(['simpleDataObjects', 'getBusyState']),
	},
	methods: {
		handleMenuCollapse() {
			this.collapseStatus = !this.collapseStatus;
		},
	},
};
</script>
