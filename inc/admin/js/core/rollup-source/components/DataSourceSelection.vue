<template>
	<div class="wptb-data-table-data-source-selection" @click.prevent.capture="deselectSelection">
		<div class="wptb-data-table-data-source-header">{{ translation('dataSourceHeader') }}</div>
		<div class="wptb-data-table-data-source-cards-wrapper">
			<data-source-card
				v-for="source in sources"
				:data-source-object="source"
				:key="source.id"
				@sourceCardConfirm="handleSourceSelection"
			></data-source-card>
		</div>
		<data-table-left-panel>
			<left-panel-info-message>{{ translation('sourceSelectLeftPanelInfo') }}</left-panel-info-message>
		</data-table-left-panel>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import DataSourceObject from '../functions/DataSourceObject';
import DataSourceCard from './DataSourceCard';
import DataTableLeftPanel from './DataTableLeftPanel';
import LeftPanelInfoMessage from './LeftPanelInfoMessage';

export default {
	components: { DataSourceCard, DataTableLeftPanel, LeftPanelInfoMessage },
	mixins: [withNativeTranslationStore],
	data() {
		return {
			sources: [
				new DataSourceObject(
					'csv',
					this.translationM('csvTitle'),
					this.translationM('csvInfo'),
					this.$store.getters.getIcon('csv')
				),
				new DataSourceObject(
					'wordpressPost',
					this.translationM('wordpressPostTitle'),
					this.translationM('wordpressPostInfo'),
					this.$store.getters.getIcon('wordpressPost'),
					true
				),
				new DataSourceObject(
					'database',
					this.translationM('databaseTitle'),
					this.translationM('databaseInfo'),
					this.$store.getters.getIcon('database'),
					true
				),
				new DataSourceObject(
					'remote',
					this.translationM('remoteTitle'),
					this.translationM('remoteInfo'),
					this.$store.getters.getIcon('server'),
					true
				),
			],
		};
	},
	methods: {
		handleSourceSelection(id) {
			this.startSourceSetup(id);
		},
		deselectSelection() {
			this.softSelectCard(null);
		},
		...mapActions(['startSourceSetup', 'softSelectCard']),
	},
};
</script>
