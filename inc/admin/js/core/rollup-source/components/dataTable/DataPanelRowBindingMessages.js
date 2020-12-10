import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import DataPanelBindingMessageBase from './DataPanelBindingMessageBase';

export default {
	props: {
		columnNames: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	mixins: [DataPanelBindingMessageBase, withNativeTranslationStore],
	computed: {
		overrideBindingTranslation() {
			const modeRowBinding = this.rowBinding?.mode;

			let message = null;
			switch (modeRowBinding) {
				case 'auto': {
					message = this.translationM('autoModeMessage');
					break;
				}
				case 'operator': {
					message = this.operatorMessage;
					break;
				}
				default: {
					message = '';
					break;
				}
			}

			return message;
		},
		operatorMessage() {
			const { compareColumn, operatorType, rowAmount, rowCustomAmount } = this.rowBinding.operator;

			const amountPart = `${
				rowAmount === 'all'
					? `${this.emphasize('all')} rows`
					: `${this.emphasize(rowCustomAmount)} row${rowCustomAmount > 1 ? 's' : ''}`
			}`;

			const selectPart = `Select ${amountPart}`;

			const operatorPart = `where ${this.emphasize(this.columnNames[compareColumn])} is ${this.emphasize(
				operatorType
			)}`;

			return `${selectPart} ${operatorPart} ${this.logicPart(this.rowBinding.operator)}.`;
		},
	},
	methods: {
		logicPart({ operatorType, operatorType2, thanAmount, equalAmount }) {
			switch (operatorType) {
				case 'not': {
					return this.emphasize(operatorType2);
				}
				case 'higher': {
					return `than ${this.emphasize(thanAmount)}`;
				}
				case 'lower': {
					return `than ${this.emphasize(thanAmount)}`;
				}
				case 'equal': {
					return `to ${this.emphasize(equalAmount)}`;
				}
				default: {
					return '';
				}
			}
		},
	},
};
