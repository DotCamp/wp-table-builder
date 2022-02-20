<template>
	<fragment>
		<menu-content style="flex-direction: column; justify-content: flex-start; align-items: center" :center="true">
			<code style="margin: 5px" :key="table.id" v-for="table in tables"
				>{{ table.id }}: {{ table.title.rendered }}</code
			>
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

export default {
	components: { MenuButton, MenuContent, FooterButtons, Fragment },
	mixins: [SettingsMenuSection, withMessage],
	data: () => ({ selectedTableIds: [], tables: [] }),
	computed: {
		tableFixButtonLabel() {
			const stringId = this.selectedTableIds.length > 1 ? 'fixTables' : 'fixTable';

			return this.strings[stringId];
		},
		fixTableButtonDisabledStatus() {
			return this.isBusy() || this.selectedTableIds.length === 0;
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.getTables();
		});
	},
	methods: {
		getTables() {
			const fetchUrl = new URL(this.sectionData.restUrl);
			fetchUrl.searchParams.append('status', 'draft');
			fetchUrl.searchParams.append('per_page', '100');
			fetchUrl.searchParams.append('_fields', 'id,title');

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
				.then((tables) => {
					this.tables = tables;
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
