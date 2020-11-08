<template>
	<portal to="leftPanel">
		<slot></slot>
		<portal-target name="leftPanelAfter"></portal-target>

		<div class="wptb-data-table-left-panel-source-setup-general-button-wrapper" v-if="isActiveScreenSourceSetup">
			<material-button
				class="wptb-plugin-box-shadow-md wptb-panel-button-material"
				:click="setScreenToSourceSelect"
				type="danger"
				size="full-size"
				>{{ translationM('back') | cap }}</material-button
			>
			<material-button
				class="wptb-plugin-box-shadow-md wptb-panel-button-material"
				type="confirm"
				size="full-size"
				:disabled="!isSetupDataImported"
				>{{ translationM('continue') | cap }}</material-button
			>
		</div>
	</portal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MaterialButton from './MaterialButton';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';

export default {
	components: { MaterialButton },
	mixins: [withNativeTranslationStore],
	computed: {
		...mapGetters(['isActiveScreenSourceSetup', 'isSetupDataImported']),
	},
	methods: {
		setScreenToSourceSelect() {
			this.setCurrentScreen('DataSourceSelection');
		},
		...mapActions(['setCurrentScreen']),
	},
};
</script>
