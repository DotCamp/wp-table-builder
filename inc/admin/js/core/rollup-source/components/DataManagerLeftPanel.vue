<template>
	<PanelSectionGroupTabbedItem :active-id="currentTab" id="dataManager">
		<data-manager-csv-options :is-busy="isBusy"></data-manager-csv-options>
	</PanelSectionGroupTabbedItem>
</template>
<script>
import PanelSectionGroupTabbedItem from './PanelSectionGroupTabbedItem';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import withStoreBusy from '../mixins/withStoreBusy';
import DataManagerCsvOptions from './DataManagerCsvOptions';

export default {
	components: { DataManagerCsvOptions, PanelSectionGroupTabbedItem },
	mixins: [withNativeTranslationStore, withStoreBusy],
	props: {
		currentTab: {
			type: String,
			default: 'default',
		},
	},
};
</script>
