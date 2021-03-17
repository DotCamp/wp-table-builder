<template>
	<fragment v-if="getEditorActiveId !== null">
		<div class="wptb-table-data-content">
			<data-manager :use-default="false"></data-manager>
		</div>
		<portal to="footerButtons">
			<div class="wptb-table-data-menu-footer-buttons-container">
				<menu-button @click="revertDataChanges" :disabled="revertDisableStatus" type="danger">{{
					translationM('revert')
				}}</menu-button>
				<menu-button :disabled="saveDisabledStatus">{{ translationM('save') }}</menu-button>
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
			if (n !== null) {
				this.fetchDataObject(n)
					.then((resp) => {
						this.dataObject = resp;

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
		...mapGetters(['getEditorActiveId', 'isDirty', 'getBusyState']),
	},
	methods: {
		resetDataObject() {
			this.dataObject = null;
		},
		revertDataChanges() {
			this.revertTableData(this.dataObject);
		},
		...mapActions(['fetchDataObject', 'mergeDataObject', 'revertTableData']),
		...mapMutations(['dirtySwitchOn', 'dirtySwitchOff']),
	},
};
</script>
