<template>
	<fragment>
		<menu-content :center="true">
			<div class="wptb-lazy-load-wrapper">
				<div class="wptb-lazy-load-basic-options">
					<label>
						<input type="checkbox" v-model="settings.enabled" />
						{{ strings.enableLazyLoad }}
					</label>
				</div>
				<div class="wptb-lazy-load-pro-options wptb-flex wptb-flex-align-center wptb-flex-justify-center">
					<i>pro options</i>
				</div>
			</div>
		</menu-content>
		<footer-buttons>
			<menu-button :disabled="!settingsDirtyStatus" @click="updateLazyLoadSettings"
				>{{ strings.submit }}
			</menu-button>
		</footer-buttons>
	</fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import MenuContent from './MenuContent';
import SettingsMenuSection from '../mixins/SettingsMenuSection';
import FooterButtons from './Settings/FooterButtons';
import MenuButton from './MenuButton';

export default {
	components: { MenuButton, FooterButtons, MenuContent, Fragment },
	mixins: [SettingsMenuSection],
	mounted() {
		this.settings = this.sectionData.settings;
		this.initialSettings = { ...this.settings };
	},
	data() {
		return {
			settings: {},
			initialSettings: {},
		};
	},
	computed: {
		settingsDirtyStatus() {
			return JSON.stringify(this.settings) !== JSON.stringify(this.initialSettings);
		},
	},
	methods: {
		updateLazyLoadSettings() {
			if (this.settingsDirtyStatus) {
				const { action, nonce, ajaxUrl } = this.sectionData.security;

				const formData = new FormData();

				formData.append('settings', JSON.stringify(this.settings));
				formData.append('action', action);
				formData.append('nonce', nonce);

				fetch(ajaxUrl, {
					method: 'POST',
					body: formData,
				})
					// eslint-disable-next-line consistent-return
					.then((res) => {
						if (res.ok) {
							return res.json();
						}
					})
					.then((resp) => {
						// TODO [erdembircan] remove for production
						console.log(resp);
					});
			}
		},
	},
};
</script>
