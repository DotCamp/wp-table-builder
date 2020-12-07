<template>
	<transition name="wptb-fade">
		<div class="wptb-data-panel-mode-operator-controls">
			<panel-control-group :title="translationM('selectGroupControls')" :icon="getIcon('handPointer')">
				<panel-dropdown-control
					:label="translationM('type') | cap"
					:options="options.rowAmount"
					v-model="operatorControls.rowAmount"
					:disabled="disabledState('rowAmount')"
				></panel-dropdown-control>
				<transition name="wptb-fade">
					<panel-input-control
						v-if="operatorControls.rowAmount === 'custom'"
						:label="translationM('amount') | cap"
						v-model="operatorControls.rowCustomAmount"
						:disabled="disabledState('rowAmount')"
					>
					</panel-input-control>
				</transition>
			</panel-control-group>
			<panel-control-group :icon="getIcon('cog')" :title="translationM('logicControls')">
				<panel-dropdown-control
					:label="translationM('compareColumn') | cap"
					:options="columnNamesWithoutNone"
					v-model="operatorControls.compareColumn"
				></panel-dropdown-control>
				<panel-dropdown-control
					:label="translationM('operator') | cap"
					:options="options.operatorTypes"
					v-model="operatorControls.operatorType"
				></panel-dropdown-control>
				<transition name="wptb-fade">
					<panel-input-control
						v-if="getOperatorControl('operatorType') === 'equal'"
						:label="`${translationM('amount')}` | cap"
						v-model="operatorControls.equalAmount"
						inputType="text"
					></panel-input-control>
				</transition>
				<transition name="wptb-fade">
					<panel-input-control
						v-if="
							getOperatorControl('operatorType') === 'higher' ||
							getOperatorControl('operatorType') === 'lower'
						"
						:label="`${translationM('amount')}` | cap"
						v-model="operatorControls.thanAmount"
					></panel-input-control>
				</transition>
				<transition name="wptb-fade">
					<panel-dropdown-control
						v-if="getOperatorControl('operatorType') === 'not'"
						:label="`${translationM('operator')} 2` | cap"
						:options="options.operator2Types"
						v-model="operatorControls.operatorType2"
					></panel-dropdown-control>
				</transition>
			</panel-control-group>
		</div>
	</transition>
</template>

<script>
import { mapGetters } from 'vuex';
import PanelDropdownControl from '../PanelDropdownControl';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import PanelInputControl from '../PanelInputControl';
import { objectDeepMerge } from '../../stores/general';
import PanelControlGroup from '../leftPanel/PanelControlGroup';
import { isObjectValuesSame } from '../../functions';

export default {
	props: {
		rowBindings: {
			type: Object,
			default: () => {
				return {};
			},
		},
		columnNames: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	mixins: [withNativeTranslationStore],
	components: { PanelControlGroup, PanelInputControl, PanelDropdownControl },
	data() {
		return {
			operatorControls: {
				rowAmount: 'all',
				rowCustomAmount: 1,
				compareColumn: null,
				operatorType: 'highest',
				operatorType2: 'highest',
				thanAmount: 1,
				equalAmount: 1,
			},
			options: {
				rowAmount: {
					all: this.translationM('all'),
					custom: this.translationM('custom'),
				},
				operatorTypes: {
					highest: this.translationM('highest'),
					lowest: this.translationM('lowest'),
					higher: this.translationM('higher'),
					lower: this.translationM('lower'),
					equal: this.translationM('equal'),
					not: this.translationM('not'),
				},
				operator2Types: {
					highest: this.translationM('highest'),
					lowest: this.translationM('lowest'),
				},
			},
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.prepareRowBindings(this.rowBindings);
			this.controlRelations();
		});
	},
	watch: {
		operatorControls: {
			handler() {
				this.controlRelations();

				this.$emit('valueChanged', this.operatorControls);
			},
			deep: true,
		},
		rowBindings: {
			handler(n) {
				if (!isObjectValuesSame(n, this.operatorControls)) {
					this.prepareRowBindings(n);
				}
			},
			deep: true,
		},
	},
	computed: {
		columnNamesWithoutNone() {
			const { none, ...rest } = this.columnNames;

			return rest;
		},
		disabledState() {
			const vm = this;
			const stateList = {
				rowAmount: () => {
					return ['highest', 'lowest'].includes(vm.getOperatorControl('operatorType'));
				},
			};

			return function calculateState(controlId) {
				return stateList[controlId]();
			};
		},
		...mapGetters(['getIcon']),
	},
	methods: {
		prepareRowBindings(target) {
			this.operatorControls = { ...this.operatorControls, ...this.rowBindings };
			this.operatorControls = objectDeepMerge(this.operatorControls, target);

			if (!this.operatorControls.compareColumn) {
				[this.operatorControls.compareColumn] = Object.keys(this.columnNamesWithoutNone).filter((k) => {
					return Object.prototype.hasOwnProperty.call(this.columnNamesWithoutNone, k);
				});
			}
		},
		controlRelations() {
			if (['highest', 'lowest'].includes(this.operatorControls.operatorType)) {
				this.setOperatorControl('rowAmount', 'custom');
				this.setOperatorControl('rowCustomAmount', 1);
			}
		},
		setOperatorControl(key, value) {
			this.operatorControls[key] = value;
		},
		getOperatorControl(key) {
			return this.operatorControls[key];
		},
	},
};
</script>
