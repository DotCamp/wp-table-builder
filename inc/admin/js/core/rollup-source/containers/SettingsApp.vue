<template>
	<div class="wptb-settings-wrapper">
		<menu-header :logo-src="pluginInfo.logo" :logo-alt="strings.logoAlt" :plugin-name="pluginInfo.pluginName">
			<a :href="pluginInfo.pluginHomepage">{{ strings.homepage }}</a>
		</menu-header>
		<sections :items="sections" v-model="currentSection" :disabled="isBusy()"></sections>
		<component
			:is="currentTemplate"
			:current-fields="currentFields"
			:store="store"
			:disabled="!canSubmit"
			@resetStore="resetStore"
			@submitSettings="submitSettings"
			:template-data="sectionData"
		></component>
		<menu-footer>
			<portal-target name="footerButtons"></portal-target>
		</menu-footer>
	</div>
</template>
<script>
import withStore from '$Mixins/withStore';
import withMessage from '$Mixins/withMessage';
import MenuHeader from '$Components/MenuHeader.vue';
import Sections from '$Components/Sections.vue';
import MenuFooter from '$Components/MenuFooter.vue';
import MenuButton from '$Components/MenuButton.vue';
import GeneralSettings from '$Containers/GeneralSettings';
import VersionControlSettings from '$Components/VersionControlSettings';
import GeneralStylesSettings from '$Components/Settings/GeneralStylesSettings';
import TableFixerSettings from '$Components/TableFixer/TableFixerSettings';
import LazyLoadSettings from '$LazyLoadSettings/LazyLoadSettings';

export default {
	props: ['sectionsData', 'settings', 'pluginInfo'],
	components: {
		MenuButton,
		MenuHeader,
		Sections,
		MenuFooter,
		GeneralSettings,
		VersionControlSettings,
		GeneralStylesSettings,
		LazyLoadSettings,
		TableFixerSettings,
	},
	mixins: [withStore, withMessage],
	data() {
		return {
			sections: {},
			currentSection: '',
			parsedFields: {},
			resetActive: false,
			canSubmit: false,
			fetching: false,
		};
	},
	watch: {
		store: {
			handler() {
				if (this.resetActive) {
					this.canSubmit = false;
					this.resetActive = false;
				} else {
					this.canSubmit = true;
				}
			},
			deep: true,
		},
		fetching(n) {
			this.setBusy(n);
		},
	},
	beforeMount() {
		// eslint-disable-next-line array-callback-return
		Object.keys(this.sectionsData).map((section) => {
			this.sections[section] = this.sectionsData[section];
			if (Object.prototype.hasOwnProperty.call(this.sectionsData, section)) {
				if (this.parsedFields[section] === undefined) {
					this.parsedFields[section] = [];
				}

				if (
					this.sectionsData[section].fields !== undefined &&
					typeof this.sectionsData[section].fields === 'object'
				) {
					// eslint-disable-next-line array-callback-return
					Object.keys(this.sectionsData[section].fields).map((field) => {
						if (Object.prototype.hasOwnProperty.call(this.sectionsData[section].fields, field)) {
							this.parsedFields[section].push({ ...this.sectionsData[section].fields[field], id: field });
						}
					});
				}
			}
		});

		// TODO [erdembircan] uncomment for production
		// eslint-disable-next-line array-callback-return,consistent-return
		[this.currentSection] = Object.keys(this.parsedFields).map((key) => {
			if (Object.prototype.hasOwnProperty.call(this.parsedFields, key)) {
				return key;
			}
		});
	},
	computed: {
		sectionData() {
			return this.settings[this.currentSection] || {};
		},
		currentFields() {
			return this.parsedFields[this.currentSection];
		},
		currentTemplate() {
			return `${this.currentSection[0].toUpperCase() + this.currentSection.slice(1)}Settings`;
		},
	},
	methods: {
		resetStore() {
			if (this.canSubmit) {
				this.revertStore();
				this.resetActive = true;
				this.setMessage({ message: this.strings.revertMessage });
			}
		},
		submitSettings() {
			if (!this.canSubmit) {
				return;
			}

			const formData = new FormData();

			// security prep for fetch request
			formData.append('nonce', this.settings.nonce);
			formData.append('action', this.settings.action);

			formData.append('options', JSON.stringify(this.store));

			this.canSubmit = false;
			this.fetching = true;

			// fetch request to update plugin options
			fetch(this.settings.ajaxUrl, {
				method: 'POST',
				body: formData,
			})
				// eslint-disable-next-line consistent-return
				.then((r) => {
					if (r.ok) {
						return r.json();
					}
					throw new Error(r.statusText);
				})
				.then((resp) => {
					if (resp.error) {
						throw new Error(resp.error);
					} else {
						this.setMessage({ message: resp.message });
					}
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.error(e);
					this.setMessage({ type: 'error', message: e });
				})
				.finally(() => {
					this.fetching = false;
				});
		},
	},
};
</script>
