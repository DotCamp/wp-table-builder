<template>
	<div
		class="wptb-flex wptb-plugin-height-full wptb-plugin-width-full wptb-justify-content-center wptb-flex-align-center wptb-data-table-elements-message"
	>
		<div
			class="wptb-data-table-message-wrapper wptb-plugin-box-shadow-md wptb-flex wptb-justify-content-center wptb-flex-align-center wptb-flex-col"
		>
			<div class="wptb-data-table-message-icon" v-html="getIcon('exclamationTriangle')"></div>
			<div>
				<i>{{ translationM('elementsMessage') }}</i>
			</div>
			<left-panel-material-button :click="toDataSetup">{{
				'Back to data table setup' | cap
			}}</left-panel-material-button>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import LeftPanelMaterialButton from '../leftPanel/LeftPanelMaterialButton';

export default {
	components: { LeftPanelMaterialButton },
	mixins: [withNativeTranslationStore],
	computed: {
		...mapGetters(['getIcon']),
	},
	methods: {
		toDataSetup() {
			WPTB_Helper.activateSection('data_table_menu');
		},
	},
};
</script>
