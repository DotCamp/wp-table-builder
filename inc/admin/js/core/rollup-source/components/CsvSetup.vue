<template>
	<div>
		<div
			class="wptb-plugin-width-full wptb-plugin-height-full wptb-flex wptb-flex-justify-center wptb-flex-align-center wptb-flex-col"
		>
			<drag-drop
				style="font-size: 80%;"
				:texts="{
					hint: translationM('dragDropHint'),
					browse: translationM('browse'),
					clear: translationM('clear'),
				}"
				:allowed-formats="['csv']"
				v-model="currentFile"
			></drag-drop>
			<transition name="wptb-fade">
				<material-button v-show="currentFile !== null" style="font-size: 80%; padding: 10px;">{{
					translationM('import') | cap
				}}</material-button>
			</transition>
		</div>
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
import DragDrop from './DragDrop';
import MaterialButton from './MaterialButton';

export default {
	components: {
		MaterialButton,
		DataTableLeftPanel,
		PanelSectionGroupTabbedImproved,
		PanelSectionGroupTabbedItem,
		CsvSetupCsvPanelControls,
		DragDrop,
	},
	mixins: [withNativeTranslationStore],
	data() {
		return {
			panelTabs: {
				csv: this.translationM('csvTitle'),
				dataManager: this.translationM('dataManager'),
			},
			currentFile: null,
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
