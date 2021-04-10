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
		<div>
			<text-modify-input
				class="wptb-data-table-editor-title-input"
				:edit-always-visible="true"
				:placeholder="translationM('dataTitlePlaceholder')"
				:value.sync="dataObjectTitle"
			></text-modify-input>
			<data-manager
				key="dataManager"
				v-show="currentSetupGroupTab('csv') === 'dataManager'"
				:use-default="getSelectedDataSource === undefined || getSelectedDataSource === null"
			></data-manager>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import DragDrop from './DragDrop';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import StoreMaterialButton from './StoreMaterialButton';
import DataManager from './DataManager';
import TextModifyInput from './TextModifyInput';

export default {
	name: 'CsvSetupBuilderView',
	props: {
		currentFile: {},
	},
	model: {
		prop: 'currentFile',
		event: 'fileSelected',
	},
	components: { TextModifyInput, StoreMaterialButton, DragDrop, DataManager },
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
		dataObjectTitle: {
			get() {
				return this.getDataObjectTitle;
			},
			set(n) {
				this.setDataObjectTitle(n);
			},
		},
		...mapGetters(['currentSetupGroupTab', 'getSelectedDataSource', 'getDataObjectTitle']),
	},
	methods: {
		handleCsvImport() {
			this.$emit('csvImport');
		},
		...mapMutations(['setDataObjectTitle']),
	},
};
</script>
