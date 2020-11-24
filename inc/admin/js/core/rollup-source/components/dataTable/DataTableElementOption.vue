<template>
	<section-group-collapse
		:start-collapsed="false"
		section-id="dataTableElementOption"
		:label="translation('collapseSectionHeader')"
	>
		<panel-section-group-tabbed-improved
			:header="translationM('bindings')"
			:tabs="panelTabs"
			v-model="currentActiveTab"
		>
			<template v-slot:default="{ currentTab }">
				<panel-section-group-tabbed-item :active-id="currentTab" id="element">
					<!--column select control-->
					<panel-dropdown-control
						v-model="elementColumnBinding"
						:label="translationM('column')"
						:options="getColumnNames"
					>
					</panel-dropdown-control>
				</panel-section-group-tabbed-item>
				<panel-section-group-tabbed-item :active-id="currentTab" id="row">row</panel-section-group-tabbed-item>
			</template>
		</panel-section-group-tabbed-improved>
	</section-group-collapse>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import SectionGroupCollapse from '../leftPanel/SectionGroupCollapse';
import PanelSectionGroupTabbedImproved from '../PanelSectionGroupTabbedImproved';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import PanelSectionGroupTabbedItem from '../PanelSectionGroupTabbedItem';
import PanelDropdownControl from '../PanelDropdownControl';

export default {
	mixins: [withNativeTranslationStore],
	components: {
		PanelDropdownControl,
		PanelSectionGroupTabbedItem,
		PanelSectionGroupTabbedImproved,
		SectionGroupCollapse,
	},
	data() {
		return {
			currentElement: null,
			currentElementId: null,
			panelTabs: {
				element: this.translationM('element'),
				row: this.translationM('row'),
			},
			currentActiveTab: 'element',
		};
	},
	mounted() {
		document.addEventListener('element:controls:active:global', ({ detail: element }) => {
			if (element.getAttribute('class').includes('wptb-ph-element')) {
				this.currentElement = element;
				this.currentTab = 'element';
			}
		});
	},
	computed: {
		elementColumnBinding: {
			get() {
				if (this.currentElement) {
					const elementId = this.parseElementId();
					const binding = this.getColumnBindingForElement(elementId);
					return binding || 'auto';
				}
				return 'auto';
			},
			set(val) {
				if (this.currentElement) {
					const elementId = this.parseElementId();
					this.setColumnBindingForElement({ id: elementId, value: val });
				}
			},
		},
		getColumnNames() {
			const { rowId } = this.parsedData.header[0];
			return this.parsedData.header[0].values.reduce(
				(carry, item) => {
					const cellId = this.formCellId(rowId, item.colId);
					// eslint-disable-next-line no-param-reassign
					carry[cellId] = item.value;

					return carry;
				},
				{ auto: this.translationM('auto') }
			);
		},
		...mapGetters(['translation', 'parsedData', 'formCellId', 'getColumnBindingForElement']),
	},
	methods: {
		parseElementId() {
			if (this.currentElement) {
				const activeElementIdArray = this.currentElement
					.getAttribute('class')
					.split(' ')
					.filter((c) => {
						const regExp = new RegExp(/^wptb-element-(.+)-(\d+)$/, 'g');
						return regExp.test(c);
					})[0];

				if (activeElementIdArray) {
					return activeElementIdArray.replace('wptb-element-', '');
				}
			}
			return null;
		},
		...mapMutations(['setColumnBindingForElement']),
	},
};
</script>
