import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import DataPanelBindingMessageBase from './DataPanelBindingMessageBase';

export default {
	mixins: [DataPanelBindingMessageBase, withNativeTranslationStore],
	computed: {
		overrideBindingTranslation() {
			const modeRowBinding = this.rowBinding?.mode;

			if (modeRowBinding === 'auto') {
				return this.translationM('autoModeMessage');
			}

			return null;
		},
	},
};
