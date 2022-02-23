<template>
	<fragment>
		<menu-content :center="true">
			<div class="wptb-table-fixer-settings">
				<list-table
					:model-bind="selectedTables"
					:row-data="userTables"
					:row-labels="['ID', strings.title, strings.modified]"
					:sort-type="{ 0: 'number', 2: 'date' }"
					search-clause=""
				></list-table>
			</div>
		</menu-content>
		<footer-buttons>
			<menu-button :disabled="fixTableButtonDisabledStatus">{{ tableFixButtonLabel }}</menu-button>
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

export default {
	components: { ListTable, MenuButton, MenuContent, FooterButtons, Fragment },
	mixins: [SettingsMenuSection, withMessage],
	data: () => ({ selectedTables: {}, tables: [] }),
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
	mounted() {
		this.$nextTick(() => {
			this.getTables();
		});
	},
	methods: {
		parseFetchedTables(rawTables) {
			return rawTables.reduce((carry, current) => {
				const localDate = new Intl.DateTimeFormat('default', {
					year: 'numeric',
					day: 'numeric',
					month: 'long',
				}).format(new Date(current.modified));

				const { title, id } = current;
				const tempObject = { ID: id, fieldDatas: [id, title.rendered, localDate] };

				carry.push(tempObject);
				return carry;
			}, []);
		},
		getTables() {
			const fetchUrl = new URL(this.sectionData.restUrl);
			fetchUrl.searchParams.append('status', 'draft');
			fetchUrl.searchParams.append('per_page', '100');
			fetchUrl.searchParams.append('_fields', 'id,title,modified');

			this.setBusy();
			return fetch(fetchUrl.toString(), {
				method: 'GET',
				headers: {
					'X-WP-Nonce': this.sectionData.restNonce,
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
	},
};
</script>
