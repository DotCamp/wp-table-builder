<template>
	<div>
		<transition name="wptb-fade" mode="out-in">
			<div
				class="wptb-plugin-width-full wptb-plugin-height-full wptb-flex wptb-flex-justify-center wptb-flex-align-center wptb-flex-col"
				v-if="currentSetupGroupTab('csv') === 'csv'"
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
			<data-manager v-if="currentSetupGroupTab('csv') === 'dataManager'"></data-manager>
		</transition>
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
		...mapGetters(['currentSetupGroupTab']),
	},
	methods: {
		handleCsvImport() {
			this.$emit('csvImport');
		},
	},
};
</script>
