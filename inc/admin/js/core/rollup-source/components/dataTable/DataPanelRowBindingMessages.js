import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import DataPanelBindingMessageBase from './DataPanelBindingMessageBase';

export default {
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
					message = 'operator message';
					break;
				}
				default: {
					message = null;
					break;
				}
			}

			return message;
		},
	},
};
