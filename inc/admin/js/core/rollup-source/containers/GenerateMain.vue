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
					:disabled="!isPro"
				/>
			</div>
			<div class="wptb-generate-menu-listing">
				<prebuilt-card
					v-for="v in sortedTables()"
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
		<div v-if="!isPro" class="wptb-prebuilt-ad">
			{{ strings.prebuiltAdPart1 }},
			<a :href="adLink" class="wptb-prebuilt-ad-link">{{ strings.prebuiltAdPart2 }}</a>
		</div>
	</div>
</template>
<script>
import PrebuiltCard from '../components/PrebuiltCard';

export default {
	components: { PrebuiltCard },
	props: {
		version: {
			type: String,
			default: 'normal',
		},
		adLink: {
			type: String,
		},
		prebuiltTables: {
			type: Object | Array,
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
		};
	},
	mounted() {
		window.addEventListener('keyup', this.focusToSearch);

		// add correct translation of blank at mounted
		this.fixedTables.blank.title = this.strings.blank;

		this.fixedTables = { ...this.fixedTables, ...this.prebuiltTables };
	},
	computed: {
		isPro() {
			return this.version === 'pro';
		},
	},
	methods: {
		deselect() {
			this.activeCard = '';
		},
		favAction(cardId) {
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
					console.error('an error occurred with fav operation request: ', e);
				});
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

			ids.sort((a, b) => {
				if (a === 'blank') {
					return -1;
				}
				if (b === 'blank') {
					return 1;
				}
				if (a.startsWith('wptb_team')) {
					return -1;
				}
				if (b.startsWith('wptb_team')) {
					return 1;
				}
				const aTitle = this.fixedTables[a].name;
				const bTitle = this.fixedTables[b].name;

				return aTitle - bTitle;
			});

			for (let i = 0; i < ids.length; i += 1) {
				const currentTable = this.fixedTables[ids[i]];
				currentTable.id = ids[i];
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
			this.activeCard = cardId;
		},
		cardEdit(cardId) {
			this.cardGenerate(cardId, 0, 0, true);
			const currentUrl = new URL(window.location.href);
			currentUrl.searchParams.append('table', encodeURIComponent(cardId));
			window.history.pushState(null, null, currentUrl.toString());
		},
		cardGenerate(cardId, cols, rows, edit = false) {
			this.generating = true;
			if (cardId === 'blank') {
				WPTB_Table(cols, rows);

				const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
				wptbTableStateSaveManager.tableStateSet();
			} else {
				const tableWrapper = document.querySelector('.wptb-table-setup');
				tableWrapper.appendChild(WPTB_Parser(this.fixedTables[cardId].content));
				const table = tableWrapper.querySelector('table');

				// unmark inserted template as prebuilt table
				// only unmark it if edit mode is not enabled
				if (!edit) {
					delete table.dataset.wptbPrebuiltTable;

					// add extra rows to table
					const tableRows = table.querySelectorAll('tr');
					const lastRow = tableRows[tableRows.length - 1];

					const extraRows = rows - tableRows.length;

					for (let i = 0; i < extraRows; i += 1) {
						const clonedRow = lastRow.cloneNode(true);
						table.appendChild(clonedRow);

						// eslint-disable-next-line array-callback-return
						Array.from(clonedRow.querySelectorAll('div')).map((e) => {
							let className = null;
							// find the divs related to elements with this unique pattern
							const classRegExp = new RegExp(/wptb-element-(.+)-([0-9]+)/, 'g');

							e.classList.forEach((c) => {
								if (c.match(classRegExp)) {
									className = c;
								}
							});

							// main wrapper div found for an element
							if (className) {
								e.classList.remove(className);
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
								e.classList.add(`wptb-element-${kind}-${highestId + 1}`);
							}
						});
					}
				}

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
		},
		deleteAction(cardId) {
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
					console.error(e.message);
				});
		},
	},
	beforeDestroy() {
		window.removeEventListener('keyup', this.focusToSearch);
	},
};
</script>
