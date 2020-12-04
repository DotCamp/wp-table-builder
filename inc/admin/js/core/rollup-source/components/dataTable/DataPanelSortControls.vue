<template>
	<panel-control-group title="Sort Controls">
		<panel-dropdown-control
			:label="translationM('target') | cap"
			:options="columnNames"
			v-model="sortOptions.sortTarget"
		>
		</panel-dropdown-control>
		<transition name="wptb-fade">
			<fragment v-if="sortOptions.sortTarget !== 'none'">
				<panel-dropdown-control
					:label="translationM('type') | cap"
					:options="sortType"
					v-model="sortOptions.sortType"
				>
				</panel-dropdown-control>
				<panel-dropdown-control
					:label="translationM('direction') | cap"
					:options="sortDirection"
					v-model="sortOptions.sortDirection"
				>
				</panel-dropdown-control>
			</fragment>
		</transition>
	</panel-control-group>
</template>

<script>
import PanelControlGroup from '../leftPanel/PanelControlGroup';
import PanelDropdownControl from '../PanelDropdownControl';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import { isObjectValuesSame } from '../../functions';

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
				sortType: '123',
				sortDirection: 'desc',
			},
			sortType: {
				abc: this.translationM('alphabetical'),
				123: this.translationM('numerical'),
			},
			sortDirection: {
				asc: this.translationM('ascending'),
				desc: this.translationM('descending'),
			},
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.prepareSortBindings();
		});
	},
	watch: {
		rowBindings: {
			handler(n) {
				if (!isObjectValuesSame(this.sortOptions, n)) {
					this.prepareSortBindings();
				}
			},
			deep: true,
		},
		sortOptions: {
			handler() {
				this.$emit('valueChanged', this.sortOptions);
			},
			deep: true,
		},
	},
	methods: {
		prepareSortBindings() {
			this.sortOptions = { ...this.sortOptions, ...this.rowBindings };
		},
	},
};
</script>
