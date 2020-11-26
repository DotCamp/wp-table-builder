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
					<!--column select controls-->
					<panel-dropdown-control
						v-for="optionType in elementDataOptions"
						:value="getOptionValue(optionType)"
						@valueChanged="setOptionValue(optionType)($event)"
						:label="translationM(optionType) | cap"
						:options="getColumnNames"
						:key="optionType"
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
import { parseTableElementId, parseElementType } from '../../functions';
import typeOptionList from './elementOptionTypeList';

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
			currentElementType: null,
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
				this.currentElementType = parseElementType(this.currentElement);
			}
		});
	},
	computed: {
		elementDataOptions() {
			let options = typeOptionList[this.currentElementType];
			if (options) {
				if (!Array.isArray(options)) {
					options = [options];
				}
				return options;
			}
			return [];
		},
		elementColumnBinding: {
			get() {
				if (this.currentElement) {
					const elementId = parseTableElementId(this.currentElement);
					const binding = this.getColumnBindingForElement(elementId);
					return binding || 'none';
				}
				return 'auto';
			},
			set(val) {
				if (this.currentElement) {
					const elementId = parseTableElementId(this.currentElement);
					this.setColumnBindingForElement({ id: elementId, value: val });
				}
			},
		},
		getColumnNames() {
			// @deprecated
			// const { rowId } = this.parsedData.header[0];
			return this.parsedData.header[0].values.reduce(
				(carry, item) => {
					// @deprecated
					// const cellId = this.formCellId(rowId, item.colId);

					// eslint-disable-next-line no-param-reassign
					carry[item.colId] = item.value;

					return carry;
				},
				{ none: this.translationM('none'), auto: this.translationM('auto') }
			);
		},
		...mapGetters(['translation', 'parsedData', 'formCellId', 'getColumnBindingForElement']),
	},
	methods: {
		getOptionValue(optionType) {
			if (this.currentElement) {
				const elementId = parseTableElementId(this.currentElement);
				const bindingObject = this.getColumnBindingForElement(elementId);

				let bindingValue = 'none';
				if (bindingObject && bindingObject[optionType]) {
					bindingValue = bindingObject[optionType];
				}
				return bindingValue;
			}
			return null;
		},
		setOptionValue(subIndex) {
			const vm = this;

			return function handleValueUpdate(value) {
				if (vm.currentElement) {
					const elementId = parseTableElementId(vm.currentElement);
					vm.setColumnBindingForElement({ id: elementId, value, subIndex });
				}
			};
		},
		...mapMutations(['setColumnBindingForElement']),
	},
};
</script>
