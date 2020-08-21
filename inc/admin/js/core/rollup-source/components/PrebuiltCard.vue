<template>
	<div class="wptb-prebuilt-card" @click="setCardActive" :class="{ 'wptb-prebuilt-card-active': isActive }">
		<div class="wptb-prebuilt-card-preview">
			<div
				ref="tablePreview"
				v-show="!liveDisplayEnabled || !isActive"
				class="wptb-prebuilt-table-wrapper wptb-unselectable"
				v-html="table"
			></div>
			<prebuilt-live-display
				v-if="isActive && liveDisplayEnabled"
				:rows="rows"
				:cols="columns"
			></prebuilt-live-display>
			<div v-if="isActive" class="wptb-prebuilt-card-controls">
				<prebuilt-card-control :disabled="disabled" orientation="row" v-model="columns"></prebuilt-card-control>
				<prebuilt-card-control :disabled="disabled" orientation="col" v-model="rows"></prebuilt-card-control>
			</div>
			<div
				v-if="!isActive"
				class="wptb-prebuilt-card-fav-icon wptb-plugin-filter-box-shadow-md-close"
				:class="{ 'is-fav': fav }"
				v-html="favIcon"
				@click.capture.prevent.stop="favAction"
			></div>
		</div>
		<div class="wptb-prebuilt-card-footer">
			<div class="wptb-prebuilt-card-footer-element" v-if="!isActive" v-html="transformedName"></div>
			<div
				class="wptb-prebuilt-card-footer-element wptb-prebuilt-generate-button wptb-unselectable"
				@click.prevent="cardGenerate"
				v-else
			>
				{{ strings.generate | cap }}
			</div>
		</div>
	</div>
</template>
<script>
import PrebuiltCardControl from './PrebuiltCardControl';
import PrebuiltLiveDisplay from './PrebuiltLiveDisplay';

export default {
	props: {
		name: {
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		table: {
			type: String,
			default: '<p class="wptb-prebuilt-blank">+</p>',
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		disabled: {
			default: false,
		},
		liveDisplayEnabled: {
			type: Boolean,
			default: true,
		},
		searchString: {
			type: String,
			default: '',
		},
		fav: {
			type: Boolean,
			default: false,
		},
		favIcon: {
			type: String,
			default: '',
		},
	},
	components: { PrebuiltCardControl, PrebuiltLiveDisplay },
	data() {
		return {
			rows: 1,
			columns: 1,
		};
	},
	computed: {
		transformedName() {
			if (this.searchString !== '') {
				const regexp = new RegExp(`(${this.searchString})`, 'ig');
				const transform = this.name.replace(
					regexp,
					'<span class="wptb-prebuilt-card-search-indicator">$&</span>'
				);
				return `<span class="wptb-prebuilt-card-search-indicator-main">${transform}</span>`;
			}

			return this.name;
		},
	},
	mounted() {
		this.$nextTick(() => {
			const { tablePreview } = this.$refs;
			const { width: wrapperWidth, height: wrapperHeight } = tablePreview.getBoundingClientRect();

			const prebuilt = tablePreview.querySelector('table');

			if (prebuilt) {
				const padding = 40;
				const { width: prebuiltWidth, height: prebuiltHeight } = prebuilt.getBoundingClientRect();
				const widthScale = wrapperWidth / (prebuiltWidth + padding);
				const heightScale = wrapperHeight / (prebuiltHeight + padding);

				prebuilt.style.transform = `scale(${Math.min(widthScale, heightScale)})`;
			}
		});
	},
	methods: {
		setCardActive() {
			if (!this.isActive) {
				this.$emit('cardActive', this.id);
			}
		},
		cardGenerate() {
			if (!this.disabled) {
				this.$emit('cardGenerate', this.id, this.columns, this.rows);
			}
		},
		favAction() {
			this.$emit('favAction', this.id);
		},
	},
};
</script>
