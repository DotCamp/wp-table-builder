<template>
	<div class="wptb-generate-wrapper">
		<div class="wptb-generate-menu">
			<div class="wptb-generate-menu-header">
				<input
					v-model.trim="searchString"
					ref="search"
					class="wptb-generate-search"
					type="text"
					placeholder="Search(/ to focus)"
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
				></prebuilt-card>
			</div>
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
		};
	},
	mounted() {
		window.addEventListener('keyup', this.focusToSearch);

		// add correct translation of blank at mounted
		this.prebuiltTables.blank.name = this.strings.blank;
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
			if (cardId === 'blank') {
				WPTB_Table(cols, rows);

				const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
				wptbTableStateSaveManager.tableStateSet();
			}
		},
	},
	beforeDestroy() {
		// TODO [erdembircan] remove for production
		console.log('destroyed');
		window.removeEventListener('keyup', this.focusToSearch);
	},
};
</script>
