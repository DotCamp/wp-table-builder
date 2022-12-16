<template>
	<div class="wptb-generate-wrapper">
		<div class="wptb-generate-menu">
			<div class="wptb-generate-menu-header">
				<input
					v-model.trim="searchString"
					ref="search"
					class="wptb-generate-search"
					type="text"
					:placeholder="strings.searchPlaceholder"
				/>
			</div>
			<div class="wptb-generate-menu-listing">
				<div class="header">{{ getTranslation('templates') }}</div>
				<link v-if="dummyProCss" :href="dummyProCss" rel="stylesheet" />
				<prebuilt-card
					v-for="v in sortedTables()"
					:is-enabled="isBaseAllowed(v.id)"
					:key="v.id"
					:id="v.id"
					:name="v.title"
					:fav="v.fav"
					:is-active="isCardActive(v.id)"
					@cardActive="cardActive"
					@cardGenerate="cardGenerate"
					@cardEdit="cardEdit"
					@favAction="favAction"
					@deleteAction="deleteAction"
					:disabled="generating"
					:table="v.content"
					:search-string="searchString"
					:fav-icon="cardFavIcon(v.id)"
					:delete-icon="cardDeleteIcon(v.id)"
				></prebuilt-card>
			</div>
		</div>
		<div v-if="false" v-html="upsell"></div>
	</div>
</template>
<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import 'regenerator-runtime/runtime';
import { mapGetters } from 'vuex';
import PrebuiltCard from '../components/PrebuiltCard';

export default {
	components: { PrebuiltCard },
	props: {
		dummyProCss: {
			type: String,
			default: null,
		},
		version: {
			type: String,
			default: 'normal',
		},
		upsell: {
			type: String,
		},
		prebuiltTables: {
			type: Object || Array,
			default() {
				return {};
			},
		},
		security: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			searchString: '',
			fixedTables: {
				blank: {
					title: 'blank',
				},
			},
			activeCard: '',
			generating: false,
			basePreviewTemplateIds: ['wptb_team_nt998', 'blank'],
		};
	},
	mounted() {
		// eslint-disable-next-line @wordpress/no-global-event-listener
		window.addEventListener('keyup', this.focusToSearch);

		// add correct translation of blank at mounted
		this.fixedTables.blank.title = this.strings.blank;

		this.fixedTables = { ...this.fixedTables, ...this.prebuiltTables };
	},
	computed: {
		...mapGetters(['proStatus', 'getTranslation']),
	},
	methods: {
		isBaseAllowed(cardId) {
			return this.proStatus || this.basePreviewTemplateIds.includes(cardId);
		},
		deselect() {
			this.activeCard = '';
		},
		favAction(cardId) {
			if (this.isBaseAllowed(cardId)) {
				const { favAction, favNonce, ajaxUrl } = this.security;

				const formData = new FormData();
				formData.append('action', favAction);
				formData.append('nonce', favNonce);
				formData.append('id', cardId);

				fetch(ajaxUrl, {
					method: 'POST',
					body: formData,
				})
					.then((r) => {
						if (r.ok) {
							return r.json();
						}
						throw new Error(r.status);
					})
					.then((resp) => {
						if (resp.error) {
							throw new Error(resp.error);
						} else {
							this.fixedTables[cardId].fav = resp.message;
						}
					})
					.catch((e) => {
						// eslint-disable-next-line no-console
						console.error('an error occurred with fav operation request: ', e);
					});
			}
		},
		cardFavIcon(cardId) {
			return cardId === 'blank' ? '' : this.appData.icons.favIcon;
		},
		cardDeleteIcon(cardId) {
			if (this.isDevBuild()) {
				return cardId === 'blank' ? '' : this.appData.icons.deleteIcon;
			}
			return cardId === 'blank' || cardId.startsWith(this.appData.teamTablePrefix)
				? ''
				: this.appData.icons.deleteIcon;
		},
		filteredTables() {
			return Object.keys(this.fixedTables).reduce((carry, id) => {
				if (this.fixedTables[id].title.toLowerCase().includes(this.searchString)) {
					// eslint-disable-next-line no-param-reassign
					carry[id] = this.fixedTables[id];
				}
				return carry;
			}, {});
		},
		sortedTables: function* sortedTables() {
			const ids = Object.keys(this.filteredTables());

			const sortedIds = ids.sort((a, b) => {
				if (a === 'blank') {
					return -1;
				}
				if (b === 'blank') {
					return 1;
				}

				if (this.basePreviewTemplateIds.includes(a)) {
					return -1;
				}

				if (this.basePreviewTemplateIds.includes(b)) {
					return 1;
				}

				const aTitle = this.fixedTables[a].title.replaceAll(' ', '');
				const bTitle = this.fixedTables[b].title.replaceAll(' ', '');

				if (aTitle > bTitle) {
					return 1;
				}

				if (aTitle < bTitle) {
					return -1;
				}

				return 0;
			});

			for (let i = 0; i < sortedIds.length; i += 1) {
				const currentTable = this.fixedTables[sortedIds[i]];
				currentTable.id = sortedIds[i];
				yield currentTable;
			}
		},
		focusToSearch(e) {
			const vm = this;
			if (e.key !== undefined && e.key === '/') {
				vm.$refs.search.focus();
			} else if (e.keyCode !== undefined && e.keyCode === 191) {
				vm.$refs.search.focus();
			}
		},
		isCardActive(id) {
			return this.activeCard === id;
		},
		cardActive(cardId) {
			if (this.isBaseAllowed(cardId) || this.proStatus) {
				this.activeCard = cardId;
			}
		},
		cardEdit(cardId) {
			if (this.isBaseAllowed(cardId)) {
				this.cardGenerate(cardId, 0, 0, [], true);
				const currentUrl = new URL(window.location.href);
				currentUrl.searchParams.append('table', encodeURIComponent(cardId));
				window.history.pushState(null, null, currentUrl.toString());
			}
		},
		cardGenerate(cardId, cols, rows, selectedCells, edit = false) {
			if (this.isBaseAllowed(cardId)) {
				this.generating = true;
				if (cardId === 'blank') {
					WPTB_Table(cols, rows);
					const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
					wptbTableStateSaveManager.tableStateSet();
				} else {
					const tableWrapper = document.querySelector('.wptb-table-setup');
					tableWrapper.appendChild(WPTB_Parser(this.fixedTables[cardId].content));
					const table = tableWrapper.querySelector('table');

					const maxWidth = table.dataset.wptbTableContainerMaxWidth;

					// add defined max width to table wrapper element
					if (maxWidth) {
						tableWrapper.style.maxWidth = `${maxWidth}px`;
					}

					if (!edit) {
						// unmark inserted template as prebuilt table
						// only unmark if edit mode is not enabled
						delete table.dataset.wptbPrebuiltTable;

						const tableRows = Array.from(table.querySelectorAll('tr'));

						// maximum column length
						const maximumCells = tableRows.reduce((carry, item) => {
							const cellLength = item.querySelectorAll('td').length;

							return Math.max(cellLength, carry);
						}, 0);

						const extraRows = rows - tableRows.length;
						const extraCols = cols - maximumCells;

						// parse table into rows and cols
						const parsedTable = tableRows.reduce((carry, item, r) => {
							if (!Array.isArray(carry[r])) {
								// eslint-disable-next-line no-param-reassign
								carry[r] = [];
							}

							// eslint-disable-next-line array-callback-return
							Array.from(item.querySelectorAll('td')).map((c) => {
								carry[r].push(c);
							});

							return carry;
						}, []);
						// sort selected cells by row then by columns
						selectedCells.sort();

						const rowNormalizeConstant = selectedCells.length > 0 ? selectedCells[0].split('-')[0] : 0;

						// cells that will be used at clone operations
						const cellsForClone = selectedCells.reduce((carry, item) => {
							const [row, column] = item.split('-');
							const normalizedRowIndex = row - rowNormalizeConstant;

							if (!Array.isArray(carry[normalizedRowIndex])) {
								// eslint-disable-next-line no-param-reassign
								carry[normalizedRowIndex] = [];
							}

							carry[normalizedRowIndex].push(parsedTable[row][column]);

							return carry;
						}, []);

						// modulo constants for cellsForClone
						const rowModulo = cellsForClone.length;
						const cellModulo = cellsForClone.reduce((carry, item) => {
							return Math.max(carry, item.length);
						}, 0);

						/**
						 * Increment id of plugin element.
						 *
						 * @param {HTMLElement} divEl div element
						 */
						const incrementIds = (divEl) => {
							let className = null;
							// find the divs related to elements with this unique pattern
							const classRegExp = new RegExp(/wptb-element-(.+)-([0-9]+)/, 'g');

							divEl.classList.forEach((c) => {
								if (c.match(classRegExp)) {
									className = c;
								}
							});

							// main wrapper div found for an element
							if (className) {
								divEl.classList.remove(className);
								// find out the kind of the element
								const [, kind] = classRegExp.exec(className);
								const regExp = new RegExp(`^wptb-element-${kind}-([0-9]+)$`, 'g');

								// find out the same kind of element with the biggest number id
								const highestId = Array.from(table.querySelectorAll('div')).reduce((carry, item) => {
									item.classList.forEach((c) => {
										const match = regExp.exec(c);
										if (match) {
											const numberId = Number.parseInt(match[1], 10);
											// eslint-disable-next-line no-param-reassign
											carry = carry > numberId ? carry : numberId;
										}
									});

									return carry;
								}, 0);

								// increment unique class id of the element
								divEl.classList.add(`wptb-element-${kind}-${highestId + 1}`);
							}
						};

						// add extra cols to table
						// eslint-disable-next-line array-callback-return
						tableRows.map((r, ri) => {
							// eslint-disable-next-line array-callback-return
							Array.from(Array(extraCols)).map((c, ci) => {
								const clonedCell = cellsForClone[ri % rowModulo][ci % cellModulo].cloneNode(true);
								r.appendChild(clonedCell);
								Array.from(clonedCell.querySelectorAll('div')).map(incrementIds);
							});
						});
						// add extra rows to table
						// eslint-disable-next-line array-callback-return
						Array.from(Array(extraRows)).map((r, ri) => {
							const currentRow = document.createElement('tr');
							table.appendChild(currentRow);
							// eslint-disable-next-line array-callback-return
							Array.from(Array(cols)).map((c, ci) => {
								const clonedCell = cellsForClone[ri % rowModulo][ci % cellModulo].cloneNode(true);
								currentRow.appendChild(clonedCell);
							});

							Array.from(currentRow.querySelectorAll('div')).map(incrementIds);
						});
					}

					// edit is enabled
					if (edit) {
						// fill in the name of the selected prebuilt table on edit mode
						document.querySelector('#wptb-setup-name').value = this.fixedTables[cardId].title;

						// force enable prebuilt functionality on edit mode
						table.dataset.wptbPrebuiltTable = 1;
					}

					WPTB_Table();
					WPTB_Settings();
					const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
					wptbTableStateSaveManager.tableStateSet();

					document.counter = new ElementCounters();
					document.select = new MultipleSelect();

					// WPTB_Initializer();
					WPTB_Settings();
				}
			}
		},
		deleteAction(cardId) {
			if (this.isBaseAllowed()) {
				const { ajaxUrl, deleteAction, deleteNonce, devModeNonce } = this.security;

				const form = new FormData();
				form.append('action', deleteAction);
				form.append('nonce', deleteNonce);
				form.append('id', cardId);

				if (cardId.startsWith(this.appData.teamTablePrefix)) {
					form.append('deleteCSV', true);
					form.append('devModeNonce', devModeNonce);
				}

				fetch(ajaxUrl, {
					method: 'POST',
					body: form,
				})
					.then((r) => {
						if (r.ok) {
							return r.json();
						}
						throw new Error('an error occurred while deleting prebuilt table, try again later');
					})
					.then((resp) => {
						if (resp.error) {
							throw new Error(resp.error);
						}
						if (resp.message === true) {
							this.$delete(this.fixedTables, cardId);
						} else {
							throw new Error('an error occurred while deleting prebuilt table, try again later');
						}
					})
					.catch((e) => {
						// eslint-disable-next-line no-console
						console.error(e.message);
					});
			}
		},
	},
	beforeDestroy() {
		// eslint-disable-next-line @wordpress/no-global-event-listener
		window.removeEventListener('keyup', this.focusToSearch);
	},
};
</script>
