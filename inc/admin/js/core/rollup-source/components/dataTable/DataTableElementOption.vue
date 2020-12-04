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
						:value="getColumnBinding(optionType)"
						@valueChanged="setColumnBinding(optionType)($event)"
						:label="translationM(optionType) | cap"
						:options="getColumnNames"
						:key="optionType"
						:disabled="isColumnBindingDisabled"
					>
					</panel-dropdown-control>
					<data-panel-element-binding-messages
						:row-binding="getRowBinding()"
						:element-binding="getColumnBinding()"
					></data-panel-element-binding-messages>
				</panel-section-group-tabbed-item>
				<panel-section-group-tabbed-item :active-id="currentTab" id="row">
					<panel-dropdown-control
						:label="translationM('mode') | cap"
						:options="rowModes"
						:value="getRowBinding('mode')"
						@valueChanged="setRowBinding('mode')($event)"
					></panel-dropdown-control>
					<data-panel-operator-mode-controls
						v-show="getRowBinding('mode') === 'operator'"
						:column-names="getColumnNames"
						:row-bindings="getRowBinding('operator')"
						@valueChanged="setRowBinding('operator')($event)"
					></data-panel-operator-mode-controls>
					<data-panel-sort-controls
						:column-names="getColumnNames"
						:row-bindings="getRowBinding('sort')"
						@valueChanged="setRowBinding('sort')($event)"
					></data-panel-sort-controls>
					<data-panel-row-binding-messages
						:row-binding="getRowBinding()"
						:element-binding="getColumnBinding()"
					></data-panel-row-binding-messages>
				</panel-section-group-tabbed-item>
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
import { parseTableElementId, parseElementType, getParentOfType, generateUniqueId } from '../../functions';
import { typeOptionList } from './elementOptionTypeList';
import DataPanelElementBindingMessages from './DataPanelElementBindingMessages';
import DataPanelRowBindingMessages from './DataPanelRowBindingMessages';
import DataPanelOperatorModeControls from './DataPanelOperatorModeControls';
import DataPanelSortControls from './DataPanelSortControls';

export default {
	mixins: [withNativeTranslationStore],
	components: {
		DataPanelSortControls,
		DataPanelOperatorModeControls,
		DataPanelRowBindingMessages,
		DataPanelElementBindingMessages,
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
			rowModes: {
				none: `-- ${this.translationM('none')} --`,
				auto: this.translationM('auto'),
				operator: this.translationM('operator'),
			},
		};
	},
	mounted() {
		document.addEventListener('element:controls:active:global', ({ detail: element }) => {
			if (element.getAttribute('class').includes('wptb-ph-element')) {
				this.currentElement = element;

				const currentRowBinding = this.getRowBinding('mode');

				// show row tab if selected element's row binding is auto
				this.currentActiveTab = currentRowBinding === 'auto' ? 'row' : 'element';

				// TODO [erdembircan] remove for production
				this.currentActiveTab = 'row';

				this.currentElementType = parseElementType(this.currentElement);
			}
		});
	},
	computed: {
		elementBindingTranslation() {
			if (this.isColumnBindingDisabled) {
				return this.translationM('autoModeActiveMessage');
			}
			return '';
		},
		isColumnBindingDisabled() {
			return this.getRowBinding('mode') === 'auto';
		},
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
				return 'none';
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
				{ none: `-- ${this.translationM('none')} --` }
			);
		},
		...mapGetters([
			'translation',
			'parsedData',
			'formCellId',
			'getColumnBindingForElement',
			'getRowBindingByRowId',
		]),
	},
	methods: {
		getRowId() {
			if (this.currentElement) {
				const row = getParentOfType(this.currentElement, 'tr');
				if (row) {
					let rowId = row.dataset.dataTableRowId;
					if (!rowId) {
						// generate a new id for the table row if none is present
						rowId = generateUniqueId();
						row.dataset.dataTableRowId = rowId;
					}
					return rowId;
				}
			}
			return null;
		},
		getRowBinding(optionType = null) {
			if (this.currentElement) {
				const rowId = this.getRowId();

				// if no optionType argument is supplied, return binding object instead
				if (rowId) {
					const bindingObject = this.getRowBindingByRowId(rowId);
					if (!optionType) {
						return bindingObject;
					}

					// use auto for mode and an empty object for other binding types as default
					let bindingValue = optionType === 'mode' ? 'auto' : {};
					if (bindingObject && bindingObject[optionType]) {
						bindingValue = bindingObject[optionType];
					}

					return bindingValue;
				}
			}
			return null;
		},
		setRowBinding(subIndex) {
			const vm = this;

			return function handleBindingUpdate(value) {
				if (vm.currentElement) {
					const rowId = vm.getRowId();

					if (rowId) {
						vm.setRowBindingForId({ id: rowId, value, subIndex });
					}
				}
			};
		},
		getColumnBinding(optionType = null) {
			if (this.currentElement) {
				const elementId = parseTableElementId(this.currentElement);
				const bindingObject = this.getColumnBindingForElement(elementId);

				// if no optionType argument is supplied, return binding object instead
				if (!optionType) {
					return bindingObject;
				}

				let bindingValue = 'none';
				if (bindingObject && bindingObject[optionType]) {
					bindingValue = bindingObject[optionType];
				}
				return bindingValue;
			}
			return null;
		},
		setColumnBinding(subIndex) {
			const vm = this;

			return function handleValueUpdate(value) {
				if (vm.currentElement) {
					const elementId = parseTableElementId(vm.currentElement);
					vm.setColumnBindingForElement({ id: elementId, value, subIndex });
				}
			};
		},
		...mapMutations(['setColumnBindingForElement', 'setRowBindingForId']),
	},
};
</script>
