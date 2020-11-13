<template>
	<portal to="leftPanel">
		<slot></slot>
		<portal-target name="leftPanelAfter"></portal-target>

		<div class="wptb-data-table-left-panel-source-setup-general-button-wrapper" v-if="isActiveScreenSourceSetup">
			<material-button
				class="wptb-plugin-box-shadow-md wptb-panel-button-material"
				:click="setCurrentScreenToDataSourceSelection"
				type="danger"
				size="full-size"
				:disabled="isBusy"
				>{{ translationM('back') | cap }}</material-button
			>
			<material-button
				class="wptb-plugin-box-shadow-md wptb-panel-button-material"
				type="confirm"
				size="full-size"
				:disabled="isContinueAvailable"
				>{{ translationM('continue') | cap }}</material-button
			>
		</div>
	</portal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MaterialButton from './MaterialButton';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import withStoreBusy from '../mixins/withStoreBusy';

export default {
	components: { MaterialButton },
	mixins: [withNativeTranslationStore, withStoreBusy],
	computed: {
		...mapGetters(['isActiveScreenSourceSetup', 'isSourceDataCreated']),
		isContinueAvailable() {
			return this.isBusy || !this.isSourceDataCreated;
		},
	},
	methods: {
		...mapActions(['setCurrentScreenToDataSourceSelection']),
	},
};
</script>
