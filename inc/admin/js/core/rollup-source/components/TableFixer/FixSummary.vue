<template>
	<div class="wptb-fix-summary-wrapper">
		<div class="wptb-fix-summary-list">
			<table>
				<tbody>
					<summary-row :key="id" v-for="(status, id) in summaryData" :id="id" :status="status"></summary-row>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import SummaryRow from '$Components/TableFixer/SummaryRow';

export default {
	components: { SummaryRow },
	props: {
		summaryData: {
			type: Object,
			default: () => ({}),
		},
	},
	methods: {
		tableTitle(id) {
			return `${this.strings.table}#${id}`;
		},
		fixStatus(status) {
			return JSON.stringify(status);
		},
		iconName(status) {
			return status ? 'check-circle' : 'times-circle';
		},
	},
};
</script>
