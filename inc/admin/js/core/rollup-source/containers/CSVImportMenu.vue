<template>
	<div>
		<drag-drop
			v-model="currentFile"
			:texts="{ hint: strings.fileDropHint, browse: strings.browse, clear: strings.clear }"
			:allowed-formats="['csv', 'xml', 'zip']"
		></drag-drop>
		<div>
			<control-item
				v-for="field in fieldsData"
				:key="field.id"
				:field-data="field"
				:model-bind="field.modelBind"
			></control-item>
		</div>
		<portal to="footerButtons">
			<menu-button :disabled="isImportDisabled" @click="importFromFile">{{ strings.importSection }} </menu-button>
		</portal>
	</div>
</template>
<script>
import DragDrop from '../components/DragDrop.vue';
import ControlItem from '../components/ControlItem.vue';
import MenuButton from '../components/MenuButton.vue';
import ImportOperations from '../functions/importOperations.js';
import withMessage from '../mixins/withMessage';

export default {
	props: ['options'],
	mixins: [withMessage],
	components: { DragDrop, ControlItem, MenuButton },
	data() {
		return {
			settings: {
				responsiveTables: false,
				topRowAsHeader: false,
				csvDelimiter: ',',
			},
			fieldsData: [],
			currentFile: null,
			fetching: false,
		};
	},
	mounted() {
		document.addEventListener('table:imported:saved', () => {
			this.currentFile = null;
			this.setMessage({ type: 'ok', message: this.strings.tableImported });
			this.setBusy(false);
		});

		document.addEventListener('table:imported:error', () => {
			this.currentFile = null;
			this.setMessage({ type: 'error', message: this.strings.errorOccured });
			this.setBusy(false);
		});

		this.fieldsData.push(
			{
				type: 'dropdown',
				id: 'csvDelimiter',
				modelBind: this.settings,
				label: this.strings.csvDelimiter,
				options: [
					{ value: ',', label: ', (comma)' },
					{ value: ';', label: '; (semicolon)' },
					{
						value: 'tab',
						label: '\\t (tabular)',
					},
				],
			},
			{
				type: 'checkbox',
				id: 'responsiveTables',
				modelBind: this.settings,
				label: this.strings.tableResponsive,
			},
			{ type: 'checkbox', id: 'topRowAsHeader', modelBind: this.settings, label: this.strings.topRowHeader }
		);
	},
	computed: {
		isImportDisabled() {
			if (this.currentFile === null) {
				return true;
			}
			return this.fetching;
		},
	},
	methods: {
		importFromFile() {
			if (this.currentFile !== null) {
				const options = {
					file: this.currentFile,
					ajaxUrl: this.options.ajaxUrl,
					nonce: this.options.security_code,
					delimiter: this.settings.csvDelimiter,
					tableResponsive: this.settings.responsiveTables,
					topRowAsHeader: this.settings.topRowAsHeader,
				};

				const operations = ImportOperations(options);
				this.setBusy();
				operations.importFromFile();
			}
		},
	},
};
</script>
