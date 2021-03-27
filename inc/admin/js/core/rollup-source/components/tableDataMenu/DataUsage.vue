<template>
	<div class="wptb-table-data-associated-tables">
		<span
			:title="message"
			class="wptb-table-data-associated-tables-inner-wrapper"
			:style="{ cursor: count === 0 ? 'default' : 'pointer' }"
			@click.prevent="showTableListing"
			><span class="wptb-table-data-associated-tables-number" :data-plural="count > 0">{{ count }}</span>
			<span class="dashicons dashicons-editor-table wptb-table-data-associated-tables-icon"></span
		></span>
		<usage-list-modal :title="translationM('tables')" :visibility="listVisibility" @close="listVisibility = false">
			<div class="wptb-data-usage-table-list-wrapper">
				<table-card
					v-for="table in associatedTables"
					:key="table.id"
					:title="table.title"
					:id="table.id"
					:link="generateCardLink(table.id)"
				></table-card>
			</div>
		</usage-list-modal>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { sprintf, _n } from '@wordpress/i18n';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import UsageListModal from './UsageListModal';
import TableCard from './TableCard';

export default {
	components: { TableCard, UsageListModal },
	props: {
		associatedTables: {
			type: Array,
			default: () => [],
		},
	},
	mixins: [withNativeTranslationStore],
	data() {
		return {
			listVisibility: false,
		};
	},
	computed: {
		buttonStyle() {
			return {
				cursor: this.count === 0 ? 'default' : 'pointer',
			};
		},
		count() {
			return this.associatedTables.length;
		},
		message() {
			if (this.count === 0) {
				return this.translationM('noTableUsage');
			}

			return sprintf(
				// translators: %s: table count
				_n('%s table is using this data.', '%s tables are using this data', this.count, 'wp-table-builder'),
				this.count
			);
		},
		...mapGetters(['getSecurityProps']),
	},
	methods: {
		showTableListing() {
			if (this.count !== 0) {
				this.listVisibility = true;
			}
		},
		generateCardLink(id) {
			const url = new URL(this.getSecurityProps('adminUrl'));

			url.searchParams.append('page', 'wptb-builder');
			url.searchParams.append('table', id);

			return url.toString();
		},
	},
};
</script>
