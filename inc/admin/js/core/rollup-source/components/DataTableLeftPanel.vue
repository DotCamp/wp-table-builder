<template>
	<portal to="leftPanel">
		<slot></slot>
		<portal-target name="leftPanelAfter"></portal-target>

		<div class="wptb-data-table-left-panel-source-setup-general-button-wrapper" v-if="isActiveScreenSourceSetup">
			<left-panel-material-button
				:click="setCurrentScreenToDataSourceSelection"
				type="danger"
				:disabled="isBusy"
				>{{ translationM('back') | cap }}</left-panel-material-button
			>
			<left-panel-material-button
				v-if="getSelectedDataSource === null"
				type="confirm"
				:disabled="isContinueAvailable"
				:click="continueToGenerate"
				>{{ translationM('continue') | cap }}</left-panel-material-button
			>
		</div>
	</portal>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import withStoreBusy from '../mixins/withStoreBusy';
import LeftPanelMaterialButton from './leftPanel/LeftPanelMaterialButton';

export default {
	components: { LeftPanelMaterialButton },
	mixins: [withNativeTranslationStore, withStoreBusy],
	computed: {
		...mapGetters(['isActiveScreenSourceSetup', 'isSourceDataCreated', 'getSelectedDataSource']),
		...mapState(['tableIsActive']),
		isContinueAvailable() {
			return this.isBusy || !this.isSourceDataCreated;
		},
	},
	methods: {
		continueToGenerate() {
			DataTableManagerStatic.getInstance().cleanUp();
			DataTableManagerStatic.getInstance().markTableAsDataTable();

			// only call generate component if there is no active table in builder
			if (!this.tableIsActive) {
				WPTB_ControlsManager.callControlScript('Generate', false);
			}

			// set table dirty
			this.setTableDirty();

			WPTB_Helper.activateSection('elements');

			// set current source in setup as selected
			this.setCurrentSourceAsSelected();
		},
		...mapActions([
			'setCurrentScreenToDataSourceSelection',
			'setCurrentSourceAsSelected',
			'addOptionsAndDataToSave',
		]),
		...mapMutations(['setTableDirty']),
	},
};
</script>
