<template>
	<fragment>
		<menu-content :center="true">
			<div class="wptb-general-style-settings">
				<div>
					<div class="wptb-general-style-header">{{ strings.headerText }}</div>
<!--					<div class="wptb-general-style-header">{{ strings.subHeaderText }}</div>-->
				</div>
				<div class="wptb-general-css-code-input">
					<css-code-input :disabled="isBusy()" v-model="code">
						<template v-slot:disabled>
							<busy-rotate></busy-rotate>
						</template>
					</css-code-input>
				</div>
			</div>
		</menu-content>
		<footer-buttons>
			<menu-button :disabled="buttonDisabledState" type="danger" @click="resetCodeToCached"
				>{{ strings.revert }}
			</menu-button>
			<menu-button :disabled="buttonDisabledState" @click="sendSavedStyles">{{ strings.submit }}</menu-button>
		</footer-buttons>
	</fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import MenuContent from '../MenuContent';
import FooterButtons from './FooterButtons';
import MenuButton from '../MenuButton';
import CssCodeInput from '../CssCodeInput';
import SettingsMenuSection from '../../mixins/SettingsMenuSection';
import withMessage from '../../mixins/withMessage';
import BusyRotate from '../BusyRotate';

export default {
	mixins: [SettingsMenuSection, withMessage],
	components: { BusyRotate, CssCodeInput, MenuButton, FooterButtons, MenuContent, Fragment },
	data() {
		return {
			code: '',
			cachedCode: '',
		};
	},
	beforeMount() {
		this.code = this.sectionData.savedStyles;
		this.updateCachedCode();
	},
	computed: {
		isCodeChanged() {
			return this.code !== this.cachedCode;
		},
		buttonDisabledState() {
			return !this.isCodeChanged || this.isBusy();
		},
	},
	methods: {
		updateCachedCode() {
			this.cachedCode = this.code;
		},
		resetCodeToCached() {
			this.code = this.cachedCode;
		},
		sendSavedStyles() {
			// set application to busy state
			this.setBusy(true);

			// prepare form data that will be sent with REST request
			const { ajaxUrl, nonce, action } = this.sectionData.security;
			const formData = new FormData();
			formData.append('action', action);
			formData.append('nonce', nonce);
			formData.append('styles', this.code);

			fetch(ajaxUrl, { method: 'POST', body: formData })
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
					throw new Error(`An error occurred while saving CSS code: ${res.statusText}`);
				})
				.then((resp) => {
					if (resp.error) {
						throw new Error(`An error occurred while saving CSS code: ${resp.error}`);
					} else {
						this.setMessage({ message: resp.message });
						this.updateCachedCode();
					}
				})
				.catch((err) => {
					this.setMessage({
						type: 'error',
						message: err.message,
					});
				})
				.finally(() => {
					// get application out from busy state
					this.setBusy(false);
				});
		},
	},
};
</script>
