<template>
	<transition name="wptb-fade">
		<div v-show="groupVisibility">
			<panel-control-group :title="`${translationM('icon')} #${iconCount}`"></panel-control-group>
		</div>
	</transition>
</template>

<script>
import ExtraDataOptionsBase from './ExtraDataOptionsBase';
import PanelControlGroup from '../leftPanel/PanelControlGroup';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';

export default {
	components: { PanelControlGroup },
	mixins: [ExtraDataOptionsBase, withNativeTranslationStore],
	data() {
		return {
			iconCount: 1,
			innerIconOptions: [
				{
					bindValue: '',
					icon: '',
					color: '#000',
				},
			],
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.mergeIconBindings(this.innerIconOptions);
		});
	},
	watch: {
		columnBindings: {
			handler(n) {
				this.mergeIconBindings(n);
			},
			deep: true,
		},
		innerIconOptions: {
			handler(n) {
				this.$emit('valueChanged', { ...this.columnBindings, ...{ iconBindings: n } });
			},
		},
	},
	computed: {
		groupVisibility() {
			return this.getColumnBinding('valueColumn') !== 'none';
		},
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
