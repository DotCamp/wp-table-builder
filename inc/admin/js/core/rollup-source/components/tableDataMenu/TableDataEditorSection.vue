<template>
	<menu-content :center="true" class="wptb-table-data-section-wrapper">
		<div class="wptb-table-data-section">
			<data-listing></data-listing>
			<data-display @dataSaved="handleDataSaved"></data-display>
			<div v-if="getEditorActiveId === null" class="wptb-table-data-no-object-wrapper">
				<fragment v-if="simpleDataObjects.length === 0">
					<div class="wptb-table-data-no-object-message">
						<i>{{ translationM('noDataObjectMessage') }}</i>
					</div>
					<material-button :click="createNewHandler" style="padding: 10px !important;"
						>{{ translationM('createNew') }}
					</material-button>
				</fragment>
				<fragment v-else>
					<div class="wptb-table-data-no-object-message">
						<i>{{ translationM('selectDataFromListing') }}</i>
					</div>
					<material-button :click="createNewHandler" style="padding: 10px !important;"
						>{{ translationM('createNew') }}
					</material-button>
				</fragment>
			</div>
		</div>
	</menu-content>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import MenuContent from '../MenuContent';
import DataListing from './DataListing';
import DataDisplay from './DataDisplay';
import MaterialButton from '../MaterialButton';

export default {
	components: { MaterialButton, MenuContent, DataListing, DataDisplay },
	computed: {
		...mapGetters(['simpleDataObjects', 'getEditorActiveId']),
	},
	methods: {
		handleDataSaved() {
			this.fetchSimpleDataObjects()
				.then((resp) => {
					this.setSimpleDataObjects(resp.data.simpleDataObjects);
				})
				.catch(() => {
					// do nothing
				});
		},
		createNewHandler() {
			this.setTableDataSectionCurrentTab('tableDataCreateNewSection');
		},
		...mapActions(['fetchSimpleDataObjects']),
		...mapMutations(['setSimpleDataObjects', 'setTableDataSectionCurrentTab']),
	},
};
</script>
