<template>
	<panel-control-group>
		<panel-dropdown-control
			:label="translationM('sortTarget') | cap"
			:options="columnNames"
			v-model="sortOptions.sortTarget"
		>
		</panel-dropdown-control>
	</panel-control-group>
</template>

<script>
import PanelControlGroup from '../leftPanel/PanelControlGroup';
import PanelDropdownControl from '../PanelDropdownControl';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';

export default {
	props: {
		columnNames: {
			type: Object,
			default: () => {
				return {};
			},
		},
		rowBindings: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	components: { PanelDropdownControl, PanelControlGroup },
	mixins: [withNativeTranslationStore],
	data() {
		return {
			sortOptions: {
				sortTarget: 'none',
				sortType: 'abc',
				sortDirection: 'desc',
			},
		};
	},
};
</script>
