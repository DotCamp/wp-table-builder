<template>
	<div
		class="wptb-data-source-card-wrapper"
		@click.prevent.capture="handleCardClick"
		:data-card-selected="isSelected()"
	>
		<div class="wptb-data-source-card">
			<div class="wptb-data-source-card-icon" v-html="dataSourceObject.icon"></div>
			<div class="wptb-data-source-card-message">
				<div class="wptb-data-source-card-header">{{ dataSourceObject.title }}</div>
				<div class="wptb-data-source-card-info">{{ dataSourceObject.info }}</div>
			</div>
		</div>
		<div
			v-if="proSourceStatus()"
			class="wptb-data-source-card-confirm"
			v-html="getIcon('chevronRight')"
			@click.prevent.capture="handleConfirm"
		></div>
		<div class="wptb-data-source-card-pro-ribbon" v-if="dataSourceObject.pro">pro</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DataSourceObject from '../functions/DataSourceObject';

export default {
	props: {
		dataSourceObject: {
			type: DataSourceObject,
			required: true,
		},
	},
	computed: {
		...mapGetters(['getIcon']),
	},
	methods: {
		handleCardClick() {
			if (!this.isSelected() && this.proSourceStatus()) {
				this.softSelectCard(this.dataSourceObject.id);
			} else if (!this.proSourceStatus()) {
				const proWin = window.open(this.$store.state.proUrl, '_blank');
				proWin.focus();
			}
		},
		proSourceStatus() {
			if (!this.dataSourceObject.pro) {
				return true;
			}
			return this.getProStatus();
		},
		isSelected() {
			return this.getSoftSelectedSourceCardId() === this.dataSourceObject.id;
		},
		handleConfirm() {
			this.$emit('sourceCardConfirm', this.dataSourceObject.id);
		},
		...mapActions(['softSelectCard']),
		...mapGetters(['getSoftSelectedSourceCardId', 'getProStatus']),
	},
};
</script>
