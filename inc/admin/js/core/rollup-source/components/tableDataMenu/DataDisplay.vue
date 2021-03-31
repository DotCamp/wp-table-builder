<template>
	<fragment v-if="getEditorActiveId !== null">
		<div class="wptb-table-data-content">
			<div class="wptb-table-data-title">
				<text-modify-input :value.sync="dataObjectTitle"></text-modify-input>
			</div>
			<data-display-header-button-container>
				<template v-slot:right>
					<data-usage :associated-tables="associatedTables"></data-usage>
				</template>
				<template v-slot:left>
					<data-display-options></data-display-options>
				</template>
			</data-display-header-button-container>
			<div class="wptb-table-data-manager-wrapper">
				<portal-target name="dataDisplaySection"></portal-target>
				<data-manager :use-default="false"></data-manager>
			</div>
		</div>
		<portal to="footerButtons">
			<div class="wptb-table-data-menu-footer-buttons-container">
				<menu-button @click="revertDataChanges" :disabled="revertDisableStatus" type="danger"
					>{{ translationM('revert') }}
				</menu-button>
				<menu-button @click="saveTableData" :disabled="saveDisabledStatus"
					>{{ translationM('save') }}
				</menu-button>
			</div>
		</portal>
	</fragment>
</template>

<script>
import deepmerge from 'deepmerge';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import MenuButton from '../MenuButton';
import DataManager from '../DataManager';
import TextModifyInput from '../TextModifyInput';
import DataUsage from './DataUsage';
import DataDisplayHeaderButtonContainer from './DataDisplayHeaderButtonContainer';
import DataDisplayOptions from './DataDisplayOptions';

export default {
	components: {
		DataDisplayOptions,
		DataDisplayHeaderButtonContainer,
		DataUsage,
		DataManager,
		MenuButton,
		TextModifyInput,
	},
	watch: {
		getEditorActiveId(n) {
			this.dataObjectOperations(n);
		},
	},
	data() {
		return {
			dataObject: null,
			dataObjectBackup: null,
		};
	},
	mounted() {
		this.$nextTick(() => {
			if (this.getEditorActiveId !== null) {
				this.dataObjectOperations(this.getEditorActiveId);
			}
		});
	},
	computed: {
		genericDisabledStatus() {
			if (this.getBusyState) {
				return this.getBusyState;
			}

			return !this.isDirty;
		},
		revertDisableStatus() {
			return this.genericDisabledStatus;
		},
		saveDisabledStatus() {
			return this.genericDisabledStatus;
		},
		dataObjectTitle: {
			get() {
				let title = ' ';
				if (this.dataObject && this.dataObject.title) {
					title = this.dataObject.title;
				}

				return title;
			},
			set(n) {
				this.dataObject.title = n;
				this.setAppDirty();
			},
		},
		associatedTables() {
			return this.getDataObjectSimple(this.getEditorActiveId).tables;
		},
		...mapGetters(['getEditorActiveId', 'isDirty', 'getBusyState', 'prepareDataObject', 'getDataObjectSimple']),
	},
	methods: {
		dataObjectOperations(dataObjectId) {
			this.resetDataObject();
			this.resetAppDirtyStatus();
			if (dataObjectId !== null) {
				this.fetchDataObject(dataObjectId)
					.then((resp) => {
						this.dataObject = resp.data.dataObject;

						// update data object backup with new data object
						this.updateDataObjectBackup();

						this.mergeDataObject(this.dataObject);
					})
					.catch(() => {
						// do nothing
					});
			}
		},
		updateDataObjectBackup() {
			// break reference link between each objects
			this.dataObjectBackup = deepmerge({}, this.dataObject);
		},
		saveTableData() {
			this.updateDataObjectAjax(this.prepareDataObject(this.dataObject))
				.then(({ data }) => {
					this.setEditorActiveId(data.id);
					this.setOkMessage(this.translationM('tableDataUpdateMessage'));
					this.resetAppDirtyStatus();
					this.$emit('dataSaved');
				})
				.catch(() => {
					// do nothing
				});
		},
		resetDataObject() {
			this.dataObject = null;
		},
		revertDataChanges() {
			this.dataObject = deepmerge({}, this.dataObjectBackup);
			this.revertTableData(this.dataObject);
		},
		...mapActions(['fetchDataObject', 'mergeDataObject', 'revertTableData', 'updateDataObjectAjax']),
		...mapMutations(['resetAppDirtyStatus', 'setEditorActiveId', 'setOkMessage', 'setAppDirty']),
	},
};
</script>
