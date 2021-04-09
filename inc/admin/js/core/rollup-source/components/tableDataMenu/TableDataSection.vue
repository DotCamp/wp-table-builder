<template>
	<fragment>
		<portal to="childSections">
			<sections :child="true" :items="childSections" v-model="currentChildSection"></sections>
		</portal>
		<component :is="sectionComponent"></component>
	</fragment>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Sections from '../Sections';
import TableDataEditorSection from './TableDataEditorSection';
import TableDataCreateNewSection from './TableDataCreateNewSection';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';

export default {
	components: { Sections, TableDataEditorSection, TableDataCreateNewSection },
	mixins: [withNativeTranslationStore],
	data() {
		return {
			childSections: {
				tableDataEditorSection: this.translationM('editor'),
				tableDataCreateNewSection: this.translationM('new'),
			},
		};
	},
	computed: {
		currentChildSection: {
			get() {
				return this.getTableDataSectionCurrentTab;
			},
			set(n) {
				if (this.isDirty) {
					this['modalWindow/showMessage']({
						message: this.translationM('sectionDirtyError'),
						positive: this.translationM('yes'),
						negative: this.translationM('no'),
						callback: (status) => {
							if (status) {
								this.setTableDataSectionCurrentTab(n);
								this['modalWindow/resetModalWindow']();
								this.revertTableDataFromBackup();
							}
						},
					});
				} else {
					this.setTableDataSectionCurrentTab(n);
				}
			},
		},
		sectionComponent() {
			return this.getTableDataSectionCurrentTab[0].toUpperCase() + this.getTableDataSectionCurrentTab.slice(1);
		},
		...mapGetters(['isDirty', 'getTableDataSectionCurrentTab']),
	},
	methods: {
		...mapActions(['modalWindow/showMessage', 'modalWindow/resetModalWindow', 'revertTableDataFromBackup']),
		...mapMutations(['setTableDataSectionCurrentTab']),
	},
};
</script>
