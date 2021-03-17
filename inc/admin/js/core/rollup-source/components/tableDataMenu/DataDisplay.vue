<template>
	<fragment v-if="getEditorActiveId !== null">
		<div class="wptb-table-data-content">
			<data-manager :use-default="false"></data-manager>
		</div>
		<portal to="footerButtons">
			<div class="wptb-table-data-menu-footer-buttons-container">
				<menu-button :disabled="revertDisableStatus" type="danger">{{ translationM('revert') }}</menu-button>
				<menu-button :disabled="saveDisabledStatus">{{ translationM('save') }}</menu-button>
			</div>
		</portal>
	</fragment>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import MenuButton from '../MenuButton';
import DataManager from '../DataManager';

export default {
	components: { DataManager, MenuButton },
	watch: {
		getEditorActiveId(n) {
			this.resetDataObject();
			if (n !== null) {
				this.fetchDataObject(n)
					.then((resp) => {
						this.dataObject = resp;

						const { controls, content } = resp;
						this.setDataManagerControlObject(controls);
						this.mergeTempData(content);
					})
					.catch(() => {
						// do nothing
					});
			}
		},
	},
	data() {
		return {
			dataObject: null,
		};
	},
	computed: {
		revertDisableStatus() {
			return !this.isDirty;
		},
		saveDisabledStatus() {
			return !this.isDirty;
		},
		...mapGetters(['getEditorActiveId', 'isDirty']),
	},
	methods: {
		resetDataObject() {
			this.dataObject = null;
		},
		...mapActions(['fetchDataObject']),
		...mapMutations(['setDataManagerControlObject', 'mergeTempData', 'dirtySwitchOn', 'dirtySwitchOff']),
	},
};
</script>
