<template>
	<div class="wptb-prebuilt-card" @click="setCardActive" :class="{ 'wptb-prebuilt-card-active': isActive }">
		<div class="wptb-prebuilt-card-preview">
			<div
				ref="tablePreview"
				v-show="!liveDisplayEnabled || !isActive"
				class="wptb-prebuilt-table-wrapper wptb-unselectable wptb-no-pointer-events"
				v-html="table"
			></div>
			<prebuilt-live-display
				v-if="isActive && liveDisplayEnabled"
				:rows="rows"
				:cols="columns"
			></prebuilt-live-display>
			<div v-if="isActive" class="wptb-prebuilt-card-controls">
				<prebuilt-card-control
					:disabled="disabled || id !== 'blank'"
					orientation="row"
					v-model="columns"
				></prebuilt-card-control>
				<prebuilt-card-control
					:disabled="disabled"
					orientation="col"
					v-model="rows"
					:min="min.rows"
					:max="max.rows"
				></prebuilt-card-control>
			</div>
			<div
				v-if="!isActive"
				class="wptb-prebuilt-card-icon wptb-prebuilt-card-fav-icon wptb-plugin-filter-box-shadow-md-close"
				:class="{ 'is-fav': fav }"
				v-html="favIcon"
				@click.capture.prevent.stop="favAction"
			></div>
			<prebuilt-card-delete-module
				v-if="isActive && deleteIcon !== ''"
				:delete-icon="deleteIcon"
				:message="strings.deleteConfirmation"
				:yes-icon="appData.icons.checkIcon"
				:no-icon="appData.icons.crossIcon"
				@confirm="deleteAction"
			></prebuilt-card-delete-module>
		</div>
		<div class="wptb-prebuilt-card-footer">
			<div class="wptb-prebuilt-card-footer-element" v-if="!isActive" v-html="transformedName"></div>
			<div
				class="wptb-prebuilt-card-footer-element wptb-prebuilt-card-footer-button-holder"
				:class="{ 'wptb-prebuilt-card-footer-button-holder-single': !editEnabled }"
				v-else
			>
				<div
					class="wptb-prebuilt-footer-button wptb-prebuilt-footer-generate wptb-unselectable"
					@click.prevent="cardGenerate"
				>
					{{ strings.generate | cap }}
				</div>
				<div
					v-if="editEnabled"
					class="wptb-prebuilt-footer-button wptb-prebuilt-footer-edit wptb-unselectable"
					@click.prevent="cardEdit"
				>
					{{ strings.edit | cap }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import PrebuiltCardControl from './PrebuiltCardControl';
import PrebuiltLiveDisplay from './PrebuiltLiveDisplay';
import PrebuiltCardDeleteModule from './PrebuiltCardDeleteModule';

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
		deleteIcon: {
			type: String,
			default: '',
		},
	},
	components: { PrebuiltCardControl, PrebuiltLiveDisplay, PrebuiltCardDeleteModule },
	data() {
		return {
			rows: 1,
			columns: 1,
			min: {
				rows: 1,
				cols: 1,
			},
			max: {
				rows: 30,
				cols: 30,
			},
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
		editEnabled() {
			return this.id !== 'blank' && !this.id.startsWith(this.appData.teamTablePrefix);
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

				if (this.id !== 'blank') {
					const tableRows = Array.from(prebuilt.querySelectorAll('tr'));
					const totalRows = tableRows.length;
					this.rows = totalRows;
					this.min.rows = totalRows;

					let minCols = 1;

					tableRows.map((t) => {
						const totalCells = t.querySelectorAll('td').length;
						if (minCols < totalCells) {
							minCols = totalCells;
						}
					});

					this.min.cols = minCols;
					this.max.cols = minCols;
					this.columns = minCols;
				}
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
		cardEdit() {
			if (!this.disabled) {
				this.$emit('cardEdit', this.id);
			}
		},
		favAction() {
			this.$emit('favAction', this.id);
		},
		deleteAction() {
			this.$emit('deleteAction', this.id);
		},
	},
};
</script>
