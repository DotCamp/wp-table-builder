<template>
	<fragment>
		<transition name="wptb-fade">
			<div v-show="isVisible" :style="mainStyle" ref="dataTableMain" class="wptb-data-table-main">
				<data-screen-handler></data-screen-handler>
				<mounting-portal :mount-to="leftPanelId">
					<portal-target name="leftPanel"></portal-target>
				</mounting-portal>
				<mounting-portal mount-to="#beforeElementOptions" append>
					<data-table-element-option v-if="getSelectedDataSource"></data-table-element-option>
				</mounting-portal>
				<mounting-portal mount-to="#wptbDataTableElementsTarget" append>
					<data-table-elements-message v-if="getSelectedDataSource === null"></data-table-elements-message>
				</mounting-portal>
			</div>
		</transition>
		<data-table-generated-preview></data-table-generated-preview>
	</fragment>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import DataScreenHandler from '../components/DataScreenHandler';
import DataTableElementOption from '../components/dataTable/DataTableElementOption';
import DataTableElementsMessage from '../components/dataTable/DataTableElementsMessage';
import DataTableGeneratedPreview from '../components/dataTable/DataTableGeneratedPreview';

export default {
	props: {
		sectionName: {
			type: String,
			required: true,
		},
		headerHeight: {
			type: Number,
			default: 0,
		},
	},
	components: { DataTableGeneratedPreview, DataTableElementsMessage, DataTableElementOption, DataScreenHandler },
	data() {
		return {
			extraPadding: 0,
		};
	},
	mounted() {
		// change component visibility depending on section changes on builder
		document.addEventListener('wptbSectionChanged', ({ detail }) => {
			this.setComponentVisibility(detail === this.sectionName);
		});

		this.handleMainTableDiscoveryProcess('.wptb-management_table_container .wptb-table-setup .wptb-preview-table');

		// change component visibility based on current active section
		this.setComponentVisibility(WPTB_Helper.getCurrentSection() === this.sectionName);

		// enable saving data table options to table on table save operation
		this.addOptionsAndDataToSave();

		// set up proxy for select click id
		this.setUpSelectionIdProxy();

		// watch for save operation process responses
		this.watchSavedResponse();
	},
	computed: {
		/**
		 * Style for main app component.
		 *
		 * @return {Object} style
		 */
		mainStyle() {
			return {
				marginTop: `${this.headerHeight + this.extraPadding}px`,
				height: `calc( 100% - ${this.headerHeight + this.extraPadding}px)`,
			};
		},
		...mapGetters(['isVisible', 'getSelectedDataSource']),
		...mapState(['leftPanelId', 'devStartupScreen']),
	},
	methods: {
		...mapActions([
			'setComponentVisibility',
			'setCurrentScreen',
			'addOptionsAndDataToSave',
			'setUpSelectionIdProxy',
			'handleMainTableDiscoveryProcess',
			'watchSavedResponse',
		]),
	},
};
</script>
