<template>
	<data-table-left-panel>
		<panel-section-group-tabbed-improved
			:header="translationM('csvControlHeader')"
			:tabs="panelTabs"
			v-model="activeControlTab"
		>
			<template v-slot:default="{ currentTab }">
				<panel-section-group-tabbed-item :active-id="currentTab" id="csv">
					<csv-setup-csv-panel-controls></csv-setup-csv-panel-controls>
				</panel-section-group-tabbed-item>
				<data-manager-left-panel :current-tab="currentTab" />
			</template>
		</panel-section-group-tabbed-improved>
	</data-table-left-panel>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import CsvSetupCsvPanelControls from './CsvSetupCsvPanelControls';
import DataTableLeftPanel from './DataTableLeftPanel';
import PanelSectionGroupTabbedImproved from './PanelSectionGroupTabbedImproved';
import PanelSectionGroupTabbedItem from './PanelSectionGroupTabbedItem';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import DataManagerLeftPanel from './DataManagerLeftPanel';

export default {
	name: 'CsvSetupLeftPanel',
	props: {
		panelTabs: {
			type: Object,
			default: () => {
				return {
					default: 'default',
				};
			},
		},
	},
	mixins: [withNativeTranslationStore],
	components: {
		DataManagerLeftPanel,
		CsvSetupCsvPanelControls,
		DataTableLeftPanel,
		PanelSectionGroupTabbedImproved,
		PanelSectionGroupTabbedItem,
	},
	computed: {
		activeControlTab: {
			get() {
				return this.currentSetupGroupTab('csv');
			},
			set(n) {
				this.setActiveControlTabGroup({ sourceId: 'csv', tabId: n });
			},
		},
		...mapGetters(['currentSetupGroupTab']),
	},
	methods: {
		...mapMutations(['setActiveControlTabGroup']),
	},
};
</script>
