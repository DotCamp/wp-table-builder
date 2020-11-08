<template>
	<PanelSectionGroupTabbedItem :active-id="currentTab" id="dataManager">
		<fragment>
			<panel-toggle-control
				v-model="firstRowAsColumnName"
				:label="translationM('firstRowHeader') | cap"
			></panel-toggle-control>
		</fragment>
	</PanelSectionGroupTabbedItem>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import PanelSectionGroupTabbedItem from './PanelSectionGroupTabbedItem';
import PanelToggleControl from './PanelToggleControl';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';

export default {
	components: { PanelToggleControl, PanelSectionGroupTabbedItem },
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
				return this.getTempDataManagerControls.firstRowAsColumnName;
			},
			set(n) {
				this.setTempDataManagerControl({ key: 'firstRowAsColumnName', value: n });
			},
		},
		...mapGetters(['getTempDataManagerControls']),
	},
	methods: {
		...mapMutations(['setTempDataManagerControl']),
	},
};
</script>
