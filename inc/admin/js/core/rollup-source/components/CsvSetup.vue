<template>
	<div>
		<i>csv setup</i>
		<data-table-left-panel>
			<panel-section-group-tabbed-improved
				:header="translationM('csvControlHeader')"
				:tabs="panelTabs"
				v-model="activeControlTab"
			>
				<template v-slot:default="{ currentTab }">
					<PanelSectionGroupTabbedItem :active-id="currentTab" id="csv">
						<csv-setup-csv-panel-controls></csv-setup-csv-panel-controls>
					</PanelSectionGroupTabbedItem>
					<PanelSectionGroupTabbedItem :active-id="currentTab" id="dataManager"
						>data manager</PanelSectionGroupTabbedItem
					>
				</template>
			</panel-section-group-tabbed-improved>
		</data-table-left-panel>
	</div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import DataTableLeftPanel from './DataTableLeftPanel';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import PanelSectionGroupTabbedImproved from './PanelSectionGroupTabbedImproved';
import PanelSectionGroupTabbedItem from './PanelSectionGroupTabbedItem';
import CsvSetupCsvPanelControls from './CsvSetupCsvPanelControls';

export default {
	components: {
		DataTableLeftPanel,
		PanelSectionGroupTabbedImproved,
		PanelSectionGroupTabbedItem,
		CsvSetupCsvPanelControls,
	},
	mixins: [withNativeTranslationStore],
	data() {
		return {
			panelTabs: {
				csv: this.translationM('csvTitle'),
				dataManager: this.translationM('dataManager'),
			},
		};
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
