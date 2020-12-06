import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import DataPanelBindingMessageBase from './DataPanelBindingMessageBase';

export default {
	mixins: [DataPanelBindingMessageBase, withNativeTranslationStore],
	computed: {
		overrideBindingTranslation() {
			if (this.elementBinding) {
				const elementBindingLength = Object.keys(this.elementBinding).filter((key) => {
					return Object.prototype.hasOwnProperty.call(this.elementBinding, key);
				}).length;

				// show element not supported message if supplied element binding is an empty object
				if (elementBindingLength === 0) {
					return this.translationM('elementNotSupported');
				}
			}

			if (this.rowBinding?.mode === 'auto') {
				return this.translationM('autoModeActiveMessage');
			}

			return this.translationM('elementColumnBasicBindingMessage');
		},
	},
};
