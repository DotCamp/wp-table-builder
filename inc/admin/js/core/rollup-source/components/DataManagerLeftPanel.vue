<template>
	<PanelSectionGroupTabbedItem :active-id="currentTab" id="dataManager">
		<fragment>
			<panel-toggle-control
				:disabled="isBusy"
				v-model="firstRowAsColumnName"
				:label="translationM('firstRowHeader') | cap"
			></panel-toggle-control>
			<panel-button-control v-if="rowForNamesVisibility" :disabled="isBusy" @buttonClick="selectRowForNames">
				{{ translationM('selectRowForNames') | cap }}
			</panel-button-control>
			<panel-button-control type="danger" v-if="!rowForNamesVisibility" @buttonClick="cancelRowSelectOperation">
				{{ translationM('cancel') | cap }}
			</panel-button-control>
			<panel-button-control v-if="newNamesRowButtonVisibility" @buttonClick="resetIndexRow">
				{{ translationM('resetIndexRow') | cap }}
			</panel-button-control>
		</fragment>
	</PanelSectionGroupTabbedItem>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import PanelSectionGroupTabbedItem from './PanelSectionGroupTabbedItem';
import PanelToggleControl from './PanelToggleControl';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import withStoreBusy from '../mixins/withStoreBusy';
import PanelButtonControl from './PanelButtonControl';

export default {
	components: { PanelButtonControl, PanelToggleControl, PanelSectionGroupTabbedItem },
	mixins: [withNativeTranslationStore, withStoreBusy],
	props: {
		currentTab: {
			type: String,
			default: 'default',
		},
	},
	computed: {
		newNamesRowButtonVisibility() {
			return !this.parsedData.header[0]?.generatedForHeader && this.getDataManagerControls.indexRow !== null;
		},
		firstRowAsColumnName: {
			get() {
				return this.getDataManagerControls.firstRowAsColumnName;
			},
			set(n) {
				this.setDataManagerControl({ key: 'firstRowAsColumnName', value: n });
			},
		},
		rowForNamesVisibility() {
			const { active, callerId } = this.getSelectOperationData;
			return !active && callerId !== 'selectRowForNames';
		},
		...mapGetters(['getDataManagerControls', 'parseCellId', 'getSelectOperationData', 'parsedData']),
	},
	methods: {
		...mapMutations(['setDataManagerControl']),
		...mapActions(['startRowSelectOperation', 'cancelRowSelectOperation']),
		selectRowForNames() {
			this.startRowSelectOperation('selectRowForNames').then((formedId) => {
				if (formedId) {
					const { rowId } = this.parseCellId(formedId);
					this.setDataManagerControl({ key: 'indexRow', value: rowId });

					// turn of first row as column name control if a row is selected as index
					if (rowId !== null) {
						this.setDataManagerControl({ key: 'firstRowAsColumnName', value: false });
					}
				}
			});
		},
		resetIndexRow() {
			this.setDataManagerControl({ key: 'firstRowAsColumnName', value: false });
			this.setDataManagerControl({ key: 'indexRow', value: null });
		},
	},
};
</script>
