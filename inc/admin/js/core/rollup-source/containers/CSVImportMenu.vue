<template>
	<div>
		<drag-drop
			v-model="currentFile"
			:texts="{ hint: strings.fileDropHint, browse: strings.browse, clear: strings.clear }"
			:allowed-formats="allowedFormats"
		></drag-drop>
		<div>
			<control-item
				v-for="field in fieldsData"
				:key="field.id"
				:field-data="field"
				:model-bind="field.modelBind"
				:master-visibility="field.masterVisibility"
				class="wptb-flex wptb-flex-align-center wptb-flex-justify-center"
			></control-item>
		</div>
		<portal to="footerButtons">
			<menu-button :disabled="isImportDisabled" @click="importFromFile">{{ strings.importSection }}</menu-button>
		</portal>
	</div>
</template>
<script>
import DragDrop from '$Components/DragDrop.vue';
import ControlItem from '$Components/ControlItem.vue';
import MenuButton from '$Components/MenuButton.vue';
import ImportOperations from '$Functions/importOperations.js';
import withMessage from '$Mixins/withMessage';

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
				preserveTableTitle: false,
			},
			fieldsData: [],
			currentFile: null,
			currentExtension: null,
			fetching: false,
			allowedFormats: ['csv', 'xml', 'zip'],
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
				masterVisibility: () => {
					return this.isCurrentFileType('csv');
				},
			},
			{
				type: 'checkbox',
				id: 'preserveTableTitle',
				modelBind: this.settings,
				label: this.strings.preserveTitles,
				masterVisibility: () => {
					return this.isCurrentFileType('xml', 'zip');
				},
			}
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
		isCurrentFileType(...typeName) {
			let status = false;

			if (this.currentFile) {
				const extension = this.currentFile.name.split('.').pop();
				status = typeName.includes(extension);
			}

			return status;
		},
		importFromFile() {
			if (this.currentFile !== null) {
				const options = {
					file: this.currentFile,
					ajaxUrl: this.options.ajaxUrl,
					nonce: this.options.security_code,
					delimiter: this.settings.csvDelimiter,
					tableResponsive: this.settings.responsiveTables,
					topRowAsHeader: this.settings.topRowAsHeader,
					preserveTitles: this.settings.preserveTableTitle,
				};

				const operations = ImportOperations(options);
				this.setBusy();
				operations.importFromFile();
			}
		},
	},
};
</script>
