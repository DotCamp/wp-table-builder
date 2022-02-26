<template>
	<fragment>
		<menu-content :center="true">
			<div class="wptb-table-fixer-settings">
				<search-input
					class="wptb-table-fixer-table-filter"
					v-model="searchClause"
					:placeholder="strings.search | cap"
				></search-input>
				<div class="wptb-table-fixer-listing">
					<list-table
						:model-bind="selectedTables"
						:row-data="userTables"
						:row-labels="['ID', strings.title, strings.modified]"
						:sort-type="{ 0: 'number', 1: 'default', 2: 'date' }"
						:search-clause="searchClause"
						:search-data-index="1"
					></list-table>
				</div>
				<div class="wptb-table-fixer-disclaimer">
					<disclaimer :title="strings.disclaimerTitle" :message="strings.disclaimerMessage"></disclaimer>
				</div>
			</div>
		</menu-content>
		<modal-window
			:close-callback="hideSummary"
			:is-fixed="true"
			:callback="hideSummary"
			:visible="summaryVisibility"
			:window-title="strings.summary"
			:message="summaryMessage"
		>
			<fix-summary :summary-data="summaryData"></fix-summary>
		</modal-window>
		<footer-buttons>
			<menu-button :disabled="fixTableButtonDisabledStatus" @click="fixTables"
				>{{ tableFixButtonLabel }}
			</menu-button>
		</footer-buttons>
	</fragment>
</template>
<script>
import { Fragment } from 'vue-fragment';
import FooterButtons from '$Settings/FooterButtons';
import MenuContent from '$Components/MenuContent';
import MenuButton from '$Components/MenuButton';
import SettingsMenuSection from '$Mixins/SettingsMenuSection';
import withMessage from '$Mixins/withMessage';
import ListTable from '$Components/ListTable';
import SearchInput from '$Components/SearchInput';
import Disclaimer from '$Settings/Disclaimer';
import ModalWindow from '$Components/ModalWindow';
import FixSummary from '$Components/TableFixer/FixSummary';

export default {
	components: {
		FixSummary,
		ModalWindow,
		Disclaimer,
		SearchInput,
		ListTable,
		MenuButton,
		MenuContent,
		FooterButtons,
		Fragment,
	},
	mixins: [SettingsMenuSection, withMessage],
	data: () => ({
		selectedTables: {},
		tables: [],
		searchClause: '',
		summaryVisibility: false,
		summaryMessage: '',
		summaryData: {},
	}),
	mounted() {
		this.$nextTick(() => {
			this.getTables();
		});
	},
	computed: {
		selectedTableIds() {
			return Object.keys(this.selectedTables).filter((key) => {
				return Object.prototype.hasOwnProperty.call(this.selectedTables, key) && this.selectedTables[key];
			});
		},
		tableFixButtonLabel() {
			const stringId = this.selectedTableIds.length > 1 ? 'fixTables' : 'fixTable';

			return this.strings[stringId];
		},
		fixTableButtonDisabledStatus() {
			return this.isBusy() || this.selectedTableIds.length === 0;
		},
		userTables() {
			return [...this.tables];
		},
	},
	methods: {
		resetSelections() {
			this.selectedTables = {};
		},
		showSummary(summaryData) {
			// eslint-disable-next-line no-unused-vars
			const allFixed = Object.entries(summaryData).every(([_, val]) => {
				return val;
			});

			this.summaryMessage = allFixed
				? this.strings.summaryMessageAllFixed
				: this.strings.summaryMessageNotAllFixed;

			this.summaryData = summaryData;
			this.summaryVisibility = true;
		},
		hideSummary() {
			this.summaryVisibility = false;
		},
		parseFetchedTables(rawTables) {
			return rawTables.reduce((carry, current) => {
				const localDate = new Intl.DateTimeFormat('default', {
					year: 'numeric',
					day: 'numeric',
					month: 'long',
				}).format(new Date(current.modified));

				let { title, id } = current;
				id = id.toString();

				const tempObject = { ID: id, fieldDatas: [id, title.rendered, localDate] };

				carry.push(tempObject);
				return carry;
			}, []);
		},
		getTables() {
			const { getUrl } = this.sectionData.tableGet;
			const { restNonce } = this.sectionData.rest;

			const fetchUrl = new URL(getUrl);
			fetchUrl.searchParams.append('status', 'draft');
			fetchUrl.searchParams.append('per_page', '100');
			fetchUrl.searchParams.append('_fields', 'id,title,modified');
			fetchUrl.searchParams.append('orderby', 'id');

			this.setBusy();
			return fetch(fetchUrl.toString(), {
				method: 'GET',
				headers: {
					'X-WP-Nonce': restNonce,
				},
			})
				.then((resp) => {
					if (resp.ok) {
						return resp.json();
					}

					throw new Error(resp.statusText);
				})
				.then((rawTables) => {
					this.tables = this.parseFetchedTables(rawTables);
					this.setMessage({
						message: this.strings.tablesFetched,
					});
				})
				.catch((err) => {
					this.setMessage({ type: 'error', message: err });
				})
				.finally(() => {
					this.setBusy(false);
				});
		},
		fixTables() {
			const { fixUrl, fixAction, fixNonce } = this.sectionData.fixPost;
			const { restNonce } = this.sectionData.rest;

			const postUrl = new URL(fixUrl);
			postUrl.searchParams.append('action', fixAction);
			postUrl.searchParams.append('nonce', fixNonce);

			this.setBusy();
			return fetch(postUrl.toString(), {
				method: 'POST',
				headers: {
					'X-WP-NONCE': restNonce,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					// eslint-disable-next-line no-unused-vars
					tableIds: Object.entries(this.selectedTableIds).map(([_, id]) => {
						return id;
					}),
				}),
			})
				.then((resp) => {
					if (resp.ok) {
						return resp.json();
					}

					return resp.json().then((data) => {
						throw new Error(data.message);
					});
				})
				.then((respObj) => {
					this.resetSelections();
					this.showSummary(respObj.data.response);
				})
				.catch((err) => {
					this.setMessage({
						message: err,
						type: 'error',
					});
				})
				.finally(() => {
					this.setBusy(false);
				});
		},
	},
};
</script>
