<template>
	<div class="wptb-menu-export-wrapper">
		<div class="wptb-menu-export-card">
			<div class="wptb-menu-export-control-title">{{ getTranslation('all tables') }}</div>
			<div
				class="wptb-export-list-table-search wptb-flex-justify-center wptb-flex-align-center wptb-plugin-width-full wptb-flex"
			>
				<search-input :placeholder="strings.search" v-model="allFilterSearchClause"></search-input>
			</div>
			<list-table
				:row-labels="['Title', 'Created', 'ID'].map(getTranslation)"
				:row-data="remainingTables"
				:model-bind="selectedTables"
				:sort-type="{ 1: 'date', 2: 'number' }"
				:search-clause="allFilterSearchClause"
			></list-table>
			<empty-cover v-show="!userTables.length > 0">
				{{ getTranslation('no tables found') }}
			</empty-cover>
		</div>
		<div class="wptb-menu-export-middle-section">
			<div class="arrow-holder">
				<img
					@click.prevent="selectAll"
					:src="pluginInfo.plainArrow"
					:title="getTranslation('select all')"
					:alt="getTranslation('arrow')"
				/>
			</div>
			<div>
				<control-item
					:field-data="exportTypeControlOptions"
					:model-bind="this"
					class="wptb-flex wptb-flex-align-center wptb-flex-justify-center"
				>
					<pop-up :message="exportTypeDescription">?</pop-up>
				</control-item>
			</div>
			<div class="arrow-holder flip">
				<img
					@click.prevent="deselectAll"
					:src="pluginInfo.plainArrow"
					:title="getTranslation('deselect all')"
					:alt="getTranslation('arrow')"
				/>
			</div>
		</div>
		<div class="wptb-menu-export-card">
			<div class="wptb-menu-export-control-title" style="text-align: end">
				{{ getTranslation('selected tables') }}
			</div>
			<list-table
				:row-labels="['Title', 'Created', 'ID'].map(getTranslation)"
				:row-data="parsedSelectedTables"
				:model-bind="selectedTables"
				:sort-type="{ 1: 'date' }"
			></list-table>
			<empty-cover v-show="isSelectedEmpty()">
				{{ getTranslation('no table selected') }}
			</empty-cover>
		</div>
		<portal to="footerButtons">
			<a ref="filesave" style="display: none" :download="filename">_filesave</a>
			<div class="wptb-settings-button-container">
				<menu-button @click="getUserTables" :disabled="isBusy()">{{ getTranslation('refresh') }}</menu-button>
				<menu-button @click="exportTables" :disabled="exportDisabled">{{ strings.exportSection }}</menu-button>
			</div>
		</portal>
	</div>
</template>
<script>
import MenuButton from '$Components/MenuButton';
import ControlItem from '$Components/ControlItem';
import EmptyCover from '$Components/EmptyCover';
import PopUp from '$Components/PopUp';
import ListTable from '$Components/ListTable';
import withMessage from '$Mixins/withMessage';
import SearchInput from '$Components/SearchInput';

export default {
	props: ['options', 'pluginInfo'],
	mixins: [withMessage],
	components: { SearchInput, ListTable, PopUp, MenuButton, ControlItem, EmptyCover },
	data() {
		return {
			userTables: [],
			selectedTables: {},
			allFilterSearchClause: '',
			exportType: 'CSV',
			exportTypeControlOptions: {
				id: 'exportType',
				type: 'dropdown',
				label: 'export type',
				options: [
					{ label: 'csv', value: 'CSV' },
					{ label: 'xml', value: 'XML' },
				],
			},
			filename: '',
		};
	},
	mounted() {
		this.getUserTables();
	},
	computed: {
		exportTypeDescription() {
			const descriptions = {
				csvDescription: `<b>CSV:</b> ${this.getTranslation(
					'only text content of your tables will be exported, ideal for usage within other apps/plugins.'
				)}`,
				xmlDescription: `<b>XML:</b> ${this.getTranslation(
					'an exact copy of your tables will be exported, ideal for backing up and sharing your tables with your other WordPress sites that uses WP Table Builder.'
				)}`,
			};

			return this.getTranslation(descriptions[`${this.exportType.toLowerCase()}Description`]);
		},
		remainingTables() {
			return this.userTables.filter((t) => {
				return !this.selectedTables[t.ID];
			});
		},
		parsedSelectedTables() {
			return this.userTables.filter((t) => {
				return this.selectedTables[t.ID];
			});
		},
		exportDisabled() {
			return this.isBusy() || this.isSelectedEmpty();
		},
	},
	methods: {
		selectAll() {
			const allSelectedObject = {};
			// eslint-disable-next-line array-callback-return
			this.userTables.map((t) => {
				allSelectedObject[t.ID] = true;
			});

			this.selectedTables = { ...this.selectedTables, ...allSelectedObject };
		},
		deselectAll() {
			this.selectedTables = {};
		},
		isSelectedEmpty() {
			return (
				!Object.keys(this.selectedTables).filter((t) => {
					if (Object.prototype.hasOwnProperty.call(this.selectedTables, t)) {
						return this.selectedTables[t];
					}
					return false;
				}).length > 0
			);
		},
		getSelectedIds() {
			const tempArray = [];

			// eslint-disable-next-line array-callback-return
			Object.keys(this.selectedTables).map((t) => {
				if (Object.prototype.hasOwnProperty.call(this.selectedTables, t)) {
					if (this.selectedTables[t]) {
						tempArray.push(t);
					}
				}
			});

			return tempArray;
		},
		fieldLabel(field) {
			return field.post_title === '' ? `Table #${field.ID}` : field.post_title;
		},
		getUserTables() {
			const { ajaxUrl, fetchNonce, fetchAjaxAction } = this.options;

			const formData = new FormData();

			formData.append('nonce', fetchNonce);
			formData.append('action', fetchAjaxAction);

			this.setBusy();

			fetch(ajaxUrl, {
				method: 'POST',
				body: formData,
			})
				.then((r) => {
					if (r.ok) {
						return r.json();
					}
					throw new Error(this.getTranslation('an error occurred, try again later'));
				})
				.then((resp) => {
					if (resp.error) {
						throw new Error(resp.error);
					}
					const parsedTables = [];

					// eslint-disable-next-line array-callback-return
					this.userTables = resp.data.userTables.map((t) => {
						const localDate = new Intl.DateTimeFormat('default', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						}).format(new Date(t.post_date));
						const tempObj = {
							ID: t.ID,
							fieldDatas: [this.fieldLabel(t), localDate, t.ID],
						};
						parsedTables.push(tempObj);
					});

					this.userTables = parsedTables;
				})
				.catch((e) => {
					this.setMessage({ type: 'error', message: e });
				})
				.finally(() => {
					this.setBusy(false);
				});
		},
		/**
		 * Parse content-disposition header to extract filename property
		 *
		 * @param {string} headerString content-disposition header
		 * @return {string} extracted filename
		 *
		 * @throws Error an error will be thrown on no match
		 */
		parseFilename(headerString) {
			const regex = new RegExp(/filename="(.+\..+)"/, 'g');
			const results = regex.exec(headerString);
			if (results === null) {
				throw new Error(this.getTranslation('invalid file name header'));
			}
			return results[1];
		},
		/**
		 * Main logic for exporting table/s
		 */
		exportTables() {
			const { ajaxUrl, exportAjaxAction, exportNonce } = this.options;

			const formData = new FormData();
			formData.append('nonce', exportNonce);
			formData.append('action', exportAjaxAction);
			formData.append('ids', JSON.stringify(this.getSelectedIds()));
			formData.append('export_type', this.exportType);

			this.setBusy();

			fetch(ajaxUrl, {
				method: 'POST',
				body: formData,
			})
				.then((r) => {
					if (r.ok) {
						const contentType = r.headers.get('content-type');

						if (contentType === 'application/octet-stream') {
							this.filename = this.parseFilename(r.headers.get('content-disposition'));
							return r.blob();
						}
						return r.json();
					}
					throw new Error(this.getTranslation('an error occurred, try again later'));
				})
				.then((resp) => {
					if (resp.error) {
						throw new Error(resp.error);
					}

					const objectData = window.URL.createObjectURL(resp);

					this.$refs.filesave.href = objectData;
					this.$refs.filesave.click();

					window.URL.revokeObjectURL(objectData);
					this.resetSelections();
				})
				.catch((e) => {
					this.setMessage({ type: 'error', message: e });
				})
				.finally(() => {
					this.setBusy(false);
				});
		},
		resetSelections() {
			this.selectedTables = [];
		},
	},
};
</script>
