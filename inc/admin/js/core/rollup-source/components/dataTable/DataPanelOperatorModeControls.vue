<template>
	<transition name="wptb-fade">
		<div class="wptb-data-panel-mode-operator-controls">
			<panel-dropdown-control
				:label="translationM('rowAmount') | cap"
				:options="options.rowAmount"
				v-model="operatorControls.rowAmount"
				:class="{ 'wptb-left-panel-no-bottom-border': operatorControls.rowAmount === 'custom' }"
				:disabled="disabledState('rowAmount')"
			></panel-dropdown-control>
			<transition name="wptb-fade">
				<panel-input-control
					v-show="operatorControls.rowAmount === 'custom'"
					:label="translationM('rows') | cap"
					v-model="operatorControls.rowCustomAmount"
					:disabled="disabledState('rowAmount')"
				>
				</panel-input-control>
			</transition>
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
		</div>
	</transition>
</template>

<script>
import PanelDropdownControl from '../PanelDropdownControl';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import PanelInputControl from '../PanelInputControl';

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
	components: { PanelInputControl, PanelDropdownControl },
	data() {
		return {
			operatorControls: {
				rowAmount: 'all',
				rowCustomAmount: 1,
				compareColumn: null,
				operatorType: 'highest',
			},
			options: {
				rowAmount: {
					all: this.translationM('all'),
					custom: this.translationM('custom'),
				},
				operatorTypes: {
					highest: this.translationM('highest'),
					lowest: this.translationM('lowest'),
				},
			},
		};
	},
	mounted() {
		this.$nextTick(() => {
			const rowBindingsLength = Object.keys(this.rowBindings).filter((k) => {
				return Object.prototype.hasOwnProperty.call(this.rowBindings, k);
			}).length;

			if (rowBindingsLength !== 0) {
				this.operatorControls = { ...this.operatorControls, ...this.rowBindings };

				if (!this.operatorControls.compareColumn) {
					const firstColumn = Object.keys(this.columnNamesWithoutNone).filter((k) => {
						return Object.prototype.hasOwnProperty.call(this.columnNamesWithoutNone, k);
					})[0];

					this.operatorControls.compareColumn = firstColumn;
				}
			}

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
	},
	methods: {
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
