<template>
	<PanelSectionGroupTabbedItem :active-id="currentTab" id="dataManager">
		<fragment>
			<panel-toggle-control
				v-model="firstRowAsColumnName"
				:label="translationM('firstRowHeader') | cap"
			></panel-toggle-control>
			<panel-button-control>
				{{ translationM('selectRowForNames') | cap }}
			</panel-button-control>
		</fragment>
	</PanelSectionGroupTabbedItem>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import PanelSectionGroupTabbedItem from './PanelSectionGroupTabbedItem';
import PanelToggleControl from './PanelToggleControl';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import PanelButtonControl from './PanelButtonControl';

export default {
	components: { PanelButtonControl, PanelToggleControl, PanelSectionGroupTabbedItem },
	mixins: [withNativeTranslationStore],
	props: {
		currentTab: {
			type: String,
			default: 'default',
		},
	},
	computed: {
		firstRowAsColumnName: {
			get() {
				return this.getDataManagerControls.firstRowAsColumnName;
			},
			set(n) {
				this.setDataManagerControl({ key: 'firstRowAsColumnName', value: n });
			},
		},
		...mapGetters(['getDataManagerControls']),
	},
	methods: {
		...mapMutations(['setDataManagerControl']),
	},
};
</script>
