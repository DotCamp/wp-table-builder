<template>
	<div class="wptb-data-table-csv-setup wptb-plugin-width-full wptb-plugin-height-full">
		<!--    left panel controls-->
		<CsvSetupLeftPanel :panel-tabs="panelTabs"></CsvSetupLeftPanel>
		<!--    builder view-->
		<CsvSetupBuilderView @csvImport="readCsvFile" v-model="currentFile"></CsvSetupBuilderView>
	</div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import CsvSetupLeftPanel from './CsvSetupLeftPanel';
import CsvSetupBuilderView from './CsvSetupBuilderView';

export default {
	components: {
		CsvSetupBuilderView,
		CsvSetupLeftPanel,
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
	mounted() {
		// TODO [erdembircan] remove for production
		this.setSetupSourceId('csv');
	},
	computed: {
		...mapGetters(['getSetupControls']),
	},
	methods: {
		readCsvFile() {
			if (FileReader && this.currentFile) {
				const csvReader = new FileReader();

				// csv reader load event listener
				csvReader.addEventListener('load', (e) => {
					const fileContent = e.target.result;

					// read contents of file line by line
					const lines = fileContent.split(/[\r\n]+/g);

					// decide delimiter value
					const { delimiter: delimiterId } = this.getSetupControls('csv');
					let delimiter = ',';
					switch (delimiterId) {
						case 'comma': {
							delimiter = ',';
							break;
						}
						default: {
							delimiter = ',';
							break;
						}
					}

					const csvData = lines.reduce((carry, item) => {
						// split individual cell data with defined delimiter
						const splitData = item.split(delimiter);
						carry.push(splitData);

						return carry;
					}, []);

					// set csv data to temp data manager
					this.addDataManagerTempData({ data: csvData });

					// show data manager setup
					this.setActiveTabGroupForCurrentSource('dataManager');
					this.setBusy(false);
				});

				// csv reader error event listener
				csvReader.addEventListener('error', (e) => {
					this.setBusy(false);
				});

				// start reading file
				this.setBusy(true);
				csvReader.readAsText(this.currentFile);
			}
		},
		...mapMutations(['setBusy', 'setSetupSourceId']),
		...mapActions(['addDataManagerTempData', 'setActiveTabGroupForCurrentSource']),
	},
};
</script>
