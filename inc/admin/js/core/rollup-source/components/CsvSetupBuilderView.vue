<template>
	<div class="wptb-plugin-height-full wptb-plugin-width-full">
		<div
			class="wptb-plugin-height-full wptb-plugin-width-full wptb-flex wptb-flex-justify-center wptb-flex-align-center wptb-flex-col"
			v-show="currentSetupGroupTab('csv') === 'csv'"
		>
			<drag-drop
				:texts="{
					hint: translationM('dragDropHint'),
					browse: translationM('browse'),
					clear: translationM('clear'),
				}"
				:allowed-formats="['csv']"
				v-model="innerFile"
			></drag-drop>
			<transition name="wptb-fade">
				<store-material-button v-show="currentFile !== null" @buttonClicked="handleCsvImport"
					>{{ translationM('import') | cap }}
				</store-material-button>
			</transition>
		</div>
		<data-manager
			key="dataManager"
			v-show="currentSetupGroupTab('csv') === 'dataManager'"
			:use-default="getSelectedDataSource === undefined || getSelectedDataSource === null"
		></data-manager>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import DragDrop from './DragDrop';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import StoreMaterialButton from './StoreMaterialButton';
import DataManager from './DataManager';

export default {
	name: 'CsvSetupBuilderView',
	props: {
		currentFile: {},
	},
	model: {
		prop: 'currentFile',
		event: 'fileSelected',
	},
	components: { StoreMaterialButton, DragDrop, DataManager },
	mixins: [withNativeTranslationStore],
	data() {
		return {
			innerFile: this.currentFile,
		};
	},
	watch: {
		innerFile(n) {
			this.$emit('fileSelected', n);
		},
	},
	computed: {
		...mapGetters(['currentSetupGroupTab', 'getSelectedDataSource']),
	},
	methods: {
		handleCsvImport() {
			this.$emit('csvImport');
		},
	},
};
</script>
