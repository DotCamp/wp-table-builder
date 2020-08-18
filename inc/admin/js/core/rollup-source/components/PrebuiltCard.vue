<template>
	<div class="wptb-prebuilt-card" @click="setCardActive" :class="{ 'wptb-prebuilt-card-active': isActive }">
		<div class="wptb-prebuilt-card-preview">
			<div v-if="!isActive">
				<div v-html="table"></div>
			</div>
			<prebuilt-live-display v-if="isActive" :rows="rows" :cols="columns"></prebuilt-live-display>
			<div v-if="isActive" class="wptb-prebuilt-card-controls">
				<prebuilt-card-control orientation="row" v-model="columns"></prebuilt-card-control>
				<prebuilt-card-control orientation="col" v-model="rows"></prebuilt-card-control>
			</div>
		</div>
		<div class="wptb-prebuilt-card-footer">
			<div class="wptb-prebuilt-card-footer-element" v-if="!isActive">{{ name | cap }}</div>
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
			type: String,
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
			type: Boolean,
			default: false,
		},
	},
	components: { PrebuiltCardControl, PrebuiltLiveDisplay },
	data() {
		return {
			rows: 1,
			columns: 1,
		};
	},
	methods: {
		setCardActive() {
			if (!this.isActive) {
				this.$emit('cardActive', this.id);
			}
		},
		cardGenerate() {
			this.$emit('cardGenerate', this.id, this.columns, this.rows);
		},
	},
};
</script>
