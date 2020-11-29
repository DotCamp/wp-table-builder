import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import DataPanelBindingMessageBase from './DataPanelBindingMessageBase';

export default {
	mixins: [DataPanelBindingMessageBase, withNativeTranslationStore],
	computed: {
		overrideBindingTranslation() {
			if (this.rowBinding?.mode === 'auto') {
				return this.translationM('autoModeActiveMessage');
			}

			return this.translationM('elementColumnBasicBindingMessage');
		},
	},
};
