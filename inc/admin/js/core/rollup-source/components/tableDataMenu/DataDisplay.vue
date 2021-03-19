<template>
	<fragment v-if="getEditorActiveId !== null">
		<div class="wptb-table-data-content">
			<input v-model="dataObjectTitle" placeholder="data title" />
			<data-manager :use-default="false"></data-manager>
		</div>
		<portal to="footerButtons">
			<div class="wptb-table-data-menu-footer-buttons-container">
				<menu-button @click="revertDataChanges" :disabled="revertDisableStatus" type="danger">{{
					translationM('revert')
				}}</menu-button>
				<menu-button @click="saveTableData" :disabled="saveDisabledStatus">{{
					translationM('save')
				}}</menu-button>
			</div>
		</portal>
	</fragment>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import MenuButton from '../MenuButton';
import DataManager from '../DataManager';

export default {
	components: { DataManager, MenuButton },
	watch: {
		getEditorActiveId(n) {
			this.resetDataObject();
			this.resetAppDirtyStatus();
			if (n !== null) {
				this.fetchDataObject(n)
					.then((resp) => {
						this.dataObject = resp.data.dataObject;

						this.mergeDataObject(this.dataObject);
					})
					.catch(() => {
						// do nothing
					});
			}
		},
	},
	data() {
		return {
			dataObject: null,
		};
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
				let title = '';
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
		...mapGetters(['getEditorActiveId', 'isDirty', 'getBusyState', 'prepareDataObject']),
	},
	methods: {
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
			this.revertTableData(this.dataObject);
		},
		...mapActions(['fetchDataObject', 'mergeDataObject', 'revertTableData', 'updateDataObjectAjax']),
		...mapMutations(['resetAppDirtyStatus', 'setEditorActiveId', 'setOkMessage', 'setAppDirty']),
	},
};
</script>
