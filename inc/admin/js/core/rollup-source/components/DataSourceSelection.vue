<template>
	<fragment>
		<!--builder-->
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
		</div>
		<!--left-panel-->
		<portal to="leftPanel">
			<left-panel-info-message>{{ translation('sourceSelectLeftPanelInfo') }}</left-panel-info-message>
			<div
				class="wptb-data-table-left-panel-source-setup-general-button-wrapper"
				v-if="getSelectedDataSource !== null"
			>
				<left-panel-material-button :click="backToSelected" type="danger">{{
					translation('cancelNew') | cap
				}}</left-panel-material-button>
			</div>
		</portal>
	</fragment>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import DataSourceObject from '../functions/DataSourceObject';
import DataSourceCard from './DataSourceCard';
import LeftPanelInfoMessage from './LeftPanelInfoMessage';
import LeftPanelMaterialButton from './leftPanel/LeftPanelMaterialButton';

export default {
	components: { LeftPanelMaterialButton, DataSourceCard, LeftPanelInfoMessage },
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
	computed: {
		...mapGetters(['translation', 'getSelectedDataSource']),
	},
	methods: {
		handleSourceSelection(id) {
			this.startSourceSetup(id);
		},
		deselectSelection() {
			this.softSelectCard(null);
		},
		backToSelected() {
			const selectedId = this.getSelectedDataSource;

			this.setCurrentScreenFromId(selectedId);
		},
		...mapActions(['startSourceSetup', 'softSelectCard', 'setCurrentScreenFromId']),
	},
};
</script>
