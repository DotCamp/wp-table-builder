<template>
	<window-header-button
		@click.native="handlePanelVisibility"
		:active="panelVisibility"
		:title="translationM('options')"
		><span class="dashicons dashicons-admin-generic wptb-table-data-header-icon"></span>
		<portal to="dataDisplaySection">
			<transition name="wptb-vertical-move">
				<div class="wptb-table-data-object-options-wrapper wptb-plugin-box-shadow-md" v-show="panelVisibility">
					<data-object-type-options></data-object-type-options>
				</div>
			</transition>
		</portal>
	</window-header-button>
</template>

<script>
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import WindowHeaderButton from '../modalWindow/WindowHeaderButton';
import DataObjectTypeOptions from './DataObjectTypeOptions';

export default {
	mixins: [withNativeTranslationStore],
	components: { WindowHeaderButton, DataObjectTypeOptions },
	data() {
		return {
			panelVisibility: false,
		};
	},
	methods: {
		handlePanelVisibility() {
			this.panelVisibility = !this.panelVisibility;
		},
	},
};
</script>
