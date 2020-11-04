<template>
	<div class="wptb-data-table-data-source-selection">
		<div class="wptb-data-table-data-source-header">{{ translation('dataSourceHeader') }}</div>
    <div class="wptb-data-table-data-source-cards-wrapper">
      <data-source-card v-for="source in sources" :data-source-object="source"></data-source-card>
    </div>
	</div>
</template>

<script>
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import DataSourceObject from '../functions/DataSourceObject';
import DataSourceCard from './DataSourceCard';

export default {
	components: { DataSourceCard },
	mixins: [withNativeTranslationStore],
	data() {
		return {
			sources: [new DataSourceObject('csv', this.translationM('csvTitle'), this.translationM('csvInfo'))],
		};
	},
};
</script>
