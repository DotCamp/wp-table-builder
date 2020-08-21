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
					:is-active="isCardActive(v.id)"
					@cardActive="cardActive"
					@cardGenerate="cardGenerate"
					:disabled="generating"
					:table="v.content"
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
		sortedTables: function* sortedTables() {
			const ids = Object.keys(this.fixedTables);

			ids.sort((a, b) => {
				if (a === 'blank') {
					return -1;
				}
				if (b === 'blank') {
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
		cardGenerate(cardId, cols, rows) {
			this.generating = true;
			if (cardId === 'blank') {
				WPTB_Table(cols, rows);

				const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
				wptbTableStateSaveManager.tableStateSet();
			} else {
				const tableWrapper = document.querySelector('.wptb-table-setup');
				tableWrapper.appendChild(WPTB_Parser(this.fixedTables[cardId].content));

				// unmark inserted template as prebuilt table
				delete tableWrapper.querySelector('table').dataset.wptbPrebuiltTable;

				WPTB_Table();

				WPTB_Settings();
				const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
				wptbTableStateSaveManager.tableStateSet();

				document.counter = new ElementCounters();
				document.select = new MultipleSelect();

				WPTB_Initializer();
				WPTB_Settings();
			}
		},
	},
	beforeDestroy() {
		window.removeEventListener('keyup', this.focusToSearch);
	},
};
</script>
