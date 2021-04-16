<template>
	<generic-data-source-setup>
		<existing-setup-left-panel></existing-setup-left-panel>
		<existing-setup-builder-view></existing-setup-builder-view>
	</generic-data-source-setup>
</template>

<script>
import GenericDataSourceSetup from './GenericDataSourceSetup';
import ExistingSetupLeftPanel from './ExistingSetupLeftPanel';
import ExistingSetupBuilderView from './ExistingSetupBuilderView';

export default {
	name: 'ExistingSetup',
	components: { ExistingSetupBuilderView, ExistingSetupLeftPanel, GenericDataSourceSetup },
};
</script>
