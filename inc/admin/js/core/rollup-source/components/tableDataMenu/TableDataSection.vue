<template>
	<fragment>
		<portal to="childSections">
			<sections :child="true" :items="childSections" v-model="currentChildSection"></sections>
		</portal>
		<component :is="sectionComponent"></component>
	</fragment>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
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
			innerCurrentChildSection: 'tableDataEditorSection',
		};
	},
	computed: {
		currentChildSection: {
			get() {
				return this.innerCurrentChildSection;
			},
			set(n) {
				if (this.isDirty) {
					this['modalWindow/showMessage']({
						message: this.translationM('sectionDirtyError'),
						positive: this.translationM('yes'),
						negative: this.translationM('no'),
						callback: (status) => {
							if (status) {
								this.innerCurrentChildSection = n;
								this['modalWindow/resetModalWindow']();
							}
						},
					});
				} else {
					this.innerCurrentChildSection = n;
				}
			},
		},
		sectionComponent() {
			return this.innerCurrentChildSection[0].toUpperCase() + this.innerCurrentChildSection.slice(1);
		},
		...mapGetters(['isDirty']),
	},
	methods: {
		...mapActions(['modalWindow/showMessage', 'modalWindow/resetModalWindow']),
	},
};
</script>
