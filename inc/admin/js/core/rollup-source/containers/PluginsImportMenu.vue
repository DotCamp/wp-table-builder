<!--Plugins Import Menu Container-->
<template>
	<div>
		<menu-button
			class="wptb-text-transform-cap"
			:disabled="!isPluginInstalled(value) || isBusy()"
			v-for="(value, key) in supportedPlugins"
			@click="handleImportFromPlugin(key)"
			:key="key"
			:title="isPluginInstalled(value) ? '' : getTranslation('plugin not installed')"
		>
			{{ importButtonText(value) }}
		</menu-button>

		<div id="wptb-importIframeSection" style="display: none;"></div>
		<transition name="wptb-fade" mode="out-in">
			<div v-if="showImportedTables" class="wptb-flex wptb-flex-align-center wptb-flex-col">
				<div class="wptb-import-tables-wrapper">
					<div class="wptb-import-tables-list" v-for="(value, key) in importedTables" :key="key">
						<div class="wptb-import-table-count-info">{{ importedTablesCountInfo(key) }}</div>
						<table class="wptb-import-table">
							<thead>
								<tr>
									<th>
										<input type="checkbox" @click="selectAllCheckbox(key)" />
									</th>
									<th class="wptb-text-transform-cap">
										{{ supportedPlugins[key] }}
									</th>
									<th class="wptb-text-transform-cap">
										wp table builder
									</th>
								</tr>
							</thead>
							<tbody>
								<fragment v-for="row in value" :key="row[0]">
									<tr>
										<td>
											<input type="checkbox" v-model="selectedReplaceRows" :value="row" />
										</td>
										<td>
											{{ row[0] }}
										</td>
										<td>
											{{ row[1] }}
										</td>
									</tr>
								</fragment>
							</tbody>
						</table>
					</div>
				</div>
				<menu-button
					class="wptb-text-transform-cap"
					:disabled="selectedReplaceRows.length === 0"
					size="small"
					@click="replaceShortcodes"
				>
					{{ getTranslation('replace short codes') }}
				</menu-button>
			</div>
		</transition>

		<div class="wptb-importPBarContainer" style="visibility: hidden;">
			<div class="wptb-importPBarProgress">
				<div class="wptb-nameProcessInBarProgress"></div>
				<div id="wptb-pBarPercent">
					<span>0%</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { Fragment } from 'vue-fragment';
import { _x, sprintf, _nx } from '@wordpress/i18n';
import MenuButton from '../components/MenuButton.vue';
import ImportOperations from '../functions/importOperations.js';
import withMessage from '../mixins/withMessage';

export default {
	props: ['options'],
	mixins: [withMessage],
	components: { MenuButton, Fragment },
	data() {
		return {
			supportedPlugins: {
				'table-press': 'TablePress',
			},
			importedTables: {},
			selectedReplaceRows: [],
		};
	},
	watch: {
		fetching(n) {
			this.$emit('fetching', n);
		},
	},
	mounted() {
		// general listener for successful operations
		document.addEventListener('table:imported:saved', ({ detail }) => {
			this.setMessage({
				type: 'ok',
				message: this.isDocumentEventPoorlyImplemented(detail) ? this.strings.operationSuccess : detail,
			});
			this.setBusy(false);
		});

		// general listener for errors
		document.addEventListener('table:imported:error', ({ detail }) => {
			this.setMessage({
				type: 'error',
				message: this.isDocumentEventPoorlyImplemented(detail) ? this.strings.errorOccured : detail,
			});
			this.setBusy(false);
		});

		// listener for import end
		document.addEventListener('table:imported:list', ({ detail }) => {
			this.setBusy(false);
			this.importedTables = detail;
		});

		// listener for shortcode replace
		document.addEventListener('table:shortcode:replace', ({ detail }) => {
			this.setMessage({
				type: 'ok',
				message: `${this.strings.replacedShortcodes}: ${detail === true ? 0 : detail}`,
			});
			this.setBusy(false);
		});
	},
	methods: {
		isDocumentEventPoorlyImplemented(val) {
			return typeof val === 'boolean';
		},
		handleImportFromPlugin(type) {
			const importOperations = ImportOperations({ ...this.options, type });

			this.setBusy();
			importOperations.importFromPlugin(type);
		},
		selectAllCheckbox(type) {
			if (this.selectedReplaceRows === this.importedTables[type]) {
				this.selectedReplaceRows = [];
			} else {
				this.selectedReplaceRows = this.importedTables[type];
			}
		},
		replaceShortcodes() {
			if (this.selectedReplaceRows.length === 0) {
				return;
			}

			const replaceArray = this.selectedReplaceRows.map((row) => {
				return { search: row[0], replace: row[1] };
			});

			const importOperation = ImportOperations(this.options);

			this.setBusy();
			importOperation.replaceShortcodesAjax(replaceArray, true);
		},
		importButtonText(plugin) {
			return sprintf(
				_x('import from %s', '%s is a format variable for a name of WordPress plugin', this.options.textDomain),
				plugin
			);
		},
		importedTablesCountInfo(key) {
			return sprintf(
				_nx('%u table imported', '%u tables imported', 'number of tables imported', this.options.textDomain),
				this.importedTables[key].length
			);
		},
		isPluginInstalled(name) {
			return this.options.installedSupportedPlugins.includes(name);
		},
	},
	computed: {
		showImportedTables() {
			const keys = Object.keys(this.importedTables).map((k) => {
				if (Object.prototype.hasOwnProperty.call(this.importedTables, k)) {
					return k;
				}
				return null;
			});
			return Array.isArray(keys) ? keys.length > 0 : false;
		},
	},
};
</script>
