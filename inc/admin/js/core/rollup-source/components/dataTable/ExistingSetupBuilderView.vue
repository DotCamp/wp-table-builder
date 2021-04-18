<template>
	<div class="wptb-existing-data-object-wrapper">
		<div class="wptb-existing-data-object-search">
			<search-input
				v-model="searchTerm"
				:placeholder="translationM('search')"
				style="font-size: 90%;"
			></search-input>
		</div>
		<div class="wptb-existing-data-object-list">
			<table class="wptb-existing-data-object-table" :data-wptb-busy="busyStatus">
				<thead>
					<tr>
						<existing-listing-header-column id="ID" @sort="handleSort">ID</existing-listing-header-column>
						<existing-listing-header-column id="post_title" @sort="handleSort">{{
							translationM('title')
						}}</existing-listing-header-column>
						<existing-listing-header-column id="type" @sort="handleSort">{{
							translationM('type')
						}}</existing-listing-header-column>
						<existing-listing-header-column id="tables" @sort="handleSort">
							<div
								class="wptb-existing-data-object-table-icon-wrapper"
								v-html="$store.getters.getIcon('table')"
							></div>
						</existing-listing-header-column>
					</tr>
				</thead>
				<transition-group tag="tbody" name="wptb-fade">
					<tr
						v-if="filteredDataObjectsList.length === 0"
						class="wptb-existing-table-no-data-row"
						key="noData"
					>
						<td colspan="4">{{ translationM('noDataFound') }}</td>
					</tr>
					<existing-table-data-row
						v-for="{ ID, post_title, type, tables } in filteredDataObjectsList"
						:key="ID"
						:id="ID"
						:title="post_title"
						:type="type"
						:search-clause="searchTerm"
						:associated-table-count="tables.length"
						@rowSelect="handleRowSelect"
					></existing-table-data-row>
				</transition-group>
			</table>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ExistingTableDataRow from './ExistingTableDataRow';
import SearchInput from '../SearchInput';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import ExistingListingHeaderColumn from './ExistingListingHeaderColumn';

export default {
	mixins: [withNativeTranslationStore],
	components: { ExistingListingHeaderColumn, SearchInput, ExistingTableDataRow },
	data() {
		return {
			dataObjectsList: [],
			filteredDataObjectsList: [],
			searchTerm: '',
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.getSimpleDataObjects()
				.then((resp) => {
					this.dataObjectsList = resp;
				})
				.catch(() => {
					// do nothing
				});
		});
	},
	watch: {
		dataObjectsList: {
			handler(n) {
				this.filteredDataObjectsList = n;
			},
			deep: true,
		},
		searchTerm(n) {
			if (n === '') {
				this.filteredDataObjectsList = this.dataObjectsList;
			} else {
				// eslint-disable-next-line camelcase
				this.filteredDataObjectsList = this.dataObjectsList.filter(({ post_title }) => {
					const regexp = new RegExp(`(${n})`, 'gi');
					return post_title.match(regexp);
				});
			}
		},
	},
	computed: {
		...mapGetters(['busyStatus']),
	},
	methods: {
		handleRowSelect(dataObjectId) {
			this.busyStatePass(() => {
				this.fetchDataObject(dataObjectId)
					.then((res) => {
						this.startSourceSetupFromDataObject(res);
					})
					.catch(() => {
						// TODO [erdembircan] bind to new messenger service for production
					});
			});
		},
		handleSort(colId, direction) {
			this.busyStatePass(() => {
				this.filteredDataObjectsList = this.filteredDataObjectsList.sort((a, b) => {
					const valA = a[colId];
					const valB = b[colId];
					const directionMultiplier = direction === 'descending' ? -1 : 1;

					if (colId === 'tables') {
						return (valA.length - valB.length) * directionMultiplier;
					}

					if (valA > valB) {
						return 1 * directionMultiplier;
					}
					if (valA < valB) {
						return -1 * directionMultiplier;
					}

					return 0;
				});
			});
		},
		...mapActions(['getSimpleDataObjects', 'fetchDataObject', 'busyStatePass', 'startSourceSetupFromDataObject']),
		...mapGetters(['getIcon']),
	},
};
</script>
