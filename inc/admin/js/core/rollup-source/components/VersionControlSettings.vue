<template>
	<fragment>
		<menu-content :center="true">
			<div class="wptb-settings-version-control">
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
							<select v-model="selectedVersion">
								<option
									v-for="k in sortedVersions"
									:key="k"
									:selected="isVersionSelected(k)"
									:disabled="k === currentVersion"
									>{{ k }}
								</option>
							</select>
						</version-control-row>
					</div>
					<div class="wptb-version-control-main-row">
						<div class="wptb-version-control-warning-span">{{ strings.warning }}:</div>
						<div class="wptb-version-control-warning-info">{{ strings.warningInfo }}</div>
					</div>
				</div>
				<changelog :version="selectedVersion" :raw-changelog="getVersionControlData().changelog"></changelog>
			</div>
		</menu-content>
		<portal to="footerButtons">
			<div class="wptb-settings-button-container">
				<menu-button :disabled="isVersionSelected(currentVersion)" type="primary" @click="installVersion"
					>{{ `${strings.installVersion} ${selectedVersion}` }}
				</menu-button>
			</div>
		</portal>
	</fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import MenuContent from './MenuContent';
import MenuButton from './MenuButton';
import VersionControlRow from './VersionControlRow';
import VersionIndicator from './VersionIndicator';
import Changelog from './Changelog';

export default {
	props: {
		templateData: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	components: { VersionControlRow, MenuContent, Fragment, MenuButton, VersionIndicator, Changelog },
	data() {
		return {
			selectedVersion: '1.0.0',
			currentVersion: '1.0.0',
			latestVersion: '1.0.0',
			allVersions: {},
		};
	},
	mounted() {
		this.selectedVersion = this.getVersionControlData().currentVersion;
		this.currentVersion = this.getVersionControlData().currentVersion;
		this.latestVersion = this.getVersionControlData().latestVersion;
		this.allVersions = this.getVersionControlData().allVersions;
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
		getVersionControlData() {
			return this.templateData.versionControl;
		},
		updateToLatest() {
			this.selectedVersion = this.latestVersion;
		},
		installVersion() {
			if (!this.isVersionSelected(this.currentVersion)) {
				const formData = new FormData();

				const { action, nonce, ajaxUrl } = this.getVersionControlData().security;

				formData.append('action', action);
				formData.append('nonce', nonce);
				formData.append('version', this.selectedVersion);

				fetch(ajaxUrl, {
					method: 'POST',
					body: formData,
				})
					.then((r) => {
						if (r.ok) {
							return r.json();
						}
						throw new Error('an error occured, try again later');
					})
					.then((resp) => {
						if (resp.error) {
							throw new Error(resp.error);
						} else {
							// TODO [erdembircan] remove for production
							console.log(resp);
						}
					})
					.catch((err) => {
						// TODO [erdembircan] remove for production
						console.error(err);
					});
			}
		},
	},
};
</script>
