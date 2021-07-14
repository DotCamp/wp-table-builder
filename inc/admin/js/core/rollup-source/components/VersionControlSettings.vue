<template>
	<fragment>
		<menu-content :center="true">
			<div v-if="!showForm" class="wptb-settings-version-control">
				<div class="wptb-version-control-main">
					<div class="wptb-version-control-main-row">{{ strings.versionControlInfo }}</div>
					<div class="wptb-version-control-controls">
						<version-control-row :label="strings.yourVersion">
							<version-indicator
								:latest-version="latestVersion"
								:version="currentVersion"
							></version-indicator>
						</version-control-row>
						<version-control-row :label="strings.latestVersion">
							<version-indicator
								:latest-version="latestVersion"
								:version="latestVersion"
							></version-indicator>
							<a
								v-if="showUpdateToLatest"
								@click.prevent="updateToLatest"
								href="#"
								class="wptb-version-control-anchor"
								>{{ strings.updateToLatest }}</a
							>
						</version-control-row>
						<version-control-row :label="strings.installVersion">
							<select v-model="selectedVersion" :disabled="isBusy()">
								<option
									v-for="k in sortedVersions"
									:key="k"
									:selected="isVersionSelected(k)"
									:disabled="k === currentVersion"
								>
									{{ k }}
								</option>
							</select>
						</version-control-row>
					</div>
					<disclaimer :title="strings.warning" :message="strings.warningInfo"></disclaimer>
				</div>
				<changelog :version="selectedVersion" :raw-changelog="sectionData.changelog"></changelog>
			</div>
			<div v-else v-html="form"></div>
		</menu-content>
		<footer-buttons>
			<menu-button
				v-if="!installResult"
				:disabled="isVersionSelected(currentVersion) || isBusy()"
				type="primary"
				@click="installVersion"
				>{{ `${strings.installVersion} ${selectedVersion}` }}
			</menu-button>
			<menu-button v-if="installResult" type="primary" @click="reloadPage">{{ strings.reload }}</menu-button>
		</footer-buttons>
	</fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import MenuContent from './MenuContent';
import MenuButton from './MenuButton';
import VersionControlRow from './VersionControlRow';
import VersionIndicator from './VersionIndicator';
import Changelog from './Changelog';
import withMessage from '../mixins/withMessage';
import FooterButtons from './Settings/FooterButtons';
import SettingsMenuSection from '../mixins/SettingsMenuSection';
import Disclaimer from '$Settings/Disclaimer';

export default {
	components: {
		Disclaimer,
		FooterButtons,
		VersionControlRow,
		MenuContent,
		Fragment,
		MenuButton,
		VersionIndicator,
		Changelog,
	},
	mixins: [withMessage, SettingsMenuSection],
	data() {
		return {
			selectedVersion: '1.0.0',
			currentVersion: '1.0.0',
			latestVersion: '1.0.0',
			allVersions: {},
			installResult: false,
			showForm: false,
			form: '<p>form</p>',
		};
	},
	mounted() {
		const { currentVersion } = this.sectionData;
		this.currentVersion = currentVersion;
		this.latestVersion = this.sectionData.latestVersion;
		this.allVersions = this.sectionData.allVersions;
		this.selectedVersion = this.allVersions[currentVersion] !== undefined ? currentVersion : this.latestVersion;
	},
	computed: {
		showUpdateToLatest() {
			return this.currentVersion !== this.latestVersion;
		},
		sortedVersions() {
			return Object.keys(this.allVersions).sort((a, b) => {
				if (a > b) {
					return -1;
				}
				if (a < b) {
					return 1;
				}

				return 0;
			});
		},
	},
	methods: {
		isVersionSelected(v) {
			return this.selectedVersion === v;
		},
		updateToLatest() {
			this.selectedVersion = this.latestVersion;
			this.installVersion();
		},
		installVersion() {
			if (!this.isVersionSelected(this.currentVersion) && !this.isBusy()) {
				// eslint-disable-next-line no-alert
				if (window.confirm(this.strings.rollbackConfirmation)) {
					this.setBusy(true);
					const formData = new FormData();

					const { action, nonce, ajaxUrl } = this.sectionData.security;

					formData.append('action', action);
					formData.append('nonce', nonce);
					formData.append('version', this.selectedVersion);

					let formSent = false;

					fetch(ajaxUrl, {
						method: 'POST',
						body: formData,
					})
						.then((r) => {
							if (r.ok) {
								const contentType = r.headers.get('Content-Type');
								if (contentType.includes('text/plain-text')) {
									return r.text();
								}
								if (contentType.includes('text/html')) {
									formSent = true;
									return r.text();
								}
								return r.json();
							}
							throw new Error('an error occurred, try again later');
						})
						.then((resp) => {
							if (typeof resp === 'object') {
								if (resp.error) {
									throw new Error(resp.error);
								} else {
									this.setMessage({ message: resp.message });
									this.setInstallResult(true);
								}
							} else if (formSent) {
								this.showForm = true;
								this.form = resp;
							} else {
								throw new Error(resp);
							}
						})
						.catch((err) => {
							this.setMessage({ type: 'error', message: err });
							this.setInstallResult(false);
						})
						.finally(() => {
							this.setBusy(false);
						});
				}
			}
		},
		setInstallResult(result) {
			this.installResult = result;
		},
		reloadPage() {
			window.location.reload();
		},
	},
};
</script>
