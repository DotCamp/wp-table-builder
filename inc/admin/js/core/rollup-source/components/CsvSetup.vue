<template>
	<div>
		<i>csv setup</i>
		<data-table-left-panel>
			<left-panel-info-message>{{ translation('csvSetupLeftPanelInfo') }} </left-panel-info-message>
		</data-table-left-panel>
	</div>
</template>
<script>
import DataTableLeftPanel from './DataTableLeftPanel';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import LeftPanelInfoMessage from './LeftPanelInfoMessage';

export default {
	components: { DataTableLeftPanel, LeftPanelInfoMessage },
	mixins: [withNativeTranslationStore],
};
</script>
