<template>
	<fragment>
		<div class="wptb-data-manager-default-add" data-type="row" @click.prevent.capture.stop="addRow">+</div>
		<div
			class="wptb-data-manager-default-add"
			:style="colControlStyle"
			data-type="col"
			@click.prevent.capture.stop="addCol"
		>
			+
		</div>
	</fragment>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	data() {
		return {
			colStyleValues: {
				top: 0,
			},
		};
	},
	watch: {
		getDataManagerTempData: {
			handler() {
				this.calculateColControlValues();
			},
			deep: true,
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.calculateColControlValues();
		});
	},
	computed: {
		...mapGetters(['getDataManagerTempData']),
		colControlStyle() {
			return {
				top: this.colStyleValues.top,
			};
		},
	},
	methods: {
		calculateColControlValues() {
			const valuesInfoRow = document.querySelector(
				'.wptb-data-manager-table-wrapper .wptb-data-manager-info-values'
			);
			const dataTable = document.querySelector('.wptb-data-manager-table-wrapper table');

			// calculate column add button position
			if (valuesInfoRow && dataTable) {
				const { top } = valuesInfoRow.getBoundingClientRect();
				const { top: tableTop } = dataTable.getBoundingClientRect();

				this.colStyleValues.top = `${top - tableTop}px`;
			}
		},
		addRow() {
			this.addRowToDataManager();
		},
		addCol() {
			this.addColumnToDataManager();
		},
		...mapActions(['addRowToDataManager', 'addColumnToDataManager']),
	},
};
</script>
