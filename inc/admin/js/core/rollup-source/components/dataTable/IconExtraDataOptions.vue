<template>
	<transition name="wptb-fade">
		<div v-show="groupVisibility">
			<panel-control-group
				:key="generateId"
				v-for="(option, index) in innerIconOptions"
				:title="`${translationM('icon')} #${index + 1}`"
			>
				<panel-input-control
					class="wptb-data-panel-string-input"
					:label="translationM('matchValue') | cap"
					v-model="innerIconOptions[index].bindValue"
					input-type="text"
					:string-placeholder="translationM('value')"
				></panel-input-control>
				<color-picker v-model="innerIconOptions[index].color" :label="translationM('color')"></color-picker>
				<panel-icon-select
					:label="translationM('icon') | cap"
					:icons="iconList"
					v-model="innerIconOptions[index].icon"
				></panel-icon-select>
			</panel-control-group>
		</div>
	</transition>
</template>

<script>
import { mapState } from 'vuex';
import { generateUniqueId } from '../../functions';
import ExtraDataOptionsBase from './ExtraDataOptionsBase';
import PanelControlGroup from '../leftPanel/PanelControlGroup';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import PanelInputControl from '../PanelInputControl';
import PanelIconSelect from '../leftPanel/PanelIconSelect';
import ColorPicker from '../ColorPicker';

export default {
	components: { PanelIconSelect, PanelInputControl, PanelControlGroup, ColorPicker },
	mixins: [ExtraDataOptionsBase, withNativeTranslationStore],
	data() {
		return {
			innerIconOptions: [
				{
					bindValue: '',
					// TODO [erdembircan] redesign icon object
					icon: {
						name: null,
						url: null,
					},
					color: '#000000',
				},
			],
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.mergeIconBindings(this.columnBindings);
		});
	},
	watch: {
		innerIconOptions: {
			handler(n) {
				const newArray = n.map((binding) => {
					return { ...binding, icon: { ...binding.icon } };
				});

				this.$emit('valueChanged', { type: 'iconBindings', value: newArray });
			},
			deep: true,
		},
	},
	computed: {
		groupVisibility() {
			return this.getColumnBinding('valueColumn') !== 'none';
		},
		generateId() {
			return generateUniqueId();
		},
		...mapState(['iconList']),
	},
	methods: {
		mergeIconBindings(source) {
			if (source.iconBindings && Array.isArray(source.iconBindings)) {
				this.innerIconOptions = source.iconBindings;
			}
		},
	},
};
</script>
