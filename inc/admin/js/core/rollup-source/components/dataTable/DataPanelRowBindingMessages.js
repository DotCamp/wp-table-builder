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
					message = null;
					break;
				}
			}

			return message;
		},
		operatorMessage() {
			const { compareColumn, operatorType, operatorType2, rowAmount, rowCustomAmount } = this.rowBinding.operator;

			const amountPart = `${
				rowAmount === 'all'
					? `${this.emphasize('all')} rows`
					: `${this.emphasize(rowCustomAmount)} row${rowCustomAmount > 1 ? 's' : ''}`
			}`;

			const selectPart = `Select ${amountPart}`;

			const operatorPart = `where ${this.emphasize(this.columnNames[compareColumn])} is ${this.emphasize(
				operatorType
			)}${operatorType === 'not' ? ` ${this.emphasize(operatorType2)}` : ''}`;

			return `${selectPart} ${operatorPart}.`;
		},
	},
};
