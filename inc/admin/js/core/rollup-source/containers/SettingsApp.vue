<template>
	<div class="wptb-settings-wrapper">
		<menu-header :logo-src="pluginInfo.logo" :logo-alt="strings.logoAlt" :plugin-name="pluginInfo.pluginName">
			<a :href="pluginInfo.pluginHomepage">{{ strings.homepage }}</a>
		</menu-header>
		<sections :items="sections" v-model="currentSection"> </sections>
		<menu-content>
			<setting-card v-for="field in currentFields" :key="field.id" :title="field.label">
				<control-item :field-data="field" :modelBind="store"></control-item>
			</setting-card>
		</menu-content>
		<menu-footer>
			<menu-button type="danger" :disabled="!canSubmit" @click="resetStore">{{ strings.revert }}</menu-button>
			<menu-button type="primary" :disabled="!canSubmit" @click="submitSettings">{{
				strings.submit
			}}</menu-button>
		</menu-footer>
	</div>
</template>
<script>
import withStore from '../mixins/withStore.js';
import withMessage from '../mixins/withMessage';
import MenuHeader from '../components/MenuHeader.vue';
import Sections from '../components/Sections.vue';
import MenuContent from '../components/MenuContent.vue';
import SettingCard from '../components/SettingCard.vue';
import ControlItem from '../components/ControlItem.vue';
import MenuFooter from '../components/MenuFooter.vue';
import MenuButton from '../components/MenuButton.vue';

export default {
	props: ['fieldsData', 'settings', 'pluginInfo'],
	components: {
		MenuButton,
		MenuHeader,
		Sections,
		MenuContent,
		SettingCard,
		ControlItem,
		MenuFooter,
	},
	mixins: [withStore, withMessage],
	data() {
		return {
			sections: [],
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
		Object.keys(this.fieldsData).map((key) => {
			if (Object.prototype.hasOwnProperty.call(this.fieldsData, key)) {
				const { section } = this.fieldsData[key];
				if (this.parsedFields[section] === undefined) {
					this.parsedFields[section] = [];
				}
				this.parsedFields[section].push({ ...this.fieldsData[key], id: key });
				this.sections.push(section);
			}

			return null;
		});

		// eslint-disable-next-line array-callback-return,consistent-return
		[this.currentSection] = Object.keys(this.parsedFields).map((key) => {
			if (Object.prototype.hasOwnProperty.call(this.parsedFields, key)) {
				return key;
			}
		});

		this.sections = Array.from(new Set(this.sections));
	},
	computed: {
		currentFields() {
			return this.parsedFields[this.currentSection];
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
