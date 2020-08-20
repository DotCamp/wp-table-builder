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
					v-for="(v, k) in prebuiltTables"
					:key="k"
					:id="k"
					:name="v.name | cap"
					:is-active="isCardActive(k)"
					@cardActive="cardActive"
					@cardGenerate="cardGenerate"
					:disabled="generating"
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
	},
	data() {
		return {
			searchString: '',
			prebuiltTables: {
				blank: {
					name: 'blank',
				},
			},
			activeCard: '',
			generating: false,
		};
	},
	mounted() {
		window.addEventListener('keyup', this.focusToSearch);

		// add correct translation of blank at mounted
		this.prebuiltTables.blank.name = this.strings.blank;
	},
	computed: {
		isPro() {
			return this.version === 'pro';
		},
	},
	methods: {
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
			}
		},
	},
	beforeDestroy() {
		window.removeEventListener('keyup', this.focusToSearch);
	},
};
</script>
